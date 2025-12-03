import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../constants/api';

const useStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.STATIONS.GET_ALL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStations(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return { stations, loading, error };
};

export default useStations;
