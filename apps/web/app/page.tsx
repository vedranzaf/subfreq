import Link from 'next/link';

const FEATURES = [
  {
    icon: '▲',
    title: 'Vertical feed',
    body: 'Scroll through reviews like a feed. Each card is a full-screen experience with the track playing behind it.',
  },
  {
    icon: '⚡',
    title: 'Cue timestamps',
    body: 'Reviewers pin the exact moment that hits hardest. Jump straight to the drop, the hook, the 32 bars that matter.',
  },
  {
    icon: '♫',
    title: 'SoundCloud native',
    body: 'Every review links directly to SoundCloud. One tap to listen. No rips, no re-uploads — the real thing.',
  },
  {
    icon: '👁',
    title: 'Taste graph',
    body: 'Follow reviewers whose ears you trust. Your feed shapes itself around the people, not the algorithm.',
  },
  {
    icon: '💬',
    title: 'Deep cuts only',
    body: 'No charts, no major labels. Subfreq is built for underground — techno, drum & bass, footwork, left-field everything.',
  },
  {
    icon: '🔗',
    title: 'Share a cue',
    body: 'Share a review with the timestamp embedded. Send someone exactly the moment you want them to hear.',
  },
];

const GENRES = ['Electronic', 'Techno', 'Drum & Bass', 'Ambient', 'Hip-Hop', 'Footwork', 'Jungle', 'Experimental'];

const MOCK_REVIEWS = [
  {
    username: 'bassline_archivist',
    track: 'Shackleton — Blood On My Hands',
    genre: 'Dub Techno',
    body: 'The kick doesn\'t drop until 4:22 and by then you\'ve been completely conditioned. Shackleton rewires your nervous system before he gives you the release.',
    cue: '4:22',
    upvotes: 312,
  },
  {
    username: 'spectral_ear',
    track: 'Burial — Archangel',
    genre: 'UK Garage',
    body: 'That vocal chop at 1:48 — it\'s not music, it\'s rain on a window at 3am. Nobody has made loneliness sound this precise before or since.',
    cue: '1:48',
    upvotes: 841,
  },
  {
    username: 'frequency_witch',
    track: 'Actress — Hubble',
    genre: 'Abstract',
    body: 'The static at the beginning isn\'t intro — it\'s the texture. Everything that follows is the static becoming something. One of the most patient openings in electronic music.',
    cue: '0:00',
    upvotes: 229,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,85,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,85,0,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(255,85,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 760 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--orange-dim)', border: '1px solid var(--orange-border)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 32,
            fontSize: 12, fontWeight: 600, color: 'var(--orange)', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ♫ Underground music discovery
          </div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            marginBottom: 24,
          }}>
            Music reviews
            <br />
            <span style={{ color: 'var(--orange)' }}>with soul.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--muted)',
            maxWidth: 520,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            A vertical feed of underground music reviews. Cue the exact moment. Follow the ears you trust. Discover what the algorithm buries.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/feed" style={{
              background: 'var(--orange)', color: '#fff',
              padding: '14px 32px', borderRadius: 10, fontWeight: 700,
              fontSize: 15, letterSpacing: '0.02em', transition: 'opacity 0.15s',
            }}>
              Explore the feed →
            </Link>
            <a href="#how" style={{
              background: 'var(--surface2)', color: 'var(--text)',
              border: '1px solid var(--border)',
              padding: '14px 32px', borderRadius: 10, fontWeight: 600,
              fontSize: 15, transition: 'border-color 0.15s',
            }}>
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* MOCK FEED PREVIEW */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              From the feed
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Reviews that hit different
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16, padding: 24,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `hsl(${(i * 120 + 20) % 360}, 60%, 20%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: `hsl(${(i * 120 + 20) % 360}, 80%, 70%)`,
                  }}>
                    {r.username[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>@{r.username}</span>
                  <span style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 100,
                    background: 'var(--orange-dim)', color: 'var(--orange)',
                    border: '1px solid var(--orange-border)',
                  }}>{r.genre}</span>
                </div>

                <div style={{
                  background: 'var(--surface2)', borderRadius: 10, padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 18, color: 'var(--orange)' }}>♫</span>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{r.track}</span>
                </div>

                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, flex: 1 }}>
                  {r.body}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: 'var(--orange)',
                    background: 'var(--orange-dim)', padding: '3px 10px',
                    borderRadius: 100, border: '1px solid var(--orange-border)',
                  }}>⚡ {r.cue}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 'auto' }}>▲ {r.upvotes}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/feed" style={{
              display: 'inline-block',
              background: 'transparent', color: 'var(--orange)',
              border: '1px solid var(--orange-border)',
              padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14,
            }}>
              See trending reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              How it works
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Built for music obsessives
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14, padding: '24px 24px 28px',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--orange-dim)', border: '1px solid var(--orange-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, marginBottom: 16,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GENRES */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            Browse by genre
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 40 }}>
            Every corner of the underground
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {GENRES.map((g) => (
              <Link key={g} href={`/feed?genre=${encodeURIComponent(g)}`} style={{
                padding: '10px 22px', borderRadius: 100,
                border: '1px solid var(--border)', background: 'var(--surface)',
                fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
                color: 'var(--muted)',
              }}>
                {g}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at center bottom, rgba(255,85,0,0.06) 0%, transparent 70%)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 20 }}>
            Start exploring<br />
            <span style={{ color: 'var(--orange)' }}>the underground.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 36, lineHeight: 1.7 }}>
            No algorithm. No major labels. Just reviews from people who actually care.
          </p>
          <Link href="/feed" style={{
            display: 'inline-block',
            background: 'var(--orange)', color: '#fff',
            padding: '16px 40px', borderRadius: 12, fontWeight: 700,
            fontSize: 16, letterSpacing: '0.02em',
          }}>
            Open the feed →
          </Link>
        </div>
      </section>
    </div>
  );
}
