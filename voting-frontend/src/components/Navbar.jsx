import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isActive  = (p) => location.pathname.startsWith(p);

  return (
    <nav className={styles.navbar}>
      <div className={styles.cosmicLine} />

      <Link to="/" className={styles.brand}>
        <div className={styles.brandOrbit}>
          <div className={styles.brandPlanet} />
          <div className={styles.brandRing} />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>VOTECHAIN</span>
          <span className={styles.brandSub}>BLOCKCHAIN VOTING</span>
        </div>
      </Link>

      <div className={styles.links}>
        {user && (
          <>
            <Link to="/elections" className={`${styles.link} ${isActive('/elections') ? styles.active : ''}`}>
              Elections
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin/elections" className={`${styles.link} ${isActive('/admin/elections') ? styles.active : ''}`}>
                  Manage
                </Link>
                <Link to="/admin/candidates" className={`${styles.link} ${isActive('/admin/candidates') ? styles.active : ''}`}>
                  Candidates
                </Link>
                <Link to="/admin/users" className={`${styles.link} ${isActive('/admin/users') ? styles.active : ''}`}>
                  Users
                </Link>
              </>
            )}
            <Link to="/blockchain" className={`${styles.link} ${isActive('/blockchain') ? styles.active : ''}`}>
              ⬡ Chain
            </Link>
          </>
        )}
        {/* About Me — always visible to everyone */}
        <Link to="/about" className={`${styles.link} ${styles.aboutLink} ${isActive('/about') ? styles.active : ''}`}>
          👨‍💻 About
        </Link>
      </div>

      <div className={styles.right}>
        {user ? (
          <>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>{user.sub?.charAt(0).toUpperCase()}</div>
              <div className={styles.userDetails}>
                <span className={styles.username}>{user.sub}</span>
                {isAdmin && <span className={styles.roleBadge}>ADMIN</span>}
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>
              LOGOUT
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.loginBtn}>LAUNCH</Link>
        )}
      </div>
    </nav>
  );
}
