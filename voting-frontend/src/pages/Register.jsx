import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Input } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim())    { toast.error('Username is required'); return; }
    if (!email.trim())       { toast.error('Enter Your Correct Mail Address'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      await axios.post('/api/user', { username, email, password });
      await axios.post('/api/otp/send', { email });
      toast.success('OTP sent to ' + email);
      navigate('/otp-verify', { state: { email, username, mode: 'register' } });
    } catch (err) {
      const msg = err.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.container}>

        <div className={styles.logoArea}>
          <div className={styles.planet}>
            <div className={styles.planetSurface} />
            <div className={styles.planetRing} />
            <div className={styles.planetRing2} />
            <div className={styles.planetGlow} />
          </div>
          <h1 className={styles.title}>VOTECHAIN</h1>
          <p className={styles.subtitle}>CREATE YOUR VOTER IDENTITY</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardInner}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>NEW CREW MEMBER</h2>
              <div className={styles.cardLine} />
            </div>

            <div className={styles.steps}>
              {['DETAILS', 'OTP', 'FACE'].map((s, i) => (
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
              <Input label="Username" type="text" placeholder="Choose a callsign"
                value={username} onChange={e => setUsername(e.target.value)} required />
              <Input label="Email Address" type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
              <Input label="Password" type="password" placeholder="Min 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} required />
              <Button type="submit" fullWidth loading={loading} size="lg">
                BEGIN REGISTRATION →
              </Button>
            </form>

            <p className={styles.switchLink}>
              Already aboard? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
