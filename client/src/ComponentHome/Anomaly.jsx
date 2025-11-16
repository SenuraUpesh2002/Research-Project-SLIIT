import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';

// Sample API endpoint to get anomaly results
const ANOMALY_API = 'http://localhost:8081/api/anomaly';

function Anomaly() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch anomaly data from backend
  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(ANOMALY_API);
      if (!response.ok) {
        throw new Error('Failed to fetch anomaly data');
      }
      const data = await response.json();
      setAnomalies(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" mb={3}>
        Fuel Anomaly Detection
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : anomalies.length === 0 ? (
        <Typography>No anomalies detected</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Fuel Type</TableCell>
                <TableCell>Dispensed Volume</TableCell>
                <TableCell>Anomaly Score</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {anomalies.map(({ id, date, fuelType, volume, score, status }) => (
                <TableRow key={id}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{fuelType}</TableCell>
                  <TableCell>{volume}</TableCell>
                  <TableCell>{score.toFixed(3)}</TableCell>
                  <TableCell>{status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={fetchAnomalies} disabled={loading}>
          Refresh Anomaly Data
        </Button>
      </Box>
    </Box>
  );
}

export default Anomaly;
