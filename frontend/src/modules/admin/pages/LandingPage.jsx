import React from 'react';
import styles from './LandingPage.module.css';

const LandingPage = () => (
  <div className={styles.wrapper}>
    {/* Header */}
    <header className={styles.header}>
      <div className={styles.logo}> {/* Add your logo here */} </div>
      <nav className={styles.nav}>
        <a href="#">Dashboard</a>
        <a href="#">Submissions</a>
        <a href="#">Alerts</a>
        <a href="#">Analytics</a>
        <a href="#">Users</a>
      </nav>
      <div className={styles.profile}> {/* Profile icon */} </div>
    </header>

    {/* Hero Section */}
    <section className={styles.hero}>
      <h1>Smart Station Recommendation Engine</h1>
      <p>Intelligently connect customers with nearby fuel stations and EV charging points, providing comprehensive recommendations and insights.</p>
      <div className={styles.heroButtons}>
        <button>Admin Portal</button>
        <button>For Customers</button>
      </div>
    </section>

    {/* Solution Overview */}
    <section className={styles.overview}>
      <h2>Complete Solution Overview</h2>
      <div className={styles.modes}>
        <div className={styles.modeBox}>
          <h3>Admin Mode</h3>
          <ul>
            <li>Dashboard & Control Panel</li>
            <li>Submissions & Management</li>
            <li>Fuel & EV Station Info</li>
            <li>Alerts/Notifications</li>
            <li>User Management</li>
          </ul>
        </div>
        <div className={styles.modeBox}>
          <h3>Customer Mode</h3>
          <ul>
            <li>Nearby Fuel/Ev Station Search</li>
            <li>Smart Recommendations</li>
            <li>Route Optimization</li>
            <li>Profile & Preferences</li>
            <li>EV Charging Info</li>
          </ul>
        </div>
      </div>
    </section>

    {/* Customer Journey Flow */}
    <section className={styles.journey}>
      <h2>Customer Journey Flow</h2>
      <div className={styles.journeySteps}>
        {/* Add your journey steps here as shown in the image */}
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

    {/* Admin Portal Features */}
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
      <div>
        <button>Access Admin Portal</button>
        <button>For Customers</button>
      </div>
    </section>

    {/* Footer */}
    <footer className={styles.footer}>
      <div>
        <p>© 2024 SLIIT. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <span>Features</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;