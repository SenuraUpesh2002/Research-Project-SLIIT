// frontend/src/modules/customer/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../../../constants/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [isLoading, setIsLoading] = useState(true); // true on first load
  const [error, setError] = useState(null);

  // Utility: try to extract token & user from various backend shapes
  const normalizeLoginResponse = (data) => {
    // data could be:
    // { id, name, email, role, token }
    // { user: {...}, token: "..." }
    // { data: {...} } or { message, data: {...} }
    if (!data) return { token: null, user: null };

    // shape: data.token at root
    if (typeof data.token === 'string' && (data.name || data.email || data.id)) {
      return {
        token: data.token,
        user: { id: data.id, name: data.name, email: data.email, role: data.role, ...data },
      };
    }

    // shape: { user: {...}, token: '...' }
    if (data.user && data.token) {
      return { token: data.token, user: data.user };
    }

    // shape: { data: { token: '...', user: {...} } }
    if (data.data && (data.data.token || data.data.user)) {
      return {
        token: data.data.token || data.data.user?.token || null,
        user: data.data.user || {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
        },
      };
    }

    // sometimes token inside data.token and user inside data.data.user
    if (data.token && data.data && data.data.user) {
      return { token: data.token, user: data.data.user };
    }

    // fallback: try to find token anywhere
    const possibleToken = data.token || (data.data && data.data.token) || (data.user && data.user.token) || null;
    const possibleUser = data.user || data.data || null;

    return { token: possibleToken, user: possibleUser };
  };

  // Load user profile on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // force logout if unauthorized to avoid repeated 401s
          throw new Error(`Failed to load profile (${res.status})`);
        }

        const profile = await res.json();
        setUser(profile);
      } catch (err) {
        console.error('Failed to load user:', err);
        setError(err.message || 'Failed to load user');
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({})); // handle non-json
      // Normalize response and extract token/user
      const { token: newToken, user: responseUser } = normalizeLoginResponse(data);

      if (!res.ok) {
        // If backend provided message in different keys
        const msg = data?.message || data?.error || `Login failed (${res.status})`;
        return { success: false, error: msg, raw: data };
      }

      if (!newToken) {
        // If backend didn't return token for some reason
        console.warn('Login succeeded but no token found in response', data);
        return { success: false, error: 'Login succeeded but no token returned by server', raw: data };
      }

      // Persist token and user
      localStorage.setItem('authToken', newToken);
      setToken(newToken);

      // If responseUser exists use it, otherwise try to fetch profile
      if (responseUser && (responseUser.name || responseUser.email || responseUser.id)) {
        setUser(responseUser);
      } else {
        // fetch profile from server to populate user
        try {
          const profRes = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${newToken}` },
          });
          if (profRes.ok) {
            const profData = await profRes.json();
            setUser(profData);
          } else {
            // profile fetch failed; still consider login successful but without user data
            console.warn('Profile fetch after login failed', profRes.status);
            setUser(null);
          }
        } catch (err) {
          console.error('Profile fetch after login error', err);
          setUser(null);
        }
      }

      return { success: true, data };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Network error or server unavailable' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password, role = 'user') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, error: data.message || data.error || `Registration failed (${res.status})`, raw: data };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'Network error or server unavailable' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
