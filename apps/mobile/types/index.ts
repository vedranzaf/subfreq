export interface User {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
}

export interface Track {
  soundcloud_id: string;
  title: string;
  artist: string;
  artwork_url: string | null;
  soundcloud_url: string;
  duration_ms: number;
}

export interface Review {
  id: string;
  created_at: string;
  reviewer: User;
  track: Track;
  body: string;
  cue_seconds: number | null;
  background_video_url: string | null;
  upvote_count: number;
  comment_count: number;
  has_upvoted: boolean;
}

export interface Comment {
  id: string;
  created_at: string;
  author: User;
  body: string;
}

export type FeedType = 'following' | 'trending' | 'genre';
