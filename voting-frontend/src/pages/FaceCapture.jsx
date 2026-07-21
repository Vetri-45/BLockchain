import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import GalaxyBg from '../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './FaceCapture.module.css';

const MODEL_URL    = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
const MAX_ATTEMPTS = 3; // max failed attempts before lockout

export default function FaceCapture() {
  const navigate      = useNavigate();
  const location      = useLocation();
  const { loginUser } = useAuth();

  const { email, username, token, mode = 'register' } = location.state || {};

  const videoRef     = useRef(null);
  const canvasRef    = useRef(null);
  const streamRef    = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab]       = useState('camera');
  const [cameraReady, setCameraReady]   = useState(false);
  const [captured, setCaptured]         = useState(null);
  const [descriptor, setDescriptor]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [cameraError, setCameraError]   = useState(null);
  const [dragOver, setDragOver]         = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [statusMsg, setStatusMsg]       = useState('Loading face models...');
  const [attempts, setAttempts]         = useState(0);
  const [locked, setLocked]             = useState(false);
  const [lockTimer, setLockTimer]       = useState(0);
  const [lastConfidence, setLastConfidence] = useState(null);

  useEffect(() => {
    if (!username) navigate('/login');
  }, [username]);

  // ── Load face-api.js models ───────────────────────────────────
  useEffect(() => {
    let tries = 0;
    const load = async () => {
      const faceapi = window.faceapi;
      if (!faceapi) {
        tries++;
        if (tries < 15) setTimeout(load, 600);
        else setStatusMsg('Failed to load models. Please refresh.');
        return;
      }
      try {
        setStatusMsg('Loading face models...');
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setStatusMsg('');
      } catch {
        // Try alternate CDN
        try {
          const alt = 'https://justadudewhohacks.github.io/face-api.js/models';
          const faceapi = window.faceapi;
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(alt),
            faceapi.nets.faceLandmark68Net.loadFromUri(alt),
            faceapi.nets.faceRecognitionNet.loadFromUri(alt),
          ]);
          setModelsLoaded(true);
          setStatusMsg('');
        } catch {
          setStatusMsg('Model load failed. Please refresh page.');
        }
      }
    };
    load();
  }, []);

 
  useEffect(() => {
    if (lockTimer <= 0) return;
    const t = setTimeout(() => {
      setLockTimer(l => l - 1);
      if (lockTimer === 1) {
        setLocked(false);
        setAttempts(0);
        setLastConfidence(null);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [lockTimer]);

  // ── Camera controls ───────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => { t.stop(); t.enabled = false; });
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => setCameraReady(true))
            .catch(() => setCameraError('Could not start video stream.'));
        };
      }
    } catch {
      setCameraError('Camera access denied. Please allow camera or use Upload tab.');
    }
  }, [stopCamera]);

  useEffect(() => {
    setCaptured(null);
    setDescriptor(null);
    if (activeTab === 'camera') startCamera();
    else stopCamera();
  }, [activeTab]);

  useEffect(() => { return () => stopCamera(); }, []);

  // ── Extract face descriptor ───────────────────────────────────
  const extractDescriptor = async (imgEl) => {
    const faceapi = window.faceapi;
    if (!faceapi || !modelsLoaded) return null;
    try {
      const det = await faceapi
        .detectSingleFace(imgEl, new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.4  // stricter detection threshold
        }))
        .withFaceLandmarks()
        .withFaceDescriptor();
      return det?.descriptor || null;
    } catch { return null; }
  };

  
  const capturePhoto = async () => {
    if (!modelsLoaded || locked) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    setStatusMsg('Scanning face...');
    const desc = await extractDescriptor(canvas);
    setStatusMsg('');

    if (!desc) {
      toast.error('No face detected. Align your face in the oval, ensure good lighting and try again.');
      return;
    }

    setDescriptor(desc);
    setCaptured(canvas.toDataURL('image/jpeg', 0.92));
    stopCamera();
    toast.success('Face scanned successfully ✅');
  };


  const retake = () => {
    if (locked) return;
    setCaptured(null);
    setDescriptor(null);
    setLastConfidence(null);
    if (activeTab === 'camera') setTimeout(() => startCamera(), 150);
  };

  // ── Process uploaded file ─────────────────────────────────────
  const processFile = async (file) => {
    if (!file || locked) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file.'); return; }
    if (file.size > 10 * 1024 * 1024)   { toast.error('Image too large. Max 10MB.'); return; }
    if (!modelsLoaded) { toast.error('Face models still loading...'); return; }

    setStatusMsg('Scanning uploaded photo...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        const canvas  = canvasRef.current;
        const maxSize = 800;
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) { height = Math.round((height * maxSize) / width); width = maxSize; }
          else { width = Math.round((width * maxSize) / height); height = maxSize; }
        }
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        const desc = await extractDescriptor(img);
        setStatusMsg('');

        if (!desc) {
          toast.error('No face detected in this photo. Please use a clear, front-facing photo.');
          return;
        }

        setDescriptor(desc);
        setCaptured(canvas.toDataURL('image/jpeg', 0.92));
        toast.success('Face detected in photo ✅');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => { processFile(e.target.files[0]); e.target.value = ''; };
  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = ()    => setDragOver(false);
  const handleDrop      = (e)   => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!captured || !descriptor || locked) return;
    setLoading(true);

    const descriptorStr = Array.from(descriptor).join(',');
    const base64        = captured.includes(',') ? captured.split(',')[1] : captured;

    try {
      if (mode === 'register') {
  // ✅ Step 1: Save user to DB first
  await axios.post('/api/otp/complete-registration', { email });

  // ✅ Step 2: Register face descriptor
  await axios.post('/api/face/register', {
    username,
    descriptor: Array.from(descriptor),
    image: base64
  });

  toast.success('Registration complete! You can now login. ✅');
  navigate('/login');
} else {
        // Login — verify descriptor against stored one
        setStatusMsg('Verifying identity...');

        const res = await axios.post('/api/face/verify', {
          username,
          descriptor: descriptorStr
        });

        setStatusMsg('');
        const conf = res.data?.confidence;
        setLastConfidence(conf);

        if (res.data?.verified && conf >= 50) {
  // ✅ Debug — check token exists
  console.log('Token from state:', token);

  if (!token) {
    toast.error('Session expired. Please login again.');
    navigate('/login');
    return;
  }

  // ✅ Save token properly
  loginUser(token);

  // ✅ Verify it saved
  console.log('Saved token:', localStorage.getItem('token'));

  toast.success(`Identity verified! Confidence: ${conf}% ✅`);
  navigate('/elections');
}
      }

    }  catch (err) {
  setStatusMsg('');
  const msg = err.response?.data;
  const status = err.response?.status;

  // ─── REGISTER ERROR HANDLING ───────────────────────
  if (mode === 'register') {
    if (status === 409) {
      // Duplicate face detected
      toast.error('❌ This face is already registered with another account!');
    } else if (status === 400) {
      toast.error('No face detected in image. Please retake.');
    } else {
      toast.error(typeof msg === 'string' ? msg : 'Face registration failed. Try again.');
    }
    // Reset for retake — no attempt locking for register
    setCaptured(null);
    setDescriptor(null);
    if (activeTab === 'camera') setTimeout(() => startCamera(), 150);
    return;
  }

  // ─── LOGIN ERROR HANDLING ───────────────────────────
  const confMatch = typeof msg === 'string' && msg.match(/Confidence: ([\d.]+)%/);
  const failedConf = confMatch ? parseFloat(confMatch[1]) : null;
  setLastConfidence(failedConf);

  const newAttempts = attempts + 1;
  setAttempts(newAttempts);

  if (newAttempts >= MAX_ATTEMPTS) {
    setLocked(true);
    setLockTimer(30);
    toast.error('❌ Too many failed attempts. Locked for 30 seconds.');
  } else {
    const remaining = MAX_ATTEMPTS - newAttempts;
    if (typeof msg === 'string') {
      toast.error(`${msg} (${remaining} attempt${remaining > 1 ? 's' : ''} remaining)`);
    } else {
      toast.error(`Face verification failed. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`);
    }
  }

  setCaptured(null);
  setDescriptor(null);
  if (activeTab === 'camera' && !locked) setTimeout(() => startCamera(), 150);
}
  };


  const getConfidenceColor = (conf) => {
    if (conf >= 75) return '#10d48e';  // green — high confidence
    if (conf >= 50) return '#f59e0b'; 
    return '#ff4757';                 
  };

  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>
            {mode === 'register' ? '🧑 REGISTER FACE' : '🔐 FACE VERIFICATION'}
          </h1>
          <p className={styles.sub}>
            {mode === 'register'
              ? 'Your face will be used as a biometric security key for future logins.'
              : 'Minimum 50% confidence required to access the system.'}
          </p>
        </div>

        {/* Security badge - login mode only */}
        {mode === 'login' && (
          <div className={styles.securityBadge}>
            <span className={styles.securityIcon}>🛡️</span>
            <div>
              <p className={styles.securityTitle}>BIOMETRIC SECURITY ACTIVE</p>
              <p className={styles.securitySub}>Min. 50% confidence · Max {MAX_ATTEMPTS} attempts · 30s lockout</p>
            </div>
            <div className={styles.attemptPills}>
              {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                <div
                  key={i}
                  className={`${styles.attemptPill} ${i < attempts ? styles.attemptFailed : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lockout screen */}
        {locked && (
          <div className={styles.lockScreen}>
            <div className={styles.lockIcon}>🔒</div>
            <h2 className={styles.lockTitle}>ACCESS LOCKED</h2>
            <p className={styles.lockDesc}>Too many failed face verification attempts.</p>
            <div className={styles.lockTimer}>{lockTimer}s</div>
            <p className={styles.lockSub}>System will unlock automatically</p>
          </div>
        )}

        {/* Status message */}
        {statusMsg && !locked && (
          <div className={styles.statusBar}>
            <div className={styles.statusDot} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Last confidence result */}
        {lastConfidence !== null && !locked && mode === 'login' && (
          <div className={styles.confidenceBar}>
            <div className={styles.confidenceHeader}>
              <span className={styles.confidenceLabel}>LAST SCAN CONFIDENCE</span>
              <span className={styles.confidenceValue}
                style={{ color: getConfidenceColor(lastConfidence) }}>
                {lastConfidence}%
              </span>
            </div>
            <div className={styles.confidenceTrack}>
              <div
                className={styles.confidenceFill}
                style={{
                  width: `${lastConfidence}%`,
                  background: getConfidenceColor(lastConfidence),
                }}
              />
              {/* Threshold marker at 50% */}
              <div className={styles.thresholdMarker}>
                <div className={styles.thresholdLine} />
                <span className={styles.thresholdLabel}>50% MIN</span>
              </div>
            </div>
            <p className={styles.confidenceHint}>
              {lastConfidence >= 75 ? '✅ High confidence — excellent match' :
               lastConfidence >= 50 ? '⚠️ Borderline — try better lighting' :
               '❌ Too low — ensure face is clear and well-lit'}
            </p>
          </div>
        )}

        {!locked && (
          <>
            {/* Tab switcher */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'camera' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('camera')}
              >
                📷 Camera
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'upload' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                📁 Upload Photo
              </button>
            </div>

            {/* Camera tab */}
            {activeTab === 'camera' && (
              <div className={styles.cameraWrap}>
                {cameraError ? (
                  <div className={styles.cameraError}>
                    <span className={styles.errorIcon}>📷</span>
                    <p>{cameraError}</p>
                    <Button variant="secondary" size="sm" onClick={startCamera}>Retry Camera</Button>
                  </div>
                ) : captured ? (
                  <>
                    <img src={captured} alt="Captured" className={styles.preview} />
                    <div className={styles.successBadge}>✅ FACE SCANNED</div>
                  </>
                ) : (
                  <video ref={videoRef} className={styles.video} autoPlay muted playsInline />
                )}
                {!captured && !cameraError && (
                  <div className={styles.faceGuide}>
                    <div className={styles.faceOval} />
                    <p className={styles.guideText}>Centre your face</p>
                  </div>
                )}
                {!captured && cameraReady && (
                  <div className={styles.liveIndicator}>
                    <div className={styles.liveDot} /><span>LIVE</span>
                  </div>
                )}
              </div>
            )}

            {/* Upload tab */}
            {activeTab === 'upload' && (
              <div className={styles.cameraWrap}>
                {captured ? (
                  <>
                    <img src={captured} alt="Uploaded" className={styles.preview} />
                    <div className={styles.successBadge}>✅ FACE DETECTED</div>
                  </>
                ) : (
                  <div
                    className={`${styles.uploadZone} ${dragOver ? styles.dragOver : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className={styles.uploadIcon}>📁</div>
                    <p className={styles.uploadText}>Click to upload or drag & drop</p>
                    <p className={styles.uploadSub}>JPG, PNG, WEBP — max 10MB</p>
                    <p className={styles.uploadSub}>Use a clear, front-facing photo</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handleFileInput} />
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Tips */}
            <div className={styles.tips}>
              <span className={styles.tip}>💡 Bright lighting</span>
              <span className={styles.tip}>👁️ Look straight ahead</span>
              <span className={styles.tip}>🚫 No glasses/mask</span>
              <span className={styles.tip}>😐 Neutral expression</span>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              {activeTab === 'camera' && !captured && (
                <Button variant="primary" size="lg" fullWidth
                  onClick={capturePhoto}
                  disabled={!cameraReady || !!cameraError || !modelsLoaded || !!statusMsg}>
                  {statusMsg ? `⏳ ${statusMsg}` : '📸 SCAN FACE'}
                </Button>
              )}

              {activeTab === 'upload' && !captured && (
                <Button variant="primary" size="lg" fullWidth
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!modelsLoaded || !!statusMsg}>
                  {statusMsg ? `⏳ ${statusMsg}` : '📁 CHOOSE PHOTO'}
                </Button>
              )}

              {captured && descriptor && (
                <>
                  <Button variant="secondary" size="md" onClick={retake}>↺ RETAKE</Button>
                  <Button variant="primary" size="lg" loading={loading}
                    onClick={handleSubmit} style={{ flex: 1 }}>
                    {loading
                      ? (statusMsg || 'PROCESSING...')
                      : mode === 'register'
                        ? 'REGISTER FACE ✓'
                        : 'VERIFY IDENTITY →'}
                  </Button>
                </>
              )}

              {captured && !descriptor && (
                <Button variant="danger" size="lg" fullWidth onClick={retake}>
                  ↺ NO FACE FOUND — RETAKE
                </Button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
