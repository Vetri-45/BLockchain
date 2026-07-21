import { useState } from 'react';
import { createPortal } from 'react-dom';

const ISSUES = [
  {
    id    : 1,
    icon  : '📧',
    color : '#00ffc8',
    title : 'OTP not received in inbox',
    fix   : 'Check your spam/junk folder. Wait 60 seconds and click Resend Code. Make sure your email address is correct.',
  },
  {
    id    : 2,
    icon  : '⏱️',
    color : '#f59e0b',
    title : 'OTP expired before I entered it',
    fix   : 'OTP is valid for only 5 minutes. Click Resend Code to get a new one and enter it quickly.',
  },
  {
    id    : 3,
    icon  : '👤',
    color : '#ff4757',
    title : 'Username already taken',
    fix   : 'Try a different username. Add numbers or underscores (e.g. john_2024). Usernames must be unique.',
  },
  {
    id    : 4,
    icon  : '📮',
    color : '#ff4757',
    title : 'Email already registered',
    fix   : 'This email has an account. Click Sign In to login. Use Forgot Password if needed.',
  },
  {
    id    : 5,
    icon  : '📷',
    color : '#a855f7',
    title : 'Face not detected during scan',
    fix   : 'Ensure good lighting. Look directly at camera. Remove glasses or mask. Use Upload Photo tab as an alternative.',
  },
  {
    id    : 6,
    icon  : '🔐',
    color : '#ff4757',
    title : 'Wrong username or password',
    fix   : 'Double check your username (case sensitive). Make sure Caps Lock is off. Re-type your password carefully.',
  },
  {
    id    : 7,
    icon  : '😶',
    color : '#f59e0b',
    title : 'Face verification failed at login',
    fix   : 'Ensure same lighting as registration. Look straight ahead. You have 3 attempts before 30 second lockout.',
  },
  {
    id    : 8,
    icon  : '🔒',
    color : '#ff4757',
    title : 'Account locked after failed attempts',
    fix   : 'Wait 30 seconds for automatic unlock. Then try face verification again with better lighting.',
  },
  {
    id    : 9,
    icon  : '🔑',
    color : '#f59e0b',
    title : 'Password too weak / rejected',
    fix   : 'Password must be at least 6 characters. Use uppercase, numbers and symbols for a stronger password.',
  },
  {
    id    : 10,
    icon  : '🔄',
    color : '#64b4ff',
    title : 'Session expired — need to login again',
    fix   : 'Your session token expired for security. Simply login again with your credentials to get a new session.',
  },
];

export default function HelpModal({ onClose }) {
  const [activeId, setActiveId] = useState(null);

  return createPortal(
    <>
      {/* ── Backdrop — NO backdropFilter, solid bg only ── */}
      <div
        onClick={onClose}
        style={{
          position : 'fixed',
          inset    : 0,
          background: 'rgba(0,0,0,0.88)',  // FIX 1: solid, no backdropFilter blur bleed
          zIndex   : 9998,
          animation: 'helpFadeIn 0.3s ease',
        }}
      />

      {/* ── Modal — isolated GPU layer ── */}
      <div style={{
        position     : 'fixed',
        top          : '50%',
        left         : '50%',
        transform    : 'translate(-50%, -50%)',
        width        : 'min(560px, 92vw)',
        maxHeight    : '82vh',
        background   : 'linear-gradient(135deg, rgba(6,13,31,0.99), rgba(10,22,40,0.99))',
        border       : '1px solid rgba(0,212,255,0.2)',
        borderRadius : '24px',
        boxShadow    : '0 32px 100px rgba(0,0,0,0.8), 0 0 60px rgba(0,100,200,0.15)',
        zIndex       : 9999,
        display      : 'flex',
        flexDirection: 'column',
        overflow     : 'visible',
        animation    : 'helpPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        isolation    : 'isolate',       // FIX 2a: seals this modal's stacking context
        willChange   : 'transform',     // FIX 2b: own GPU compositing layer
      }}>

        {/* Top scan line */}
        <div style={{
          position  : 'absolute',
          top: 0, left: 0, right: 0,
          height    : '2px',
          background: 'linear-gradient(90deg, transparent, #00ffc8, transparent)',
          animation : 'helpScanLine 3s ease infinite',
          zIndex    : 1,
        }} />

        {/* ── Header ── */}
        <div style={{
          padding       : '24px 28px 16px',
          borderBottom  : '1px solid rgba(0,212,255,0.08)',
          display       : 'flex',
          alignItems    : 'center',
          justifyContent: 'space-between',
          flexShrink    : 0,
          position      : 'relative',
          zIndex        : 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width         : '40px',
              height        : '40px',
              borderRadius  : '10px',
              background    : 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,100,200,0.1))',
              border        : '1px solid rgba(0,212,255,0.3)',
              display       : 'flex',
              alignItems    : 'center',
              justifyContent: 'center',
              fontSize      : '20px',
              boxShadow     : '0 0 20px rgba(0,212,255,0.2)',
            }}>❓</div>
            <div>
              <h2 style={{
                fontFamily   : 'var(--font-display)',
                fontSize     : '16px',
                fontWeight   : '800',
                letterSpacing: '2px',
                color        : '#e8f4ff',
                margin       : 0,
              }}>HELP & TROUBLESHOOTING</h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize  : '12px',
                color     : 'rgba(255,255,255,0.3)',
                margin    : '2px 0 0',
              }}>Click any issue to see the fix</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              width         : '36px',
              height        : '36px',
              borderRadius  : '50%',
              background    : 'rgba(255,255,255,0.04)',
              border        : '1px solid rgba(255,255,255,0.1)',
              color         : 'rgba(255,255,255,0.5)',
              fontSize      : '18px',
              cursor        : 'pointer',
              display       : 'flex',
              alignItems    : 'center',
              justifyContent: 'center',
              transition    : 'all 0.2s ease',
              flexShrink    : 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = 'rgba(255,71,87,0.15)';
              e.currentTarget.style.borderColor = 'rgba(255,71,87,0.4)';
              e.currentTarget.style.color       = '#ff4757';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color       = 'rgba(255,255,255,0.5)';
            }}
          >✕</button>
        </div>

        {/* ── Scrollable issues list ── */}
        <div style={{
          overflowY       : 'auto',
          padding         : '16px 28px 24px',
          display         : 'flex',
          flexDirection   : 'column',
          gap:'14px',
          scrollbarWidth  : 'thin',
          scrollbarColor  : 'rgba(0,212,255,0.2) transparent',
          position        : 'relative',        // FIX 3a
          zIndex          : 1,                 // FIX 3b
          transform       : 'translateZ(0)',   // FIX 3c: own GPU layer, stops blur bleed
          WebkitTransform : 'translateZ(0)',   // FIX 3d: Safari
        }}>
          {ISSUES.map((issue, i) => {
            const isOpen = activeId === issue.id;
            return (
              <div
                key={issue.id}
                onClick={() => setActiveId(isOpen ? null : issue.id)}
                style={{
                  background  : isOpen
                    ? `linear-gradient(135deg, ${issue.color}12, rgba(4,10,24,0.98))`
                    : 'rgba(10,22,40,0.6)',
                  border      : `1px solid ${isOpen ? issue.color + '40' : 'rgba(100,180,255,0.08)'}`,
                  borderRadius: '14px',
                  padding:'16px',
marginBottom:'4px',
                  cursor      : 'pointer',
                  transition  : 'all 0.3s ease',
                  animation   : `helpSlideUp 0.4s ease ${i * 0.04}s both`,
                  position    : 'relative',
                  overflow    : 'hidden',
                }}
                onMouseEnter={e => {
                  if (!isOpen) {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
                    e.currentTarget.style.background  = 'rgba(0,212,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isOpen) {
                    e.currentTarget.style.borderColor = 'rgba(100,180,255,0.08)';
                    e.currentTarget.style.background  = 'rgba(10,22,40,0.6)';
                  }
                }}
              >
                {/* Left accent bar */}
                {isOpen && (
                  <div style={{
                    position    : 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width       : '3px',
                    background  : `linear-gradient(180deg, ${issue.color}, transparent)`,
                    boxShadow   : `0 0 12px ${issue.color}`,
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}

                {/* Issue row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontSize  : '20px',
                    flexShrink: 0,
                    filter    : isOpen ? `drop-shadow(0 0 8px ${issue.color})` : 'none',
                    transition: 'filter 0.3s',
                  }}>{issue.icon}</span>

                  <div style={{ flex: 1 }}>
                    <p
style={{
    fontFamily:'var(--font-body)',
    fontSize:'13px',
    color:'rgba(255,255,255,0.75)',

    lineHeight:'22px',
    margin:0,

    whiteSpace:'normal',
    wordBreak:'break-word',
    overflowWrap:'break-word',
}}
>
                      <span style={{
                        color      : issue.color,
                        marginRight: '6px',
                        fontFamily : 'var(--font-mono)',
                        fontSize   : '10px',
                        opacity    : 0.7,
                      }}>#{String(issue.id).padStart(2, '0')}</span>
                      {issue.title}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span style={{
                    color     : isOpen ? issue.color : 'rgba(255,255,255,0.2)',
                    fontSize  : '14px',
                    transform : isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}>›</span>
                </div>

                {/* Expanded fix */}
                {isOpen && (
  <div
  style={{
    maxHeight: isOpen ? "200px" : "0px",
    opacity: isOpen ? 1 : 0,
    overflow: "hidden",
    transition: "max-height 0.35s ease, opacity 0.25s ease, margin 0.35s ease, padding 0.35s ease",
    marginTop: isOpen ? "14px" : "0px",
    paddingTop: isOpen ? "14px" : "0px",
    borderTop: isOpen ? `1px solid ${issue.color}25` : "none",
  }}
>
                      <p
    style={{
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: "rgba(255,255,255,0.75)",
      lineHeight: "22px",
      margin: 0,
      whiteSpace: "normal",
      wordBreak: "break-word",
    }}
  >
                     <span
      style={{
        color: issue.color,
        fontWeight: 700,
      }}
    >
      ✓ Fix:
    </span>{" "}
    {issue.fix}

                      
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding   : '14px 28px',
          borderTop : '1px solid rgba(0,212,255,0.08)',
          background: 'rgba(0,0,0,0.2)',
          display   : 'flex',
          alignItems: 'center',
          gap       : '8px',
          flexShrink: 0,
        }}>
          <div style={{
            width       : '6px',
            height      : '6px',
            borderRadius: '50%',
            background  : '#00ffc8',
            boxShadow   : '0 0 8px rgba(0,255,200,0.8)',
            animation   : 'helpNetworkPulse 2s ease infinite',
            flexShrink  : 0,
          }} />
          <p style={{
            fontFamily   : 'var(--font-display)',
            fontSize     : '10px',
            letterSpacing: '1px',
            color        : 'rgba(255,255,255,0.25)',
            margin       : 0,
          }}>VOTECHAIN SUPPORT SYSTEM • BLOCKCHAIN SECURED</p>
        </div>
      </div>

      <style>{`
        @keyframes helpPopIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
        @keyframes helpFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes helpSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes helpScanLine {
          0%   { opacity: 0.3; transform: scaleX(0.2); }
          50%  { opacity: 1;   transform: scaleX(1);   }
          100% { opacity: 0.3; transform: scaleX(0.2); }
        }
        @keyframes helpNetworkPulse {
          0%, 100% { opacity: 1;   box-shadow: 0 0 8px  rgba(0,255,200,0.8); }
          50%       { opacity: 0.5; box-shadow: 0 0 16px rgba(0,255,200,0.3); }
        }
        div::-webkit-scrollbar       { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb {
          background   : rgba(0,212,255,0.2);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(0,212,255,0.4);
        }
      `}</style>
    </>,
    document.body
  );
}