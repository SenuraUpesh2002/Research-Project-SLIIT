import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button onClick={toggleSidebar} className={styles.closeButton}>X</button>
      <ul className={styles.navList}>
        <li><Link to="/admin/dashboard" onClick={toggleSidebar}>Dashboard</Link></li>
        <li><Link to="/admin/submissions" onClick={toggleSidebar}>Submissions</Link></li>
        <li><Link to="/admin/duplicates" onClick={toggleSidebar}>Duplicates</Link></li>
        <li><Link to="/admin/alerts" onClick={toggleSidebar}>Alerts</Link></li>
        <li><Link to="/admin/reports" onClick={toggleSidebar}>Reports</Link></li>
        <li><Link to="/admin/users" onClick={toggleSidebar}>Users</Link></li>
        <li><Link to="/admin/login" onClick={toggleSidebar}>Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
