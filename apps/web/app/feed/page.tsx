'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

const API = 'https://subfreq-wine.vercel.app/api';

const GENRES = ['Techno', 'Electronic', 'Drum & Bass', 'Ambient', 'Hip-Hop', 'Footwork'];

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

function ReviewSlide({
  review,
  isActive,
}: {
  review: Review;
  isActive: boolean;
}) {
  const hue = hueFromStr(review.id);
  const reviewerHue = hueFromStr(review.reviewer.username);
  const artwork = review.track.artwork_url ?? null;
  const [upvoted, setUpvoted] = useState(review.has_upvoted);
  const [upvotes, setUpvotes] = useState(review.upvote_count);
  const [bodyExpanded, setBodyExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleUpvote = () => {
    setUpvoted(v => !v);
    setUpvotes(v => upvoted ? v - 1 : v + 1);
  };

  const showImage = artwork && !imgError;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(160deg, hsl(${hue},35%,6%) 0%, hsl(${(hue + 80) % 360},35%,12%) 100%)`,
    }}>

      {/* Blurred background artwork */}
      {showImage && (
        <img
          src={artwork}
          alt=""
          onError={() => setImgError(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'blur(48px) brightness(0.3) saturate(1.6)',
            transform: 'scale(1.15)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Dark overlay — always present */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.95) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Centred album art — only occupies the middle zone */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -58%)',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        {showImage ? (
          <img
            src={artwork}
            alt={`${review.track.artist} — ${review.track.title}`}
            onError={() => setImgError(true)}
            style={{
              width: 200, height: 200,
              borderRadius: 16,
              objectFit: 'cover',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
              display: 'block',
              opacity: isActive ? 1 : 0.7,
              transition: 'opacity 0.4s',
            }}
          />
        ) : (
          /* Fallback art — coloured square with initials */
          <div style={{
            width: 200, height: 200,
            borderRadius: 16,
            background: `linear-gradient(135deg, hsl(${hue},45%,18%), hsl(${(hue + 90) % 360},45%,28%))`,
            boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 48 }}>♫</span>
            <span style={{
              fontSize: 12, fontWeight: 700, textAlign: 'center', padding: '0 12px',
              color: 'rgba(255,255,255,0.7)', lineHeight: 1.4,
            }}>
              {review.track.artist}
            </span>
          </div>
        )}
      </div>

      {/* ── SIDE ACTIONS ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        right: 12,
        bottom: 180,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        zIndex: 10,
      }}>
        {/* Reviewer avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: `linear-gradient(135deg,
              hsl(${reviewerHue},50%,18%),
              hsl(${(reviewerHue + 60) % 360},50%,26%))`,
            border: '2px solid rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, fontWeight: 800,
            color: `hsl(${reviewerHue},70%,75%)`,
          }}>
            {review.reviewer.username[0].toUpperCase()}
          </div>
          <div style={{
            position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
            width: 20, height: 20, borderRadius: '50%',
            background: '#ff5500',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#fff', fontWeight: 900, lineHeight: 1,
          }}>+</div>
        </div>

        {/* Upvote */}
        <button onClick={handleUpvote} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: upvoted ? '#ff5500' : '#fff',
          transition: 'color 0.15s',
          transform: upvoted ? 'scale(1.1)' : 'scale(1)',
        }}>
          <span style={{ fontSize: 30, lineHeight: 1 }}>▲</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>
            {upvotes >= 1000 ? `${(upvotes / 1000).toFixed(1)}k` : upvotes}
          </span>
        </button>

        {/* Comment */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
          <span style={{ fontSize: 27, lineHeight: 1 }}>💬</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{review.comment_count}</span>
        </div>

        {/* Share */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
          <span style={{ fontSize: 25, lineHeight: 1 }}>🔗</span>
        </div>

        {/* Spinning disc */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1c1c1c, #3a3a3a)',
          border: '3px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          animation: isActive ? 'spin 5s linear infinite' : 'none',
        }}>♫</div>
      </div>

      {/* ── BOTTOM CONTENT ───────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 64,
        padding: '0 16px 28px',
        zIndex: 10,
      }}>
        {/* Reviewer + time */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
        }}>
          <Link href={`/profile/${review.reviewer.username}`} style={{
            fontSize: 15, fontWeight: 700, color: '#fff',
          }}>
            @{review.reviewer.username}
          </Link>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            · {timeAgo(review.created_at)}
          </span>
        </div>

        {/* Track bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderRadius: 10, padding: '7px 11px',
          marginBottom: 10,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ fontSize: 15, color: '#ff5500', flexShrink: 0 }}>♫</span>
          <span style={{
            fontSize: 12, fontWeight: 600, flex: 1, color: 'rgba(255,255,255,0.9)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {review.track.artist} — {review.track.title}
          </span>
          {review.cue_seconds != null && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#ff5500',
              background: 'rgba(255,85,0,0.15)',
              padding: '2px 8px', borderRadius: 100, flexShrink: 0,
            }}>
              ⚡{formatCue(review.cue_seconds)}
            </span>
          )}
        </div>

        {/* Review body — tap to expand */}
        <p
          onClick={() => setBodyExpanded(v => !v)}
          style={{
            fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6,
            marginBottom: 12, cursor: 'pointer', userSelect: 'none',
            ...(bodyExpanded ? {} : {
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }),
          } as React.CSSProperties}
        >
          {review.body}
          {!bodyExpanded && (
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}> … more</span>
          )}
        </p>

        {/* SoundCloud CTA */}
        <a
          href={review.track.soundcloud_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#ff5500', color: '#fff',
            padding: '11px', borderRadius: 12,
            fontSize: 13, fontWeight: 800, letterSpacing: '0.04em',
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

/* ─── Main feed page ────────────────────────────────────────────────────────── */
export default function FeedPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [genre, setGenre] = useState<string | null>(null);
  const [showGenrePicker, setShowGenrePicker] = useState(false);
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
      containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFeed('trending'); }, [loadFeed]);

  // Track active slide
  useEffect(() => {
    if (!containerRef.current || reviews.length === 0) return;
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

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000', overflow: 'hidden' }}>

      {/* ── HEADER: single row, no overlap ──────────────────── */}
      {/* Sits ABOVE the scroll content, inside the phone frame */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 88,  /* notch (34) + status gap (10) + tab row (44) */
        zIndex: 30,
        pointerEvents: 'none',
      }}>
        {/* Tab row — below the notch */}
        <div style={{
          position: 'absolute',
          top: 44,   /* below notch (34px) + small gap */
          left: 0, right: 0,
          height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 4,
          pointerEvents: 'all',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)',
        }}>
          {/* Logo */}
          <Link href="/" style={{
            fontSize: 17, fontWeight: 900, letterSpacing: '-0.03em',
            color: '#fff', position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          }}>
            sub<span style={{ color: '#ff5500' }}>freq</span>
          </Link>

          {/* Trending tab */}
          <button
            onClick={() => {
              setGenre(null); setShowGenrePicker(false);
              loadFeed('trending');
            }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: !genre ? '#fff' : 'rgba(255,255,255,0.45)',
              fontWeight: !genre ? 700 : 500,
              fontSize: 14, padding: '0 10px',
              borderBottom: `2px solid ${!genre ? '#fff' : 'transparent'}`,
              lineHeight: '42px',
            }}
          >
            Trending
          </button>

          {/* Genre tab */}
          <button
            onClick={() => setShowGenrePicker(v => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: genre ? '#ff5500' : 'rgba(255,255,255,0.45)',
              fontWeight: genre ? 700 : 500,
              fontSize: 14, padding: '0 10px',
              borderBottom: `2px solid ${genre ? '#ff5500' : 'transparent'}`,
              lineHeight: '42px',
            }}
          >
            {genre ?? 'Genres ▾'}
          </button>
        </div>
      </div>

      {/* Genre picker — slides down from below the header */}
      {showGenrePicker && (
        <div style={{
          position: 'absolute',
          top: 88, left: 0, right: 0,
          padding: '10px 12px',
          display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center',
          zIndex: 29,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          {GENRES.map(g => (
            <button key={g} onClick={() => {
              setGenre(g); setShowGenrePicker(false); loadFeed('genre', g);
            }} style={{
              background: genre === g ? '#ff5500' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${genre === g ? '#ff5500' : 'rgba(255,255,255,0.15)'}`,
              color: '#fff', fontSize: 12, fontWeight: 600,
              padding: '6px 14px', borderRadius: 100, cursor: 'pointer',
            }}>
              {g}
            </button>
          ))}
        </div>
      )}

      {/* ── SCROLL CONTAINER ─────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          width: '100%', height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>

        {loading ? (
          <div style={{
            width: '100%', height: '100%', scrollSnapAlign: 'start',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.35)', gap: 14,
          }}>
            <div style={{ fontSize: 52 }}>♫</div>
            <div style={{ fontSize: 14 }}>Loading...</div>
          </div>
        ) : reviews.length === 0 ? (
          <div style={{
            width: '100%', height: '100%', scrollSnapAlign: 'start',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.35)', gap: 14,
          }}>
            <div style={{ fontSize: 52 }}>♫</div>
            <div style={{ fontSize: 14 }}>No reviews for {genre ?? 'this feed'}</div>
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

      {/* ── PROGRESS DOTS ────────────────────────────────────── */}
      {reviews.length > 1 && (
        <div style={{
          position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 4, zIndex: 20,
          pointerEvents: 'none',
        }}>
          {reviews.slice(0, 12).map((_, i) => (
            <div key={i} style={{
              width: 3,
              height: i === activeIndex ? 18 : 5,
              borderRadius: 2,
              background: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.2)',
              transition: 'height 0.2s, background 0.2s',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
