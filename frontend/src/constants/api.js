// frontend/src/constants/api.js
// Use a consistent API prefix; keep endpoints relative so apiClient's baseURL is applied.
const API_PREFIX = ''; // Changed to empty string

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    LOGOUT: `/auth/logout`,
    PROFILE: `/auth/profile`,
  },
  SUBMISSIONS: {
    GET_ALL: `/submissions`,
    GET_BY_ID: (id) => `/submissions/${id}`,
    CREATE: `/submissions`,
    UPDATE: (id) => `/submissions/${id}`,
    DELETE: (id) => `/submissions/${id}`,
  },
  USERS: {
    GET_ALL: `/users`,
    GET_BY_ID: (id) => `/users/${id}`,
    CREATE: `/users`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
  STATIONS: {
    GET_ALL: `/stations`,
    GET_BY_ID: (id) => `/stations/${id}`,
    CREATE: `/stations`,
    UPDATE: (id) => `/stations/${id}`,
    DELETE: (id) => `/stations/${id}`,
  },
  REPORTS: {
    GET_ALL: `/reports`,
    GET_BY_ID: (id) => `/reports/${id}`,
  },
  ALERTS: {
    GET_ALL: `/alerts`,
    CREATE: `/alerts`,
    DELETE: (id) => `/alerts/${id}`,
    STREAM: `/alerts/stream`
  }
};

// Geoapify key for reverse geocoding. Set VITE_GEOAPIFY_KEY in your .env for local/dev.
export const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_KEY || "REPLACE_WITH_YOUR_KEY";