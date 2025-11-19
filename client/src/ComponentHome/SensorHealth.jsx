import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Chip
} from '@mui/material';
import axios from 'axios';

const API_BASE = 'http://localhost:8081';

function SensorHealth() {
  const [health, setHealth] = useState({ active: false, diffMins: 0, avgReading: 0 });
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [testMessage, setTestMessage] = useState('');

  // Fetch sensor health status every 30 secs
  const fetchHealth = () => {
    setLoadingHealth(true);
    axios.get(`${API_BASE}/sensor/health`)
      .then(res => {
        setHealth(res.data);
        setLoadingHealth(false);
      })
      .catch(() => {
        setHealth({ active: false, diffMins: 9999, avgReading: 0 });
        setLoadingHealth(false);
      });
  };

  useEffect(() => {
    fetchHealth();
    const intervalId = setInterval(fetchHealth, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const triggerTestSensor = () => {
    setTestMessage('');
    axios.post(`${API_BASE}/sensor/test`)
      .then(res => {
        setTestMessage(res.data.message);
      })
      .catch(() => {
        setTestMessage('Test failed to trigger.');
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Sensor Health Status</Typography>

      {loadingHealth ? (<CircularProgress />) : (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={health.active ? "Sensor Active" : "Sensor Inactive"}
            color={health.active ? "success" : "error"}
            size="medium"
          />
          <Typography sx={{ mt: 1 }}>
            Last reading {Math.round(health.diffMins)} minutes ago. Average reading: {health.avgReading ? health.avgReading.toFixed(2) : "N/A"} cm
          </Typography>
        </Box>
      )}

      <Button variant="contained" onClick={triggerTestSensor} sx={{ mb: 1 }}>Test Sensor</Button>
      {testMessage && <Typography>{testMessage}</Typography>}
    </Box>
  );
}

export default SensorHealth;
