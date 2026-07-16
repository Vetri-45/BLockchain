import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Button, Input } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';
import BlockchainLogo from '../components/BlockchainLogo';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState(null);
  const [pageReady, setPageReady] = useState(false);
  const cardRef  = useRef(null);
  const navigate = useNavigate();

  // ✅ Page entrance animation
  useEffect(() => {
    setTimeout(() => setPageReady(true), 100);
  }, []);

  // ✅ 3D card tilt on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const cx      = rect.width  / 2;
    const cy      = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) *  6;
    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(10px)
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
    if (!username.trim()) { toast.error('Username is required'); return; }
    if (!password.trim()) { toast.error('Password is required'); return; }

    setLoading(true);
    try {
      const res   = await api.post('/login', { username, password });
      const token = res.data;

      if (!token || token === 'Fail') {
        toast.error('Invalid username or password');
        return;
      }

      const userRes = await api.get('/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const me    = userRes.data.find(u => u.username === username);
      const email = me?.email;

      if (!email) { toast.error('No email found for this account.'); return; }

      await api.post('/otp/send', { email });
      toast.success('OTP sent to your email!');
      navigate('/otp-verify', { state: { email, username, token, mode: 'login' } });

    } catch (err) {
      toast.error(err.response?.data || 'Login failed');
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

        {/* ✅ Animated logo area */}
       <div className={styles.logoArea}>
         {/*✅ ADD THIS */}
        
              <BlockchainLogo />
          {/* ✅ Animated planet */}

          <div className={styles.planet} style={{
            animation: 'float 4s ease infinite',
            filter:    'drop-shadow(0 0 20px rgba(0,255,200,0.4))',
          }}>
            <div className={styles.planetSurface}/>
            <div className={styles.planetRing}/>
            <div className={styles.planetRing2}/>
            <div className={styles.planetGlow}/>
          </div>

          <h1 className={styles.title} style={{
            background:           'linear-gradient(135deg, #ffffff 0%, #00ffc8 50%, #90caf9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
            animation:            'slideDown 0.6s ease 0.3s both',
          }}>
            VOTECHAIN
          </h1>
          <p className={styles.subtitle} style={{
            animation:     'slideDown 0.6s ease 0.4s both',
            letterSpacing: '4px',
            color:         'rgba(255,255,255,0.5)',
          }}>
            IDENTIFY YOURSELF
          </p>
        </div>

        {/* ✅ 3D Card */}
        <div
          ref={cardRef}
          className={styles.card}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transition:  'transform 0.15s ease, box-shadow 0.3s ease',
            boxShadow:   '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,200,0.05)',
            animation:   'slideUp 0.7s ease 0.3s both',
            position:    'relative',
            overflow:    'hidden',
          }}
        >
          {/* ✅ Mouse follow glow inside card */}
          <div style={{
            position:      'absolute',
            inset:         0,
            background:    'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,255,200,0.06) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          {/* ✅ Top shimmer line */}
          <div style={{
            position:   'absolute',
            top:        0, left: 0, right: 0,
            height:     '2px',
            background: 'linear-gradient(90deg, transparent, #00ffc8, transparent)',
            animation:  'scanLine 3s ease infinite',
          }} />

          <div className={styles.cardInner}>
            <div className={styles.cardHeader} style={{
              animation: 'slideDown 0.5s ease 0.5s both',
            }}>
              <h2 className={styles.cardTitle} style={{
                background:           'linear-gradient(135deg, #fff, #00ffc8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>
                CREW LOGIN
              </h2>
              <div className={styles.cardLine} />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

              {/* ✅ Username input with focus glow */}
              <div style={{
                animation:  'slideUp 0.5s ease 0.6s both',
                transition: 'transform 0.2s ease',
                transform:  focused === 'username' ? 'translateX(4px)' : 'translateX(0)',
              }}>
                <Input
                  label="Username"
                  type="text"
                  placeholder="Your callsign"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  required
                  style={focused === 'username' ? {
                    boxShadow: '0 0 0 2px rgba(0,255,200,0.3)',
                    border:    '1px solid rgba(0,255,200,0.5)',
                  } : {}}
                />
              </div>

              {/* ✅ Password input with focus glow */}
              <div style={{
                animation:  'slideUp 0.5s ease 0.7s both',
                transition: 'transform 0.2s ease',
                transform:  focused === 'password' ? 'translateX(4px)' : 'translateX(0)',
              }}>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  style={focused === 'password' ? {
                    boxShadow: '0 0 0 2px rgba(0,255,200,0.3)',
                    border:    '1px solid rgba(0,255,200,0.5)',
                  } : {}}
                />
              </div>

              {/* ✅ Animated submit button */}
              <div style={{ animation: 'slideUp 0.5s ease 0.8s both' }}>
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
                  {loading ? 'AUTHENTICATING...' : 'LAUNCH →'}
                </Button>
              </div>
            </form>

            {/* ✅ Security badge */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              gap:           '8px',
              marginTop:     '16px',
              padding:       '8px',
              borderRadius:  '8px',
              background:    'rgba(0,255,200,0.04)',
              border:        '1px solid rgba(0,255,200,0.1)',
              animation:     'slideUp 0.5s ease 0.9s both',
            }}>
              <span style={{ fontSize: '12px' }}>🔒</span>
              <span style={{
                fontSize:      '10px',
                color:         'rgba(255,255,255,0.3)',
                letterSpacing: '1.5px',
              }}>
                JWT + OTP + FACE SECURED
              </span>
            </div>

            <p className={styles.switchLink} style={{
              animation: 'slideUp 0.5s ease 1s both',
            }}>
              New crew member? <Link to="/register" style={{
                color:      '#00ffc8',
                transition: 'all 0.2s ease',
              }}>Register</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Keyframe animations */}
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
      `}</style>
    </div>
  );
}