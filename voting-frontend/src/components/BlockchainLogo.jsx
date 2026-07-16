import { useEffect, useRef } from 'react';

export default function BlockchainLogo() {
  const cubeRef = useRef(null);

  useEffect(() => {
    let angle = 0;
    let animId;
    const animate = () => {
      angle += 0.5;
      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateY(${angle}deg) rotateX(${angle * 0.4}deg)`;
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      gap:            '12px',
      marginBottom:   '8px',
    }}>

      {/* ── Chain link LEFT ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ChainLink />

        {/* ── 3D Cube ── */}
        <div style={{
          width:           '80px',
          height:          '80px',
          perspective:     '300px',
          perspectiveOrigin: '50% 50%',
        }}>
          <div
            ref={cubeRef}
            style={{
              width:          '100%',
              height:         '100%',
              position:       'relative',
              transformStyle: 'preserve-3d',
              transition:     'transform 0.016s linear',
            }}
          >
            {/* Front */}
            <CubeFace style={{ transform: 'translateZ(40px)' }} />
            {/* Back */}
            <CubeFace style={{ transform: 'rotateY(180deg) translateZ(40px)' }} opacity={0.6} />
            {/* Left */}
            <CubeFace style={{ transform: 'rotateY(-90deg) translateZ(40px)' }} opacity={0.7} />
            {/* Right */}
            <CubeFace style={{ transform: 'rotateY(90deg) translateZ(40px)' }} opacity={0.7} />
            {/* Top */}
            <CubeFace style={{ transform: 'rotateX(90deg) translateZ(40px)' }} opacity={0.8} />
            {/* Bottom */}
            <CubeFace style={{ transform: 'rotateX(-90deg) translateZ(40px)' }} opacity={0.5} />
          </div>
        </div>

        {/* ── Chain link RIGHT ── */}
        <ChainLink flip />
      </div>

      {/* ── Glow under cube ── */}
      <div style={{
        width:        '60px',
        height:       '8px',
        borderRadius: '50%',
        background:   'radial-gradient(ellipse, rgba(0,212,255,0.4) 0%, transparent 70%)',
        animation:    'pulseGlow 2s ease infinite',
        marginTop:    '-8px',
      }} />

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scaleX(0.8); }
          50%       { opacity: 1;   transform: scaleX(1.2); }
        }
      `}</style>
    </div>
  );
}

// ── Single cube face ──────────────────────────────────────
function CubeFace({ style, opacity = 1 }) {
  return (
    <div style={{
      position:     'absolute',
      width:        '80px',
      height:       '80px',
      border:       '1.5px solid rgba(0,212,255,0.7)',
      background:   `rgba(0,150,200,${0.08 * opacity})`,
      backdropFilter: 'blur(2px)',
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'center',
      boxShadow:    `inset 0 0 12px rgba(0,212,255,${0.15 * opacity}),
                     0 0 8px rgba(0,212,255,${0.1 * opacity})`,
      ...style,
    }}>
      {/* ── Corner dots ── */}
      {[
        { top: '6px',  left: '6px'  },
        { top: '6px',  right: '6px' },
        { bottom: '6px', left: '6px'  },
        { bottom: '6px', right: '6px' },
      ].map((pos, i) => (
        <div key={i} style={{
          position:     'absolute',
          width:        '4px',
          height:       '4px',
          borderRadius: '50%',
          background:   '#00d4ff',
          boxShadow:    '0 0 6px #00d4ff',
          ...pos,
        }} />
      ))}

      {/* ── Center node ── */}
      <div style={{
        width:        '10px',
        height:       '10px',
        borderRadius: '50%',
        background:   'radial-gradient(circle, #00d4ff, #0080ff)',
        boxShadow:    '0 0 10px #00d4ff, 0 0 20px rgba(0,212,255,0.5)',
      }} />
    </div>
  );
}

// ── Chain link component ──────────────────────────────────
function ChainLink({ flip = false }) {
  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      gap:           '3px',
      transform:     flip ? 'scaleX(-1)' : 'none',
      animation:     'chainPulse 2s ease infinite',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width:        '20px',
          height:       '8px',
          borderRadius: '4px',
          border:       '1.5px solid rgba(0,212,255,0.7)',
          background:   'rgba(0,212,255,0.08)',
          boxShadow:    '0 0 6px rgba(0,212,255,0.3)',
          animationDelay: `${i * 0.2}s`,
          animation:    `linkGlow 2s ease ${i * 0.2}s infinite`,
        }} />
      ))}

      <style>{`
        @keyframes chainPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1;   }
        }
        @keyframes linkGlow {
          0%, 100% { box-shadow: 0 0 4px rgba(0,212,255,0.3); border-color: rgba(0,212,255,0.5); }
          50%       { box-shadow: 0 0 10px rgba(0,212,255,0.8); border-color: rgba(0,212,255,1); }
        }
      `}</style>
    </div>
  );
}