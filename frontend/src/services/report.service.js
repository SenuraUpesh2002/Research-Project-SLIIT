import apiClient from './apiClient';

const reportService = {
  getReports: async (params) => {
    try {
      const response = await apiClient.get('/reports', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  getReportById: async (id) => {
    try {
      const response = await apiClient.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching report with ID ${id}:`, error);
      throw error;
    }
  },

  createReport: async (reportData) => {
    try {
      const response = await apiClient.post('/reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  updateReport: async (id, reportData) => {
    try {
      const response = await apiClient.put(`/reports/${id}`, reportData);
      return response.data;
    } catch (error) {
      console.error(`Error updating report with ID ${id}:`, error);
      throw error;
    }
  },

  deleteReport: async (id) => {
    try {
      const response = await apiClient.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting report with ID ${id}:`, error);
      throw error;
    }
  },
};

export default reportService;
