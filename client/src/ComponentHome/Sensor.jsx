import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Chip } from '@mui/material';

const Sensor = ({ stationId }) => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated API call, replace with your actual data fetching
  useEffect(() => {
    setTimeout(() => {
      setSensorData({
        stationName: 'CPC Colombo Main Station',
        sensors: [
          { id: 1, sensorType: 'Ultrasonic AJ-SR04T', installationDate: '2024-05-06', calibrationStatus: 'Calibrated', lastReading: 12.35, lastUpdated: '2025-10-30 09:15', status: 'Active' },
          { id: 2, sensorType: 'Temperature Sensor', installationDate: '2024-06-10', calibrationStatus: 'Pending', lastReading: 32.1, lastUpdated: '2025-10-30 09:10', status: 'Inactive' }
        ]
      });
      setLoading(false);
    }, 800);
  }, [stationId]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Sensor Data - {sensorData.stationName}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sensor ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Installation Date</TableCell>
              <TableCell>Calibration Status</TableCell>
              <TableCell>Last Reading</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sensorData.sensors.map(sensor => (
              <TableRow key={sensor.id}>
                <TableCell>{sensor.id}</TableCell>
                <TableCell>{sensor.sensorType}</TableCell>
                <TableCell>{sensor.installationDate}</TableCell>
                <TableCell>
                  <Chip
                    label={sensor.calibrationStatus}
                    color={sensor.calibrationStatus === 'Calibrated' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{sensor.lastReading}</TableCell>
                <TableCell>{sensor.lastUpdated}</TableCell>
                <TableCell>
                  <Chip
                    label={sensor.status}
                    color={sensor.status === 'Active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Sensor;
