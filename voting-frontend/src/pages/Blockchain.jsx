import { useState } from 'react';
import { verifyBlockchain } from '../api/services';
import { Button, Card } from '../components/UI';
import GalaxyBg from '../components/GalaxyBg';
import styles from './Blockchain.module.css';

export default function Blockchain() {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true); setStatus(null);
    try {
      await verifyBlockchain();
      setStatus('valid');
    } catch {
      setStatus('invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.content}>

        <div className={styles.header}>
          <div className={styles.headerIcon}>⬡</div>
          <div>
            <h1 className={styles.title}>BLOCKCHAIN INTEGRITY</h1>
            <p className={styles.sub}>Verify the SHA-256 hash chain across all votes</p>
          </div>
        </div>

        {/* Chain visualisation */}
        <div className={styles.chainViz}>
          {[
            { label: 'GENESIS', hash: '0000000', prev: '—' },
            { label: 'BLOCK 1', hash: 'a3f8c21', prev: '0000000' },
            { label: 'BLOCK 2', hash: 'b9d42e7', prev: 'a3f8c21' },
            { label: 'BLOCK N', hash: '···', prev: 'b9d42e7' },
          ].map((block, i) => (
            <div key={i} className={styles.blockGroup} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`${styles.block}
                ${status === 'valid' ? styles.blockValid : ''}
                ${status === 'invalid' ? styles.blockInvalid : ''}`}>
                <div className={styles.blockLabel}>{block.label}</div>
                <div className={styles.blockField}>
                  <span className={styles.fieldKey}>HASH</span>
                  <span className={styles.fieldVal}>{block.hash}</span>
                </div>
                <div className={styles.blockField}>
                  <span className={styles.fieldKey}>PREV</span>
                  <span className={styles.fieldVal}>{block.prev}</span>
                </div>
              </div>
              {i < 3 && (
                <div className={`${styles.chainLink} ${status === 'valid' ? styles.linkValid : ''}`}>
                  <div className={styles.linkLine} />
                  <div className={styles.linkArrow}>▶</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Verify card */}
        <div className={styles.verifyCard}>
          <div className={styles.verifyLeft}>
            <h2 className={styles.verifyTitle}>RUN CHAIN VERIFICATION</h2>
            <p className={styles.verifyDesc}>
              Recalculates every SHA-256 hash in the vote chain and confirms
              the <code>previousHash</code> link is unbroken from genesis to latest block.
              Any tampering instantly breaks the chain.
            </p>
            <Button variant="primary" size="lg" loading={loading} onClick={handleVerify}>
              ⬡ VERIFY BLOCKCHAIN
            </Button>
          </div>

          {status && (
            <div className={`${styles.result} ${status === 'valid' ? styles.resultValid : styles.resultInvalid}`}>
              <div className={styles.resultIcon}>{status === 'valid' ? '✅' : '❌'}</div>
              <div>
                <p className={styles.resultTitle}>
                  {status === 'valid' ? 'CHAIN INTACT' : 'CHAIN CORRUPTED'}
                </p>
                <p className={styles.resultDesc}>
                  {status === 'valid'
                    ? 'All hashes verified. No tampering detected.'
                    : 'Hash mismatch found. Data may be compromised.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className={styles.infoGrid}>
          {[
            { icon: '🔒', title: 'SHA-256 HASHING', desc: 'Each vote hashed with user ID, election ID, candidate ID and timestamp.' },
            { icon: '⛓️', title: 'CHAIN LINKING', desc: 'Every block stores the previous hash — one change breaks everything.' },
            { icon: '🔍', title: 'TAMPER DETECTION', desc: 'Any modification is instantly detectable across the entire chain.' },
          ].map((item, i) => (
            <div key={i} className={styles.infoCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.infoCardLine} />
              <div className={styles.infoIcon}>{item.icon}</div>
              <h3 className={styles.infoTitle}>{item.title}</h3>
              <p className={styles.infoDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
