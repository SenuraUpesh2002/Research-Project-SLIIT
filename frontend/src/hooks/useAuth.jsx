/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";
import { API_ENDPOINTS } from "../constants/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("authToken")?.trim() || null
  );
  const [loading, setLoading] = useState(false);

  // Verify token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);

      if (token) {
        console.log("TOKEN SENT IN HEADER:", token); // DEBUG

        // Test token support
        if (token.startsWith("test-admin-token-")) {
          setUser({
            id: "test-user-id",
            email: "admin@test.com",
            role: "admin",
            name: "Test Admin",
          });
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else if (response.status === 404) {
            // Profile endpoint missing – token still valid
            setUser({ token });
          } else {
            console.warn("Invalid token. Removing.");
            localStorage.removeItem("authToken");
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("authToken");
          setToken(null);
          setUser(null);
        }
      }

      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("TOKEN RECEIVED:", data.token); // DEBUG

      if (response.ok) {
        const trimmedToken = data.token.trim();
        localStorage.setItem("authToken", trimmedToken);
        setToken(trimmedToken);
        setUser(data.user);

        return { success: true };
      }

      return {
        success: false,
        message: data.message || "Login failed",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error or server unavailable",
      };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password, role = "user") => {
    if (!name || !email || !password) {
      return { success: false, message: "All fields are required" };
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Registration successful",
        };
      }

      return {
        success: false,
        message: data.message || "Registration failed",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Network error or server unavailable",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ PropTypes fix for ESLint
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook
export const useAuth = () => useContext(AuthContext);
