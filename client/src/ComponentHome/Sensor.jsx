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

// Helper to format timestamp string for table
function formatDateTime(ts) {
  if (!ts) return "-";
  try {
    const dt = typeof ts === "string" ? new Date(ts.replace(' ', 'T')) : new Date(ts);
    return dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts;
  }
}

// Returns "Active" if the record is the latest and within 15 mins, else "End"
function getRecordStatus(sensor, idx, sensors) {
  if (idx !== 0) return "End";
  if (!sensor.reading_time) return "End";
  const now = new Date();
  const readingDate = new Date(sensor.reading_time.replace(' ', 'T'));
  const diffMs = now - readingDate;
  const diffMins = diffMs / (1000 * 60);
  if (diffMins < 15) {
    return "Active";
  } else {
    return "End";
  }
}

const Sensor = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8081/sensor')
      .then(res => {
        let rows = [];
        if (Array.isArray(res.data)) {
          // Sort records with latest first (desc by time)
          rows = [...res.data].sort((a, b) => new Date(b.reading_time) - new Date(a.reading_time));
        } else if (res.data) {
          rows = [res.data];
        }
        setSensorData(rows);
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
        <Typography variant="h5" gutterBottom>
          Fuel Level Acquisition & Reading Ingestion – Sensor Based Data
        </Typography><br></br>
        
        {/* PHYSICAL DETAILS ONCE */}
        <Box sx={{ mb: 3, p: 2, border: "1px solid #e3e3e3", borderRadius: 2, bgcolor: "#f8f7fd" }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Sensor Identification Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography><b>Sensor Identity:</b> {SENSOR_TYPE}</Typography>
          <Typography><b>Installed Location:</b> {SENSOR_LOCATION}</Typography>
        </Box>

        {/* OPERATIONAL DETAILS TABLE */}
        {(!sensorData || sensorData.length === 0) ? (
          <Typography>No sensor data found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Tank Height</b></TableCell>
                <TableCell><b>Tank Width</b></TableCell>
                <TableCell><b>Reading</b></TableCell>
                <TableCell><b>Time</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensorData.map((sensor, idx) => {
                const statusLabel = getRecordStatus(sensor, idx, sensorData);
                return (
                  <TableRow key={sensor.id || idx}>
                    <TableCell>{sensor.id}</TableCell>
                    <TableCell>43.18</TableCell>
                    <TableCell>33.02</TableCell>
                    <TableCell>{sensor.reading}</TableCell>
                    <TableCell>{formatDateTime(sensor.reading_time)}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabel}
                        color={statusLabel === "Active" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default Sensor;
