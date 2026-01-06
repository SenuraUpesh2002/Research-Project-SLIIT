import apiClient from './apiClient';
import { jwtDecode } from 'jwt-decode';

const authService = {
  login: async (credentials) => {
    console.log("authService.login called with credentials:", credentials);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      console.log("Backend login response data:", response.data);
      if (response.data.token) {
        console.log("Token received from backend:", response.data.token);
        localStorage.setItem('authToken', response.data.token);
        return jwtDecode(response.data.token);
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  validateToken: () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  },
};

export default authService;


