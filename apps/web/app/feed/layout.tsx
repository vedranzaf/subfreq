export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Desktop side hints */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 48,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
      }}>
        {/* Left hint — hidden on mobile */}
        <div className="desktop-hint" style={{
          color: 'rgba(255,255,255,0.2)',
          fontSize: 13,
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: 160,
          lineHeight: 1.6,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>↕</div>
          Scroll to discover<br />underground music
        </div>

        {/* Phone frame */}
        <div style={{
          width: '100%',
          maxWidth: 390,
          height: '100%',
          maxHeight: 844,
          position: 'relative',
          borderRadius: 44,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 40px 120px rgba(0,0,0,0.8)',
          flexShrink: 0,
        }}>
          {/* Notch */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 120, height: 34, background: '#000',
            borderRadius: '0 0 20px 20px', zIndex: 50,
          }} />
          {children}
        </div>

        {/* Right hint — hidden on mobile */}
        <div className="desktop-hint" style={{
          color: 'rgba(255,255,255,0.2)',
          fontSize: 13,
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: 160,
          lineHeight: 1.6,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>♫</div>
          Tap to open<br />on SoundCloud
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .desktop-hint { display: none !important; }
        }
        @media (max-height: 900px) {
          .desktop-hint { display: none !important; }
        }
      `}</style>
    </div>
  );
}
