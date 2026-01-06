import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
  const authToken = localStorage.getItem('authToken');
  console.log('Attaching auth token to request:', authToken);
  console.log('Authorization header being set:', authToken ? `Bearer ${authToken}` : 'None');
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default apiClient;



