import { useNavigate } from 'react-router-dom';
import styles from './welcome.module.css';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <div className={styles.iconContainer}>
            <span style={{ fontSize: 60, color: '#1e40af' }}>🚗</span>
            <span style={{ fontSize: 30, color: '#f59e0b' }} className={styles.evIcon}>⚡</span>
          </div>
          <p className={styles.appName}>FUELWATCH</p>
          <p className={styles.tagline}>
            Find the best Fuel or EV Station smartly
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span style={{ fontSize: 24, color: '#1e40af' }}>📍</span>
            <p className={styles.featureText}>Location-based search</p>
          </div>
          <div className={styles.feature}>
            <span style={{ fontSize: 24, color: '#1e40af' }}>⏰</span>
            <p className={styles.featureText}>Real-time availability</p>
          </div>
          <div className={styles.feature}>
            <span style={{ fontSize: 24, color: '#1e40af' }}>⭐</span>
            <p className={styles.featureText}>Smart recommendations</p>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.getStartedButton}
          onClick={() => navigate('/user-type')}
        >
          <p className={styles.getStartedText}>Get Started</p>
          <span style={{ fontSize: 20, color: '#ffffff' }}>➡️</span>
        </button>
      </div>
    </div>
  );
}
