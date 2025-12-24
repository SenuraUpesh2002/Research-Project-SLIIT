import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling (e.g. session expiry)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Dispatch a global logout event or redirect
            // window.location.href = '/login'; // Use with caution to avoid loops
            console.warn('Session expired or unauthorized');
        }
        return Promise.reject(error);
    }
);

// Auth related API calls
export const authService = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
};

// Fuel related API calls
export const fuelService = {
    getStocks: () => api.get('/fuel/stocks'),
};

// Prediction related API calls
export const predictionService = {
    getForecast: () => api.get('/predictions/forecast'),
    getStaffing: (data) => api.post('/predictions/staffing', data),
};

// Attendance related API calls
export const attendanceService = {
    checkIn: (data) => api.post('/attendance/checkin', data),
    getActive: () => api.get('/attendance/active'),
};

// Employee related API calls
export const employeeService = {
    getAll: () => api.get('/employees'),
};

export default api;
