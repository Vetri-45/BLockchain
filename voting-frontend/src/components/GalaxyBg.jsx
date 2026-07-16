import { useEffect, useRef } from 'react';
import styles from './GalaxyBg.module.css';

export default function GalaxyBg() {
  const cursorGlowRef  = useRef(null);
  const trailsRef      = useRef([]);
  const mouseRef       = useRef({ x: 0, y: 0 });
  const animRef        = useRef(null);

  useEffect(() => {
    const glow   = cursorGlowRef.current;
    const trails = trailsRef.current;
    let   frame  = 0;

    // ── Mouse move handler ───────────────────────────────
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Move cursor glow
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top  = `${e.clientY}px`;
        glow.style.opacity = '1';
      }

      // Spawn star trail particle every 3 frames
      if (frame % 3 === 0) spawnTrail(e.clientX, e.clientY);
      frame++;
    };

    const onLeave = () => {
      if (glow) glow.style.opacity = '0';
    };

    // ── Spawn a tiny star at cursor position ─────────────
    const spawnTrail = (x, y) => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top:  ${y}px;
        width:  ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        border-radius: 50%;
        background: ${randomStarColor()};
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 6px ${randomStarColor()};
        transition: opacity 0.6s ease, transform 0.6s ease;
      `;
      document.body.appendChild(el);
      trails.push(el);

      // Animate outward then fade
      setTimeout(() => {
        const angle  = Math.random() * Math.PI * 2;
        const dist   = 20 + Math.random() * 40;
        el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`;
        el.style.opacity   = '0';
      }, 10);

      // Remove after animation
      setTimeout(() => {
        el.remove();
        const idx = trails.indexOf(el);
        if (idx > -1) trails.splice(idx, 1);
      }, 700);
    };

    const randomStarColor = () => {
      const colors = ['#ffffff', '#a5b4fc', '#7dd3fc', '#86efac', '#fde68a', '#f9a8d4'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // ── Click burst effect ───────────────────────────────
    const onClick = (e) => {
      for (let i = 0; i < 12; i++) {
        setTimeout(() => spawnTrail(e.clientX, e.clientY), i * 20);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('click', onClick);
      trails.forEach(t => t.remove());
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Cursor glow ring ─────────────────────────── */}
      <div
        ref={cursorGlowRef}
        style={{
          position:     'fixed',
          width:        '40px',
          height:       '40px',
          borderRadius: '50%',
          border:       '1.5px solid rgba(165,180,252,0.6)',
          background:   'radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)',
          transform:    'translate(-50%, -50%)',
          pointerEvents:'none',
          zIndex:       9999,
          opacity:      0,
          transition:   'opacity 0.3s ease, width 0.2s ease, height 0.2s ease',
          boxShadow:    '0 0 20px rgba(165,180,252,0.3)',
        }}
      />

      <div className={styles.galaxyBg} aria-hidden="true">
        {/* Nebula clouds */}
        <div className={`${styles.nebula} ${styles.nebula1}`} />
        <div className={`${styles.nebula} ${styles.nebula2}`} />
        <div className={`${styles.nebula} ${styles.nebula3}`} />

        {/* Shooting stars */}
        <div className={`${styles.shootingStar} ${styles.ss1}`} />
        <div className={`${styles.shootingStar} ${styles.ss2}`} />
        <div className={`${styles.shootingStar} ${styles.ss3}`} />

        {/* Twinkling stars */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={styles.twinkleStar}
            style={{
              left:           `${(i * 37 + 5) % 100}%`,
              top:            `${(i * 23 + 8) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              width:          i % 3 === 0 ? '2px' : '1px',
              height:         i % 3 === 0 ? '2px' : '1px',
              cursor:         'pointer',
            }}
          />
        ))}
      </div>
    </>
  );
}