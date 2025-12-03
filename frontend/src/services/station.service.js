import apiClient from './apiClient';

const stationService = {
  getStations: async (params) => {
    try {
      const response = await apiClient.get('/stations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  },

  getStationById: async (id) => {
    try {
      const response = await apiClient.get(`/stations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching station with ID ${id}:`, error);
      throw error;
    }
  },

  createStation: async (stationData) => {
    try {
      const response = await apiClient.post('/stations', stationData);
      return response.data;
    } catch (error) {
      console.error('Error creating station:', error);
      throw error;
    }
  },

  updateStation: async (id, stationData) => {
    try {
      const response = await apiClient.put(`/stations/${id}`, stationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating station with ID ${id}:`, error);
      throw error;
    }
  },

  deleteStation: async (id) => {
    try {
      const response = await apiClient.delete(`/stations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting station with ID ${id}:`, error);
      throw error;
    }
  },
};

export default stationService;
