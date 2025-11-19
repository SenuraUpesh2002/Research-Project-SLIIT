import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
  Tooltip,
  LinearProgress,
  Divider,
  Stack,
} from "@mui/material";
import axios from "axios";

const API_BASE = "http://localhost:8081";

function SensorHealth() {
  const [health, setHealth] = useState({
    active: false,
    diffMins: 0,
    avgReading: 0,
  });
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [testMessage, setTestMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Fetch sensor health status every 30 secs
  const fetchHealth = () => {
    setLoadingHealth(true);
    axios
      .get(`${API_BASE}/sensor/health`)
      .then((res) => {
        setHealth(res.data);
        setLoadingHealth(false);
      })
      .catch(() => {
        setHealth({ active: false, diffMins: 9999, avgReading: 0 });
        setLoadingHealth(false);
        setSnackbarSeverity("error");
        setTestMessage("Unable to get sensor health status.");
        setOpenSnackbar(true);
      });
  };

  useEffect(() => {
    fetchHealth();
    const intervalId = setInterval(fetchHealth, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const triggerTestSensor = () => {
    setTestMessage("");
    axios
      .post(`${API_BASE}/sensor/test`)
      .then((res) => {
        setTestMessage(res.data.message);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      })
      .catch(() => {
        setTestMessage("Test failed to trigger.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const progressValue = health.avgReading
    ? Math.min((health.avgReading / 37.78) * 100, 100)
    : 0;

  return (
    <Paper elevation={6} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 6 }}>
      <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
        Sensor Health Status
      </Typography>  <br></br>

      {loadingHealth ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={60} thickness={5} />
        </Box>
      ) : (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Chip
              label={health.active ? "Sensor Active" : "Sensor Inactive"}
              color={health.active ? "success" : "error"}
              size="medium"
              sx={{ fontWeight: "bold", fontSize: 16, px: 2, py: 1 }}
            />
            <Tooltip title="Minutes since last sensor reading">
              <Typography variant="subtitle1" color="text.secondary">
                {Math.round(health.diffMins)} minutes ago
              </Typography>
            </Tooltip>
          </Stack> <br></br>

          <Box mb={3}>
            <Typography gutterBottom fontWeight="medium" color="text.secondary">
              Average Sensor Reading (cm)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 20,
                borderRadius: 2,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  bgcolor: progressValue > 80 ? "error.main" : "success.main",
                  transition: "width 1s ease-in-out",
                },
              }}
            />
            <Typography
              mt={1}
              variant="body1"
              align="center"
              fontWeight="medium"
              color={progressValue > 80 ? "error.main" : "green"}
            >
              {health.avgReading ? health.avgReading.toFixed(2) : "N/A"} cm
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={triggerTestSensor}
            aria-label="Test Sensor Button"
          >
            Test Sensor
          </Button>
        </>
      )}

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {testMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default SensorHealth;
