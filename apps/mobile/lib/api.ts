import { Review, Comment, User } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  feed: {
    get: (params: { type?: string; genre?: string; cursor?: string }) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)) as Record<string, string>,
      );
      return request<{ reviews: Review[]; next_cursor: string | null }>(`/api/feed?${qs}`);
    },
  },
  reviews: {
    upvote: (id: string) =>
      request<{ has_upvoted: boolean }>(`/api/reviews/${id}/upvote`, { method: 'POST' }),
    getComments: (id: string) =>
      request<{ comments: Comment[] }>(`/api/reviews/${id}/comments`),
    postComment: (id: string, body: string) =>
      request<{ comment: Comment }>(`/api/reviews/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      }),
  },
  users: {
    get: (username: string) => request<{ user: User }>(`/api/users/${username}`),
    getReviews: (username: string) =>
      request<{ reviews: Review[] }>(`/api/users/${username}/reviews`),
    follow: (username: string) =>
      request<{ following: boolean }>(`/api/users/${username}/follow`, { method: 'POST' }),
  },
};
