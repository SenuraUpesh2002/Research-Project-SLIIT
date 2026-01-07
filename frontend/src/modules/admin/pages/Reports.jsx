import { useState, useEffect } from 'react';
import styles from './Reports.module.css';
import ReportCharts from '../components/ReportCharts';
import reportService from '../../../services/report.service'; // Import the report service
import AdminSidebar from '../components/AdminSidebar'; // Assuming you have an AdminSidebar component

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    allReports: [],
    submissionTrends: [],
    userActivity: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await reportService.getReports(); // Use the service to fetch data
        console.log('Fetched report data:', data); // Log the fetched data
        // Temporarily use dummy data to check chart rendering
        const dummySubmissionTrends = [
          { month: 'Jan 2023', count: 10 },
          { month: 'Feb 2023', count: 15 },
          { month: 'Mar 2023', count: 8 },
          { month: 'Apr 2023', count: 20 },
        ];
        const dummyUserActivity = [
          { day: '2023-04-01', activeUsers: 5 },
          { day: '2023-04-02', activeUsers: 12 },
          { day: '2023-04-03', activeUsers: 7 },
          { day: '2023-04-04', activeUsers: 18 },
        ];
        setReportData({
          allReports: data.allReports,
          submissionTrends: dummySubmissionTrends,
          userActivity: dummyUserActivity,
        });
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
    <div className={styles.adminLayout}> {/* Use adminLayout for consistent styling */}
      <AdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.header}>Reports & Analytics</h1>
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h2>Submission Trends</h2>
              <ReportCharts data={reportData.submissionTrends} chartType="line" dataKey="count" nameKey="month" />
            </div>
            <div className={styles.chartCard}>
              <h2>User Activity</h2>
              <ReportCharts data={reportData.userActivity} chartType="bar" dataKey="activeUsers" nameKey="day" />
            </div>
            {/* You can add more charts here based on your reportData */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;