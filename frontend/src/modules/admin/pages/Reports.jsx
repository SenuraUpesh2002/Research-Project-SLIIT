import { useState, useEffect } from 'react';
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
        // In a real application, you would call report.service.js here
        // const data = await reportService.getReportData();
        // setReportData(data);
        
        // Mock data for now
        const mockData = {
          submissionTrends: [
            { month: 'Jan', count: 10 },
            { month: 'Feb', count: 15 },
            { month: 'Mar', count: 20 },
            { month: 'Apr', count: 12 },
            { month: 'May', count: 18 },
          ],
          userActivity: [
            { day: 'Mon', activeUsers: 5 },
            { day: 'Tue', activeUsers: 8 },
            { day: 'Wed', activeUsers: 12 },
            { day: 'Thu', activeUsers: 7 },
            { day: 'Fri', activeUsers: 10 },
          ],
        };
        setReportData(mockData);
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
