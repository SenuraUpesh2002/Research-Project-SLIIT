// frontend/src/modules/customer/app/auth/index.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import styles from "./index.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Email and password are required");
      return;
    }

    const result = await login({ email, password });

    if (!result.success) {
      alert(result.error || result.message || "Login failed");
    } else {
      // redirect after login
      navigate("/app/welcome");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.title}>Welcome Back</p>
          <p className={styles.subtitle}>Sign in to FUELWATCH</p>
        </div>

        <div className={styles.form}>

          {/* Email */}
          <div className={styles.inputContainer}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faEnvelope} /></span>
              <input
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.inputContainer}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faLock} /></span>
              <input
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

          <button className={styles.button} onClick={handleLogin} disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>

          <button className={styles.linkButton} onClick={() => navigate("/signup")}>
            Don't have an account? <strong>Sign Up</strong>
          </button>

        </div>
      </div>
    </div>
  );
}
