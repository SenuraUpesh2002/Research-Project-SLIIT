import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.topbar}>
          <h1 className={styles.topbarTitle}>Admin User</h1>
        </div>
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
