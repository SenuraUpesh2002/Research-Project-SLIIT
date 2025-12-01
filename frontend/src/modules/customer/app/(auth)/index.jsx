import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For web navigation
import { useAuth } from "../../context/AuthContext";
import styles from "./index.module.css"; // Import CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, login } = useAuth();

  const validateForm = () => {
    if (!email.trim()) {
      window.alert('Error', 'Email is required');
      return false;
    }
    
    if (!password) {
      window.alert('Error', 'Password is required');
      return false;
    }
    
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    const result = await login(email, password);

    if (!result.success) {
      window.alert("Error", result.error);
    } else {
      window.alert("Login successful!");
      navigate("/app/welcome"); // Navigate to web welcome page
    }
  };

  // if (isCheckingAuth) return null; // Uncomment and adapt when authStore is web-ready

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.title}>Welcome Back</p>
          <p className={styles.subtitle}>Sign in to FUELWATCH</p>
        </div>

        <div className={styles.form}>
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faEnvelope} /></span>
              <input
                id="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoCapitalize="none"
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faLock} /></span>
              <input
                id="password"
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeIcon}
              >
                {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
              </button>
            </div>
          </div>

          <button
            className={`${styles.button} ${isLoading ? styles.buttonDisabled : ""}`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Loading...</span> // Simple text loading indicator
            ) : (
              <span className={styles.buttonText}>Sign In</span>
            )}
          </button>

          <button
            className={styles.linkButton}
            onClick={() => navigate("/auth/register")}
          >
            <p className={styles.linkText}>
              Don't have an account? <span className={styles.linkTextBold}>Sign Up</span>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
