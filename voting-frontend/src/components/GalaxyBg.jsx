import { useEffect, useRef } from 'react';

export default function GalaxyBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let animId;

    // ── Config ──────────────────────────────────────────────
    const CONFIG = {
      particleCount : 90,
      connectDist   : 140,
      nodeRadius    : { min: 1.5, max: 3.5 },
      speed         : { min: 0.15, max: 0.45 },
      colors        : {
        nodeBright : '#00ffc8',
        nodeDim    : '#90caf9',
        line       : '0,255,200',
        glow       : '0,255,200',
      },
    };

    // ── Resize ───────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Mouse tracking ───────────────────────────────────────
    const mouse = { x: canvas.width / 2, y: canvas.height / 2, active: false };
    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; };
    const onMouseOut  = ()  => { mouse.active = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout',  onMouseOut);

    // ── Particle factory ─────────────────────────────────────
    const rand = (min, max) => Math.random() * (max - min) + min;

    class Particle {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x    = initial ? rand(0, canvas.width) : rand(0, canvas.width);
        this.y    = initial ? rand(0, canvas.height) : rand(0, canvas.height);
        this.vx   = rand(-CONFIG.speed.max, CONFIG.speed.max);
        this.vy   = rand(-CONFIG.speed.max, CONFIG.speed.max);
        // ensure minimum speed
        if (Math.abs(this.vx) < CONFIG.speed.min) this.vx *= 2;
        if (Math.abs(this.vy) < CONFIG.speed.min) this.vy *= 2;

        this.r       = rand(CONFIG.nodeRadius.min, CONFIG.nodeRadius.max);
        this.base    = this.r;
        this.bright  = Math.random() > 0.7;           // 30% are cyan, rest are blue
        this.pulse   = rand(0, Math.PI * 2);           // phase offset for breathing
        this.pulseSpd= rand(0.01, 0.03);
        this.opacity = rand(0.4, 1);
      }

      update() {
        this.x    += this.vx;
        this.y    += this.vy;
        this.pulse+= this.pulseSpd;
        this.r     = this.base + Math.sin(this.pulse) * 0.6;

        // Bounce off edges with padding
        if (this.x < -20 || this.x > canvas.width  + 20) this.vx *= -1;
        if (this.y < -20 || this.y > canvas.height + 20) this.vy *= -1;
      }

      draw() {
        const color = this.bright ? CONFIG.colors.nodeBright : CONFIG.colors.nodeDim;

        // Outer glow
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4);
        grd.addColorStop(0, this.bright
          ? `rgba(0,255,200,${this.opacity * 0.4})`
          : `rgba(144,202,249,${this.opacity * 0.2})`);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Inner white highlight
        ctx.beginPath();
        ctx.arc(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fill();
      }
    }

    // ── Create particles ─────────────────────────────────────
    const particles = Array.from({ length: CONFIG.particleCount }, () => new Particle());

    // ── Mouse particle (follows cursor) ──────────────────────
    const mousePart = {
      x: mouse.x, y: mouse.y,
      r: 4, bright: true, opacity: 0.9,
    };

    // ── Draw connections ─────────────────────────────────────
    const drawConnections = (list) => {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a  = list[i];
          const b  = list[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);

          if (d < CONFIG.connectDist) {
            const alpha = (1 - d / CONFIG.connectDist) * 0.55;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            // Gradient line
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            const ca   = a.bright ? CONFIG.colors.line : '144,202,249';
            const cb   = b.bright ? CONFIG.colors.line : '144,202,249';
            grad.addColorStop(0, `rgba(${ca},${alpha})`);
            grad.addColorStop(1, `rgba(${cb},${alpha})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth   = alpha * 1.5;
            ctx.stroke();

            // Midpoint pulse dot on brighter connections
            if (alpha > 0.35) {
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              ctx.beginPath();
              ctx.arc(mx, my, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${CONFIG.colors.glow},${alpha * 0.8})`;
              ctx.fill();
            }
          }
        }
      }
    };

    // ── Mouse connections (wider reach) ──────────────────────
    const drawMouseConnections = () => {
      if (!mouse.active) return;
      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        const reach = CONFIG.connectDist * 1.6;

        if (d < reach) {
          const alpha = (1 - d / reach) * 0.7;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(0,255,200,${alpha})`;
          ctx.lineWidth   = alpha * 2;
          ctx.stroke();
        }
      });

      // Draw mouse node
      const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 20);
      grd.addColorStop(0, 'rgba(0,255,200,0.35)');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffc8';
      ctx.fill();
    };

    // ── Main loop ─────────────────────────────────────────────
    const loop = () => {
      // Deep dark background — matches your theme
      ctx.fillStyle = 'rgba(5, 8, 20, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawConnections(particles);
      drawMouseConnections();
      particles.forEach(p => { p.update(); p.draw(); });

      animId = requestAnimationFrame(loop);
    };

    // First clear — solid dark fill
    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout',  onMouseOut);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position : 'fixed',
        inset    : 0,
        zIndex   : 0,
        display  : 'block',
        background: '#050814',
      }}
    />
  );
}