import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar'; // Assuming Sidebar is in components
import Navbar from '../../../components/Navbar'; // Assuming Navbar is in components
import styles from './AdminLayout.module.css'; // Assuming a CSS module for styling

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Navbar />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
