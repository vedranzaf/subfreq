import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../lib/supabase';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const createReviewSchema = z.object({
  track: z.object({
    soundcloud_id: z.string(),
    title: z.string(),
    artist: z.string(),
    soundcloud_url: z.string().url(),
    artwork_url: z.string().url().optional(),
    duration_ms: z.number().int().positive(),
    genre: z.string().optional(),
  }),
  body: z.string().min(10).max(1000),
  cue_seconds: z.number().int().min(0).optional(),
  background_video_url: z.string().url().optional(),
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { track, body, cue_seconds, background_video_url } = parsed.data;

  const { data: upsertedTrack, error: trackError } = await db
    .from('tracks')
    .upsert(track, { onConflict: 'soundcloud_id' })
    .select('id')
    .single();

  if (trackError) {
    res.status(500).json({ error: trackError.message });
    return;
  }

  const { data: review, error } = await db
    .from('reviews')
    .insert({
      reviewer_id: req.userId,
      track_id: upsertedTrack.id,
      body,
      cue_seconds: cue_seconds ?? null,
      background_video_url: background_video_url ?? null,
    })
    .select(`
      id, created_at, body, cue_seconds, background_video_url,
      upvote_count, comment_count,
      reviewer:users!reviewer_id (id, username, avatar_url),
      track:tracks!track_id (soundcloud_id, title, artist, artwork_url, soundcloud_url, duration_ms)
    `)
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({ review: { ...review, has_upvoted: false } });
});

router.post('/:id/upvote', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { data: existing } = await db
    .from('upvotes')
    .select('id')
    .eq('review_id', id)
    .eq('user_id', req.userId!)
    .single();

  if (existing) {
    await db.from('upvotes').delete().eq('id', existing.id);
    await db.rpc('decrement_upvote_count', { review_id: id });
    res.json({ has_upvoted: false });
  } else {
    await db.from('upvotes').insert({ review_id: id, user_id: req.userId });
    await db.rpc('increment_upvote_count', { review_id: id });
    res.json({ has_upvoted: true });
  }
});

router.get('/:id/comments', async (req, res) => {
  const { data, error } = await db
    .from('comments')
    .select('id, created_at, body, author:users!author_id (id, username, avatar_url)')
    .eq('review_id', req.params.id)
    .order('created_at', { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ comments: data });
});

router.post('/:id/comments', requireAuth, async (req: AuthRequest, res: Response) => {
  const body = z.string().min(1).max(500).safeParse(req.body.body);
  if (!body.success) {
    res.status(400).json({ error: 'Invalid comment body' });
    return;
  }

  const { data, error } = await db
    .from('comments')
    .insert({ review_id: req.params.id, author_id: req.userId, body: body.data })
    .select('id, created_at, body, author:users!author_id (id, username, avatar_url)')
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  await db.rpc('increment_comment_count', { review_id: req.params.id });
  res.status(201).json({ comment: data });
});

export default router;
