import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getElections } from '../api/services';
import { Badge, Button, Spinner, EmptyState } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import styles from './Elections.module.css';

function statusColor(s) {
  if (!s) return 'default';
  const u = s.toUpperCase();
  if (u === 'ACTIVE')    return 'active';
  if (u === 'COMPLETED') return 'completed';
  return 'pending';
}

// ✅ 3D Tilt Election Card
function ElectionCard({ e, i }) {
  const cardRef  = useRef(null);
  const isActive    = e.status?.toUpperCase() === 'ACTIVE';
  const isCompleted = e.status?.toUpperCase() === 'COMPLETED';

  const handleMouseMove = (ev) => {
    const card = cardRef.current;
    if (!card) return;
    const rect    = card.getBoundingClientRect();
    const x       = ev.clientX - rect.left;
    const y       = ev.clientY - rect.top;
    const cx      = rect.width  / 2;
    const cy      = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) *  8;
    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
      translateZ(12px)
    `;
    // ✅ Move glow with mouse
    card.style.setProperty('--mx', `${(x / rect.width)  * 100}%`);
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1) translateZ(0)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={styles.electionCard}
      style={{
        animationDelay: `${i * 0.1}s`,
        animation:      `slideUp 0.5s ease ${i * 0.1}s both`,
        transition:     'transform 0.15s ease, box-shadow 0.3s ease',
        position:       'relative',
        overflow:       'hidden',
        border: isActive
          ? '1.5px solid rgba(0,255,200,0.4)'
          : '1.5px solid rgba(255,255,255,0.07)',
        boxShadow: isActive
          ? '0 8px 32px rgba(0,255,200,0.15)'
          : '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* ✅ Mouse follow glow */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: isActive
          ? 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(0,255,200,0.08) 0%, transparent 60%)'
          : 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
        transition:    'background 0.1s ease',
      }} />

      {/* ✅ Animated top glow line */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     '2px',
        background: isActive
          ? 'linear-gradient(90deg, transparent, #00ffc8, transparent)'
          : isCompleted
          ? 'linear-gradient(90deg, transparent, #7e57c2, transparent)'
          : 'linear-gradient(90deg, transparent, #546e7a, transparent)',
        animation: isActive ? 'scanLine 2s ease infinite' : 'none',
      }} />

      {/* ✅ Active pulse ring */}
      {isActive && (
        <div style={{
          position:     'absolute',
          top:          '16px',
          right:        '16px',
          width:        '10px',
          height:       '10px',
          borderRadius: '50%',
          background:   '#00ffc8',
          boxShadow:    '0 0 8px #00ffc8',
          animation:    'ping 1.5s ease infinite',
        }} />
      )}

      <div className={styles.cardTop}>
        <Badge color={statusColor(e.status)}>{e.status || 'PENDING'}</Badge>
        <span className={styles.cardId}>#{String(e.id).padStart(3, '0')}</span>
      </div>

      {/* ✅ Election name with slide */}
      <h3 className={styles.cardName} style={{
        background:        isActive
          ? 'linear-gradient(135deg, #fff, #00ffc8)'
          : 'linear-gradient(135deg, #fff, #90a4ae)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor:  'transparent',
        backgroundClip:       'text',
      }}>
        {e.name || e.title}
      </h3>

      {e.title && e.name !== e.title && (
        <p className={styles.cardSub}>{e.title}</p>
      )}

      {/* ✅ Orbit decoration — spins faster on active */}
      <div className={styles.cardOrbit} style={{
        animation: isActive
          ? 'orbit 3s linear infinite'
          : 'orbit 8s linear infinite',
        opacity: isActive ? 0.8 : 0.3,
      }}>
        <div className={styles.cardOrbitDot} />
      </div>

      {/* ✅ Status info row */}
      <div style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '8px',
        marginBottom:  '12px',
        fontSize:      '11px',
        color:         'rgba(255,255,255,0.4)',
        letterSpacing: '1px',
      }}>
        {isActive    && <span style={{ color: '#00ffc8' }}>● LIVE NOW</span>}
        {isCompleted && <span style={{ color: '#7e57c2' }}>✓ ENDED</span>}
        {!isActive && !isCompleted && <span>⏳ PENDING</span>}
      </div>

      {/* ✅ Action buttons with hover effect */}
      <div className={styles.cardActions}>
        {isActive && (
          <Link to={`/vote/${e.id}`} style={{ width: '100%' }}>
            <Button variant="primary" size="sm" style={{
              width:      '100%',
              boxShadow:  '0 0 20px rgba(0,255,200,0.3)',
              transition: 'all 0.3s ease',
            }}>
              CAST VOTE →
            </Button>
          </Link>
        )}
        {isCompleted && (
          <Link to={`/results/${e.id}`} style={{ width: '100%' }}>
            <Button variant="secondary" size="sm" style={{ width: '100%' }}>
              VIEW RESULTS 🏆
            </Button>
          </Link>
        )}
        {(!e.status || e.status.toUpperCase() === 'PENDING') && (
          <Button variant="ghost" size="sm" disabled style={{ width: '100%' }}>
            ⏳ AWAITING LAUNCH
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [filter,    setFilter]    = useState('ALL');

  useEffect(() => {
    getElections()
      .then(r => {
        setElections(r.data);
        setTimeout(() => setPageReady(true), 100);
      })
      .catch(err => console.log('ERROR:', err.response?.status))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.page}><GalaxyBg /><Spinner /></div>;

  // ✅ Filter elections
  const filtered = elections.filter(e => {
    if (filter === 'ALL')       return true;
    if (filter === 'ACTIVE')    return e.status?.toUpperCase() === 'ACTIVE';
    if (filter === 'COMPLETED') return e.status?.toUpperCase() === 'COMPLETED';
    if (filter === 'PENDING')   return !e.status || e.status.toUpperCase() === 'PENDING';
    return true;
  });

  const activeCount    = elections.filter(e => e.status?.toUpperCase() === 'ACTIVE').length;
  const completedCount = elections.filter(e => e.status?.toUpperCase() === 'COMPLETED').length;

  return (
    <div className={styles.page}>
      <GalaxyBg />

      <div className={styles.content} style={{
        opacity:    pageReady ? 1 : 0,
        transform:  pageReady ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>

        {/* ✅ Animated header */}
        <div className={styles.header} style={{
          animation: 'slideDown 0.6s ease 0.1s both',
        }}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon} style={{
              animation:  'float 3s ease infinite',
              fontSize:   '40px',
              filter:     'drop-shadow(0 0 12px rgba(0,255,200,0.5))',
            }}>🗳️</div>
            <div>
              <h1 className={styles.title} style={{
                background:           'linear-gradient(135deg, #fff 0%, #00ffc8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>ELECTIONS</h1>
              <p className={styles.sub}>Active missions across the galaxy</p>
            </div>
          </div>

          {/* ✅ Stats with glow */}
          <div className={styles.statsRow}>
            <div className={styles.stat} style={{
              background:   'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding:      '12px 20px',
              border:       '1px solid rgba(255,255,255,0.07)',
            }}>
              <span className={styles.statNum} style={{
                background:           'linear-gradient(135deg, #fff, #90caf9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
              }}>{elections.length}</span>
              <span className={styles.statLabel}>TOTAL</span>
            </div>
            <div className={styles.stat} style={{
              background:   'rgba(0,255,200,0.05)',
              borderRadius: '12px',
              padding:      '12px 20px',
              border:       '1px solid rgba(0,255,200,0.2)',
              boxShadow:    '0 0 20px rgba(0,255,200,0.08)',
            }}>
              <span className={styles.statNum} style={{ color: '#00ffc8' }}>
                {activeCount}
              </span>
              <span className={styles.statLabel}>ACTIVE</span>
            </div>
            <div className={styles.stat} style={{
              background:   'rgba(126,87,194,0.05)',
              borderRadius: '12px',
              padding:      '12px 20px',
              border:       '1px solid rgba(126,87,194,0.2)',
            }}>
              <span className={styles.statNum} style={{ color: '#ce93d8' }}>
                {completedCount}
              </span>
              <span className={styles.statLabel}>DONE</span>
            </div>
          </div>
        </div>

        {/* ✅ Filter tabs */}
        <div style={{
          display:       'flex',
          gap:           '8px',
          marginBottom:  '24px',
          animation:     'slideDown 0.5s ease 0.2s both',
        }}>
          {['ALL', 'ACTIVE', 'COMPLETED', 'PENDING'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:       '6px 16px',
              borderRadius:  '20px',
              border:        filter === f
                ? '1px solid rgba(0,255,200,0.6)'
                : '1px solid rgba(255,255,255,0.1)',
              background:    filter === f
                ? 'rgba(0,255,200,0.1)'
                : 'rgba(255,255,255,0.03)',
              color:         filter === f ? '#00ffc8' : 'rgba(255,255,255,0.5)',
              fontSize:      '11px',
              letterSpacing: '1px',
              cursor:        'pointer',
              transition:    'all 0.2s ease',
              fontWeight:    filter === f ? 'bold' : 'normal',
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* ✅ Elections grid */}
        {filtered.length === 0 ? (
          <EmptyState icon="🌌" message="No elections in this galaxy yet." />
        ) : (
          <div className={styles.grid}>
            {filtered.map((e, i) => (
              <ElectionCard key={e.id} e={e} i={i} />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Global keyframes */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-6px); }
        }
        @keyframes scanLine {
          0%   { opacity: 0.3; transform: scaleX(0.3); }
          50%  { opacity: 1;   transform: scaleX(1);   }
          100% { opacity: 0.3; transform: scaleX(0.3); }
        }
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 1;   }
          100% { transform: scale(2.5); opacity: 0;   }
        }
        @keyframes orbit {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}