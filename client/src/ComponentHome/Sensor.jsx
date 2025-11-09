import React, { useEffect, useState } from 'react';
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
    setTimeout(() => {
      setSensorData({
        stationName: 'CPC Colombo Main Station',
        sensors: [
          {
            id: 1,
            sensorType: 'Ultrasonic AJ-SR04T',
            installationDate: '2024-05-06',
            location: 'Tank 1 (Petrol 92)',
            manufacturer: 'Aojie Tech',
            calibrationStatus: 'Calibrated',
            lastReading: 12.35,
            lastUpdated: '2025-10-30 09:15',
            status: 'Active'
          },
          {
            id: 2,
            sensorType: 'Temperature Sensor DS18B20',
            installationDate: '2024-06-10',
            location: 'Tank 1 (Petrol 92)',
            manufacturer: 'Maxim Integrated',
            calibrationStatus: 'Pending',
            lastReading: 32.1,
            lastUpdated: '2025-10-30 09:10',
            status: 'Inactive'
          }
        ]
      });
      setLoading(false);
    }, 800);
  }, [stationId]);

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
          Sensor Data – {sensorData.stationName}
        </Typography>
        {sensorData.sensors.map((sensor, idx) => (
          <Paper key={sensor.id} elevation={2} sx={{ p: 2, mb: 4, bgcolor: idx % 2 === 0 ? "#f8f7fd" : "#f3f9ee" }}>
            <Grid container spacing={2}>
              {/* Physical Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Physical Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography><b>Sensor ID:</b> {sensor.id}</Typography>
                  <Typography><b>Type:</b> {sensor.sensorType}</Typography>
                  <Typography><b>Manufacturer:</b> {sensor.manufacturer}</Typography>
                  <Typography><b>Installation Date:</b> {sensor.installationDate}</Typography>
                  <Typography><b>Location:</b> {sensor.location}</Typography>
                </Box>
              </Grid>
              {/* Operational Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    Operational Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography>
                    <b>Calibration Status:</b>{' '}
                    <Chip
                      label={sensor.calibrationStatus}
                      color={sensor.calibrationStatus === 'Calibrated' ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography>
                    <b>Last Reading:</b> {sensor.lastReading}
                  </Typography>
                  <Typography>
                    <b>Last Updated:</b> {sensor.lastUpdated}
                  </Typography>
                  <Typography>
                    <b>Status:</b>{' '}
                    <Chip
                      label={sensor.status}
                      color={sensor.status === 'Active' ? 'success' : 'error'}
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
