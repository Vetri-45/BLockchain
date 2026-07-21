import GalaxyBg from '../components/GalaxyBg';
import styles from './About.module.css';

// ─── Shared Project Data ────────────────────────────────────────────────────

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

// ─── Team Members ───────────────────────────────────────────────────────────

const teamMembers = [
  {
    number: '01',
    initials: 'VB',
    firstName: 'Vetrivel',
    lastName: 'Balakrishnan',
    tag: 'DEVELOPER · STUDENT · INNOVATOR',
    role: 'Full Stack Developer & Project Lead',
    college: '📍 Muthayammal Engineering College, Rasipuram',
    bio: 'IT Student passionate about building secure, real-world systems. Created VoteChain to solve the trust problem in traditional elections — making every vote 100% secure, transparent and verifiable.',
    skills: ['Java', 'Spring Boot', 'React', 'JavaScript', 'HTML', 'CSS', 'MySQL', 'C', 'Blockchain'],
    email: 'vetrisharma4533@gmail.com',
    github: { url: 'https://github.com/Vetri4533', label: 'github.com/Vetri4533' },
    linkedin: { url: 'https://www.linkedin.com/in/vetrivel-b-b59583352', label: 'linkedin.com/in/vetrivel-b' },
  },
  {
    number: '02',
    initials: 'VE',
    firstName: 'Vishnu',
    lastName: 'Elango',
    tag: 'DEVELOPER · STUDENT · CREATOR',
    role: 'Frontend Developer & UI Designer',
    college: '📍 Muthayammal Engineering College, Rasipuram',
    bio: 'IT Student with a flair for building elegant, responsive interfaces. Brought VoteChain\'s frontend to life — crafting smooth user flows and pixel-precise components that make secure democratic voting feel intuitive, modern, and accessible to every citizen.',
    skills: ['React', 'Vite', 'JavaScript', 'HTML', 'CSS', 'UI/UX', 'Figma', 'Responsive Design'],
    email: 'vishnuelango23@gmail.com',          // ← update
    github: { url: 'https://github.com/vishnu-2311', label: 'github.com/VishnuElango' },   // ← update
    linkedin: { url: 'https://www.linkedin.com/in/vishnu-e-478411338?utm_source=share_via&utm_content=profile&utm_medium=member_android', label: 'linkedin.com/in/vishnu-elango' }, // ← update
  },
  {
    number: '03',
    initials: 'UV',
    firstName: 'Udhayasuriya',
    lastName: 'Vellaiyan',
    tag: 'DEVELOPER · STUDENT · ARCHITECT',
    role: 'Backend Developer & Database Engineer',
    college: '📍 Muthayammal Engineering College, Rasipuram',
    bio: 'IT Student with a strong command of backend systems and database architecture. Engineered VoteChain\'s data backbone — designing optimized MySQL schemas, building reliable REST APIs, and ensuring every vote transaction is stored with surgical precision and zero compromise.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'Spring Security', 'JDBC', 'C', 'SQL'],
    email: 'udhayasuriyavellaiyan@gmail.com',          // ← update
    github: { url: 'https://github.com/suriya1572007', label: 'github.com/UdhayasuriyaV' },   // ← update
    linkedin: { url: 'https://www.linkedin.com/in/udhayasuriya-v-137420338?utm_source=share_via&utm_content=profile&utm_medium=member_android', label: 'linkedin.com/in/udhayasuriya-v' }, // ← update
  },
];

// ─── Member Section Component ────────────────────────────────────────────────

function MemberSection({ member }) {
  return (
    <div className={styles.memberBlock}>

      {/* Member number strip */}
      <div className={styles.memberNumberStrip}>
        <span className={styles.memberNumberLabel}>TEAM MEMBER</span>
        <span className={styles.memberNumberBadge}>{member.number}</span>
        <div className={styles.memberNumberLine} />
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatarRing1} />
          <div className={styles.avatarRing2} />
          <div className={styles.avatarRing3} />
          <div className={styles.avatar}>{member.initials}</div>
          <div className={styles.avatarGlow} />
          <div className={styles.orbitDot} />
        </div>

        <div className={styles.heroText}>
          <div className={styles.heroTag}>{member.tag}</div>
          <h1 className={styles.heroName}>
            {member.firstName}<br />{member.lastName}
          </h1>
          {/* Role badge — enhanced addition */}
          <div className={styles.memberRoleBadge}>
            <span className={styles.memberRoleDot} />
            {member.role}
          </div>
          <p className={styles.heroCollege}>{member.college}</p>
          <p className={styles.heroBio}>{member.bio}</p>

          <div className={styles.contactRow}>
            {member.email && (
              <a href={`mailto:${member.email}`} className={styles.contactBtn}>
                <span className={styles.contactIcon}>✉</span>
                <span>Email</span>
              </a>
            )}
            <a
              href={member.github.url}
              target="_blank" rel="noreferrer"
              className={styles.contactBtn}
            >
              <span className={styles.contactIcon}>🐙</span>
              <span>GitHub</span>
            </a>
            <a
              href={member.linkedin.url}
              target="_blank" rel="noreferrer"
              className={`${styles.contactBtn} ${styles.contactBtnLinkedIn}`}
            >
              <span className={styles.contactIcon}>💼</span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Skill Set */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLine} />
          <h2 className={styles.sectionTitle}>SKILL SET</h2>
          <div className={styles.sectionLine} />
        </div>
        <div className={styles.skillsGrid}>
          {member.skills.map((skill, i) => (
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

    </div>
  );
}

// ─── Divider between members ─────────────────────────────────────────────────

function MemberDivider() {
  return (
    <div className={styles.memberDivider}>
      <div className={styles.memberDividerLine} />
      <div className={styles.memberDividerIcon}>⬡</div>
      <div className={styles.memberDividerLine} />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.content}>

        {/* ── MEET THE TEAM header ── */}
        <div className={styles.teamHeader}>
          <div className={styles.teamHeaderLine} />
          <div className={styles.teamHeaderInner}>
            <span className={styles.teamHeaderEye}>⬡</span>
            <h2 className={styles.teamHeaderTitle}>MEET THE TEAM</h2>
            <span className={styles.teamHeaderEye}>⬡</span>
          </div>
          <p className={styles.teamHeaderSub}>The builders behind VoteChain</p>
          <div className={styles.teamHeaderLine} />
        </div>

        {/* ── All three members ── */}
        {teamMembers.map((member, i) => (
          <div key={member.number}>
            <MemberSection member={member} />
            {i < teamMembers.length - 1 && <MemberDivider />}
          </div>
        ))}

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

        {/* ── Footer ── */}
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
            © 2025 VoteChain Team · Built with ☕ Java, ⚛️ React & ⬡ Blockchain
          </p>
        </section>

      </div>
    </div>
  );
}