import styles from './Dashboard.module.css';

export default function Dashboard() {
  // Mock data for demonstration
  const stats = {
    totalSubmissions: 1250,
    duplicateSubmissions: 45,
    alertsSent: 12,
    activeUsers: 340,
  };

  const quickLinks = [
    { name: 'View Submissions', path: '/admin/submissions' },
    { name: 'Manage Alerts', path: '/admin/alerts' },
    { name: 'Review Duplicates', path: '/admin/duplicates' },
    { name: 'User Management', path: '/admin/users' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Overview of system activities</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Submissions</h3>
          <p>{stats.totalSubmissions}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Duplicate Submissions</h3>
          <p>{stats.duplicateSubmissions}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Alerts Sent</h3>
          <p>{stats.alertsSent}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Active Users</h3>
          <p>{stats.activeUsers}</p>
        </div>
      </div>

      <div className={styles.quickLinks}>
        <h2>Quick Actions</h2>
        <div className={styles.linksGrid}>
          {quickLinks.map((link) => (
            <a key={link.name} href={link.path} className={styles.quickLinkCard}>
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Placeholder for graphs/charts */}
      <div className={styles.chartsSection}>
        <h2>Submission Trends (Coming Soon)</h2>
        {/* ReportCharts component would be integrated here */}
      </div>
    </div>
  );
}
