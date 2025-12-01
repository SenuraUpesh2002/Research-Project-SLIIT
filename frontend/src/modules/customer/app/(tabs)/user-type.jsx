import React from 'react';
import { useNavigate } from 'react-router-dom'; // For web navigation
import styles from './user-type.module.css'; // Import CSS module

export default function UserTypeScreen() {
  const navigate = useNavigate();

  const handleVehicleTypeSelect = (type) => {
    if (type === 'fuel') {
      navigate('/forms/fuel-form');
    } else if (type === 'ev') {
      navigate('/forms/ev-form');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>Select Your Vehicle Type</p>
        <p className={styles.subtitle}>
          Choose your vehicle type to get personalized recommendations
        </p>
      </div>

      <div className={styles.vehicleOptions}>
        <button
          className={styles.vehicleCard}
          onClick={() => handleVehicleTypeSelect('fuel')}
        >
          <div className={styles.iconContainer}>
            <span style={{ fontSize: 60, color: "#1e40af" }}>🚗</span> {/* Placeholder icon */}
          </div>
          <p className={styles.vehicleTitle}>🚗 Fuel Vehicle</p>
          <p className={styles.vehicleDescription}>
            Find petrol, diesel, and super fuel stations near you
          </p>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span style={{ color: "#10b981", marginRight: 8 }}>✔</span> {/* Placeholder icon */}
              <p className={styles.featureText}>Real-time availability</p>
            </div>
            <div className={styles.featureItem}>
              <span style={{ color: "#10b981", marginRight: 8 }}>✔</span> {/* Placeholder icon */}
              <p className={styles.featureText}>Queue status updates</p>
            </div>
            <div className={styles.featureItem}>
              <span style={{ color: "#10b981", marginRight: 8 }}>✔</span> {/* Placeholder icon */}
              <p className={styles.featureText}>Price comparisons</p>
            </div>
          </div>
        </button>

        <button
          className={styles.vehicleCard}
          onClick={() => handleVehicleTypeSelect('ev')}
        >
          <div className={styles.iconContainer}>
            <span style={{ fontSize: 60, color: "#f59e0b" }}>⚡</span> {/* Placeholder icon */}
          </div>
          <p className={styles.vehicleTitle}>⚡ EV Vehicle</p>
          <p className={styles.vehicleDescription}>
            Locate electric vehicle charging stations with power ratings
          </p>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span style={{ color: "#10b981", marginRight: 8 }}>✔</span> {/* Placeholder icon */}
              <p className={styles.featureText}>Charging speeds</p>
            </div>
            <div className={styles.featureItem}>
              <span style={{ color: "#10b981", marginRight: 8 }}>✔</span> {/* Placeholder icon */}
              <p className={styles.featureText}>Connector types</p>
            </div>
            <div className={styles.featureItem}>
              <span style={{ color: "#10b981", marginRight: 8 }}>✔</span> {/* Placeholder icon */}
              <p className={styles.featureText}>Availability status</p>
            </div>
          </div>
        </button>
      </div>

      <button
        className={styles.backButton}
        onClick={() => navigate(-1)} // navigate(-1) goes back in history
      >
        <span style={{ color: "#64748b", marginRight: 8 }}>⬅</span> {/* Placeholder icon */}
        <p className={styles.backButtonText}>Back</p>
      </button>
    </div>
  );
}
