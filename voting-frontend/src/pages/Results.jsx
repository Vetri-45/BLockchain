import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResult, getElectionById, getCandidates } from '../api/services';
import { Badge, Spinner } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import styles from './Results.module.css';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult]       = useState(null);
  const [election, setElection]   = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    Promise.all([getResult(id), getElectionById(id), getCandidates()])
      .then(([rRes, eRes, cRes]) => {
        setResult(rRes.data);
        setElection(eRes.data);
        setCandidates(cRes.data.filter(c => c.election?.id === Number(id)));
      })
      .catch(err => setError(err.response?.data || 'Failed to load results'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.page}><GalaxyBg /><Spinner /></div>;

  return (
    <div className={styles.page}>
      <GalaxyBg />
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
            <div className={styles.winnerCard}>
              <div className={styles.winnerGlow} />
              {/* Twinkling stars decoration */}
              <div className={styles.winnerStars}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={styles.winnerStar} style={{
                    left: `${(i * 23 + 10) % 90}%`,
                    top:  `${(i * 17 + 5) % 80}%`,
                    animationDelay: `${i * 0.3}s`
                  }} />
                ))}
              </div>
              <div className={styles.trophyWrap}>🏆</div>
              <p className={styles.winnerLabel}>GALACTIC WINNER</p>
              <h2 className={styles.winnerName}>{result.winner}</h2>
              <div className={styles.votesPill}>
                <span className={styles.votesNum}>{result.votes}</span>
                <span className={styles.votesLabel}>VOTES</span>
              </div>
            </div>

            {candidates.length > 0 && (
              <div>
                <p className={styles.sectionTitle}>All Candidates</p>
                <div className={styles.candidateList}>
                  {candidates.map((c, i) => {
                    const isWinner = c.name === result.winner;
                    return (
                      <div key={c.id}
                        className={`${styles.candidateRow} ${isWinner ? styles.winnerRow : ''}`}
                        style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className={styles.rank}>#{i + 1}</div>
                        <div className={styles.avatar}>{c.name.charAt(0).toUpperCase()}</div>
                        <div className={styles.cInfo}>
                          <p className={styles.cName}>{c.name}</p>
                          {c.party && <p className={styles.cParty}>{c.party}</p>}
                        </div>
                        {isWinner && <Badge color="active">WINNER</Badge>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
