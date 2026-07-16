import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectionById, getCandidates, castVote } from '../api/services';
import { Badge, Button, Spinner, Modal } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Vote.module.css';

// ✅ 3D Tilt Card Wrapper
function TiltCard({ children, selected, onClick, delay }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card   = cardRef.current;
    if (!card) return;
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) *  10;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${selected ? 1.04 : 1.02})
      translateZ(10px)
    `;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = selected
      ? 'perspective(1000px) scale(1.03) translateZ(8px)'
      : 'perspective(1000px) scale(1) translateZ(0px)';
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition:   'transform 0.15s ease, box-shadow 0.3s ease',
        transform:    selected
          ? 'perspective(1000px) scale(1.03) translateZ(8px)'
          : 'perspective(1000px) scale(1)',
        boxShadow: selected
          ? '0 20px 60px rgba(0, 255, 200, 0.35), 0 0 30px rgba(0, 255, 200, 0.15)'
          : '0 8px 32px rgba(0,0,0,0.3)',
        animationDelay: `${delay}s`,
        cursor: 'pointer',
        borderRadius: '16px',
      }}
    >
      {children}
    </div>
  );
}

// ✅ Vote success animation overlay
function VoteSuccess({ candidate }) {
  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      background:     'rgba(0,0,0,0.85)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      zIndex:         9999,
      animation:      'fadeIn 0.4s ease',
    }}>
      <div style={{
        fontSize:  '80px',
        animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>✅</div>
      <h2 style={{
        color:         '#10d48e',
        fontSize:      '24px',
        fontWeight:    'bold',
        letterSpacing: '4px',
        marginTop:     '16px',
        animation:     'slideUp 0.5s ease 0.2s both',
      }}>VOTE TRANSMITTED!</h2>
      <p style={{
        color:      '#80cbc4',
        marginTop:  '8px',
        fontSize:   '14px',
        animation:  'slideUp 0.5s ease 0.3s both',
      }}>Your vote for <strong style={{ color: '#fff' }}>{candidate}</strong> is now on the blockchain</p>
      <div style={{
        marginTop:  '24px',
        fontSize:   '32px',
        animation:  'pulse 0.8s ease infinite',
      }}>🔗⛓️🔗</div>
    </div>
  );
}

export default function Vote() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [election,   setElection]   = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [casting,    setCasting]    = useState(false);
  const [confirm,    setConfirm]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [pageReady,  setPageReady]  = useState(false);

  useEffect(() => {
    Promise.all([getElectionById(id), getCandidates()])
      .then(([eRes, cRes]) => {
        setElection(eRes.data);
        setCandidates(cRes.data.filter(c => c.election?.id === Number(id)));
        // ✅ Trigger page entrance animation
        setTimeout(() => setPageReady(true), 100);
      })
      .catch(() => toast.error('Failed to load election'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCast = async () => {
    setCasting(true);
    try {
      await castVote(Number(id), selected);
      setConfirm(false);
      // ✅ Show success overlay
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        toast.success('✅ Vote cast on the blockchain!');
        navigate('/elections');
      }, 2500);
    } catch (err) {
      toast.error(err.response?.data || 'Failed to cast vote');
      setCasting(false);
      setConfirm(false);
    }
  };

  if (loading) return <div className={styles.page}><GalaxyBg /><Spinner /></div>;
  if (!election) return <div className={styles.page}><p>Election not found.</p></div>;

  const selectedCandidate = candidates.find(c => c.id === selected);

  return (
    <div className={styles.page}>
      <GalaxyBg />

      {/* ✅ Vote success overlay */}
      {success && <VoteSuccess candidate={selectedCandidate?.name} />}

      <div className={styles.content} style={{
        opacity:    pageReady ? 1 : 0,
        transform:  pageReady ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>

        {/* Back button with hover effect */}
        <button className={styles.back}
          onClick={() => navigate('/elections')}
          style={{ transition: 'all 0.2s ease' }}
          onMouseEnter={e => e.target.style.transform = 'translateX(-4px)'}
          onMouseLeave={e => e.target.style.transform = 'translateX(0)'}>
          ← BACK TO ELECTIONS
        </button>

        {/* Header slide in */}
        <div className={styles.header} style={{
          animation: 'slideDown 0.6s ease 0.2s both',
        }}>
          <Badge color={election.status?.toUpperCase() === 'ACTIVE' ? 'active' : 'default'}>
            {election.status}
          </Badge>
          <h1 className={styles.title}>{election.name || election.title}</h1>
          <p className={styles.sub}>
            Select your candidate. Your vote is immutable once cast on the blockchain.
          </p>
        </div>

        {/* ✅ 3D Candidate Cards Grid */}
        <div className={styles.grid}>
          {candidates.length === 0 ? (
            <p className={styles.empty}>No candidates registered for this election.</p>
          ) : candidates.map((c, i) => (
            <TiltCard
              key={c.id}
              selected={selected === c.id}
              onClick={() => setSelected(c.id)}
              delay={i * 0.1}
            >
              <div
                className={`${styles.candidateCard} ${selected === c.id ? styles.selected : ''}`}
                style={{
                  background: selected === c.id
                    ? 'linear-gradient(135deg, rgba(0,255,200,0.15), rgba(0,150,136,0.1))'
                    : 'rgba(255,255,255,0.03)',
                  border: selected === c.id
                    ? '1.5px solid rgba(0,255,200,0.6)'
                    : '1.5px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding:      '24px',
                  position:     'relative',
                  overflow:     'hidden',
                  animation:    `slideUp 0.5s ease ${i * 0.1}s both`,
                }}>

                {/* ✅ Shimmer effect on selected */}
                {selected === c.id && (
                  <div style={{
                    position:   'absolute',
                    inset:      0,
                    background: 'linear-gradient(135deg, transparent 40%, rgba(0,255,200,0.05) 50%, transparent 60%)',
                    animation:  'shimmer 2s ease infinite',
                  }} />
                )}

                <div className={styles.cardGlowLine} />

                {/* Avatar with glow on select */}
                <div className={styles.candidateAvatar} style={
                  selected === c.id ? {
                    background: 'linear-gradient(135deg, #00ffc8, #00897b)',
                    boxShadow:  '0 0 20px rgba(0,255,200,0.5)',
                    color:      '#000',
                    transform:  'scale(1.1)',
                    transition: 'all 0.3s ease',
                  } : { transition: 'all 0.3s ease' }
                }>
                  {c.name.charAt(0).toUpperCase()}
                </div>

                <div className={styles.candidateInfo}>
                  <h3 className={styles.candidateName}>{c.name}</h3>
                  {c.party && <p className={styles.candidateParty}>{c.party}</p>}
                </div>

                {/* ✅ Animated radio button */}
                <div className={styles.radioOuter} style={{
                  border: selected === c.id
                    ? '2px solid #00ffc8'
                    : '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  boxShadow: selected === c.id
                    ? '0 0 10px rgba(0,255,200,0.4)'
                    : 'none',
                }}>
                  {selected === c.id && (
                    <div className={styles.radioInner} style={{
                      background: '#00ffc8',
                      animation:  'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    }} />
                  )}
                </div>

              </div>
            </TiltCard>
          ))}
        </div>

        {/* ✅ Animated submit button */}
        <div className={styles.actions} style={{
          animation: 'slideUp 0.6s ease 0.4s both',
        }}>
          {selected && (
            <p style={{
              color:         '#80cbc4',
              fontSize:      '13px',
              marginBottom:  '12px',
              textAlign:     'center',
              animation:     'fadeIn 0.4s ease',
              letterSpacing: '1px',
            }}>
              ✅ {selectedCandidate?.name} selected — ready to transmit
            </p>
          )}
          <Button
            variant="primary"
            size="lg"
            disabled={!selected}
            onClick={() => setConfirm(true)}
            style={{
              transform:  selected ? 'scale(1)' : 'scale(0.98)',
              opacity:    selected ? 1 : 0.5,
              transition: 'all 0.3s ease',
              boxShadow:  selected ? '0 0 30px rgba(0,255,200,0.3)' : 'none',
            }}>
            TRANSMIT VOTE TO BLOCKCHAIN →
          </Button>
        </div>

        {/* ✅ Enhanced confirm modal */}
        <Modal open={confirm} onClose={() => setConfirm(false)} title="CONFIRM TRANSMISSION">
          <div className={styles.confirmContent} style={{
            animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div className={styles.confirmIcon} style={{
              animation: 'float 2s ease infinite',
            }}>🛰️</div>

            <p className={styles.confirmText}>
              You are transmitting your vote for{' '}
              <strong style={{ color: '#00ffc8' }}>{selectedCandidate?.name}</strong>
              {selectedCandidate?.party && ` (${selectedCandidate.party})`}{' '}
              in <strong>{election.name || election.title}</strong>.
            </p>

            <p className={styles.confirmWarn}>
              ⚠️ This action will be permanently recorded on the blockchain and cannot be undone.
            </p>

            <div className={styles.confirmActions}>
              <Button variant="ghost" onClick={() => setConfirm(false)}>ABORT</Button>
              <Button variant="primary" loading={casting} onClick={handleCast}>
                CONFIRM TRANSMISSION
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      {/* ✅ Global animations */}
      <style>{`
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
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1);   }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%);  }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}