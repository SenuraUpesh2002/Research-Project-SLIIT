// frontend/src/modules/admin/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import logo from './logo.jpeg';

const LandingPage = () => {
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Fuel Watch Logo" />
        </div>
        <nav className={styles.nav}>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/submissions">Submissions</Link>
          <Link to="/admin/alerts">Alerts</Link>
          <Link to="/admin/analytics">Analytics</Link>
          <Link to="/admin/users">Users</Link>
        </nav>
        <div className={styles.profile}> {/* Profile icon */} </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Smart Station Recommendation Engine</h1>
          <p>
            Intelligently connect customers with nearby fuel stations and EV charging points, providing comprehensive recommendations and insights.
          </p>
          <div className={styles.heroButtons}>
            <button>Admin Portal</button>
            <button>For Customers</button>
          </div>
        </div>
        <div className={styles.heroImage}>
          {/* Add admin dashboard preview image here */}
        </div>
      </section>

      {/* Solution Overview */}
      <section className={styles.overview}>
        <h2>Complete Solution Overview</h2>
        <div className={styles.overviewCards}>
          <div className={styles.card}>
            <h3>Admin Mode</h3>
            <ul>
              <li>Dashboard & Control Panel</li>
              <li>Submissions & Management</li>
              <li>Fuel & EV Station Info</li>
              <li>Alerts/Notifications</li>
              <li>User Management</li>
            </ul>
          </div>
          <div className={styles.card}>
            <h3>Customer Mode</h3>
            <ul>
              <li>Nearby Fuel/EV Station Search</li>
              <li>Smart Recommendations</li>
              <li>Route Optimization</li>
              <li>Profile & Preferences</li>
              <li>EV Charging Info</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Customer Journey */}
      <section className={styles.journey}>
        <h2>Customer Journey Flow</h2>
        <div className={styles.journeySteps}>
          <div className={styles.step}>Mode Selection</div>
          <div className={styles.step}>Location Input</div>
          <div className={styles.step}>Station Recommendations</div>
          <div className={styles.step}>Map Selection</div>
          <div className={styles.step}>Profile Management</div>
          <div className={styles.step}>Route Selection</div>
          <div className={styles.step}>Alerts & Notifications</div>
          <div className={styles.step}>Account Registration/Login</div>
        </div>
      </section>

      {/* Admin Features */}
      <section className={styles.features}>
        <h2>Admin Portal Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureBox}>Dashboard</div>
          <div className={styles.featureBox}>Submissions Management</div>
          <div className={styles.featureBox}>Duplicate Detection</div>
          <div className={styles.featureBox}>Alerts Management</div>
          <div className={styles.featureBox}>Analytics & Reports</div>
          <div className={styles.featureBox}>User Management</div>
        </div>
      </section>

      {/* Technology & Features */}
      <section className={styles.tech}>
        <h2>Technology & Features</h2>
        <div className={styles.techGrid}>
          <div className={styles.techBox}>Interactive Map</div>
          <div className={styles.techBox}>AI Recommendation Engine</div>
          <div className={styles.techBox}>Custom Design</div>
          <div className={styles.techBox}>Secure Authentication</div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h2>Ready to Get Started?</h2>
        <p>Experience the complete station recommendation solution.</p>
        <div className={styles.ctaButtons}>
          <button>Access Admin Portal</button>
          <button>For Customers</button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <img src={logo} alt="Fuel Watch Logo" />
          </div>
          <div className={styles.footerLinks}>
            <h4>Features</h4>
            <ul>
              <li>Dashboard</li>
              <li>Analytics</li>
              <li>Reports</li>
            </ul>
          </div>
          <div className={styles.footerLinks}>
            <h4>Support</h4>
            <ul>
              <li>Contact</li>
              <li>Documentation</li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 SLIIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;