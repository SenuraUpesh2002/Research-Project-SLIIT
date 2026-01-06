import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import AdminSidebar from '../components/AdminSidebar';

export default function Dashboard() {
  const [stats] = useState({
    totalSubmissions: 1234,
    activeAlerts: 23,
    duplicatesFound: 47,
    totalUsers: 856,
  });
  const [recentSubmissions] = useState([
    { id: 1, user: 'John Doe', station: 'Tesla Supercharger - Downtown', type: 'Fuel Form', date: '2025-12-14 10:30 AM', status: 'completed' },
    { id: 2, user: 'Jane Smith', station: 'ChargePoint Station - Mall', type: 'EV Form', date: '2025-12-14 09:15 AM', status: 'pending' },
    { id: 3, user: 'Mike Johnson', station: 'EVgo Fast Charger - Airport', type: 'Fuel Form', date: '2025-12-14 08:45 AM', status: 'completed' },
    { id: 4, user: 'Sarah Williams', station: 'Blink Charging - Station A', type: 'EV Form', date: '2025-12-13 11:20 PM', status: 'completed' },
    { id: 5, user: 'Tom Brown', station: 'Electrify America - Highway 101', type: 'Fuel Form', date: '2025-12-13 09:30 PM', status: 'pending' },
  ]);
  const [recentAlerts] = useState([
    { id: 1, station: 'Tesla Supercharger - Downtown', message: 'New submission from John Doe', time: '5 minutes ago', type: 'info' },
    { id: 2, station: 'ChargePoint Station - Mall', message: 'Possible duplicate detected', time: '15 minutes ago', type: 'warning' },
    { id: 3, station: 'EVgo Fast Charger - Airport', message: 'Station contacted - awaiting response', time: '1 hour ago', type: 'info' },
    { id: 4, station: 'Blink Charging - Station A', message: 'New submission from Sarah Williams', time: '2 hours ago', type: 'info' },
  ]);

  const getStatusColor = (status) => {
    if (status === 'completed') return '#10B981';
    if (status === 'pending') return '#F59E0B';
    return '#9CA3AF';
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.dashboard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Admin Dashboard</h1>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#3B82F6' }}>📄</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.totalSubmissions}</div>
                <div className={styles.statLabel}>Total Submissions</div>
                <div className={styles.statTrend}>📈 +12%</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#F59E0B' }}>⚠️</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.activeAlerts}</div>
                <div className={styles.statLabel}>Active Alerts</div>
                <div className={styles.statTrend}>📈 +5%</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#EF4444' }}>📋</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.duplicatesFound}</div>
                <div className={styles.statLabel}>Duplicates Found</div>
                <div className={styles.statTrend}>📉 -8%</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#10B981' }}>👥</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.totalUsers}</div>
                <div className={styles.statLabel}>Total Users</div>
                <div className={styles.statTrend}>📈 +18%</div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className={styles.contentGrid}>
            {/* Recent Submissions */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Submissions</h2>
              <div className={styles.submissionsList}>
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className={styles.submissionItem}>
                    <div className={styles.submissionIcon}>📄</div>
                    <div className={styles.submissionInfo}>
                      <div className={styles.submissionName}>{submission.user}</div>
                      <div className={styles.submissionStation}>{submission.station}</div>
                      <div className={styles.submissionMeta}>
                        {submission.type} • 🕐 {submission.date}
                      </div>
                    </div>
                    <span 
                      className={styles.submissionStatus}
                      style={{ backgroundColor: getStatusColor(submission.status) }}
                    >
                      {submission.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Alerts</h2>
              <div className={styles.alertsList}>
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className={styles.alertItem}>
                    <div className={styles.alertIcon}>⚠️</div>
                    <div className={styles.alertInfo}>
                      <div className={styles.alertStation}>{alert.station}</div>
                      <div className={styles.alertMessage}>{alert.message}</div>
                      <div className={styles.alertTime}>{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}