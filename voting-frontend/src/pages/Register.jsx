import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Button, Input } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import BlockchainLogo from '../components/BlockchainLogo';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';
import LoginHelpModal from '../components/LoginHelpModal';

/* ── Feature cards ──────────────────────────────────────── */
const FEATURE_CARDS = [
  {
    icon   : '📧',
    color  : '#00ffc8',
    glow   : 'rgba(0,255,200,0.18)',
    border : 'rgba(0,255,200,0.3)',
    title  : 'OTP Verified',
    sub    : 'Encrypted communications',
    metric : '256-BIT',
    tag    : 'ENCRYPTION',
    delay  : '0.7s',
  },
  {
    icon   : '🧑',
    color  : '#64b4ff',
    glow   : 'rgba(100,180,255,0.18)',
    border : 'rgba(100,180,255,0.3)',
    title  : 'Biometric Ready',
    sub    : 'Zero-knowledge proof identity',
    metric : '99.8%',
    tag    : 'ACCURACY',
    delay  : '0.85s',
  },
  {
    icon   : '🔗',
    color  : '#a855f7',
    glow   : 'rgba(168,85,247,0.18)',
    border : 'rgba(168,85,247,0.3)',
    title  : 'Blockchain Secured',
    sub    : 'Immutable ledger registration',
    metric : '∞',
    tag    : 'IMMUTABLE',
    delay  : '1s',
  },
];

/* ── Marquee words ───────────────────────────────────────── */
const MOTTO_WORDS = [
  'YOUR', 'VOTE', '·', 'YOUR', 'DEMOCRACY', '·',
  'YOUR', 'CHAIN', '·', 'YOUR', 'FUTURE', '·',
];

/* ── Typewriter hook ─────────────────────────────────────── */
function useTypewriter(phrases, typingSpeed = 70, pauseMs = 2000, deleteSpeed = 35) {
  const [display, setDisplay] = useState('');
  const [phase,   setPhase]   = useState('typing');
  const [pIdx,    setPIdx]    = useState(0);
  const [cIdx,    setCIdx]    = useState(0);

  useEffect(() => {
    const current = phrases[pIdx];
    if (phase === 'typing') {
      if (cIdx < current.length) {
        const t = setTimeout(() => {
          setDisplay(current.slice(0, cIdx + 1));
          setCIdx(c => c + 1);
        }, typingSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('deleting'), pauseMs);
        return () => clearTimeout(t);
      }
    }
    if (phase === 'deleting') {
      if (cIdx > 0) {
        const t = setTimeout(() => {
          setDisplay(current.slice(0, cIdx - 1));
          setCIdx(c => c - 1);
        }, deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setPIdx(p => (p + 1) % phrases.length);
        setPhase('typing');
      }
    }
  }, [cIdx, phase, pIdx, phrases, typingSpeed, pauseMs, deleteSpeed]);

  return display;
}

/* ── Node counter ────────────────────────────────────────── */
function NodeCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const end  = 482;
    const step = end / (1800 / 16);
    const id   = setInterval(() => {
      n += step;
      if (n >= end) { setCount(end); clearInterval(id); }
      else setCount(Math.floor(n));
    }, 16);
    return () => clearInterval(id);
  }, []);
  return <>{count}</>;
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export default function Register() {
  const [username,    setUsername]    = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [focused,     setFocused]     = useState(null);
  const [pageReady,   setPageReady]   = useState(false);
  const [strength,    setStrength]    = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeBeam,  setActiveBeam]  = useState(0);
  const [panelFocus,  setPanelFocus]  = useState(null); // 'left' | 'right' | null
  const [showHelp, setShowHelp] = useState(false);
 

  const cardRef  = useRef(null);
  const navigate = useNavigate();

  const typedText = useTypewriter([
    'verifiable democracy.',
    'trustless elections.',
    'immutable integrity.',
    'zero-fraud voting.',
  ]);

  useEffect(() => {
    const id = setInterval(() => setActiveBeam(b => (b + 1) % 3), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setTimeout(() => setPageReady(true), 100); }, []);

  /* ── Password strength ─────────────────────────────────── */
  const checkStrength = (val) => {
    let s = 0;
    if (val.length >= 6)           s++;
    if (val.length >= 10)          s++;
    if (/[A-Z]/.test(val))         s++;
    if (/[0-9]/.test(val))         s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };
  const strengthColor = () => {
    if (strength <= 1) return '#ff4757';
    if (strength <= 3) return '#f59e0b';
    return '#00ffc8';
  };
  const strengthLabel = () => {
    if (strength <= 1) return 'WEAK';
    if (strength <= 3) return 'MEDIUM';
    return 'STRONG';
  };

  /* ── 3D card tilt ──────────────────────────────────────── */
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
    const rotateY = ((x - rect.width  / 2) / (rect.width  / 2)) *  4;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
    card.style.setProperty('--mx', `${(x / rect.width)  * 100}%`);
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateZ(0)';
  };

  /* ── Submit ─────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim())    { toast.error('Username is required'); return; }
    if (!email.trim())       { toast.error('Enter Your Correct Mail Address'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post('/otp/send', { username, email, password });
      toast.success('OTP sent to ' + email);
      navigate('/otp-verify', { state: { email, username, mode: 'register' } });
    } catch (err) {
      const msg = err.response?.data;
      if (err.response?.status === 409) {
        toast.error(typeof msg === 'string' ? msg : 'Account already exists.');
      } else {
        toast.error(typeof msg === 'string' ? msg : 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Panel opacity / blur / slide helper ───────────────── */
  const getPanelStyle = (side) => {
    const isFaded = panelFocus !== null && panelFocus !== side;
    return {
      opacity   : isFaded ? 0.05 : 1,
      filter    : isFaded ? 'blur(7px) saturate(0.15) brightness(0.5)' : 'blur(0px) saturate(1) brightness(1)',
      transform : isFaded
        ? side === 'left' ? 'translateX(-22px) scale(0.96)' : 'translateX(22px) scale(0.96)'
        : 'translateX(0) scale(1)',
      transition   : 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), filter 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: isFaded ? 'none' : 'all',
    };
  };

  /* ── Divider colour helper ──────────────────────────────── */
  const dividerColor  = panelFocus === 'left' ? '#00ffc8' : panelFocus === 'right' ? '#64b4ff' : 'rgba(168,85,247,0.5)';
  const dividerShadow = panelFocus === 'left'
    ? '-4px 0 28px rgba(0,255,200,0.5), 4px 0 14px rgba(0,255,200,0.15)'
    : panelFocus === 'right'
    ? '4px 0 28px rgba(100,180,255,0.5), -4px 0 14px rgba(100,180,255,0.15)'
    : 'none';

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div
      style={{
        minHeight     : '100vh',
        display       : 'flex',
        flexDirection : 'column',
        position      : 'relative',
        overflow      : 'hidden',
        opacity       : pageReady ? 1 : 0,
        transition    : 'opacity 0.7s ease',
      }}
      onMouseLeave={() => setPanelFocus(null)}
    >
      <GalaxyBg />

      {/* ══════════════════════════════════════════════════
          MOTTO MARQUEE BAR
      ══════════════════════════════════════════════════ */}
      <div style={{
        position  : 'relative',
        zIndex    : 10,
        width     : '100%',
        overflow  : 'hidden',
        borderBottom: '1px solid rgba(0,212,255,0.08)',
        background  : 'linear-gradient(90deg, rgba(0,255,200,0.03), rgba(100,180,255,0.05), rgba(168,85,247,0.03))',
        padding     : '10px 0',
        animation   : 'slideDown 0.6s ease 0.1s both',
        flexShrink  : 0,
      }}>
        {/* Top glow line */}
        <div style={{
          position  : 'absolute',
          top: 0, left: 0, right: 0,
          height    : '1px',
          background: 'linear-gradient(90deg, transparent, #00ffc8, rgba(168,85,247,0.6), #64b4ff, transparent)',
          animation : 'glowShift 4s linear infinite',
        }} />

        {/* Scrolling track */}
        <div style={{
          display  : 'flex',
          width    : 'max-content',
          animation: 'marqueeScroll 22s linear infinite',
        }}>
          {[...Array(6)].map((_, gi) =>
            MOTTO_WORDS.map((word, wi) => {
              const isDot = word === '·';
              const wordColor = isDot ? 'rgba(168,85,247,0.6)'
                : (wi % MOTTO_WORDS.length) < 2  ? '#00ffc8'
                : (wi % MOTTO_WORDS.length) < 5  ? '#64b4ff'
                : (wi % MOTTO_WORDS.length) < 8  ? '#ffffff'
                : '#a855f7';
              return (
                <span
                  key={`${gi}-${wi}`}
                  style={{
                    fontFamily   : 'var(--font-display)',
                    fontSize     : isDot ? '10px' : '11px',
                    fontWeight   : isDot ? '400'  : '700',
                    letterSpacing: isDot ? '2px'  : '5px',
                    color        : wordColor,
                    padding      : '0 16px',
                    textShadow   : isDot ? 'none' : `0 0 20px ${wordColor}55`,
                    display      : 'inline-block',
                    animation    : `letterGlow ${2.5 + wi * 0.2}s ease-in-out infinite`,
                  }}
                >
                  {word}
                </span>
              );
            })
          )}
        </div>

        {/* Bottom glow line */}
        <div style={{
          position  : 'absolute',
          bottom: 0, left: 0, right: 0,
          height    : '1px',
          background: 'linear-gradient(90deg, transparent, rgba(100,180,255,0.4), rgba(168,85,247,0.3), transparent)',
          animation : 'glowShift 4s linear infinite reverse',
        }} />
      </div>

      {/* ══════════════════════════════════════════════════
          SPLIT LAYOUT
      ══════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* ─────────────────────────────────────────────────
            LEFT PANEL
        ───────────────────────────────────────────────── */}
        <div
          onMouseEnter={() => setPanelFocus('left')}
          style={{
            flex          : '1 1 50%',
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',
            padding       : '40px 48px',
            position      : 'relative',
            zIndex        : 1,
            animation     : 'panelLeft 0.8s ease both',
            ...getPanelStyle('left'),
          }}
        >
          {/* Bloom overlay when focused */}
          {panelFocus === 'left' && (
            <div style={{
              position     : 'absolute',
              inset        : 0,
              background   : 'radial-gradient(ellipse 75% 65% at 35% 50%, rgba(0,255,200,0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
              animation    : 'fadeIn 0.4s ease both',
              zIndex       : 0,
            }} />
          )}

          {/* Brand */}
          <div style={{
            display   : 'flex',
            alignItems: 'center',
            gap       : '12px',
            animation : 'slideDown 0.6s ease 0.1s both',
            position  : 'relative',
            zIndex    : 1,
          }}>
            <BlockchainLogo size={36} />
            <span style={{
              fontFamily   : 'var(--font-display)',
              fontSize     : '18px',
              fontWeight   : '700',
              letterSpacing: '4px',
              color        : '#e8f4ff',
            }}>VOTECHAIN</span>
          </div>

          {/* Hero copy */}
          <div style={{ animation: 'slideUp 0.7s ease 0.3s both', position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily   : 'var(--font-display)',
              fontSize     : '11px',
              letterSpacing: '4px',
              color        : 'rgba(0,212,255,0.6)',
              marginBottom : '20px',
            }}>BLOCKCHAIN ELECTION SYSTEM</p>

            <h1 style={{
              fontFamily  : 'var(--font-display)',
              fontSize    : 'clamp(26px, 3.2vw, 46px)',
              fontWeight  : '800',
              lineHeight  : '1.15',
              color       : '#ffffff',
              marginBottom: '0',
            }}>The foundation of</h1>

            <h1 style={{
              fontFamily          : 'var(--font-display)',
              fontSize            : 'clamp(26px, 3.2vw, 46px)',
              fontWeight          : '800',
              lineHeight          : '1.3',
              background          : 'linear-gradient(90deg, #00ffc8, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor : 'transparent',
              backgroundClip      : 'text',
              filter              : 'drop-shadow(0 0 24px rgba(0,255,200,0.4))',
              marginBottom        : '24px',
              minHeight           : '1.4em',
              display             : 'flex',
              alignItems          : 'center',
              gap                 : '4px',
            }}>
              {typedText}
              <span style={{ animation: 'blink 1s step-end infinite', color: '#00ffc8' }}>|</span>
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize  : '16px',
              fontWeight: '400',
              color     : 'rgba(255,255,255,0.45)',
              lineHeight: '1.7',
              maxWidth  : '380px',
            }}>
              Register your civic identity on the decentralised
              ledger. Secure, private, and mathematically irrefutable.
            </p>
          </div>

          {/* ── Feature cards ──────────────────────────── */}
          <div style={{
            display      : 'flex',
            flexDirection: 'column',
            gap          : '12px',
            animation    : 'slideUp 0.7s ease 0.5s both',
            position     : 'relative',
            zIndex       : 1,
          }}>
            {FEATURE_CARDS.map((fc, i) => {
              const isHover  = hoveredCard === i;
              const isActive = activeBeam  === i;
              const rgb = fc.color === '#00ffc8' ? '0,255,200'
                        : fc.color === '#64b4ff' ? '100,180,255'
                        : '168,85,247';
              return (
                <div
                  key={fc.title}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    display     : 'flex',
                    alignItems  : 'center',
                    gap         : '16px',
                    background  : isHover
                      ? `linear-gradient(135deg, ${fc.glow}, rgba(4,10,24,0.97))`
                      : isActive
                      ? `linear-gradient(135deg, rgba(${rgb},0.07), rgba(4,10,24,0.95))`
                      : 'rgba(10,22,40,0.7)',
                    border      : `1px solid ${isHover ? fc.border : isActive ? fc.border.replace('0.3','0.2') : 'rgba(100,180,255,0.1)'}`,
                    borderRadius: '14px',
                    padding     : '16px 20px',
                    transition  : 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow   : isHover
                      ? `0 8px 36px ${fc.glow}, 0 0 0 1px ${fc.border}, inset 0 1px 0 rgba(255,255,255,0.05)`
                      : isActive ? `0 4px 20px ${fc.glow}` : '0 2px 12px rgba(0,0,0,0.3)',
                    transform   : isHover ? 'translateX(10px) scale(1.01)' : 'translateX(0) scale(1)',
                    animation   : `slideUp 0.5s ease ${fc.delay} both`,
                    position    : 'relative',
                    overflow    : 'hidden',
                    cursor      : 'default',
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{
                    position    : 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width       : isHover ? '3px' : isActive ? '2px' : '0px',
                    background  : `linear-gradient(180deg, ${fc.color}, transparent)`,
                    boxShadow   : `0 0 16px ${fc.color}`,
                    transition  : 'width 0.3s ease',
                    borderRadius: '0 2px 2px 0',
                  }} />

                  {/* Sweep beam */}
                  {isActive && !isHover && (
                    <div style={{
                      position     : 'absolute',
                      inset        : 0,
                      background   : `linear-gradient(90deg, transparent 0%, ${fc.glow} 50%, transparent 100%)`,
                      animation    : 'sweep 1.8s ease-in-out infinite',
                      pointerEvents: 'none',
                    }} />
                  )}

                  {/* Corner brackets on hover */}
                  {isHover && (
                    <>
                      <div style={{ position:'absolute', top:5, left:5,   width:8, height:8, borderTop:`2px solid ${fc.color}`, borderLeft:`2px solid ${fc.color}`,   animation:'cornerFade 0.25s ease both', borderRadius:'1px 0 0 0' }} />
                      <div style={{ position:'absolute', top:5, right:5,  width:8, height:8, borderTop:`2px solid ${fc.color}`, borderRight:`2px solid ${fc.color}`,  animation:'cornerFade 0.25s ease both', borderRadius:'0 1px 0 0' }} />
                      <div style={{ position:'absolute', bottom:5, left:5, width:8, height:8, borderBottom:`2px solid ${fc.color}`, borderLeft:`2px solid ${fc.color}`, animation:'cornerFade 0.25s ease both', borderRadius:'0 0 0 1px' }} />
                      <div style={{ position:'absolute', bottom:5, right:5, width:8, height:8, borderBottom:`2px solid ${fc.color}`, borderRight:`2px solid ${fc.color}`, animation:'cornerFade 0.25s ease both', borderRadius:'0 0 1px 0' }} />
                    </>
                  )}

                  {/* Icon */}
                  <div style={{
                    width          : '46px',
                    height         : '46px',
                    borderRadius   : '11px',
                    background     : isHover
                      ? `linear-gradient(135deg, ${fc.glow}, rgba(0,0,0,0.5))`
                      : 'rgba(255,255,255,0.04)',
                    border         : `1px solid ${isHover ? fc.border : 'rgba(255,255,255,0.07)'}`,
                    display        : 'flex',
                    alignItems     : 'center',
                    justifyContent : 'center',
                    fontSize       : '21px',
                    flexShrink     : 0,
                    transition     : 'all 0.3s',
                    filter         : isHover ? `drop-shadow(0 0 12px ${fc.color})` : 'none',
                    animation      : isHover ? 'iconPulse 1.2s ease-in-out infinite' : 'none',
                  }}>
                    {fc.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily   : 'var(--font-display)',
                      fontSize     : '15px',
                      fontWeight   : '700',
                      color        : isHover ? '#ffffff' : 'rgba(255,255,255,0.82)',
                      letterSpacing: '0.5px',
                      marginBottom : '3px',
                      transition   : 'color 0.3s',
                    }}>{fc.title}</div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize  : '13px',
                      fontWeight: '400',
                      color     : isHover ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)',
                      transition: 'color 0.3s',
                    }}>{fc.sub}</div>
                  </div>

                  {/* Metric */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'2px', flexShrink:0 }}>
                    <span style={{
                      fontFamily   : 'var(--font-mono)',
                      fontSize     : isHover ? '19px' : '15px',
                      fontWeight   : '700',
                      color        : isHover ? fc.color : 'rgba(255,255,255,0.22)',
                      letterSpacing: '1px',
                      transition   : 'all 0.3s',
                      filter       : isHover ? `drop-shadow(0 0 10px ${fc.color})` : 'none',
                    }}>{fc.metric}</span>
                    <span style={{
                      fontFamily   : 'var(--font-display)',
                      fontSize     : '8px',
                      color        : isHover ? fc.color : 'rgba(255,255,255,0.14)',
                      letterSpacing: '1.5px',
                      transition   : 'color 0.3s',
                    }}>{fc.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Network status */}
          <div style={{
            display   : 'flex',
            alignItems: 'center',
            gap       : '8px',
            animation : 'slideUp 0.5s ease 1.1s both',
            position  : 'relative',
            zIndex    : 1,
          }}>
            <div style={{
              width       : '8px',
              height      : '8px',
              borderRadius: '50%',
              background  : '#00ffc8',
              boxShadow   : '0 0 10px rgba(0,255,200,0.8)',
              animation   : 'networkPulse 2s ease infinite',
            }} />
            <span style={{
              fontFamily   : 'var(--font-mono)',
              fontSize     : '12px',
              color        : 'rgba(255,255,255,0.3)',
              letterSpacing: '1px',
            }}>
              Network operational • Node <NodeCount />
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────
            CENTRE DIVIDER
        ───────────────────────────────────────────────── */}
        <div style={{
          width     : '1px',
          flexShrink: 0,
          position  : 'relative',
          background: `linear-gradient(180deg,
            transparent 0%,
            ${dividerColor} 25%,
            rgba(168,85,247,0.5) 50%,
            ${dividerColor} 75%,
            transparent 100%)`,
          boxShadow : dividerShadow,
          transition: 'background 0.5s ease, box-shadow 0.5s ease',
          zIndex    : 5,
        }}>
          {/* Energy orb travelling the line */}
          <div style={{
            position    : 'absolute',
            left        : '50%',
            width       : '12px',
            height      : '12px',
            borderRadius: '50%',
            background  : dividerColor,
            boxShadow   : `0 0 24px ${dividerColor}, 0 0 48px ${dividerColor}55`,
            transform   : 'translateX(-50%)',
            animation   : 'orbTravel 3s ease-in-out infinite',
            transition  : 'background 0.4s, box-shadow 0.4s',
            zIndex      : 2,
          }} />

          {/* Diamond tick marks */}
          {[15, 30, 45, 60, 75, 88].map((pct, ti) => (
            <div key={pct} style={{
              position    : 'absolute',
              top         : `${pct}%`,
              left        : '50%',
              width       : panelFocus ? '6px' : '4px',
              height      : panelFocus ? '6px' : '4px',
              background  : ti % 2 === 0 ? dividerColor : 'rgba(168,85,247,0.5)',
              transform   : 'translate(-50%, -50%) rotate(45deg)',
              transition  : 'all 0.4s ease',
              boxShadow   : panelFocus ? `0 0 10px ${dividerColor}` : 'none',
              borderRadius: '1px',
            }} />
          ))}

          {/* Side arrows pointing to active panel */}
          {panelFocus && (
            <div style={{
              position : 'absolute',
              top      : '50%',
              left     : '50%',
              transform: `translate(-50%, -50%)`,
              display  : 'flex',
              flexDirection: 'column',
              gap      : '6px',
              animation: 'fadeIn 0.3s ease both',
            }}>
              {[0,1,2].map(k => (
                <div key={k} style={{
                  width       : '0',
                  height      : '0',
                  borderTop   : '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderLeft  : panelFocus === 'right' ? `6px solid ${dividerColor}` : 'none',
                  borderRight : panelFocus === 'left'  ? `6px solid ${dividerColor}` : 'none',
                  opacity     : 1 - k * 0.3,
                  filter      : `drop-shadow(0 0 4px ${dividerColor})`,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────
            RIGHT PANEL
        ───────────────────────────────────────────────── */}
        <div
          onMouseEnter={() => setPanelFocus('right')}
          style={{
            flex          : '1 1 50%',
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            padding       : '40px 48px',
            position      : 'relative',
            zIndex        : 1,
            animation     : 'panelRight 0.8s ease both',
            ...getPanelStyle('right'),
          }}
        >
          {/* Bloom overlay when focused */}
          {panelFocus === 'right' && (
            <div style={{
              position     : 'absolute',
              inset        : 0,
              background   : 'radial-gradient(ellipse 75% 65% at 65% 50%, rgba(100,180,255,0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
              animation    : 'fadeIn 0.4s ease both',
              zIndex       : 0,
            }} />
          )}

          <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>

            {/* Logo + brand header */}
            <div style={{
              textAlign   : 'center',
              marginBottom: '24px',
              animation   : 'slideDown 0.6s ease 0.2s both',
            }}>
              <BlockchainLogo size={64} />

              <h1 style={{
                fontFamily          : 'var(--font-display)',
                fontSize            : '26px',
                fontWeight          : '900',
                letterSpacing       : '8px',
                background          : 'linear-gradient(135deg, #ffffff 0%, #00ffc8 50%, #90caf9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor : 'transparent',
                backgroundClip      : 'text',
                marginTop           : '12px',
                marginBottom        : '6px',
                filter              : 'drop-shadow(0 0 20px rgba(0,255,200,0.35))',
              }}>VOTECHAIN</h1>

              <p style={{
                fontFamily   : 'var(--font-display)',
                fontSize     : '9px',
                letterSpacing: '4px',
                color        : 'rgba(0,212,255,0.7)',
                marginBottom : '3px',
              }}>OFFICIAL VOTER REGISTRY</p>

              <p style={{
                fontFamily   : 'var(--font-display)',
                fontSize     : '8px',
                letterSpacing: '2.5px',
                color        : 'rgba(255,255,255,0.25)',
              }}>BLOCKCHAIN ELECTION COMMISSION</p>
            </div>

            {/* ── 3D Card ─────────────────────────────── */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                background  : 'linear-gradient(135deg, rgba(10,22,40,0.98), rgba(4,10,24,0.98))',
                border      : '1px solid rgba(0,150,255,0.2)',
                borderRadius: '24px',
                overflow    : 'hidden',
                boxShadow   : '0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,100,200,0.1), inset 0 1px 0 rgba(100,180,255,0.08)',
                transition  : 'transform 0.15s ease, box-shadow 0.3s ease',
                position    : 'relative',
                animation   : 'slideUp 0.7s ease 0.4s both',
              }}
            >
              {/* Mouse follow glow */}
              <div style={{
                position     : 'absolute',
                inset        : 0,
                background   : 'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,255,200,0.05) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex       : 0,
              }} />

              {/* Top scan line */}
              <div style={{
                position  : 'absolute',
                top:0, left:0, right:0,
                height    : '2px',
                background: 'linear-gradient(90deg, transparent, #00ffc8, transparent)',
                animation : 'scanLine 3s ease infinite',
                zIndex    : 1,
              }} />

              <div style={{ padding: '32px', position: 'relative', zIndex: 1 }}>

                {/* Heading */}
                <h2 style={{
                  fontFamily   : 'var(--font-display)',
                  fontSize     : '22px',
                  fontWeight   : '800',
                  letterSpacing: '1px',
                  color        : '#ffffff',
                  marginBottom : '4px',
                }}>Create Identity</h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize  : '14px',
                  color     : 'rgba(255,255,255,0.4)',
                }}>Step 1 of 3: Set up your secure credentials.</p>

                {/* Divider */}
                <div style={{
                  height      : '1px',
                  background  : 'linear-gradient(90deg, #00ffc8, rgba(168,85,247,0.5), transparent)',
                  margin      : '14px 0 22px',
                }} />

                {/* Steps */}
                <div style={{
                  display     : 'flex',
                  alignItems  : 'center',
                  marginBottom: '26px',
                }}>
                  {[{ label:'Identity' }, { label:'Verify' }, { label:'Biometric' }].map((s, i) => (
                    <div key={s.label} style={{ display:'flex', alignItems:'center', flex: i < 2 ? 1 : 0 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
                        <div style={{
                          width          : '32px',
                          height         : '32px',
                          borderRadius   : '50%',
                          background     : i === 0 ? 'linear-gradient(135deg, #0066cc, #00aaff)' : 'rgba(255,255,255,0.04)',
                          border         : `2px solid ${i === 0 ? '#00ffc8' : 'rgba(100,180,255,0.18)'}`,
                          display        : 'flex',
                          alignItems     : 'center',
                          justifyContent : 'center',
                          fontFamily     : 'var(--font-display)',
                          fontSize       : '11px',
                          fontWeight     : '900',
                          color          : i === 0 ? '#fff' : 'rgba(255,255,255,0.22)',
                          boxShadow      : i === 0 ? '0 0 18px rgba(0,170,255,0.5)' : 'none',
                          animation      : i === 0 ? 'pulse 2s ease infinite' : 'none',
                          flexShrink     : 0,
                        }}>
                          {i === 0 ? '✓' : i + 1}
                        </div>
                        <span style={{
                          fontFamily   : 'var(--font-display)',
                          fontSize     : '9px',
                          letterSpacing: '1px',
                          color        : i === 0 ? '#00ffc8' : 'rgba(255,255,255,0.22)',
                        }}>{s.label}</span>
                      </div>
                      {i < 2 && (
                        <div style={{
                          flex        : 1,
                          height      : '2px',
                          background  : i === 0
                            ? 'linear-gradient(90deg, rgba(0,255,200,0.6), rgba(100,180,255,0.12))'
                            : 'rgba(100,180,255,0.08)',
                          margin      : '0 8px',
                          marginBottom: '22px',
                        }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

                  {/* Username */}
                  <div style={{
                    animation : 'slideUp 0.5s ease 0.6s both',
                    transition: 'transform 0.2s ease',
                    transform : focused === 'username' ? 'translateX(4px)' : 'translateX(0)',
                  }}>
                    <Input
                      label="Citizen Username"
                      type="text"
                      placeholder="e.g. alex_smith"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      onFocus={() => setFocused('username')}
                      onBlur={() => setFocused(null)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div style={{
                    animation : 'slideUp 0.5s ease 0.7s both',
                    transition: 'transform 0.2s ease',
                    transform : focused === 'email' ? 'translateX(4px)' : 'translateX(0)',
                  }}>
                    <Input
                      label="Secure Email"
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div style={{
                    animation : 'slideUp 0.5s ease 0.8s both',
                    transition: 'transform 0.2s ease',
                    transform : focused === 'password' ? 'translateX(4px)' : 'translateX(0)',
                  }}>
                    <Input
                      label="Master Password"
                      type="password"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={e => { setPassword(e.target.value); checkStrength(e.target.value); }}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      required
                    />
                    {password.length > 0 && (
                      <div style={{ marginTop:'8px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                          <span style={{
                            fontFamily   : 'var(--font-display)',
                            fontSize     : '10px',
                            color        : 'rgba(255,255,255,0.35)',
                            letterSpacing: '1.5px',
                          }}>PASSWORD STRENGTH</span>
                          <span style={{
                            fontFamily   : 'var(--font-display)',
                            fontSize     : '10px',
                            color        : strengthColor(),
                            letterSpacing: '1.5px',
                            fontWeight   : '700',
                            filter       : `drop-shadow(0 0 6px ${strengthColor()})`,
                          }}>{strengthLabel()}</span>
                        </div>
                        <div style={{ display:'flex', gap:'4px' }}>
                          {[1,2,3,4,5].map(n => (
                            <div key={n} style={{
                              flex        : 1,
                              height      : '3px',
                              borderRadius: '2px',
                              background  : n <= strength ? strengthColor() : 'rgba(255,255,255,0.08)',
                              transition  : 'background 0.3s ease',
                              boxShadow   : n <= strength ? `0 0 8px ${strengthColor()}` : 'none',
                            }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div style={{ animation:'slideUp 0.5s ease 0.9s both', marginTop:'4px' }}>
                    <Button
                      type="submit"
                      fullWidth
                      loading={loading}
                      size="lg"
                      style={{
                        fontFamily   : 'var(--font-display)',
                        fontSize     : '13px',
                        letterSpacing: '2px',
                        boxShadow    : loading ? 'none' : '0 0 30px rgba(0,255,200,0.2)',
                        transition   : 'all 0.3s ease',
                        transform    : loading ? 'scale(0.98)' : 'scale(1)',
                      }}
                    >
                      {loading ? 'TRANSMITTING...' : 'INITIALIZE REGISTRATION →'}
                    </Button>
                  </div>
                </form>
                {/* Security badges */}
                <div style={{
                  display       : 'flex',
                  justifyContent: 'center',
                  gap           : '24px',
                  marginTop     : '20px',
                  paddingTop    : '16px',
                  borderTop     : '1px solid rgba(100,180,255,0.08)',
                  animation     : 'slideUp 0.5s ease 1s both',
                }}>
                  {[
                    { icon: '📧', label: 'EMAIL OTP'  },
                    { icon: '🧑', label: 'FACE SCAN'  },
                    { icon: '🔗', label: 'BLOCKCHAIN' },
                  ].map(item => (
                    <div key={item.label} style={{
                      display      : 'flex',
                      flexDirection: 'column',
                      alignItems   : 'center',
                      gap          : '5px',
                    }}>
                      <span style={{ fontSize: '18px' }}>{item.icon}</span>
                      <span style={{
                        fontFamily   : 'var(--font-display)',
                        fontSize     : '9px',
                        color        : 'rgba(255,255,255,0.25)',
                        letterSpacing: '1.5px',
                      }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Sign in link */}
                <p style={{
                  textAlign : 'center',
                  marginTop : '18px',
                  fontFamily: 'var(--font-body)',
                  fontSize  : '14px',
                  fontWeight: '500',
                  color     : 'rgba(255,255,255,0.3)',
                  animation : 'slideUp 0.5s ease 1.1s both',
                }}>
                  Already registered?{' '}
                  <Link to="/login" style={{
                    color         : '#00ffc8',
                    fontWeight    : '600',
                    textDecoration: 'none',
                  }}>Sign in →</Link>
                </p>
                {/* ✅ Help button */}
<div style={{
  display       : 'flex',
  justifyContent: 'center',
  marginTop     : '14px',
}}>
  <button
    onClick={() => setShowHelp(true)}
    style={{
      display      : 'flex',
      alignItems   : 'center',
      gap          : '6px',
      padding      : '6px 18px',
      borderRadius : '20px',
      border       : '1px solid rgba(0,212,255,0.2)',
      background   : 'transparent',
      color        : 'rgba(255,255,255,0.3)',
      fontFamily   : 'var(--font-display)',
      fontSize     : '10px',
      letterSpacing: '1.5px',
      cursor       : 'pointer',
      transition   : 'all 0.25s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
      e.currentTarget.style.color       = '#00d4ff';
      e.currentTarget.style.background  = 'rgba(0,212,255,0.06)';
      e.currentTarget.style.boxShadow   = '0 0 14px rgba(0,212,255,0.12)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
      e.currentTarget.style.color       = 'rgba(255,255,255,0.3)';
      e.currentTarget.style.background  = 'transparent';
      e.currentTarget.style.boxShadow   = 'none';
    }}
  >
    💡 HELP CENTER
  </button>
</div>

{/* ✅ Help Modal */}
{showHelp && <LoginHelpModal onClose={() => setShowHelp(false)} />}
               
                

              </div>{/* end card inner */}
            </div>{/* end 3D card */}
          </div>{/* end right inner */}
        </div>{/* end right panel */}
      </div>{/* end split layout */}

      {/* ══════════════════════════════════════════════════
          ALL KEYFRAMES
      ══════════════════════════════════════════════════ */}
      <style>{`

        /* ── Entry animations ── */
        @keyframes panelLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes panelRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Marquee ── */
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── Letter glow breath ── */
        @keyframes letterGlow {
          0%, 100% { opacity: 0.7;  text-shadow: none; }
          50%       { opacity: 1;    text-shadow: 0 0 22px currentColor; }
        }

        /* ── Top bar glow shift ── */
        @keyframes glowShift {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* ── Scan line ── */
        @keyframes scanLine {
          0%   { opacity: 0.3; transform: scaleX(0.2); }
          50%  { opacity: 1;   transform: scaleX(1);   }
          100% { opacity: 0.3; transform: scaleX(0.2); }
        }

        /* ── Step pulse ── */
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 16px rgba(0,170,255,0.5); }
          50%       { box-shadow: 0 0 30px rgba(0,170,255,0.95); }
        }

        /* ── Typewriter cursor ── */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── Feature card icon ── */
        @keyframes iconPulse {
          0%, 100% { transform: scale(1);    }
          50%       { transform: scale(1.18); }
        }

        /* ── Feature card sweep beam ── */
        @keyframes sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%);  }
        }

        /* ── Feature card corner brackets ── */
        @keyframes cornerFade {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1);   }
        }

        /* ── Divider orb ── */
        @keyframes orbTravel {
          0%   { top: 10%;  opacity: 0;   transform: translateX(-50%) scale(0.6); }
          15%  { opacity: 1;              transform: translateX(-50%) scale(1);   }
          50%  { top: 50%;               transform: translateX(-50%) scale(1.3); }
          85%  { opacity: 1;              transform: translateX(-50%) scale(1);   }
          100% { top: 90%;  opacity: 0;   transform: translateX(-50%) scale(0.6); }
        }

        /* ── Network dot ── */
        @keyframes networkPulse {
          0%, 100% { opacity: 1;   transform: scale(1);   box-shadow: 0 0 10px rgba(0,255,200,0.8); }
          50%       { opacity: 0.6; transform: scale(1.5); box-shadow: 0 0 22px rgba(0,255,200,0.3); }
        }

        /* ── Responsive stacking ── */
        @media (max-width: 860px) {
          .register-split {
            flex-direction: column !important;
          }
        }

      `}</style>

    </div>/* end root */
  );
}