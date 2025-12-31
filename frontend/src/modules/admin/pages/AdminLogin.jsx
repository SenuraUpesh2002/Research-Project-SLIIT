// frontend/src/modules/admin/pages/AdminLogin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from "../../../constants/api";
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto-login with test credentials for development
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/admin'); // Redirect to landing page
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    // Test credentials
    const TEST_EMAIL = 'admin@test.com';
    const TEST_PASSWORD = 'admin123';

    if (emailTrimmed === TEST_EMAIL && passwordTrimmed === TEST_PASSWORD) {
      // Set a mock token for testing
      const token = 'test-admin-token-' + Date.now();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', 'admin');
      setTimeout(() => {
        navigate('/admin'); // Redirect to landing page
      }, 100);
      return;
    }

    // Only try API call if not using test credentials
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailTrimmed, password: passwordTrimmed }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', 'admin');
        navigate('/admin'); // Redirect to landing page
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Network error or server is unreachable.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Admin Login</h2>
        <div className={styles.testCredentials}>
          <p className={styles.testLabel}>Test Credentials:</p>
          <p className={styles.testText}>Email: <strong>admin@test.com</strong></p>
          <p className={styles.testText}>Password: <strong>admin123</strong></p>
        </div>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;