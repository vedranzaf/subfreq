import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Subfreq — Underground Music Discovery',
  description: 'Discover underground music through the people who live it. Reviews, cue timestamps, and vertical feeds for music obsessives.',
  openGraph: {
    title: 'Subfreq',
    description: 'Underground music discovery — reviews with soul',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 24px',
            height: 56, display: 'flex', alignItems: 'center', gap: 32,
          }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>
                sub<span style={{ color: 'var(--orange)' }}>freq</span>
              </span>
            </a>
            <nav style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
              <a href="/feed" style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                Trending
              </a>
              <a href="/feed?genre=Electronic" style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                Genres
              </a>
            </nav>
          </div>
        </header>
        <main style={{ paddingTop: 56 }}>
          {children}
        </main>
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '32px 24px',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: 13,
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>
              sub<span style={{ color: 'var(--orange)' }}>freq</span>
            </span>
            {' '}· Underground music discovery · {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}
