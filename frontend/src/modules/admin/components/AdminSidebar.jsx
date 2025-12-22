import { Link, useLocation } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Submissions', path: '/admin/submissions', icon: '📝' },
    { name: 'Duplicates', path: '/admin/duplicates', icon: '📋' },
    { name: 'Alerts', path: '/admin/alerts', icon: '⚠️' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span>
        <span className={styles.logoText}>EV Charging</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <p className={styles.navLabel}>Main</p>
          {menuItems.slice(0, 3).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navName}>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className={styles.navSection}>
          <p className={styles.navLabel}>Reports</p>
          {menuItems.slice(3).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navName}>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>👤</div>
          <div>
            <div className={styles.userName}>Admin</div>
            <div className={styles.userEmail}>admin@test.com</div>
          </div>
        </div>
        <button className={styles.logoutBtn}>🚪</button>
      </div>
    </aside>
  );
}
