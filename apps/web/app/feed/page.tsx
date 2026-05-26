'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

const API = 'https://subfreq-wine.vercel.app/api';

interface Track {
  soundcloud_id: string;
  title: string;
  artist: string;
  artwork_url: string | null;
  soundcloud_url: string;
  duration_ms: number;
}

interface Reviewer {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Review {
  id: string;
  created_at: string;
  body: string;
  cue_seconds: number | null;
  background_video_url: string | null;
  upvote_count: number;
  comment_count: number;
  has_upvoted: boolean;
  reviewer: Reviewer;
  track: Track;
}

function formatCue(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'now';
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function hueFromStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return h % 360;
}

function ReviewSlide({ review, isActive }: { review: Review; isActive: boolean }) {
  const hue = hueFromStr(review.id);
  const artwork = review.track.artwork_url?.replace('-large', '-t300x300') ?? null;
  const [upvoted, setUpvoted] = useState(review.has_upvoted);
  const [upvotes, setUpvotes] = useState(review.upvote_count);
  const [bodyExpanded, setBodyExpanded] = useState(false);

  const handleUpvote = () => {
    setUpvoted(v => !v);
    setUpvotes(v => upvoted ? v - 1 : v + 1);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      flexShrink: 0,
      overflow: 'hidden',
      background: '#111',
    }}>
      {/* Background artwork */}
      {artwork ? (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${artwork})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px) brightness(0.35) saturate(1.4)',
          transform: 'scale(1.1)',
        }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, hsl(${hue},35%,8%) 0%, hsl(${(hue+80)%360},35%,14%) 100%)`,
        }} />
      )}

      {/* Artwork as centered image */}
      {artwork && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -65%)',
          width: 220, height: 220,
          borderRadius: 16,
          backgroundImage: `url(${artwork})`,
          backgroundSize: 'cover',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          opacity: isActive ? 1 : 0.7,
          transition: 'opacity 0.4s',
          zIndex: 2,
        }} />
      )}

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '65%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
        zIndex: 3,
      }} />

      {/* Top gradient (for status bar area) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 80,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
        zIndex: 3,
      }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 40, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10, padding: '0 20px',
      }}>
        <Link href="/" style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em',
        }}>
          sub<span style={{ color: '#ff5500' }}>freq</span>
        </Link>
      </div>

      {/* Side actions */}
      <div style={{
        position: 'absolute', right: 14, bottom: 120,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
        zIndex: 10,
      }}>
        {/* Reviewer avatar */}
        <div style={{ position: 'relative', marginBottom: 4 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: review.reviewer.avatar_url
              ? `url(${review.reviewer.avatar_url}) center/cover`
              : `linear-gradient(135deg, hsl(${hueFromStr(review.reviewer.username)},50%,20%), hsl(${(hueFromStr(review.reviewer.username)+60)%360},50%,28%))`,
            border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700,
            color: `hsl(${hueFromStr(review.reviewer.username)},70%,75%)`,
          }}>
            {!review.reviewer.avatar_url && review.reviewer.username[0].toUpperCase()}
          </div>
          <div style={{
            position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
            width: 20, height: 20, borderRadius: '50%',
            background: '#ff5500',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#fff', fontWeight: 900,
          }}>+</div>
        </div>

        {/* Upvote */}
        <button onClick={handleUpvote} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: upvoted ? '#ff5500' : '#fff',
          transition: 'color 0.15s, transform 0.1s',
          transform: upvoted ? 'scale(1.15)' : 'scale(1)',
        }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>▲</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{upvotes >= 1000 ? `${(upvotes/1000).toFixed(1)}k` : upvotes}</span>
        </button>

        {/* Comments */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 26, lineHeight: 1 }}>💬</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{review.comment_count}</span>
        </div>

        {/* Share */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>🔗</span>
        </div>

        {/* Genre disc */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a1a1a, #333)',
          border: '2px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
          animation: isActive ? 'spin 4s linear infinite' : 'none',
        }}>
          ♫
        </div>
      </div>

      {/* Bottom content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 72,
        padding: '0 16px 32px',
        zIndex: 10,
      }}>
        {/* Reviewer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Link href={`/profile/${review.reviewer.username}`} style={{
            fontSize: 15, fontWeight: 700, color: '#fff',
          }}>
            @{review.reviewer.username}
          </Link>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>· {timeAgo(review.created_at)}</span>
        </div>

        {/* Track */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: 10, padding: '8px 12px',
          marginBottom: 10, border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ fontSize: 16, color: '#ff5500', flexShrink: 0 }}>♫</span>
          <span style={{
            fontSize: 12, fontWeight: 600, flex: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {review.track.artist} — {review.track.title}
          </span>
          {review.cue_seconds != null && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#ff5500',
              background: 'rgba(255,85,0,0.15)', padding: '2px 7px',
              borderRadius: 100, flexShrink: 0,
            }}>⚡{formatCue(review.cue_seconds)}</span>
          )}
        </div>

        {/* Review body */}
        <p
          onClick={() => setBodyExpanded(v => !v)}
          style={{
            fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6,
            marginBottom: 12, cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: bodyExpanded ? undefined : 3,
            WebkitBoxOrient: 'vertical',
            overflow: bodyExpanded ? 'visible' : 'hidden',
          } as React.CSSProperties}
        >
          {review.body}
          {!bodyExpanded && <span style={{ color: 'rgba(255,255,255,0.4)' }}> more</span>}
        </p>

        {/* SoundCloud CTA */}
        <a
          href={review.track.soundcloud_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#ff5500', color: '#fff',
            padding: '11px 0', borderRadius: 12,
            fontSize: 13, fontWeight: 800, letterSpacing: '0.03em',
            textDecoration: 'none',
          }}
        >
          ▶ LISTEN ON SOUNDCLOUD
        </a>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function FeedPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [genre, setGenre] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'trending' | 'genre'>('trending');
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const loadFeed = useCallback(async (type: string, g?: string | null) => {
    setLoading(true);
    try {
      const url = g
        ? `${API}/feed?type=genre&genre=${encodeURIComponent(g)}`
        : `${API}/feed?type=${type}&limit=20`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setActiveIndex(0);
      containerRef.current?.scrollTo({ top: 0 });
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFeed('trending'); }, [loadFeed]);

  // Track active slide via IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.findIndex(r => r === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 },
    );
    slideRefs.current.forEach(r => r && observer.observe(r));
    return () => observer.disconnect();
  }, [reviews]);

  const GENRES = ['Techno', 'Electronic', 'Drum & Bass', 'Ambient', 'Hip-Hop', 'Footwork'];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
      {/* Genre tabs */}
      <div style={{
        position: 'absolute', top: 44, left: 0, right: 0,
        display: 'flex', gap: 0,
        justifyContent: 'center',
        zIndex: 20, padding: '0 60px',
      }}>
        <button
          onClick={() => { setFeedType('trending'); setGenre(null); loadFeed('trending'); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: feedType === 'trending' && !genre ? '#fff' : 'rgba(255,255,255,0.45)',
            fontWeight: feedType === 'trending' && !genre ? 700 : 500,
            fontSize: 14, padding: '4px 12px',
            borderBottom: feedType === 'trending' && !genre ? '2px solid #fff' : '2px solid transparent',
          }}
        >
          Trending
        </button>
        <button
          onClick={() => {
            // cycle through genres
            const next = GENRES[(GENRES.indexOf(genre ?? '') + 1) % GENRES.length];
            setFeedType('genre'); setGenre(next); loadFeed('genre', next);
          }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: feedType === 'genre' ? '#fff' : 'rgba(255,255,255,0.45)',
            fontWeight: feedType === 'genre' ? 700 : 500,
            fontSize: 14, padding: '4px 12px',
            borderBottom: feedType === 'genre' ? '2px solid #ff5500' : '2px solid transparent',
          }}
        >
          {genre ?? 'Genres'}
        </button>
      </div>

      {/* Genre picker drawer */}
      {feedType === 'genre' && (
        <div style={{
          position: 'absolute', top: 80, left: 12, right: 12,
          display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center',
          zIndex: 20,
        }}>
          {GENRES.map(g => (
            <button key={g} onClick={() => { setGenre(g); loadFeed('genre', g); }} style={{
              background: genre === g ? '#ff5500' : 'rgba(0,0,0,0.6)',
              border: `1px solid ${genre === g ? '#ff5500' : 'rgba(255,255,255,0.2)'}`,
              backdropFilter: 'blur(10px)',
              color: '#fff', fontSize: 11, fontWeight: 600,
              padding: '5px 12px', borderRadius: 100, cursor: 'pointer',
            }}>
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Scroll container */}
      <div
        ref={containerRef}
        style={{
          width: '100%', height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {loading ? (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.4)', gap: 12,
            scrollSnapAlign: 'start',
          }}>
            <div style={{ fontSize: 48 }}>♫</div>
            <div style={{ fontSize: 14 }}>Loading...</div>
          </div>
        ) : reviews.length === 0 ? (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.4)', gap: 12,
            scrollSnapAlign: 'start',
          }}>
            <div style={{ fontSize: 48 }}>♫</div>
            <div style={{ fontSize: 14 }}>No reviews yet for {genre ?? 'this feed'}</div>
          </div>
        ) : (
          reviews.map((review, i) => (
            <div
              key={review.id}
              ref={el => { slideRefs.current[i] = el; }}
              style={{ width: '100%', height: '100%', scrollSnapAlign: 'start', flexShrink: 0 }}
            >
              <ReviewSlide review={review} isActive={i === activeIndex} />
            </div>
          ))
        )}
      </div>

      {/* Progress dots */}
      {reviews.length > 1 && (
        <div style={{
          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 4, zIndex: 20,
        }}>
          {reviews.slice(0, 10).map((_, i) => (
            <div key={i} style={{
              width: 3, height: i === activeIndex ? 16 : 5,
              borderRadius: 2,
              background: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.25)',
              transition: 'height 0.2s, background 0.2s',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
