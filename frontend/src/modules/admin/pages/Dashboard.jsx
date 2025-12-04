import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from "../../../../constants/api";
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    duplicateSubmissions: 0,
    alertsSent: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.REPORTS.GET_ALL, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data = await response.json();
        // Assuming the API returns data in a format like:
        // { totalSubmissions: 1250, duplicateSubmissions: 45, alertsSent: 12, activeUsers: 340 }
        setStats(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const quickLinks = [
    { name: 'View Submissions', path: '/admin/submissions' },
    { name: 'Manage Alerts', path: '/admin/alerts' },
    { name: 'Review Duplicates', path: '/admin/duplicates' },
    { name: 'User Management', path: '/admin/users' },
  ];

  if (loading) {
    return <div className={styles.container}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>Error: {error}</p></div>;
  }

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
