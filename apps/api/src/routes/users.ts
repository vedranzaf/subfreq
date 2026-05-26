import { Router, Response } from 'express';
import { db } from '../lib/supabase';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/:username', async (req, res) => {
  const { data, error } = await db
    .from('users')
    .select('id, username, avatar_url, bio, follower_count, following_count')
    .eq('username', req.params.username)
    .single();

  if (error || !data) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user: data });
});

router.get('/:username/reviews', async (req, res) => {
  const { data: user } = await db
    .from('users')
    .select('id')
    .eq('username', req.params.username)
    .single();

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { data, error } = await db
    .from('reviews')
    .select(`
      id, created_at, body, cue_seconds, background_video_url,
      upvote_count, comment_count,
      reviewer:users!reviewer_id (id, username, avatar_url),
      track:tracks!track_id (soundcloud_id, title, artist, artwork_url, soundcloud_url, duration_ms)
    `)
    .eq('reviewer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ reviews: data });
});

router.post('/:username/follow', requireAuth, async (req: AuthRequest, res: Response) => {
  const { data: target } = await db
    .from('users')
    .select('id')
    .eq('username', req.params.username)
    .single();

  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (target.id === req.userId) {
    res.status(400).json({ error: 'Cannot follow yourself' });
    return;
  }

  const { data: existing } = await db
    .from('follows')
    .select('id')
    .eq('follower_id', req.userId!)
    .eq('following_id', target.id)
    .single();

  if (existing) {
    await db.from('follows').delete().eq('id', existing.id);
    await db.rpc('decrement_follower_count', { target_id: target.id, actor_id: req.userId });
    res.json({ following: false });
  } else {
    await db.from('follows').insert({ follower_id: req.userId, following_id: target.id });
    await db.rpc('increment_follower_count', { target_id: target.id, actor_id: req.userId });
    res.json({ following: true });
  }
});

export default router;
