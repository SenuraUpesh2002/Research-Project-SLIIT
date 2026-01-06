// frontend/src/modules/admin/pages/Alerts.jsx
import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from "../../../constants/api";
import apiClient from '../../../services/apiClient';
import styles from './Alerts.module.css';
import AdminSidebar from '../components/AdminSidebar';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newAlertMessage, setNewAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  // Delete confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);

  // Popup toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.ALERTS.GET_ALL);
      setAlerts(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Create alert
  const handleCreateAlert = async () => {
    if (!newAlertMessage.trim()) return;

    try {
      const res = await apiClient.post(API_ENDPOINTS.ALERTS.CREATE, {
        message: newAlertMessage.trim(),
        type: alertType,
      });

      setAlerts(prev => [res.data, ...prev]);
      setNewAlertMessage('');
      setAlertType('info');
      showToast('Alert created successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to create alert', 'error');
    }
  };

  // Open confirmation popup
  const openDeleteConfirm = (alert) => {
    setAlertToDelete(alert);
    setShowConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!alertToDelete) return;

    try {
      await apiClient.delete(API_ENDPOINTS.ALERTS.DELETE(alertToDelete.id));
      setAlerts(prev => prev.filter(a => a.id !== alertToDelete.id));
      showToast('Alert deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete alert', 'error');
    } finally {
      setShowConfirm(false);
      setAlertToDelete(null);
    }
  };

  if (loading) return <div className={styles.loading}>Loading alerts...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Alerts & Notification Management</h1>

          {/* Create Alert */}
          <div className={styles.createAlertSection}>
            <textarea
              className={styles.alertInput}
              placeholder="Enter new alert message..."
              value={newAlertMessage}
              onChange={(e) => setNewAlertMessage(e.target.value)}
            />

            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="system">System</option>
            </select>

            <button className={styles.createButton} onClick={handleCreateAlert}>
              Create Alert
            </button>
          </div>

          {/* Alerts */}
          {alerts.length === 0 ? (
            <p className={styles.noAlerts}>No alerts available</p>
          ) : (
            <div className={styles.alertsList}>
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`${styles.alertCard} ${styles[alert.type]}`}
                >
                  <div className={styles.alertHeader}>
                    <span className={styles.alertType}>{alert.type}</span>
                    <span className={styles.alertDate}>
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className={styles.alertMessage}>{alert.message}</p>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => openDeleteConfirm(alert)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Confirmation Popup */}
          {showConfirm && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Delete Alert</h3>
                <p>Are you sure you want to delete this alert?</p>
                <div className={styles.modalActions}>
                  <button onClick={() => setShowConfirm(false)}>Cancel</button>
                  <button className={styles.danger} onClick={confirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast Popup */}
          {toast && (
            <div className={`${styles.toast} ${styles[toast.type]}`}>
              {toast.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;