import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResult, getElectionById, getCandidates } from '../api/services';
import { Badge, Spinner } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import styles from './Results.module.css';

// ✅ Confetti particle component
function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors  = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98'];
    const particles = Array.from({ length: 150 }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height - canvas.height,
      w:       Math.random() * 10 + 5,
      h:       Math.random() * 6 + 3,
      color:   colors[Math.floor(Math.random() * colors.length)],
      speed:   Math.random() * 3 + 2,
      angle:   Math.random() * 360,
      spin:    Math.random() * 4 - 2,
      opacity: Math.random() * 0.8 + 0.2,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y     += p.speed;
        p.angle += p.spin;
        p.opacity -= 0.002;
        if (p.y > canvas.height || p.opacity <= 0) {
          p.y       = -20;
          p.x       = Math.random() * canvas.width;
          p.opacity = Math.random() * 0.8 + 0.2;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    // Stop after 6 seconds
    const stop = setTimeout(() => cancelAnimationFrame(animId), 6000);
    return () => { cancelAnimationFrame(animId); clearTimeout(stop); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0,
      pointerEvents: 'none', zIndex: 999
    }} />
  );
}

// ✅ Floating emoji burst
function EmojiBurst() {
  const emojis = ['🎉', '🏆', '👏', '🥳', '⭐', '🎊', '🌟', '🎈'];
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 998 }}>
      {emojis.map((e, i) => (
        <div key={i} style={{
          position:  'absolute',
          fontSize:  `${Math.random() * 20 + 20}px`,
          left:      `${(i * 12) + 5}%`,
          animation: `floatUp 3s ease-out ${i * 0.3}s forwards`,
          bottom:    '-50px',
          opacity:   0,
        }}>{e}</div>
      ))}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Results() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [result,     setResult]     = useState(null);
  const [election,   setElection]   = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [celebrate,  setCelebrate]  = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    Promise.all([getResult(id), getElectionById(id), getCandidates()])
      .then(([rRes, eRes, cRes]) => {
        setResult(rRes.data);
        setElection(eRes.data);
        setCandidates(cRes.data.filter(c => c.election?.id === Number(id)));

        // ✅ Trigger celebration after 800ms
        setTimeout(() => {
          setCelebrate(true);
          setShowWinner(true);
        }, 800);

        // ✅ Stop confetti after 6 seconds
        setTimeout(() => setCelebrate(false), 6000);
      })
      .catch(err => setError(err.response?.data || 'Failed to load results'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.page}><GalaxyBg /><Spinner /></div>;

  // Calculate total votes and percentages
  const totalVotes = candidates.reduce((sum, c) => {
    const votes = result?.voteCounts?.[c.name] || 0;
    return sum + votes;
  }, result?.votes || 0);

  return (
    <div className={styles.page}>
      <GalaxyBg />

      {/* ✅ Celebration effects */}
      {celebrate && <Confetti />}
      {celebrate && <EmojiBurst />}

      <div className={styles.content}>
        <button className={styles.back} onClick={() => navigate('/elections')}>
          ← BACK TO ELECTIONS
        </button>

        <div className={styles.header}>
          <h1 className={styles.title}>{election?.name || election?.title}</h1>
          <Badge color="completed">COMPLETED</Badge>
        </div>

        {error ? (
          <div className={`${styles.candidateRow} ${styles.errorCard}`}>
            <p className={styles.errorMsg}>{error}</p>
          </div>
        ) : result && (
          <>
            {/* ✅ WINNER CELEBRATION CARD */}
            <div className={styles.winnerCard} style={{
              transform:  showWinner ? 'scale(1)'   : 'scale(0.8)',
              opacity:    showWinner ? 1             : 0,
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <div className={styles.winnerGlow} />

              {/* Stars decoration */}
              <div className={styles.winnerStars}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={styles.winnerStar} style={{
                    left:           `${(i * 23 + 10) % 90}%`,
                    top:            `${(i * 17 + 5)  % 80}%`,
                    animationDelay: `${i * 0.3}s`
                  }} />
                ))}
              </div>

              {/* ✅ Animated trophy */}
              <div className={styles.trophyWrap} style={{
                animation: showWinner ? 'trophyBounce 1s ease infinite alternate' : 'none',
              }}>🏆</div>

              {/* ✅ Congratulations text */}
              <div style={{
                fontSize:      '13px',
                letterSpacing: '4px',
                color:         '#FFD700',
                marginBottom:  '8px',
                animation:     'pulse 1.5s ease infinite',
              }}>
                🎉 CONGRATULATIONS 🎉
              </div>

              <p className={styles.winnerLabel}>GALACTIC WINNER</p>
              <h2 className={styles.winnerName}>{result.winner}</h2>

              <div className={styles.votesPill}>
                <span className={styles.votesNum}>{result.votes}</span>
                <span className={styles.votesLabel}>VOTES</span>
              </div>

              {/* ✅ Applause row */}
              <div style={{
                fontSize:   '28px',
                marginTop:  '16px',
                letterSpacing: '8px',
                animation:  'pulse 0.8s ease infinite',
              }}>
                👏 👏 👏
              </div>

              {/* ✅ Win message */}
              <p style={{
                color:      '#80cbc4',
                fontSize:   '13px',
                marginTop:  '12px',
                fontStyle:  'italic',
              }}>
                "{result.winner} has won the {election?.name || election?.title}!"
              </p>
            </div>

            {/* ✅ Candidates with vote bars */}
            {candidates.length > 0 && (
              <div>
                <p className={styles.sectionTitle}>All Candidates</p>
                <div className={styles.candidateList}>
                  {candidates
                    .sort((a, b) => {
                      // Sort winner first
                      if (a.name === result.winner) return -1;
                      if (b.name === result.winner) return 1;
                      return 0;
                    })
                    .map((c, i) => {
                      const isWinner  = c.name === result.winner;
                      const voteCount = isWinner ? result.votes : 0;
                      const pct       = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                      return (
                        <div key={c.id}
                          className={`${styles.candidateRow} ${isWinner ? styles.winnerRow : ''}`}
                          style={{ animationDelay: `${i * 0.08}s` }}>

                          {/* Rank */}
                          <div className={styles.rank}>
                            {isWinner ? '🥇' : i === 1 ? '🥈' : '🥉'}
                          </div>

                          {/* Avatar */}
                          <div className={styles.avatar}
                            style={isWinner ? { background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000' } : {}}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>

                          {/* Info */}
                          <div className={styles.cInfo} style={{ flex: 1 }}>
                            <p className={styles.cName}>{c.name}</p>
                            {c.party && <p className={styles.cParty}>{c.party}</p>}

                            {/* ✅ Vote progress bar */}
                            {isWinner && (
                              <div style={{
                                marginTop:   '6px',
                                background:  'rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                height:      '6px',
                                overflow:    'hidden',
                              }}>
                                <div style={{
                                  width:      `${pct}%`,
                                  height:     '100%',
                                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                                  borderRadius: '4px',
                                  transition: 'width 1.5s ease',
                                }} />
                              </div>
                            )}
                          </div>

                          {/* Winner badge */}
                          {isWinner
                            ? <Badge color="active">🏆 WINNER</Badge>
                            : <Badge color="default">CANDIDATE</Badge>
                          }
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ✅ Share / celebrate button */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                onClick={() => { setCelebrate(true); setTimeout(() => setCelebrate(false), 6000); }}
                style={{
                  background:    'linear-gradient(135deg, #FFD700, #FFA500)',
                  border:        'none',
                  borderRadius:  '8px',
                  padding:       '12px 32px',
                  color:         '#000',
                  fontWeight:    'bold',
                  fontSize:      '14px',
                  cursor:        'pointer',
                  letterSpacing: '2px',
                }}>
                🎉 CELEBRATE AGAIN!
              </button>
            </div>
          </>
        )}
      </div>

      {/* ✅ Global keyframe animations */}
      <style>{`
        @keyframes trophyBounce {
          from { transform: translateY(0)    rotate(-5deg); }
          to   { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}