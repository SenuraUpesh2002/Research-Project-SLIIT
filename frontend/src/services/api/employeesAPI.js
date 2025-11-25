import api from './api'; // axios instance

const employeesAPI = {
  login: (email, password) => api.post('/api/employees/login', { email, password }).then(res => res.data),
  getAll: () => api.get('/api/employees').then(res => res.data),
  getById: (id) => api.get(`/api/employees/${id}`).then(res => res.data),
  create: (data) => api.post('/api/employees', data).then(res => res.data),
  update: (id, data) => api.put(`/api/employees/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/api/employees/${id}`).then(res => res.data),
  search: (term) => api.get(`/api/employees/search?q=${term}`).then(res => res.data),
  getStatistics: (stationId) => api.get(`/api/employees/statistics${stationId ? `?stationId=${stationId}` : ''}`).then(res => res.data),
};

export default employeesAPI;