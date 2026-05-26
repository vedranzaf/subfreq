import Link from 'next/link';
import { Review } from '@/lib/types';

const GENRES = ['Electronic', 'Techno', 'Drum & Bass', 'Ambient', 'Hip-Hop', 'Footwork', 'Jungle', 'Experimental'];

function formatCue(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function ReviewCard({ review }: { review: Review }) {
  const artwork = review.track.artwork_url?.replace('-large', '-t300x300');
  const hue = parseInt(review.id.slice(-6), 16) % 360;

  return (
    <article style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Artwork / header */}
      <div style={{
        height: 160,
        background: artwork
          ? `url(${artwork}) center/cover`
          : `linear-gradient(135deg, hsl(${hue},40%,8%) 0%, hsl(${(hue+60)%360},40%,14%) 100%)`,
        position: 'relative',
      }}>
        {review.background_video_url && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.6)', borderRadius: 6,
            padding: '3px 8px', fontSize: 11, fontWeight: 600,
          }}>
            🎬 video review
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }} />
        {/* Track info overlay */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16, color: 'var(--orange)' }}>♫</span>
          <a
            href={review.track.soundcloud_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {review.track.artist} — {review.track.title}
          </a>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Reviewer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `hsl(${hue},50%,18%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: `hsl(${hue},70%,65%)`,
            flexShrink: 0,
          }}>
            {review.reviewer.username[0].toUpperCase()}
          </div>
          <Link href={`/profile/${review.reviewer.username}`}
            style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            @{review.reviewer.username}
          </Link>
          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>
            {timeAgo(review.created_at)}
          </span>
        </div>

        {/* Review body */}
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {review.body}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {review.cue_seconds != null && (
            <span style={{
              fontSize: 12, fontWeight: 700, color: 'var(--orange)',
              background: 'var(--orange-dim)', padding: '3px 10px',
              borderRadius: 100, border: '1px solid var(--orange-border)',
            }}>
              ⚡ {formatCue(review.cue_seconds)}
            </span>
          )}
          <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 'auto' }}>
            ▲ {review.upvote_count}
          </span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            💬 {review.comment_count}
          </span>
          <a
            href={review.track.soundcloud_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--orange)', color: '#fff',
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            }}
          >
            ▶ SoundCloud
          </a>
        </div>
      </div>
    </article>
  );
}

async function getFeedData(genre: string | null) {
  const apiBase = process.env.API_URL ?? 'https://subfreq-wine.vercel.app';
  const url = genre
    ? `${apiBase}/api/feed?type=genre&genre=${encodeURIComponent(genre)}`
    : `${apiBase}/api/feed?type=trending`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.reviews ?? []) as Review[];
  } catch {
    return [];
  }
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  const reviews = await getFeedData(genre ?? null);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
          {genre ? `${genre} reviews` : 'Trending reviews'}
        </h1>

        {/* Genre pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/feed" style={{
            padding: '7px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600,
            background: !genre ? 'var(--orange)' : 'var(--surface2)',
            color: !genre ? '#fff' : 'var(--muted)',
            border: `1px solid ${!genre ? 'var(--orange)' : 'var(--border)'}`,
          }}>
            Trending
          </Link>
          {GENRES.map((g) => (
            <Link key={g} href={`/feed?genre=${encodeURIComponent(g)}`} style={{
              padding: '7px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600,
              background: genre === g ? 'var(--orange)' : 'var(--surface2)',
              color: genre === g ? '#fff' : 'var(--muted)',
              border: `1px solid ${genre === g ? 'var(--orange)' : 'var(--border)'}`,
            }}>
              {g}
            </Link>
          ))}
        </div>
      </div>

      {/* Feed grid */}
      {reviews.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 24px',
          color: 'var(--muted)', fontSize: 15,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>♫</div>
          <p style={{ marginBottom: 8 }}>No reviews yet{genre ? ` for ${genre}` : ''}.</p>
          <p style={{ fontSize: 13 }}>Be the first to post one from the mobile app.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
