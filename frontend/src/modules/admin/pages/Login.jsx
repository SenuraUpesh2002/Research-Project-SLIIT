import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from "../../../../constants/api";
import styles from './Login.module.css'; // Assuming a CSS module for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
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
