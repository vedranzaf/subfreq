-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Users ────────────────────────────────────────────────────────────────────
create table users (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  username        text not null unique,
  avatar_url      text,
  bio             text,
  follower_count  int not null default 0,
  following_count int not null default 0
);

-- ─── Tracks ───────────────────────────────────────────────────────────────────
create table tracks (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  soundcloud_id  text not null unique,
  title          text not null,
  artist         text not null,
  artwork_url    text,
  soundcloud_url text not null,
  duration_ms    int not null,
  genre          text
);

-- ─── Reviews ──────────────────────────────────────────────────────────────────
create table reviews (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  reviewer_id          uuid not null references users(id) on delete cascade,
  track_id             uuid not null references tracks(id),
  body                 text not null,
  cue_seconds          int,           -- timestamp the reviewer highlights
  background_video_url text,
  upvote_count         int not null default 0,
  comment_count        int not null default 0
);

create index reviews_created_at_idx on reviews(created_at desc);
create index reviews_reviewer_idx   on reviews(reviewer_id);
create index reviews_upvote_idx     on reviews(upvote_count desc);

-- ─── Follows ──────────────────────────────────────────────────────────────────
create table follows (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  follower_id  uuid not null references users(id) on delete cascade,
  following_id uuid not null references users(id) on delete cascade,
  unique(follower_id, following_id)
);

-- ─── Upvotes ──────────────────────────────────────────────────────────────────
create table upvotes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  review_id   uuid not null references reviews(id) on delete cascade,
  user_id     uuid not null references users(id) on delete cascade,
  unique(review_id, user_id)
);

-- ─── Comments ─────────────────────────────────────────────────────────────────
create table comments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  review_id   uuid not null references reviews(id) on delete cascade,
  author_id   uuid not null references users(id) on delete cascade,
  body        text not null
);

create index comments_review_idx on comments(review_id, created_at asc);

-- ─── Counter RPCs ─────────────────────────────────────────────────────────────
create or replace function increment_upvote_count(review_id uuid)
returns void language sql as $$
  update reviews set upvote_count = upvote_count + 1 where id = review_id;
$$;

create or replace function decrement_upvote_count(review_id uuid)
returns void language sql as $$
  update reviews set upvote_count = greatest(0, upvote_count - 1) where id = review_id;
$$;

create or replace function increment_comment_count(review_id uuid)
returns void language sql as $$
  update reviews set comment_count = comment_count + 1 where id = review_id;
$$;

create or replace function increment_follower_count(target_id uuid, actor_id uuid)
returns void language sql as $$
  update users set follower_count  = follower_count  + 1 where id = target_id;
  update users set following_count = following_count + 1 where id = actor_id;
$$;

create or replace function decrement_follower_count(target_id uuid, actor_id uuid)
returns void language sql as $$
  update users set follower_count  = greatest(0, follower_count  - 1) where id = target_id;
  update users set following_count = greatest(0, following_count - 1) where id = actor_id;
$$;

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table users    enable row level security;
alter table reviews  enable row level security;
alter table comments enable row level security;
alter table upvotes  enable row level security;
alter table follows  enable row level security;
alter table tracks   enable row level security;

-- Public reads
create policy "public read users"   on users   for select using (true);
create policy "public read reviews" on reviews for select using (true);
create policy "public read tracks"  on tracks  for select using (true);
create policy "public read comments" on comments for select using (true);
