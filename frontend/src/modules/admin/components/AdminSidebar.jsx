import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminSidebar.module.css'; // Import the CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faClipboardList, faChartBar, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        Admin Panel
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <FontAwesomeIcon icon={faUsers} />
              <span>Users</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/admin/submissions" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <FontAwesomeIcon icon={faClipboardList} />
              <span>Submissions</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <FontAwesomeIcon icon={faChartBar} />
              <span>Analytics</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/admin/reports" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <FontAwesomeIcon icon={faChartBar} />
              <span>Reports</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/admin/alerts" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <FontAwesomeIcon icon={faBell} /> {/* Using faBell for alerts */}
              <span>Alerts</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/admin/settings" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <FontAwesomeIcon icon={faCog} />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.footer}>
        <NavLink to="/admin/logout" className={styles.navLink}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;