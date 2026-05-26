import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../lib/supabase';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const feedQuery = z.object({
  type: z.enum(['following', 'trending', 'genre']).default('trending'),
  genre: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
});

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = feedQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { type, genre, cursor, limit } = parsed.data;

  let query = db
    .from('reviews')
    .select(`
      id, created_at, body, cue_seconds, background_video_url,
      upvote_count, comment_count,
      reviewer:users!reviewer_id (id, username, avatar_url),
      track:tracks!track_id (soundcloud_id, title, artist, artwork_url, soundcloud_url, duration_ms),
      upvotes!left (user_id)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  if (type === 'following') {
    const { data: follows } = await db
      .from('follows')
      .select('following_id')
      .eq('follower_id', req.userId!);
    const ids = (follows ?? []).map((f) => f.following_id);
    if (ids.length === 0) {
      res.json({ reviews: [], next_cursor: null });
      return;
    }
    query = query.in('reviewer_id', ids);
  }

  if (type === 'trending') {
    query = query.order('upvote_count', { ascending: false });
  }

  if (type === 'genre' && genre) {
    query = query.eq('tracks.genre', genre);
  }

  const { data, error } = await query;
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const reviews = (data ?? []).map((r) => ({
    ...r,
    has_upvoted: Array.isArray(r.upvotes)
      ? r.upvotes.some((u: { user_id: string }) => u.user_id === req.userId)
      : false,
    upvotes: undefined,
  }));

  const next_cursor =
    reviews.length === limit ? reviews[reviews.length - 1].created_at : null;

  res.json({ reviews, next_cursor });
});

export default router;
