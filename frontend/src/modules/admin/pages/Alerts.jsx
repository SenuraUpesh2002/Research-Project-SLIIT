import { useState, useEffect } from 'react';
import styles from './Alerts.module.css';
import AlertCard from '../components/AlertCard'; // Assuming this component exists

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAlertMessage, setNewAlertMessage] = useState('');

  useEffect(() => {
    // Placeholder for fetching alerts from an API
    const fetchAlerts = async () => {
      try {
        // Simulate API call
        const mockAlerts = [
          { id: 'alert1', message: 'New EV submission from Colombo', type: 'info', date: '2023-11-01' },
          { id: 'alert2', message: 'High number of duplicate submissions detected', type: 'warning', date: '2023-10-30' },
          { id: 'alert3', message: 'System maintenance scheduled for tonight', type: 'system', date: '2023-10-28' },
        ];
        setAlerts(mockAlerts);
      } catch (err) {
        setError('Failed to fetch alerts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleCreateAlert = () => {
    if (newAlertMessage.trim()) {
      const newAlert = {
        id: `alert${alerts.length + 1}`,
        message: newAlertMessage.trim(),
        type: 'info', // Default type for new alerts
        date: new Date().toISOString().slice(0, 10),
      };
      setAlerts([newAlert, ...alerts]);
      setNewAlertMessage('');
      console.log('New alert created:', newAlert);
      // In a real app, this would involve an API call to save the alert
    }
  };

  const handleDeleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    console.log(`Alert ${id} deleted.`);
    // In a real app, this would involve an API call to delete the alert
  };

  if (loading) return <div className={styles.loading}>Loading alerts...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Alerts & Notification Management</h1>

      <div className={styles.createAlertSection}>
        <textarea
          className={styles.alertInput}
          placeholder="Enter new alert message..."
          value={newAlertMessage}
          onChange={(e) => setNewAlertMessage(e.target.value)}
          rows="3"
        ></textarea>
        <button className={styles.createButton} onClick={handleCreateAlert}>
          Create Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <p className={styles.noAlerts}>No active alerts.</p>
      ) : (
        <div className={styles.alertsList}>
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onDelete={handleDeleteAlert} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
