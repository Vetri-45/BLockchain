import { useEffect, useRef, useState } from 'react';

export default function CyberCursor() {
  const dotRef   = useRef(null);   // inner dot  — exact position
  const ringRef  = useRef(null);   // outer ring — lerped / delayed
  const trailRef = useRef(null);   // scan trail

  const pos     = useRef({ x: window.innerWidth  / 2, y: window.innerHeight / 2 });
  const delayed = useRef({ x: window.innerWidth  / 2, y: window.innerHeight / 2 });
  const animId  = useRef(null);

  const [clicking,  setClicking]  = useState(false);
  const [hovering,  setHovering]  = useState(false);
  const [ripples,   setRipples]   = useState([]);

  // ── Track mouse ──────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onDown = (e) => {
      setClicking(true);
      // Spawn ripple
      setRipples(prev => [
        ...prev.slice(-4),
        { id: Date.now(), x: e.clientX, y: e.clientY },
      ]);
    };

    const onUp   = ()  => setClicking(false);

    // Detect hoverable elements
    const onOver = (e) => {
      const t = e.target;
      if (
        t.tagName === 'BUTTON' ||
        t.tagName === 'A'      ||
        t.tagName === 'INPUT'  ||
        t.closest('button')    ||
        t.closest('a')
      ) setHovering(true);
      else setHovering(false);
    };

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('mouseover',  onOver);

    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('mouseover',  onOver);
    };
  }, []);

  // ── Animation loop — lerp the ring ───────────────────────
  useEffect(() => {
    const loop = () => {
      // Lerp factor — lower = more lag
      const lerp = 0.1;
      delayed.current.x += (pos.current.x - delayed.current.x) * lerp;
      delayed.current.y += (pos.current.y - delayed.current.y) * lerp;

      const dot  = dotRef.current;
      const ring = ringRef.current;
      const trail = trailRef.current;

      if (dot) {
        dot.style.left = `${pos.current.x}px`;
        dot.style.top  = `${pos.current.y}px`;
      }

      if (ring) {
        ring.style.left = `${delayed.current.x}px`;
        ring.style.top  = `${delayed.current.y}px`;
      }

      if (trail) {
        trail.style.left = `${delayed.current.x}px`;
        trail.style.top  = `${delayed.current.y}px`;
      }

      animId.current = requestAnimationFrame(loop);
    };

    animId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId.current);
  }, []);

  // ── Clean up old ripples ─────────────────────────────────
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 800);
    return () => clearTimeout(timer);
  }, [ripples]);

  // ── Shared positioning style ─────────────────────────────
  const base = {
    position  : 'fixed',
    pointerEvents: 'none',
    zIndex    : 99999,
    transform : 'translate(-50%, -50%)',
  };

  return (
    <>
      {/* ── Inner dot ───────────────────────────────────── */}
      <div
        ref={dotRef}
        style={{
          ...base,
          width      : clicking ? '6px' : '8px',
          height     : clicking ? '6px' : '8px',
          borderRadius: '50%',
          background : '#00ffc8',
          boxShadow  : `0 0 ${clicking ? 12 : 8}px #00ffc8,
                        0 0 ${clicking ? 24 : 16}px rgba(0,255,200,0.6)`,
          transition : 'width 0.1s, height 0.1s, box-shadow 0.1s',
        }}
      />

      {/* ── Outer ring ──────────────────────────────────── */}
      <div
        ref={ringRef}
        style={{
          ...base,
          width        : hovering ? '52px' : clicking ? '28px' : '36px',
          height       : hovering ? '52px' : clicking ? '28px' : '36px',
          borderRadius : hovering ? '8px'  : '50%',
          border       : `1.5px solid rgba(0,255,200,${hovering ? 0.9 : 0.55})`,
          boxShadow    : hovering
            ? '0 0 20px rgba(0,255,200,0.35), inset 0 0 12px rgba(0,255,200,0.08)'
            : '0 0 10px rgba(0,255,200,0.2)',
          transition   : 'width 0.2s ease, height 0.2s ease, border-radius 0.2s ease, border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Corner brackets — visible on hover */}
        {hovering && (
          <>
            {[
              { top:  -1, left:  -1, borderTop: '2px solid #00ffc8', borderLeft:  '2px solid #00ffc8' },
              { top:  -1, right: -1, borderTop: '2px solid #00ffc8', borderRight: '2px solid #00ffc8' },
              { bottom: -1, left:  -1, borderBottom: '2px solid #00ffc8', borderLeft:  '2px solid #00ffc8' },
              { bottom: -1, right: -1, borderBottom: '2px solid #00ffc8', borderRight: '2px solid #00ffc8' },
            ].map((s, i) => (
              <div key={i} style={{
                position  : 'absolute',
                width     : '8px',
                height    : '8px',
                ...s,
                transition: 'opacity 0.2s',
              }} />
            ))}
          </>
        )}
      </div>

      {/* ── Crosshair lines ─────────────────────────────── */}
      <div ref={trailRef} style={{ ...base }}>
        {/* Horizontal */}
        <div style={{
          position  : 'absolute',
          top       : '50%',
          left      : '50%',
          transform : 'translate(-50%, -50%)',
          width     : hovering ? '60px' : '20px',
          height    : '1px',
          background: `linear-gradient(90deg,
            transparent,
            rgba(0,255,200,${hovering ? 0.6 : 0.25}),
            transparent)`,
          transition: 'width 0.2s ease, opacity 0.2s',
        }} />
        {/* Vertical */}
        <div style={{
          position  : 'absolute',
          top       : '50%',
          left      : '50%',
          transform : 'translate(-50%, -50%)',
          width     : '1px',
          height    : hovering ? '60px' : '20px',
          background: `linear-gradient(180deg,
            transparent,
            rgba(0,255,200,${hovering ? 0.6 : 0.25}),
            transparent)`,
          transition: 'height 0.2s ease, opacity 0.2s',
        }} />
      </div>

      {/* ── Click ripples ───────────────────────────────── */}
      {ripples.map(r => (
        <div key={r.id} style={{
          ...base,
          left       : `${r.x}px`,
          top        : `${r.y}px`,
          width      : '8px',
          height     : '8px',
          borderRadius: '50%',
          border     : '1.5px solid #00ffc8',
          animation  : 'cyberRipple 0.7s ease-out forwards',
        }} />
      ))}

      {/* ── Ripple keyframes ────────────────────────────── */}
      <style>{`
        @keyframes cyberRipple {
          0%   { width: 8px;  height: 8px;  opacity: 0.9; }
          100% { width: 70px; height: 70px; opacity: 0;   }
        }
      `}</style>
    </>
  );
}