// frontend/src/modules/customer/app/auth/signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import styles from "./signup.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, register } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const result = await register({
      name,
      email,
      password,
      role: "user"
    });

    if (!result.success) {
      alert(result.message || "Registration failed");
    } else {
      alert("Registration successful!");
      navigate("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.title}>FUELWATCH</p>
          <p className={styles.subtitle}>Register to FuelWatch</p>
        </div>

        <div className={styles.formContainer}>
          
          {/* Name */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Name</label>
            <div className={styles.inputContainer}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faUser} /></span>
              <input
                className={styles.input}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputContainer}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faEnvelope} /></span>
              <input
                className={styles.input}
                type="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputContainer}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faLock} /></span>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputContainer}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faLock} /></span>
              <input
                className={styles.input}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeIcon}
              >
                {showConfirmPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
              </button>
            </div>
          </div>

          <button className={styles.button} onClick={handleSignUp} disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <div className={styles.footer}>
            <p className={styles.footerText}>Already have an account?</p>
            <button type="button" onClick={() => navigate("/login")} className={styles.link}>
              Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
