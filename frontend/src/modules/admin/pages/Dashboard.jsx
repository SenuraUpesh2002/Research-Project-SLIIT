import React from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Overview of system activities</p>
      </div>
      {/* Dashboard content will go here */}
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
}
