import GalaxyBg from '../components/GalaxyBg';
import styles from './About.module.css';

const skills = ['Java', 'Spring Boot', 'React', 'JavaScript', 'HTML', 'CSS', 'MySQL', 'C', 'Blockchain'];

const techStack = [
  { icon: '☕', name: 'Java', role: 'Backend Language' },
  { icon: '🌿', name: 'Spring Boot', role: 'Backend Framework' },
  { icon: '⚛️', name: 'React + Vite', role: 'Frontend Framework' },
  { icon: '🔐', name: 'JWT + Spring Security', role: 'Authentication' },
  { icon: '🗄️', name: 'MySQL', role: 'Database' },
  { icon: '⬡', name: 'Blockchain', role: 'SHA-256 Hash Chain' },
  { icon: '👁️', name: 'face-api.js', role: 'Face Recognition' },
  { icon: '📧', name: 'Mailtrap SMTP', role: 'OTP Email Service' },
];

const features = [
  { icon: '⬡', title: 'Blockchain Voting', desc: 'Every vote is recorded as an immutable SHA-256 block — tamper-proof and verifiable.' },
  { icon: '🔐', title: 'JWT Authentication', desc: 'Secure stateless auth with Spring Security and role-based access control.' },
  { icon: '📧', title: 'OTP Verification', desc: '2-Factor authentication via email OTP on every login and registration.' },
  { icon: '👁️', title: 'Face Recognition', desc: 'Browser-based face detection and verification using face-api.js — no external API.' },
];

export default function About() {
  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.content}>

        {/* ── Hero Section ── */}
        <section className={styles.hero}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing1} />
            <div className={styles.avatarRing2} />
            <div className={styles.avatarRing3} />
            <div className={styles.avatar}>VB</div>
            <div className={styles.avatarGlow} />
            {/* Orbiting dot */}
            <div className={styles.orbitDot} />
          </div>

          <div className={styles.heroText}>
            <div className={styles.heroTag}>DEVELOPER · STUDENT · INNOVATOR</div>
            <h1 className={styles.heroName}>Vetrivel<br />Balakrishnan</h1>
            <p className={styles.heroCollege}>
              📍 Muthayammal Engineering College, Rasipuram
            </p>
            <p className={styles.heroBio}>
              IT Student passionate about building secure, real-world systems.
              Created VoteChain to solve the trust problem in traditional elections
              — making every vote 100% secure, transparent and verifiable.
            </p>

            {/* Contact buttons */}
            <div className={styles.contactRow}>
              <a
                href="mailto:vetrisharma4533@gmail.com"
                className={styles.contactBtn}
              >
                <span className={styles.contactIcon}>✉</span>
                <span>Email</span>
              </a>
              <a
                href="https://github.com/Vetri4533"
                target="_blank" rel="noreferrer"
                className={styles.contactBtn}
              >
                <span className={styles.contactIcon}>🐙</span>
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/vetrivel-b-b59583352"
                target="_blank" rel="noreferrer"
                className={`${styles.contactBtn} ${styles.contactBtnLinkedIn}`}
              >
                <span className={styles.contactIcon}>💼</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Skills Section ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLine} />
            <h2 className={styles.sectionTitle}>SKILL SET</h2>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.skillsGrid}>
            {skills.map((skill, i) => (
              <div
                key={skill}
                className={styles.skillChip}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={styles.skillDot} />
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* ── About Project Section ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLine} />
            <h2 className={styles.sectionTitle}>THE PROJECT</h2>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.projectCard}>
            <div className={styles.projectCardGlow} />
            <div className={styles.projectTop}>
              <div className={styles.projectIcon}>⬡</div>
              <div>
                <h3 className={styles.projectName}>VoteChain</h3>
                <p className={styles.projectTagline}>Blockchain-Powered Voting System</p>
              </div>
            </div>
            <p className={styles.projectDesc}>
              Traditional offline elections cannot guarantee 100% security or accurate results.
              Votes can be manipulated, miscounted, or lost. <strong>VoteChain</strong> solves this
              by recording every vote as an immutable block in a SHA-256 hash chain.
              Once cast, a vote cannot be altered — the entire chain would break.
              Every citizen can verify the integrity of the election in real time.
            </p>
            <div className={styles.projectStats}>
              <div className={styles.projectStat}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>SECURE</span>
              </div>
              <div className={styles.projectStatDivider} />
              <div className={styles.projectStat}>
                <span className={styles.statNum}>SHA-256</span>
                <span className={styles.statLabel}>HASH CHAIN</span>
              </div>
              <div className={styles.projectStatDivider} />
              <div className={styles.projectStat}>
                <span className={styles.statNum}>3-LAYER</span>
                <span className={styles.statLabel}>AUTH</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Features ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLine} />
            <h2 className={styles.sectionTitle}>KEY FEATURES</h2>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className={styles.featureCard}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={styles.featureCardLine} />
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLine} />
            <h2 className={styles.sectionTitle}>TECH STACK</h2>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.techGrid}>
            {techStack.map((t, i) => (
              <div
                key={t.name}
                className={styles.techCard}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={styles.techIcon}>{t.icon}</div>
                <div>
                  <p className={styles.techName}>{t.name}</p>
                  <p className={styles.techRole}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer Contact ── */}
        <section className={styles.footerSection}>
          <div className={styles.footerGlow} />
          <h2 className={styles.footerTitle}>GET IN TOUCH</h2>
          <p className={styles.footerSub}>Feel free to connect or collaborate</p>
          <div className={styles.footerLinks}>
            <a href="mailto:vetrisharma4533@gmail.com" className={styles.footerLink}>
              <span>✉</span> vetrisharma4533@gmail.com
            </a>
            <a href="https://github.com/Vetri4533" target="_blank" rel="noreferrer" className={styles.footerLink}>
              <span>🐙</span> github.com/Vetri4533
            </a>
            <a href="https://www.linkedin.com/in/vetrivel-b-b59583352" target="_blank" rel="noreferrer" className={styles.footerLink}>
              <span>💼</span> linkedin.com/in/vetrivel-b
            </a>
          </div>
          <p className={styles.footerCopy}>
            © 2025 Vetrivel Balakrishnan · Built with ☕ Java, ⚛️ React & ⬡ Blockchain
          </p>
        </section>

      </div>
    </div>
  );
}
