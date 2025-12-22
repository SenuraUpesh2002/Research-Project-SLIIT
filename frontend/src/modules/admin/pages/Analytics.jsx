import styles from './Analytics.module.css';

export default function Analytics() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>View detailed analytics and reports</p>
      </div>

      <div className={styles.comingSoon}>
        <div className={styles.icon}>📊</div>
        <h2>Coming Soon</h2>
        <p>Analytics dashboard is under development. Check back soon!</p>
      </div>
    </div>
  );
}
