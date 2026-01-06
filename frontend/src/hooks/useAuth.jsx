/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";
import { API_ENDPOINTS } from "../constants/api";
import authService from "../services/auth.service"; // Import authService
import useAuthStore from "../state/auth.store";
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, user, token, login: authStoreLogin, logout: authStoreLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Verify token on initial load
  useEffect(() => {
    setLoading(true);

    const authToken = localStorage.getItem("authToken");
    // console.log("Auth Token from localStorage (useAuth):", authToken);

    if (authToken && authService.validateToken()) {
      try {
        const decodedToken = jwtDecode(authToken);
        authStoreLogin(decodedToken, authToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        authStoreLogout();
        localStorage.removeItem("authToken");
      }
    } else {
      authStoreLogout();
      localStorage.removeItem("authToken");
    }

    setLoading(false);
  }, [authStoreLogin, authStoreLogout]);

  // Login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const decodedUser = await authService.login(credentials);
      if (decodedUser) {
        const authToken = localStorage.getItem('authToken'); // Retrieve the raw token
        authStoreLogin(decodedUser, authToken); // Pass decoded user and raw token
        return { success: true };
      }
      return { success: false, message: "Login failed" };
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
      const response = await authService.register({ name, email, password, role });
      if (response.token) {
        const decodedUser = jwtDecode(response.token);
        authStoreLogin(decodedUser, response.token);
        return { success: true };
      }
      return { success: false, message: response.message || "Registration failed" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Network error or server unavailable" };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    authStoreLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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




