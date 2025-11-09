import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';

const SENSOR_TYPE = "JSN-SR04T-V3";
const SENSOR_LOCATION = "Tank-1-Octane-92";

function formatDateTime(ts) {
  if (!ts) return "-";
  // If ts is a Date, convert to string; else assume YYYY-MM-DD HH:mm:ss
  // (Backend MySQL usually gives as string)
  try {
    const dt = typeof ts === "string" ? new Date(ts.replace(' ', 'T')) : new Date(ts);
    if (isNaN(dt)) return ts;
    return dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts;
  }
}

const Sensor = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8081/sensor')
      .then(res => {
        if (Array.isArray(res.data)) {
          setSensorData(res.data);
        } else if (res.data) {
          setSensorData([res.data]);
        } else {
          setSensorData([]);
        }
        setBackendError(false);
        setLoading(false);
      })
      .catch(() => {
        setBackendError(true);
        setSensorData([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (backendError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#ffeaea' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Cannot connect to backend server!
          </Typography>
          <Typography>
            Ensure your Node.js/Express API is running at <b>http://localhost:8081</b> and try again.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Fuel Level Acquisition & Ingestion – Real Sensor Data
        </Typography>
        
        {/* PHYSICAL DETAILS ONCE */}
        <Box sx={{ mb: 3, p: 2, border: "1px solid #e3e3e3", borderRadius: 2, bgcolor: "#f8f7fd" }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Physical Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography><b>Type:</b> {SENSOR_TYPE}</Typography>
          <Typography><b>Location:</b> {SENSOR_LOCATION}</Typography>
        </Box>

        {/* OPERATIONAL DETAILS TABLE */}
        {(!sensorData || sensorData.length === 0) ? (
          <Typography>No sensor data found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Reading</b></TableCell>
                <TableCell><b>Time</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensorData.map((sensor, idx) => (
                <TableRow key={sensor.id || idx}>
                  <TableCell>{sensor.id}</TableCell>
                  <TableCell>{sensor.reading}</TableCell>
                  <TableCell>{formatDateTime(sensor.reading_time)}</TableCell>
                  <TableCell>
                    <Chip
                      label={sensor.reading > 0 ? "Active" : "Inactive"}
                      color={sensor.reading > 0 ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default Sensor;
