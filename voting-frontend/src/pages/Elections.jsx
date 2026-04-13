import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getElections } from '../api/services';
import { Badge, Button, Spinner, EmptyState } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import styles from './Elections.module.css';

function statusColor(s) {
  if (!s) return 'default';
  const u = s.toUpperCase();
  if (u === 'ACTIVE') return 'active';
  if (u === 'COMPLETED') return 'completed';
  return 'pending';
}

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getElections().then(r => setElections(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.page}><GalaxyBg /><Spinner /></div>;

  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.content}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>🗳️</div>
            <div>
              <h1 className={styles.title}>ELECTIONS</h1>
              <p className={styles.sub}>Active missions across the galaxy</p>
            </div>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{elections.length}</span>
              <span className={styles.statLabel}>TOTAL</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum} style={{ color: 'var(--success)' }}>
                {elections.filter(e => e.status?.toUpperCase() === 'ACTIVE').length}
              </span>
              <span className={styles.statLabel}>ACTIVE</span>
            </div>
          </div>
        </div>

        {elections.length === 0 ? (
          <EmptyState icon="🌌" message="No elections in this galaxy yet." />
        ) : (
          <div className={styles.grid}>
            {elections.map((e, i) => (
              <div key={e.id} className={styles.electionCard} style={{ animationDelay: `${i * 0.08}s` }}>
                {/* Card top glow line */}
                <div className={`${styles.cardTopLine} ${e.status?.toUpperCase() === 'ACTIVE' ? styles.activeLine : ''}`} />

                <div className={styles.cardTop}>
                  <Badge color={statusColor(e.status)}>{e.status || 'PENDING'}</Badge>
                  <span className={styles.cardId}>#{String(e.id).padStart(3, '0')}</span>
                </div>

                <h3 className={styles.cardName}>{e.name || e.title}</h3>
                {e.title && e.name !== e.title && (
                  <p className={styles.cardSub}>{e.title}</p>
                )}

                {/* Orbit decoration */}
                <div className={styles.cardOrbit}>
                  <div className={styles.cardOrbitDot} />
                </div>

                <div className={styles.cardActions}>
                  {e.status?.toUpperCase() === 'ACTIVE' && (
                    <Link to={`/vote/${e.id}`}>
                      <Button variant="primary" size="sm">CAST VOTE →</Button>
                    </Link>
                  )}
                  {e.status?.toUpperCase() === 'COMPLETED' && (
                    <Link to={`/results/${e.id}`}>
                      <Button variant="secondary" size="sm">VIEW RESULTS</Button>
                    </Link>
                  )}
                  {(!e.status || e.status.toUpperCase() === 'PENDING') && (
                    <Button variant="ghost" size="sm" disabled>AWAITING LAUNCH</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
