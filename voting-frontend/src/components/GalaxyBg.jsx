import styles from './GalaxyBg.module.css';


export default function GalaxyBg() {
  return (
    <div className={styles.galaxyBg} aria-hidden="true">
      {/* Nebula clouds */}
      <div className={`${styles.nebula} ${styles.nebula1}`} />
      <div className={`${styles.nebula} ${styles.nebula2}`} />
      <div className={`${styles.nebula} ${styles.nebula3}`} />

      {/* Shooting stars */}
      <div className={`${styles.shootingStar} ${styles.ss1}`} />
      <div className={`${styles.shootingStar} ${styles.ss2}`} />
      <div className={`${styles.shootingStar} ${styles.ss3}`} />

      {/* Twinkling stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={styles.twinkleStar}
          style={{
            left:  `${(i * 37 + 5) % 100}%`,
            top:   `${(i * 23 + 8) % 100}%`,
            animationDelay: `${i * 0.4}s`,
            width:  i % 3 === 0 ? '2px' : '1px',
            height: i % 3 === 0 ? '2px' : '1px',
          }}
        />
      ))}
    </div>
  );
}
