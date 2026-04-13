import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './OtpVerify.module.css';

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, username, token, mode = 'register' } = location.state || {};

  const [digits, setDigits]       = useState(['', '', '', '', '', '']);
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => { if (!email) navigate('/login'); }, [email]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits]; next[i] = val.slice(-1); setDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setDigits(pasted.split('')); inputRefs.current[5]?.focus(); }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try {
      await axios.post('/api/otp/verify', { email, code });
      toast.success('OTP verified! ✅');
      navigate('/face-capture', { state: { email, username, token, mode } });
    } catch (err) {
      toast.error(err.response?.data || 'Invalid OTP. Try again.');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post('/api/otp/send', { email });
      toast.success('New OTP sent!');
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch { toast.error('Failed to resend OTP'); }
    finally { setResending(false); }
  };

  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.container}>

        <div className={styles.signalIcon}>
          <div className={styles.signalRing} />
          <div className={styles.signalRing2} />
          <div className={styles.signalCore}>✉</div>
        </div>

        <h1 className={styles.title}>TRANSMISSION RECEIVED</h1>
        <p className={styles.sub}>
          A 6-digit code was transmitted to<br />
          <span className={styles.email}>{email}</span>
        </p>

        <div className={styles.otpRow} onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              className={`${styles.otpBox} ${d ? styles.filled : ''}`}
              type="text" inputMode="numeric"
              maxLength={1} value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleVerify}>
          VERIFY TRANSMISSION →
        </Button>

        <div className={styles.resendRow}>
          {countdown > 0 ? (
            <p className={styles.timer}>Resend in {countdown}s</p>
          ) : (
            <button className={styles.resendBtn} onClick={handleResend} disabled={resending}>
              {resending ? 'TRANSMITTING...' : '↺ RESEND CODE'}
            </button>
          )}
        </div>

        <p className={styles.expiry}>⏱ Code expires in 5 minutes</p>
      </div>
    </div>
  );
}
