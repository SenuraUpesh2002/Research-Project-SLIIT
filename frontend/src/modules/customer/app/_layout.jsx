import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './_layout.module.css';

export default function CustomerLayout() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Customer Portal</h1>
      </header>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
