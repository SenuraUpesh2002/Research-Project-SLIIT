import apiClient from './apiClient';

const alertService = {
  getAllAlerts: async () => {
    try {
      const response = await apiClient.get('/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  getAlertById: async (id) => {
    try {
      const response = await apiClient.get(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alert with ID ${id}:`, error);
      throw error;
    }
  },

  createAlert: async (alertData) => {
    try {
      const response = await apiClient.post('/alerts', alertData);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  },

  updateAlert: async (id, alertData) => {
    try {
      const response = await apiClient.put(`/alerts/${id}`, alertData);
      return response.data;
    } catch (error) {
      console.error(`Error updating alert with ID ${id}:`, error);
      throw error;
    }
  },

  deleteAlert: async (id) => {
    try {
      const response = await apiClient.delete(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting alert with ID ${id}:`, error);
      throw error;
    }
  },
};

export default alertService;
