import apiClient from './apiClient';

const submissionService = {
  getSubmissions: async (params) => {
    try {
      const response = await apiClient.get('/submissions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  },

  getSubmissionById: async (id) => {
    try {
      const response = await apiClient.get(`/submissions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching submission with ID ${id}:`, error);
      throw error;
    }
  },

  createSubmission: async (submissionData) => {
    try {
      const response = await apiClient.post('/submissions', submissionData);
      return response.data;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  },

  updateSubmission: async (id, submissionData) => {
    try {
      const response = await apiClient.put(`/submissions/${id}`, submissionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating submission with ID ${id}:`, error);
      throw error;
    }
  },

  deleteSubmission: async (id) => {
    try {
      const response = await apiClient.delete(`/submissions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting submission with ID ${id}:`, error);
      throw error;
    }
  },
};

export default submissionService;
