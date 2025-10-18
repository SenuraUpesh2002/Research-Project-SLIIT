import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Chip } from '@mui/material';
// Import your API function here
// import { fetchStationInfo } from '../api/stationApi';

const StationInfo = ({ stationId }) => {
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy fetch, replace with your actual API call
  useEffect(() => {
    // Simulate API
    setTimeout(() => {
      setStationData({
        name: 'CPC Colombo Main Station',
        location: 'Colombo 07, Sri Lanka',
        contact: '+94 11 1234567',
        noOfTanks: 2,
        status: 'Active',
        tanks: [
          { id: 1, type: 'Petrol 92', capacity: 20_000, currentLevel: 12_350, lastUpdated: '2025-10-14 11:30', sensorStatus: 'OK' },
          { id: 2, type: 'Auto Diesel', capacity: 10_000, currentLevel: 9_750, lastUpdated: '2025-10-14 11:25', sensorStatus: 'OK' }
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
          {stationData.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Location: {stationData.location}
        </Typography>
        <Typography variant="subtitle2">Contact: {stationData.contact}</Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
          No of Tanks: {stationData.noOfTanks}{' '}
          {stationData.status === 'Active'
            ? <Chip label="Active" color="success" size="small" />
            : <Chip label="Inactive" color="error" size="small" />}
        </Typography>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Tank Details</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tank ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Capacity (L)</TableCell>
                <TableCell>Current Level (L)</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Sensor Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stationData.tanks.map(tank => (
                <TableRow key={tank.id}>
                  <TableCell>{tank.id}</TableCell>
                  <TableCell>{tank.type}</TableCell>
                  <TableCell>{tank.capacity}</TableCell>
                  <TableCell>
                    {tank.currentLevel}
                    <Chip
                      label={`${Math.round((tank.currentLevel / tank.capacity) * 100)}%`}
                      color={tank.currentLevel < tank.capacity * 0.2 ? 'error' : 'primary'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </TableCell>
                  <TableCell>{tank.lastUpdated}</TableCell>
                  <TableCell>
                    <Chip
                      label={tank.sensorStatus}
                      color={tank.sensorStatus === 'OK' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
};

export default StationInfo;
