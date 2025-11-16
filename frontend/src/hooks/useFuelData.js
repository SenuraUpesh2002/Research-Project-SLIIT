// src/hooks/useFuelData.js
import { useState, useEffect } from 'react';
import { generateMockFuelData, generateMockChartData } from '../services/mockData';
import { REFRESH_INTERVAL } from '../utils/constants';

export const useFuelData = () => {
  const [fuelData, setFuelData] = useState(generateMockFuelData());
  const [chartData, setChartData] = useState(generateMockChartData());
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = () => {
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setFuelData(generateMockFuelData());
      setChartData(generateMockChartData());
      setLastUpdate(new Date()); // LK time: +0530
      setLoading(false);
    }, 600); // Slight delay for realism
  };

  // Auto-refresh every REFRESH_INTERVAL (from constants.js)
  useEffect(() => {
    const interval = setInterval(refreshData, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [REFRESH_INTERVAL]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, []);

  return {
    fuelData,
    chartData,
    loading,
    lastUpdate,
    refreshData,
  };
};