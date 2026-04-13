import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Input } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) { toast.error('Username is required'); return; }
    if (!password.trim()) { toast.error('Password is required'); return; }

    setLoading(true);
    try {
      const res   = await axios.post('/api/login', { username, password });
      const token = res.data;
      if (!token || token === 'Fail') { toast.error('Invalid username or password'); return; }

      const userRes = await axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } });
      const me      = userRes.data.find(u => u.username === username);
      const email   = me?.email;

      if (!email) { toast.error('No email found for this account.'); return; }

      await axios.post('/api/otp/send', { email });
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
      <div className={styles.container}>

        {/* Planet logo */}
        <div className={styles.logoArea}>
          <div className={styles.planet}>
            <div className={styles.planetSurface} />
            <div className={styles.planetRing} />
            <div className={styles.planetRing2} />
            <div className={styles.planetGlow} />
          </div>
          <h1 className={styles.title}>VOTECHAIN</h1>
          <p className={styles.subtitle}>DECENTRALIZED · TRANSPARENT · IMMUTABLE</p>
        </div>

        {/* Auth card */}
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>MISSION LOGIN</h2>
              <div className={styles.cardLine} />
            </div>

            {/* Steps */}
            <div className={styles.steps}>
              {['PASSWORD', 'OTP', 'FACE'].map((s, i) => (
                <div key={s} className={styles.stepWrap}>
                  <div className={`${styles.step} ${i === 0 ? styles.stepActive : ''}`}>
                    <span>{i + 1}</span>
                  </div>
                  <span className={`${styles.stepLabel} ${i === 0 ? styles.stepLabelActive : ''}`}>{s}</span>
                  {i < 2 && <div className={styles.stepConnector} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input label="Username" type="text" placeholder="Enter your username"
                value={username} onChange={e => setUsername(e.target.value)} required />
              <Input label="Password" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
              <Button type="submit" fullWidth loading={loading} size="lg">
                INITIATE LOGIN →
              </Button>
            </form>

            <p className={styles.switchLink}>
              New astronaut? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>

        {/* Blockchain viz */}
        <div className={styles.chainRow}>
          {['GENESIS', 'BLOCK·1', 'BLOCK·2', 'BLOCK·N'].map((b, i) => (
            <div key={b} className={styles.chainBlock} style={{ animationDelay: `${i * 0.12}s` }}>
              <span>{b}</span>
              {i < 3 && <div className={styles.chainArrow}>→</div>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
