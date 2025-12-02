import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // For web navigation
import { useAuth } from '../../context/AuthContext';
import styles from './register.module.css'; // Import CSS module

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      window.alert('Error', 'Full name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      window.alert('Error', 'Email is required');
      return false;
    }
    
    if (!formData.password) {
      window.alert('Error', 'Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      window.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      window.alert('Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const result = await register(
      formData.fullName,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      window.alert(
        'Success',
        'Account created successfully! Please login.'
      );
      navigate('/auth'); // Navigate to web login page
    } else {
      window.alert('Error', result.error || 'Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer}>
        <div className={styles.header}>
          <p className={styles.title}>Create Account</p>
          <p className={styles.subtitle}>Join FUELWATCH to find the best stations</p>
        </div>

        <div className={styles.form}>
          <div className={styles.inputContainer}>
            <label htmlFor="fullName" className={styles.label}>Full Name</label>
            <input
              id="fullName"
              name="fullName"
              className={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              autoCapitalize="words"
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              className={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              autoCapitalize="none"
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              className={styles.input}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              type="password"
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              type="password"
            />
          </div>

          <button
            className={`${styles.button} ${isLoading ? styles.buttonDisabled : ""}`}
            onClick={handleRegister}
            disabled={isLoading}
          >
            <span className={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </span>
          </button>

          <button
            className={styles.linkButton}
            onClick={() => navigate('/auth')}
          >
            <p className={styles.linkText}>
              Already have an account? <span className={styles.linkTextBold}>Login</span>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
