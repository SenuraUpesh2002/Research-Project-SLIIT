// frontend/src/modules/customer/app/tabs/profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import Loader from "../../../../components/Loader";
import styles from "./profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faFire,
  faShieldAlt,
  faMapMarkerAlt,
  faCity,
  faBell,
  faCog,
  faMap,
  faClock,
  faUsers,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../../../../constants/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, loading: isLoading, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch profile-related data from backend (favorites/alerts/history)
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) {
        setDataLoading(false);
        return;
      }

      try {
        setDataLoading(true);
        const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // allow specific inspection of 401
          if (response.status === 401) {
            throw new Error("Unauthorized (401) - token invalid or expired");
          }
          throw new Error(`Failed to fetch profile data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // If the profile endpoint returns favorites/alerts/history include them,
        // otherwise fall back to empty arrays.
        setFavorites(data.favorites || []);
        setAlerts(data.alerts || []);
        setHistory(data.history || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to fetch profile data");
      } finally {
        setDataLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  if (isLoading || dataLoading) return <Loader />;
  if (!user) return <div className={styles.container}><p className={styles.error}>You are not logged in.</p></div>;
  if (error) return <div className={styles.container}><p className={styles.error}>Error: {error}</p></div>;

  const vehiclePreferences = [
    { label: "Vehicle Type", value: user.preferences?.vehicleType || "Fuel Vehicle", icon: faCar },
    { label: "Fuel / Charge", value: user.preferences?.fuelType || "Petrol 92", icon: faFire },
    { label: "Preferred Brand", value: user.preferences?.preferredBrand || "Lanka IOC", icon: faShieldAlt },
    { label: "Province", value: user.preferences?.province || "Western", icon: faMapMarkerAlt },
    { label: "Town", value: user.preferences?.town || "Colombo", icon: faCity },
    { label: "Alerts", value: "Enabled", icon: faBell },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <span style={{ fontSize: 48, color: '#1e40af' }}>👤</span>
          </div>
          <p className={styles.profileName}>{user.name || user.email}</p>
          <p className={styles.profileEmail}>{user.email}</p>
        </div>
        
        {/* Logout Button */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          <span style={{ fontSize: 18, color: '#ef4444', marginRight: 8 }}>🚪</span>
          <p className={styles.logoutButtonText}>Logout</p>
        </button>

        {/* Vehicle Preferences */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>Vehicle Preferences</p>
            <p className={styles.sectionSubtitle}>Personalize recommendations</p>
          </div>

          <div className={styles.preferenceGrid}>
            {vehiclePreferences.map((item) => (
              <div key={item.label} className={styles.preferenceCard}>
                <div className={styles.preferenceIcon}>
                  <FontAwesomeIcon icon={item.icon} style={{ fontSize: 18, color: 'var(--primary)' }} />
                </div>
                <p className={styles.preferenceLabel}>{item.label}</p>
                <p className={styles.preferenceValue}>{item.value}</p>
              </div>
            ))}
          </div>

          <button className={styles.secondaryButton}>
            <FontAwesomeIcon icon={faCog} style={{ fontSize: 18, color: 'var(--primary)' }} />
            <p className={styles.secondaryButtonText}>Edit Preferences</p>
          </button>
        </div>

        {/* Favorite Stations */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>Favorite Stations</p>
            <p className={styles.sectionSubtitle}>{favorites.length} saved for quick access</p>
          </div>

          {favorites.length === 0 ? (
            <p className={styles.emptyText}>No favorites saved yet.</p>
          ) : (
            favorites.map((station) => (
              <div key={station.id} className={styles.stationCard}>
                <div className={styles.stationHeader}>
                  <div>
                    <p className={styles.stationName}>{station.name}</p>
                    <p className={styles.stationAddress}>{station.address}</p>
                  </div>
                  <div className={`${styles.statusPill} ${station.status === "Available" ? styles.statusAvailable : styles.statusPending}`}>
                    <p className={styles.statusText}>{station.status}</p>
                  </div>
                </div>

                <div className={styles.stationMetaRow}>
                  <div className={styles.stationMeta}>
                    <FontAwesomeIcon icon={faMap} style={{ fontSize: 16, color: 'var(--text-secondary)' }} />
                    <p className={styles.stationMetaText}>{station.distance}</p>
                  </div>
                  <div className={styles.stationMeta}>
                    <FontAwesomeIcon icon={faClock} style={{ fontSize: 16, color: 'var(--text-secondary)' }} />
                    <p className={styles.stationMetaText}>{station.lastUpdated}</p>
                  </div>
                  <div className={styles.stationMeta}>
                    <FontAwesomeIcon icon={faUsers} style={{ fontSize: 16, color: 'var(--text-secondary)' }} />
                    <p className={styles.stationMetaText}>Queue: {station.queue}</p>
                  </div>
                </div>

                <div className={styles.stationMetaRow}>
                  <div className={styles.fuelTag}>
                    <FontAwesomeIcon icon={faFire} style={{ fontSize: 14, color: 'var(--primary)' }} />
                    <p className={styles.fuelTagText}>{station.fuel}</p>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.secondaryButton}>
                    <FontAwesomeIcon icon={faBell} style={{ fontSize: 18, color: 'var(--primary)' }} />
                    <p className={styles.secondaryButtonText}>Set Alert</p>
                  </button>
                  <button className={styles.secondaryButton}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: 18, color: 'var(--primary)' }} />
                    <p className={styles.secondaryButtonText}>Navigate</p>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Active Alerts */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>Active Alerts</p>
            <p className={styles.sectionSubtitle}>Stay ahead of restocks</p>
          </div>

          {alerts.length === 0 ? <p className={styles.emptyText}>No active alerts</p> : alerts.map((alert) => (
            <div key={alert.id} className={styles.alertCard}>
              <div className={styles.alertHeader}>
                <FontAwesomeIcon icon={faBell} style={{ fontSize: 18, color: 'var(--primary)' }} />
                <p className={styles.alertStatus}>{alert.status}</p>
              </div>
              <p className={styles.alertStation}>{alert.station}</p>
              <p className={styles.alertMessage}>{alert.message}</p>
              <p className={styles.alertTime}>{alert.time}</p>
            </div>
          ))}

          <button className={styles.secondaryButton}>
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: 18, color: 'var(--primary)' }} />
            <p className={styles.secondaryButtonText}>Create Alert</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>Recent Activity</p>
            <p className={styles.sectionSubtitle}>{history.length} stations checked recently</p>
          </div>

          {history.length === 0 ? <p className={styles.emptyText}>No recent activity</p> : history.map((item) => (
            <div key={item.id} className={styles.historyCard}>
              <div>
                <p className={styles.historyName}>{item.name}</p>
                <p className={styles.historyType}>{item.type}</p>
              </div>
              <div>
                <p className={styles.historyStatus}>{item.status}</p>
                <p className={styles.historyTime}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
