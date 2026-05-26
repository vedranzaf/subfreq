import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px 24px',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>♫</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>404</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32 }}>This page doesn&apos;t exist.</p>
      <Link href="/" style={{
        background: 'var(--orange)', color: '#fff',
        padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14,
      }}>
        Go home →
      </Link>
    </div>
  );
}
