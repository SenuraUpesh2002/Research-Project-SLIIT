// frontend/src/modules/admin/components/AdminLayout.jsx

import React from 'react'; // <-- Add this import
import { Link, useMatch, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const isActive = (path) => {
    return useMatch(`/admin/${path}`);
  };

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Only redirect if NOT on an admin route AND not already on the login page
    if (!location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [location, navigate]);

  return (
    <div className={styles.adminLayout}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Fuel Watch Logo" />
        </div>
        <ul className={styles.navList}>
          <li>
            <Link 
              to="/admin/dashboard" 
              className={isActive('dashboard') ? styles.active : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/submissions" 
              className={isActive('submissions') ? styles.active : ''}
            >
              Submissions
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/alerts" 
              className={isActive('alerts') ? styles.active : ''}
            >
              Alerts
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/analytics" 
              className={isActive('analytics') ? styles.active : ''}
            >
              Analytics
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users" 
              className={isActive('users') ? styles.active : ''}
            >
              Users
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.topbar}>
          <h1 className={styles.topbarTitle}>Admin Dashboard</h1>
        </div>
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;