import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

// eslint-disable-next-line react/prop-types
const Navbar = ({ isAdmin = false }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link to={isAdmin ? "/admin/dashboard" : "/"}>
          {isAdmin ? "Admin Dashboard" : "Web App"}
        </Link>
      </div>
      <ul className={styles.navList}>
        {isAdmin ? (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/submissions">Submissions</Link></li>
            <li><Link to="/admin/duplicates">Duplicates</Link></li>
            <li><Link to="/admin/alerts">Alerts</Link></li>
            <li><Link to="/admin/reports">Reports</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/login">Logout</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
