import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './CustomerNavbar.module.css';

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link to="/app/welcome">
          <span className={styles.brandIcon}>🚗</span>
          <span className={styles.brandText}>FUELWATCH</span>
        </Link>
      </div>
      <ul className={styles.navList}>
        <li>
          <Link to="/app/welcome" className={styles.navLink}>
            <span>🏠</span>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/user-type" className={styles.navLink}>
            <span>🔍</span>
            <span>Find Station</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className={styles.navLink}>
            <span>👤</span>
            <span>Profile</span>
          </Link>
        </li>
        {user && (
          <li className={styles.userInfo}>
            <span className={styles.userName}>{user.name || user.email}</span>
          </li>
        )}
        <li>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default CustomerNavbar;

