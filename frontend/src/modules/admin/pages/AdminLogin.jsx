import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from "../../../constants/api";
import styles from './Login.module.css'; // Assuming a CSS module for styling

const Login = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto-login with test credentials for development
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && token.startsWith('test-admin-token-')) {
      navigate('/admin/dashboard');
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

    console.log('Login attempt with:', { emailTrimmed, passwordTrimmed });
    console.log('Test email:', TEST_EMAIL, 'Test password:', TEST_PASSWORD);
    console.log('Match:', emailTrimmed === TEST_EMAIL && passwordTrimmed === TEST_PASSWORD);

    if (emailTrimmed === TEST_EMAIL && passwordTrimmed === TEST_PASSWORD) {
      // Set a mock token for testing
      const token = 'test-admin-token-' + Date.now();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', 'admin');
      console.log('✅ Admin login successful with test credentials!');
      console.log('Token saved to localStorage:', localStorage.getItem('authToken'));
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 100);
      return;
    }

    // Only try API call if not using test credentials
    console.log('Attempting API login (not test credentials)');
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
        console.log('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Network error or server is unreachable.');
      console.error('Login error:', err);
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
