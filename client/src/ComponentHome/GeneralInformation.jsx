import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  LinearProgress
} from "@mui/material";
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const time = now.toLocaleTimeString('en-US', { hour12: true });

  const formatted = `${year} - ${month} - ${date} - ${time}`;

  return (
    <h5 style={{ textAlign: 'center', color: '#42246A', marginBottom: '20px', fontWeight: '700' }}>
      {formatted}
    </h5>
  );
}


function GeneralInformation() {
  const { stationId } = useParams();
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (stationId) {
      setLoading(true);
      setApiError(null);
      fetch(`http://localhost:8081/api/fs_fuel_information/${stationId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setTanks(data);
            setApiError(null);
          } else if (data && data.error) {
            setApiError(data.error);
            setTanks([]);
          } else {
            setTanks([]);
            setApiError("Unknown error occurred or no data received.");
          }
          setLoading(false);
        })
        .catch((err) => {
          setApiError("Error loading fuel data: " + (err.message || err));
          setTanks([]);
          setLoading(false);
        });
    }
  }, [stationId]);

  return (
    <Box sx={{ background: "#f6f1fb", minHeight: "100vh", p: 0 }}>
      <Box sx={{ width: "80%", mx: "auto", pt: 8 }}>
        {/* Current date-time as h3 at top */}
        <DateTimeDisplay />

        <Typography variant="h4" sx={{ color: "#9667d9", mb: 2, fontWeight: 700 }}>
          Fuel Levels - Station {stationId}
        </Typography>

        {loading ? (
          <Box sx={{ pt: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ color: "#9667D9" }} />
          </Box>
        ) : apiError ? (
          <Typography color="error" sx={{ mt: 3 }}>
            {apiError}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mt: 2,
              justifyContent: "flex-start"
            }}
          >
            {tanks.length === 0 ? (
              <Typography>No fuel tank data found for this station.</Typography>
            ) : (
              tanks.map((tank, idx) => (
                <Card
                  key={`${tank.fuel_type}_${tank.tank_index}_${idx}`}
                  sx={{
                    minWidth: 240,
                    maxWidth: 300,
                    boxShadow: 6,
                    background: "#fff",
                    borderRadius: 3,
                    mb: 2
                  }}
                >
                  <CardHeader
                    avatar={<LocalGasStationIcon sx={{ color: "#9667d9", fontSize: 32 }} />}
                    title={tank.fuel_type}
                    subheader={`Tank ${tank.tank_index}`}
                    sx={{
                      background: "#ece6fa",
                      color: "#42246A",
                      py: 1.5,
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      textAlign: "center"
                    }}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Capacity: {tank.tank_capacity} L
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1, color: "#502c8f" }}>
                      Current: {tank.current_level} L
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={tank.percent_level || Math.round((tank.current_level / tank.tank_capacity) * 100)}
                      color={
                        (tank.percent_level || Math.round((tank.current_level / tank.tank_capacity) * 100)) < 10 ? "error"
                          : (tank.percent_level || Math.round((tank.current_level / tank.tank_capacity) * 100)) < 40 ? "warning"
                            : "success"
                      }
                      sx={{ height: 8, borderRadius: 5, mb: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: "#42246A" }}>
                      {tank.percent_level || Math.round((tank.current_level / tank.tank_capacity) * 100)}% Full
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default GeneralInformation;
