import { Review, User, Comment } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  feed: {
    trending: (cursor?: string) => {
      const qs = cursor ? `&cursor=${cursor}` : '';
      return get<{ reviews: Review[]; next_cursor: string | null }>(`/api/feed?type=trending${qs}`);
    },
    genre: (genre: string, cursor?: string) => {
      const qs = cursor ? `&cursor=${cursor}` : '';
      return get<{ reviews: Review[]; next_cursor: string | null }>(`/api/feed?type=genre&genre=${genre}${qs}`);
    },
  },
  users: {
    get: (username: string) => get<{ user: User }>(`/api/users/${username}`),
    reviews: (username: string) => get<{ reviews: Review[] }>(`/api/users/${username}/reviews`),
  },
  reviews: {
    comments: (id: string) => get<{ comments: Comment[] }>(`/api/reviews/${id}/comments`),
  },
};
