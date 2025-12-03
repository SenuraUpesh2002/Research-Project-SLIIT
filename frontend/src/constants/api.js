const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  SUBMISSIONS: {
    GET_ALL: `${API_BASE_URL}/submissions`,
    GET_BY_ID: (id) => `${API_BASE_URL}/submissions/${id}`,
    CREATE: `${API_BASE_URL}/submissions`,
    UPDATE: (id) => `${API_BASE_URL}/submissions/${id}`,
    DELETE: (id) => `${API_BASE_URL}/submissions/${id}`,
  },
  USERS: {
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    CREATE: `${API_BASE_URL}/users`,
    UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/users/${id}`,
  },
  STATIONS: {
    GET_ALL: `${API_BASE_URL}/stations`,
    GET_BY_ID: (id) => `${API_BASE_URL}/stations/${id}`,
    CREATE: `${API_BASE_URL}/stations`,
    UPDATE: (id) => `${API_BASE_URL}/stations/${id}`,
    DELETE: (id) => `${API_BASE_URL}/stations/${id}`,
  },
  REPORTS: {
    GET_ALL: `${API_BASE_URL}/reports`,
    GET_BY_ID: (id) => `${API_BASE_URL}/reports/${id}`,
  },
  ALERTS: {
    GET_ALL: `${API_BASE_URL}/alerts`,
    GET_BY_ID: (id) => `${API_BASE_URL}/alerts/${id}`,
  },
};
