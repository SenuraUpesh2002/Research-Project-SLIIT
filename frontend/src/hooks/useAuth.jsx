// frontend/src/hooks/useAuth.jsx
import { useState, useEffect, useContext, createContext } from 'react';
import { API_ENDPOINTS } from '../constants/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('authToken')?.trim() || null
  );
  const [loading, setLoading] = useState(false);

  // Verify token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);

      if (token) {
        console.log("TOKEN SENT IN HEADER:", token); // DEBUG

        // For test tokens, skip profile verification
        if (token.startsWith('test-admin-token-')) {
          setUser({
            id: 'test-user-id',
            email: 'admin@test.com',
            role: 'admin',
            name: 'Test Admin'
          });
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else if (response.status === 404) {
            // Profile endpoint doesn't exist, just validate token exists
            setUser({ token });
          } else {
            console.warn("Profile fetch failed. Removing invalid token.");
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

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      console.log("TOKEN RECEIVED:", data.token); // DEBUG

      if (response.ok) {
        const trimmedToken = data.token.trim();

        localStorage.setItem('authToken', trimmedToken);
        setToken(trimmedToken);

        console.log("TOKEN SAVED:", localStorage.getItem('authToken')); // DEBUG

        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error or server unavailable' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password, role = "user") => {
    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message || 'Registration successful' };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error or server unavailable' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => useContext(AuthContext);
