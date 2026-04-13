import styles from './UI.module.css';

export function Button({ children, variant = 'primary', size = 'md', loading, onClick, type = 'button', disabled, fullWidth, style }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.full : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  );
}

export function Card({ children, className = '', glow, style }) {
  return (
    <div className={`${styles.card} ${glow ? styles.cardGlow : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Badge({ children, color = 'default' }) {
  return <span className={`${styles.badge} ${styles[`badge_${color}`]}`}>{children}</span>;
}

export function Spinner() {
  return (
    <div className={styles.spinnerWrap}>
      <div className={styles.spinnerRing} />
      <div className={styles.spinnerCore} />
    </div>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.inputError : ''}`} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export function Select({ label, children, error, ...props }) {
  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={`${styles.input} ${error ? styles.inputError : ''}`} {...props}>
        {children}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, message }) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon}>{icon}</span>
      <p>{message}</p>
    </div>
  );
}
