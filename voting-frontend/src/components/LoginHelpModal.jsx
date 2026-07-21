
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// ✅ Only 5 most relevant Q&As for Login/Register pages
const QA = [
  {
    id   : 1,
    icon : '📧',
    color: '#00ffc8',
    q    : 'I did not receive the OTP email?',
    a    : 'Check your spam or junk folder. Make sure you entered the correct email. Wait 60 seconds then click Resend Code.',
  },
  {
    id   : 2,
    icon : '👤',
    color: '#64b4ff',
    q    : 'Username or email already taken?',
    a    : 'Your username must be unique. Try adding numbers or underscores (e.g. john_99). If email is taken, try logging in instead.',
  },
  {
    id   : 3,
    icon : '🔐',
    color: '#f59e0b',
    q    : 'Wrong username or password at login?',
    a    : 'Usernames are case sensitive. Make sure Caps Lock is off. Re-type your password carefully. Contact support if forgotten.',
  },
  {
    id   : 4,
    icon : '📷',
    color: '#a855f7',
    q    : 'Face not detected during registration?',
    a    : 'Ensure bright lighting on your face. Look directly at the camera. Remove glasses or mask. Try the Upload Photo tab instead.',
  },
  {
    id   : 5,
    icon : '⏱️',
    color: '#ff4757',
    q    : 'OTP expired before I could enter it?',
    a    : 'OTP is valid for only 5 minutes. Click Resend Code to get a fresh one. Enter it immediately after receiving.',
  },
];

export default function LoginHelpModal({ onClose }) {
  const [activeId, setActiveId] = useState(null);
  const cursorRef = useRef(null);

useEffect(() => {
  const cursor = cursorRef.current;
  if (!cursor) return;

  const onMove = (e) => {
    cursor.style.left    = `${e.clientX}px`;
    cursor.style.top     = `${e.clientY}px`;
    cursor.style.opacity = '1';
  };

  const onLeave = () => {
    cursor.style.opacity = '0';
  };

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseleave', onLeave);
  return () => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseleave', onLeave);
  };
}, []);

  return createPortal(
    <>
    {/* ✅ Cursor glow ring — visible over modal */}
    <div
      ref={cursorRef}
      style={{
        position     : 'fixed',
        width        : '36px',
        height       : '36px',
        borderRadius : '50%',
        border       : '1.5px solid rgba(0,212,255,0.7)',
        background   : 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
        transform    : 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex       : 99999,
        opacity      : 0,
        transition   : 'opacity 0.3s ease',
        boxShadow    : '0 0 16px rgba(0,212,255,0.3)',
      }}
    />
    
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position  : 'fixed',
          inset     : 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex    : 9998,
          animation : 'lhFadeIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position     : 'fixed',
        top          : '50%',
        left         : '50%',
        transform    : 'translate(-50%, -50%)',
        width        : 'min(500px, 92vw)',
        background   : 'linear-gradient(135deg, rgba(6,13,31,0.99), rgba(10,22,40,0.99))',
        border       : '1px solid rgba(0,212,255,0.2)',
        borderRadius : '24px',
        boxShadow    : '0 32px 100px rgba(0,0,0,0.8), 0 0 60px rgba(0,100,200,0.15)',
        zIndex       : 9999,
        display      : 'flex',
        flexDirection: 'column',
        overflow     : 'hidden',
        animation    : 'lhPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        isolation    : 'isolate',
        willChange   : 'transform',
      }}>

        {/* Top scan line */}
        <div style={{
          position  : 'absolute',
          top:0, left:0, right:0,
          height    : '2px',
          background: 'linear-gradient(90deg, transparent, #00ffc8, transparent)',
          animation : 'lhScanLine 3s ease infinite',
          zIndex    : 1,
        }} />

        {/* Header */}
        <div style={{
          padding       : '22px 24px 14px',
          borderBottom  : '1px solid rgba(0,212,255,0.08)',
          display       : 'flex',
          alignItems    : 'center',
          justifyContent: 'space-between',
          flexShrink    : 0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{
              width         : '38px',
              height        : '38px',
              borderRadius  : '10px',
              background    : 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,100,200,0.1))',
              border        : '1px solid rgba(0,212,255,0.3)',
              display       : 'flex',
              alignItems    : 'center',
              justifyContent: 'center',
              fontSize      : '18px',
              boxShadow     : '0 0 16px rgba(0,212,255,0.2)',
            }}>💡</div>
            <div>
              <h2 style={{
                fontFamily   : 'var(--font-display)',
                fontSize     : '15px',
                fontWeight   : '800',
                letterSpacing: '2px',
                color        : '#e8f4ff',
                margin       : 0,
              }}>HELP CENTER</h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize  : '12px',
                color     : 'rgba(255,255,255,0.3)',
                margin    : '2px 0 0',
              }}>Common login & registration issues</p>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              width         : '34px',
              height        : '34px',
              borderRadius  : '50%',
              background    : 'rgba(255,255,255,0.04)',
              border        : '1px solid rgba(255,255,255,0.1)',
              color         : 'rgba(255,255,255,0.5)',
              fontSize      : '16px',
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

        {/* Q&A List */}
        <div style={{
          padding      : '16px 24px 20px',
          display      : 'flex',
          flexDirection: 'column',
          gap          : '10px',
        }}>
          {QA.map((item, i) => {
            const isOpen = activeId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveId(isOpen ? null : item.id)}
                style={{
                  background  : isOpen
                    ? `linear-gradient(135deg, ${item.color}12, rgba(4,10,24,0.98))`
                    : 'rgba(10,22,40,0.6)',
                  border      : `1px solid ${isOpen ? item.color + '40' : 'rgba(100,180,255,0.08)'}`,
                  borderRadius: '14px',
                  padding     : '14px 16px',
                  cursor      : 'pointer',
                  transition  : 'all 0.3s ease',
                  animation   : `lhSlideUp 0.4s ease ${i * 0.06}s both`,
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
                {/* Left accent */}
                {isOpen && (
                  <div style={{
                    position    : 'absolute',
                    left:0, top:0, bottom:0,
                    width       : '3px',
                    background  : `linear-gradient(180deg, ${item.color}, transparent)`,
                    boxShadow   : `0 0 10px ${item.color}`,
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}

                {/* Question row */}
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{
                    fontSize  : '20px',
                    flexShrink: 0,
                    filter    : isOpen ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                    transition: 'filter 0.3s',
                  }}>{item.icon}</span>

                  <p style={{
                    flex        : 1,
                    fontFamily  : 'var(--font-display)',
                    fontSize    : '12px',
                    fontWeight  : '700',
                    letterSpacing:'0.5px',
                    color       : isOpen ? '#fff' : 'rgba(255,255,255,0.7)',
                    margin      : 0,
                    transition  : 'color 0.3s',
                  }}>
                    <span style={{
                      color      : item.color,
                      marginRight: '6px',
                      fontSize   : '10px',
                      opacity    : 0.7,
                      fontFamily : 'var(--font-mono)',
                    }}>Q{item.id}</span>
                    {item.q}
                  </p>

                  <span style={{
                    color     : isOpen ? item.color : 'rgba(255,255,255,0.2)',
                    fontSize  : '16px',
                    transform : isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}>›</span>
                </div>

                {/* Answer — expands on click */}
                {isOpen && (
                  <div style={{
                    marginTop : '12px',
                    paddingTop: '12px',
                    borderTop : `1px solid ${item.color}25`,
                    animation : 'lhSlideUp 0.25s ease both',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize  : '13px',
                      color     : 'rgba(255,255,255,0.65)',
                      lineHeight: '1.7',
                      margin    : 0,
                    }}>
                      <span style={{
                        color     : item.color,
                        fontWeight: '700',
                        marginRight: '4px',
                      }}>✓ Answer:</span>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding    : '12px 24px',
          borderTop  : '1px solid rgba(0,212,255,0.08)',
          background : 'rgba(0,0,0,0.2)',
          display    : 'flex',
          alignItems : 'center',
          gap        : '8px',
          flexShrink : 0,
        }}>
          <div style={{
            width       : '6px',
            height      : '6px',
            borderRadius: '50%',
            background  : '#00ffc8',
            boxShadow   : '0 0 8px rgba(0,255,200,0.8)',
            animation   : 'lhPulse 2s ease infinite',
            flexShrink  : 0,
          }} />
          <p style={{
            fontFamily   : 'var(--font-display)',
            fontSize     : '9px',
            letterSpacing: '1px',
            color        : 'rgba(255,255,255,0.2)',
            margin       : 0,
          }}>VOTECHAIN HELP CENTER • CLICK ANY QUESTION TO EXPAND</p>
        </div>
      </div>

      <style>{`
        @keyframes lhPopIn {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.85); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1);    }
        }
        @keyframes lhFadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes lhSlideUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes lhScanLine {
          0%,100% { opacity:0.3; transform:scaleX(0.2); }
          50%      { opacity:1;   transform:scaleX(1);   }
        }
        @keyframes lhPulse {
          0%,100% { opacity:1;   box-shadow:0 0 8px rgba(0,255,200,0.8); }
          50%      { opacity:0.5; box-shadow:0 0 16px rgba(0,255,200,0.3); }
        }
      `}</style>
    </>,
    document.body
  );
}