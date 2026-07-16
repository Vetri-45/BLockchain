import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Button, Input } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';
import BlockchainLogo from '../components/BlockchainLogo';

export default function Register() {
  const [username, setUsername]   = useState('');
  const [email,    setEmail]      = useState('');
  const [password, setPassword]   = useState('');
  const [loading,  setLoading]    = useState(false);
  const [focused,  setFocused]    = useState(null);
  const [pageReady, setPageReady] = useState(false);
  const [strength, setStrength]   = useState(0);
  const cardRef  = useRef(null);
  const navigate = useNavigate();

  // ✅ Page entrance animation
  useEffect(() => {
    setTimeout(() => setPageReady(true), 100);
  }, []);

  // ✅ Password strength checker
  const checkStrength = (val) => {
    let score = 0;
    if (val.length >= 6)                    score++;
    if (val.length >= 10)                   score++;
    if (/[A-Z]/.test(val))                  score++;
    if (/[0-9]/.test(val))                  score++;
    if (/[^A-Za-z0-9]/.test(val))          score++;
    setStrength(score);
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

  // ✅ 3D card tilt
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const cx      = rect.width  / 2;
    const cy      = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) *  5;
    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(8px)
    `;
    card.style.setProperty('--mx', `${(x / rect.width)  * 100}%`);
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateZ(0)';
  };

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

  return (
    <div className={styles.page}>
      <GalaxyBg />

      <div className={styles.container} style={{
        opacity:    pageReady ? 1 : 0,
        transform:  pageReady ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>

        {/* ✅ Logo area with animations */}
        <div className={styles.logoArea}> 
            {/* ✅ ADD THIS */}
               <BlockchainLogo />

  

          <h1 className={styles.title} style={{
            background:           'linear-gradient(135deg, #ffffff 0%, #00ffc8 50%, #90caf9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
            animation:            'slideDown 0.6s ease 0.2s both',
          }}>VOTECHAIN</h1>

          <p className={styles.subtitle} style={{
            animation:     'slideDown 0.6s ease 0.3s both',
            letterSpacing: '4px',
            color:         'rgba(255,255,255,0.5)',
          }}>CREATE YOUR VOTER IDENTITY</p>
        </div>

        {/* ✅ 3D Card */}
        <div
          ref={cardRef}
          className={styles.card}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transition: 'transform 0.15s ease, box-shadow 0.3s ease',
            boxShadow:  '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,200,0.05)',
            animation:  'slideUp 0.7s ease 0.3s both',
            position:   'relative',
            overflow:   'hidden',
          }}
        >
          {/* ✅ Mouse follow glow */}
          <div style={{
            position:      'absolute',
            inset:         0,
            background:    'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,255,200,0.06) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          {/* ✅ Animated top scan line */}
          <div style={{
            position:   'absolute',
            top:        0, left: 0, right: 0,
            height:     '2px',
            background: 'linear-gradient(90deg, transparent, #00ffc8, transparent)',
            animation:  'scanLine 3s ease infinite',
          }} />

          <div className={styles.cardInner}>

            {/* ✅ Header */}
            <div className={styles.cardHeader} style={{
              animation: 'slideDown 0.5s ease 0.5s both',
            }}>
              <h2 className={styles.cardTitle} style={{
                background:           'linear-gradient(135deg, #fff, #00ffc8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>NEW CREW MEMBER</h2>
              <div className={styles.cardLine} />
            </div>

            {/* ✅ Animated step indicators */}
            <div className={styles.steps} style={{
              animation: 'slideDown 0.5s ease 0.55s both',
            }}>
              {['DETAILS', 'OTP', 'FACE'].map((s, i) => (
                <div key={s} className={styles.stepWrap}>
                  <div className={`${styles.step} ${i === 0 ? styles.stepActive : ''}`}
                    style={i === 0 ? {
                      boxShadow:  '0 0 16px rgba(0,255,200,0.5)',
                      animation:  'pulse 2s ease infinite',
                    } : {}}>
                    <span>{i + 1}</span>
                  </div>
                  <span className={`${styles.stepLabel} ${i === 0 ? styles.stepLabelActive : ''}`}>
                    {s}
                  </span>
                  {i < 2 && <div className={styles.stepConnector}
                    style={ i === 0 ? {
                      background: 'linear-gradient(90deg, rgba(0,255,200,0.5), rgba(255,255,255,0.1))',
                    } : {}} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

              {/* ✅ Username input */}
              <div style={{
                animation:  'slideUp 0.5s ease 0.6s both',
                transition: 'transform 0.2s ease',
                transform:  focused === 'username' ? 'translateX(4px)' : 'translateX(0)',
              }}>
                <Input
                  label="Username"
                  type="text"
                  placeholder="Choose a callsign"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>

              {/* ✅ Email input */}
              <div style={{
                animation:  'slideUp 0.5s ease 0.7s both',
                transition: 'transform 0.2s ease',
                transform:  focused === 'email' ? 'translateX(4px)' : 'translateX(0)',
              }}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>

              {/* ✅ Password with strength meter */}
              <div style={{
                animation:  'slideUp 0.5s ease 0.8s both',
                transition: 'transform 0.2s ease',
                transform:  focused === 'password' ? 'translateX(4px)' : 'translateX(0)',
              }}>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); checkStrength(e.target.value); }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                />
                {/* ✅ Password strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{
                      display:        'flex',
                      justifyContent: 'space-between',
                      marginBottom:   '4px',
                    }}>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
                        PASSWORD STRENGTH
                      </span>
                      <span style={{ fontSize: '10px', color: strengthColor(), letterSpacing: '1px', fontWeight: 'bold' }}>
                        {strengthLabel()}
                      </span>
                    </div>
                    <div style={{
                      display:       'flex',
                      gap:           '4px',
                    }}>
                      {[1,2,3,4,5].map(n => (
                        <div key={n} style={{
                          flex:         1,
                          height:       '3px',
                          borderRadius: '2px',
                          background:   n <= strength ? strengthColor() : 'rgba(255,255,255,0.1)',
                          transition:   'background 0.3s ease',
                          boxShadow:    n <= strength ? `0 0 6px ${strengthColor()}` : 'none',
                        }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ Submit button */}
              <div style={{ animation: 'slideUp 0.5s ease 0.9s both' }}>
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  size="lg"
                  style={{
                    boxShadow:  loading ? 'none' : '0 0 30px rgba(0,255,200,0.25)',
                    transition: 'all 0.3s ease',
                    transform:  loading ? 'scale(0.98)' : 'scale(1)',
                  }}
                >
                  {loading ? 'TRANSMITTING...' : 'BEGIN REGISTRATION →'}
                </Button>
              </div>
            </form>

            {/* ✅ Steps info */}
            <div style={{
              display:       'flex',
              justifyContent:'center',
              gap:           '16px',
              marginTop:     '16px',
              animation:     'slideUp 0.5s ease 1s both',
            }}>
              {[
                { icon: '📧', label: 'EMAIL OTP' },
                { icon: '🧑', label: 'FACE SCAN' },
                { icon: '🔗', label: 'BLOCKCHAIN' },
              ].map(item => (
                <div key={item.label} style={{
                  display:       'flex',
                  flexDirection: 'column',
                  alignItems:    'center',
                  gap:           '4px',
                }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span style={{
                    fontSize:      '9px',
                    color:         'rgba(255,255,255,0.3)',
                    letterSpacing: '1px',
                  }}>{item.label}</span>
                </div>
              ))}
            </div>

            <p className={styles.switchLink} style={{
              animation: 'slideUp 0.5s ease 1.1s both',
            }}>
              Already aboard?{' '}
              <Link to="/login" style={{ color: '#00ffc8' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Keyframes */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-8px); }
        }
        @keyframes scanLine {
          0%   { opacity: 0.3; transform: scaleX(0.2); }
          50%  { opacity: 1;   transform: scaleX(1);   }
          100% { opacity: 0.3; transform: scaleX(0.2); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 16px rgba(0,255,200,0.5); }
          50%       { box-shadow: 0 0 28px rgba(0,255,200,0.9); }
        }
      `}</style>
    </div>
  );
}