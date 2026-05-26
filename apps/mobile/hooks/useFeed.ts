import { useState, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import { Review, FeedType } from '../types';

export function useFeed(type: FeedType, genre?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const cursor = useRef<string | null>(null);
  const exhausted = useRef(false);

  const load = useCallback(async (reset = false) => {
    if (loading || (!reset && exhausted.current)) return;

    if (reset) {
      cursor.current = null;
      exhausted.current = false;
    }

    setLoading(true);
    try {
      const { reviews: incoming, next_cursor } = await api.feed.get({
        type,
        genre,
        cursor: cursor.current ?? undefined,
      });
      cursor.current = next_cursor;
      if (!next_cursor) exhausted.current = true;
      setReviews((prev) => (reset ? incoming : [...prev, ...incoming]));
    } catch (err) {
      console.error('Feed load error:', err);
    } finally {
      setLoading(false);
    }
  }, [type, genre, loading]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  }, [load]);

  const toggleUpvote = useCallback((id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              has_upvoted: !r.has_upvoted,
              upvote_count: r.has_upvoted ? r.upvote_count - 1 : r.upvote_count + 1,
            }
          : r,
      ),
    );
    api.reviews.upvote(id).catch(() => {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                has_upvoted: !r.has_upvoted,
                upvote_count: r.has_upvoted ? r.upvote_count - 1 : r.upvote_count + 1,
              }
            : r,
        ),
      );
    });
  }, []);

  return { reviews, loading, refreshing, load, refresh, toggleUpvote };
}
