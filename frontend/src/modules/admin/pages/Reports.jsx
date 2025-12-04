import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from "../../../../constants/api";
import styles from './Reports.module.css';
import ReportCharts from '../components/ReportCharts'; // Assuming this path

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Simulate fetching report data
    const fetchReportData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.REPORTS.GET_ALL, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch report data: ${response.statusText}`);
        }
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        setError('Failed to load report data.');
        console.error('Error fetching report data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading reports...</div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Reports & Analytics</h1>
      <div className={styles.chartsGrid}>
        {reportData && (
          <>
            <div className={styles.chartCard}>
              <h2>Submission Trends</h2>
              <ReportCharts data={reportData.submissionTrends} chartType="line" dataKey="count" nameKey="month" />
            </div>
            <div className={styles.chartCard}>
              <h2>User Activity</h2>
              <ReportCharts data={reportData.userActivity} chartType="bar" dataKey="activeUsers" nameKey="day" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
