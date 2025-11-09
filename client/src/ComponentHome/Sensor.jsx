import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';

const Sensor = ({ stationId }) => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/sensor') // Your server endpoint
      .then(res => {
        setSensorData(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Fuel Level Acquisition & Ingestion – Real Sensor Data
        </Typography>
        {sensorData.length === 0 && <Typography>No sensor data found.</Typography>}
        {sensorData.map((sensor, idx) => (
          <Paper key={sensor.id} elevation={2} sx={{ p: 2, mb: 4, bgcolor: idx % 2 === 0 ? "#f8f7fd" : "#f3f9ee" }}>
            <Grid container spacing={2}>
              {/* Physical Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px solid #e3e3e3', borderRadius: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Physical Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography><b>Sensor ID:</b> {sensor.id}</Typography>
                  <Typography><b>Type:</b> JSN-SR04T-V3</Typography>
                  <Typography><b>Location:</b> Tank 1</Typography>
                  <Typography><b>Installation Date:</b> {sensor.reading_time ? sensor.reading_time.split(' ')[0] : '-'}</Typography>
                </Box>
              </Grid>
              {/* Operational Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: '1px solid #e3e3e3', borderRadius: 2 }}>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    Operational Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography>
                    <b>Last Reading:</b> {sensor.reading}
                  </Typography>
                  <Typography>
                    <b>Last Updated:</b> {sensor.reading_time}
                  </Typography>
                  <Typography>
                    <b>Status:</b>{' '}
                    <Chip
                      label={sensor.reading > 0 ? 'Active' : 'Inactive'}
                      color={sensor.reading > 0 ? 'success' : 'error'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default Sensor;
