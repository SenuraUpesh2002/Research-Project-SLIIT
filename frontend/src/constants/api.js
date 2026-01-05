// frontend/src/constants/api.js
// Use a consistent API prefix; keep endpoints relative so apiClient's baseURL is applied.
const API_PREFIX = '/api';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_PREFIX}/auth/login`,
    REGISTER: `${API_PREFIX}/auth/register`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    PROFILE: `${API_PREFIX}/auth/profile`,
  },
  SUBMISSIONS: {
    GET_ALL: `${API_PREFIX}/submissions`,
    GET_BY_ID: (id) => `${API_PREFIX}/submissions/${id}`,
    CREATE: `${API_PREFIX}/submissions`,
    UPDATE: (id) => `${API_PREFIX}/submissions/${id}`,
    DELETE: (id) => `${API_PREFIX}/submissions/${id}`,
  },
  USERS: {
    GET_ALL: `${API_PREFIX}/users`,
    GET_BY_ID: (id) => `${API_PREFIX}/users/${id}`,
    CREATE: `${API_PREFIX}/users`,
    UPDATE: (id) => `${API_PREFIX}/users/${id}`,
    DELETE: (id) => `${API_PREFIX}/users/${id}`,
  },
  STATIONS: {
    GET_ALL: `${API_PREFIX}/stations`,
    GET_BY_ID: (id) => `${API_PREFIX}/stations/${id}`,
    CREATE: `${API_PREFIX}/stations`,
    UPDATE: (id) => `${API_PREFIX}/stations/${id}`,
    DELETE: (id) => `${API_PREFIX}/stations/${id}`,
  },
  REPORTS: {
    GET_ALL: `${API_PREFIX}/reports`,
    GET_BY_ID: (id) => `${API_PREFIX}/reports/${id}`,
  },
  ALERTS: {
    GET_ALL: `${API_PREFIX}/alerts`,
    CREATE: `${API_PREFIX}/alerts`,
    DELETE: (id) => `${API_PREFIX}/alerts/${id}`,
    STREAM: `${API_PREFIX}/alerts/stream`
  }
};

// Geoapify key for reverse geocoding. Set VITE_GEOAPIFY_KEY in your .env for local/dev.
export const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_KEY || "REPLACE_WITH_YOUR_KEY";