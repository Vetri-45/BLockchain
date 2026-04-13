import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectionById, getCandidates, castVote } from '../api/services';
import { Badge, Button, Spinner, Modal } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Vote.module.css';

export default function Vote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection]     = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [casting, setCasting]       = useState(false);
  const [confirm, setConfirm]       = useState(false);

  useEffect(() => {
    Promise.all([getElectionById(id), getCandidates()])
      .then(([eRes, cRes]) => {
        setElection(eRes.data);
        setCandidates(cRes.data.filter(c => c.election?.id === Number(id)));
      })
      .catch(() => toast.error('Failed to load election'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCast = async () => {
    setCasting(true);
    try {
      await castVote(Number(id), selected);
      toast.success('✅ Vote cast on the blockchain!');
      navigate('/elections');
    } catch (err) {
      toast.error(err.response?.data || 'Failed to cast vote');
    } finally {
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
      <div className={styles.content}>

        <button className={styles.back} onClick={() => navigate('/elections')}>
          ← BACK TO ELECTIONS
        </button>

        <div className={styles.header}>
          <Badge color={election.status?.toUpperCase() === 'ACTIVE' ? 'active' : 'default'}>
            {election.status}
          </Badge>
          <h1 className={styles.title}>{election.name || election.title}</h1>
          <p className={styles.sub}>Select your candidate. Your vote is immutable once cast on the blockchain.</p>
        </div>

        <div className={styles.grid}>
          {candidates.length === 0 ? (
            <p className={styles.empty}>No candidates registered for this election.</p>
          ) : candidates.map((c, i) => (
            <div
              key={c.id}
              className={`${styles.candidateCard} ${selected === c.id ? styles.selected : ''}`}
              onClick={() => setSelected(c.id)}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={styles.cardGlowLine} />
              <div className={styles.candidateAvatar}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.candidateInfo}>
                <h3 className={styles.candidateName}>{c.name}</h3>
                {c.party && <p className={styles.candidateParty}>{c.party}</p>}
              </div>
              <div className={styles.radioOuter}>
                {selected === c.id && <div className={styles.radioInner} />}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Button variant="primary" size="lg"
            disabled={!selected} onClick={() => setConfirm(true)}>
            TRANSMIT VOTE TO BLOCKCHAIN →
          </Button>
        </div>

        <Modal open={confirm} onClose={() => setConfirm(false)} title="CONFIRM TRANSMISSION">
          <div className={styles.confirmContent}>
            <div className={styles.confirmIcon}>🛰️</div>
            <p className={styles.confirmText}>
              You are transmitting your vote for{' '}
              <strong>{selectedCandidate?.name}</strong>
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
    </div>
  );
}
