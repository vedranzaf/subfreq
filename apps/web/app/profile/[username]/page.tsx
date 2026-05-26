import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Review, User } from '@/lib/types';

function formatCue(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : `${Math.floor(d / 30)}mo ago`;
}

async function getUserData(username: string): Promise<{ user: User; reviews: Review[] } | null> {
  const base = process.env.API_URL ?? 'https://subfreq-wine.vercel.app';
  try {
    const [userRes, reviewsRes] = await Promise.all([
      fetch(`${base}/api/users/${username}`, { next: { revalidate: 60 } }),
      fetch(`${base}/api/users/${username}/reviews`, { next: { revalidate: 60 } }),
    ]);
    if (!userRes.ok) return null;
    const { user } = await userRes.json();
    const { reviews } = reviewsRes.ok ? await reviewsRes.json() : { reviews: [] };
    return { user, reviews };
  } catch {
    return null;
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getUserData(username);
  if (!data) notFound();

  const { user, reviews } = data;
  const hue = username.charCodeAt(0) * 15 % 360;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {/* Profile header */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '32px',
        marginBottom: 36,
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
          background: user.avatar_url
            ? `url(${user.avatar_url}) center/cover`
            : `linear-gradient(135deg, hsl(${hue},50%,15%), hsl(${(hue+60)%360},50%,22%))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: `hsl(${hue},70%,65%)`,
          border: '2px solid var(--border)',
        }}>
          {!user.avatar_url && username[0].toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>@{user.username}</h1>
          {user.bio && (
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>{user.bio}</p>
          )}
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--orange)' }}>{reviews.length}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reviews</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{user.follower_count}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{user.following_count}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
        Reviews{reviews.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 8 }}>({reviews.length})</span>}
      </h2>

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>♫</div>
          <p>No reviews posted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map((r) => (
            <div key={r.id} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '20px',
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
            }}>
              {/* Track artwork */}
              <div style={{
                width: 64, height: 64, borderRadius: 10, flexShrink: 0,
                background: r.track.artwork_url
                  ? `url(${r.track.artwork_url?.replace('-large', '-t300x300')}) center/cover`
                  : `linear-gradient(135deg, hsl(${hue},40%,10%), hsl(${(hue+80)%360},40%,18%))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, border: '1px solid var(--border)',
              }}>
                {!r.track.artwork_url && '♫'}
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <a href={r.track.soundcloud_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 14, fontWeight: 700, color: 'var(--orange)' }}>
                    {r.track.artist} — {r.track.title}
                  </a>
                  <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>
                    {timeAgo(r.created_at)}
                  </span>
                </div>

                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 12 }}>
                  {r.body}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {r.cue_seconds != null && (
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: 'var(--orange)',
                      background: 'var(--orange-dim)', padding: '3px 10px',
                      borderRadius: 100, border: '1px solid var(--orange-border)',
                    }}>⚡ {formatCue(r.cue_seconds)}</span>
                  )}
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>▲ {r.upvote_count}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>💬 {r.comment_count}</span>
                  <a href={r.track.soundcloud_url} target="_blank" rel="noopener noreferrer"
                    style={{
                      marginLeft: 'auto', background: 'var(--orange)', color: '#fff',
                      padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                    }}>
                    ▶ Listen
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/feed" style={{ fontSize: 14, color: 'var(--muted)' }}>← Back to feed</Link>
      </div>
    </div>
  );
}
