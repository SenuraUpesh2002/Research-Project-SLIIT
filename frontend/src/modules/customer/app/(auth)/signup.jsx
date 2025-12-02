import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For web navigation
import { useAuth } from "../../context/AuthContext";
import styles from "./signup.module.css"; // Import CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, register } = useAuth();

  const navigate = useNavigate(); // Web equivalent of useRouter

  const handleSignUp = async () => {
    const result = await register(username, email, password, password); // Assuming confirmPassword is same as password for simplicity

    if (!result.success) window.alert("Error", result.error);
    else {
      window.alert("Registration successful!");
      navigate("/app/login"); // Navigate to web login page
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* HEADER */}
        <div className={styles.header}>
          <p className={styles.title}>BookWorm🐛</p>
          <p className={styles.subtitle}>Share your favorite reads</p>
        </div>

        <div className={styles.formContainer}>
          {/* USERNAME INPUT */}
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <div className={styles.inputContainer}>
              {/* For icons, you'd typically use an SVG or a web icon library like Font Awesome */}
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faUser} /></span>
              <input
                id="username"
                className={styles.input}
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoCapitalize="none"
              />
            </div>
          </div>

          {/* EMAIL INPUT */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputContainer}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faEnvelope} /></span>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none"
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputContainer}>
              <span className={styles.inputIcon}><FontAwesomeIcon icon={faLock} /></span>
              <input
                id="password"
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

          {/* SIGNUP BUTTON */}
          <button className={styles.button} onClick={handleSignUp} disabled={isLoading}>
            {isLoading ? (
              <span>Loading...</span> // Simple text loading indicator
            ) : (
              <span className={styles.buttonText}>Sign Up</span>
            )}
          </button>

          {/* FOOTER */}
          <div className={styles.footer}>
            <p className={styles.footerText}>Already have an account?</p>
            <button type="button" onClick={() => navigate("/app/login")} className={styles.link}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
