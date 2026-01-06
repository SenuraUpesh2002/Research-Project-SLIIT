import styles from './Analytics.module.css';
import ModelVisualizations from '../components/ModelVisualizations';
import AdminSidebar from '../components/AdminSidebar';

window.addEventListener('unhandledrejection', (e) => {
  if (e?.reason?.message?.includes('Could not establish connection. Receiving end does not exist')) {
    e.preventDefault();
  }
});

export default function Analytics() {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>Analytics</h1>
              <p className={styles.subtitle}>View detailed analytics and reports</p>
            </div>
          </div>

          <div className={styles.panel}>
            <ModelVisualizations />
          </div>
        </div>
      </div>
    </div>
  );
}