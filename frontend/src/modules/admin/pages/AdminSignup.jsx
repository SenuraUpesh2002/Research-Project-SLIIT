import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../constants/api';
import styles from './Login.module.css'; // Reuse login styles

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'admin' })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Admin account created! You can now log in.');
        setTimeout(() => navigate('/admin/login'), 1500);
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch (err) {
      setError('Network error or server is unreachable.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Admin Signup</h2>
        <form onSubmit={handleSignup}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Name:</label>
            <input type="text" id="name" className={styles.input} value={name}
              onChange={e => setName(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input type="email" id="email" className={styles.input} value={email}
              onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <input type="password" id="password" className={styles.input} value={password}
              onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button type="submit" className={styles.button}>Create Admin Account</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
