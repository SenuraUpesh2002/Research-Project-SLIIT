import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Card, CardContent, CardHeader, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import fuelwatchLogo from "../assets/fuelwatch_logo.png";

function View5() {
  const { stationId } = useParams();
  const navigate = useNavigate(); // NEW: for navigation
  const [fuelData, setFuelData] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (stationId) {
      setLoading(true);
      setApiError(null);
      fetch(`http://localhost:8081/fs_fuel_information/${stationId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const grouped = {};
            data.forEach(row => {
              if (!grouped[row.fuel_type]) grouped[row.fuel_type] = [];
              grouped[row.fuel_type].push(row);
            });
            setFuelData(grouped);
            setApiError(null);
          } else if (data && data.error) {
            setApiError(data.error);
            setFuelData({});
          } else {
            setFuelData({});
            setApiError("Unknown error occurred or no data received.");
          }
          setLoading(false);
        })
        .catch((err) => {
          setFuelData({});
          setApiError("Error loading fuel data: " + (err.message || err));
          setLoading(false);
        });
    }
  }, [stationId]);

  // Navigation handler
  const handleNavigate = () => {
    navigate(`/FuelDashboard`);
  };

  return (
    <Box sx={{ background: "#f6f1fb", minHeight: "100vh", p: 0, position: "relative" }}>
      <Box sx={{ position: "absolute", top: 24, left: 1150 }}>
        <img src={fuelwatchLogo} alt="FuelWatch Logo" style={{ width: 100, height: "auto" }} />
      </Box>
      <Box sx={{ width: "80%", mx: "auto", pt: 8 }}>
        <Typography variant="h4" sx={{ color: "#9667d9", mb: 1.5, fontWeight: 600 }}>
          Selected Fuel Types & Tank Counts
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Fuel Station Unique ID: <span style={{ color: "#000000ff", fontWeight: 500 }}>{stationId}</span>
        </Typography>
        <Button
          variant="contained"
          sx={{ mb: 3, backgroundColor: "#42246A", "&:hover": { backgroundColor: "#311b4b" } }}
          onClick={handleNavigate}
        >
          Navigate To Console
        </Button>
        {loading ? (
          <Box sx={{ pt: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ color: "#9667D9" }} />
          </Box>
        ) : apiError ? (
          <Typography color="error" sx={{ mt: 3 }}>
            {apiError}
          </Typography>
        ) : (
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mt: 2,
            justifyContent: "flex-start"
          }}>
            {Object.keys(fuelData).length === 0 ? (
              <Typography>No fuel/tank data found for this station.</Typography>
            ) : (
              Object.entries(fuelData).map(([fuelType, tanks], idx) => (
                <Card key={fuelType + idx}
                  sx={{
                    minWidth: 220,
                    maxWidth: 320,
                    boxShadow: 6,
                    background: "#fff",
                    borderRadius: 3,
                  }}>
                  <CardHeader
                    title={fuelType}
                    sx={{
                      background: "#9667D9",
                      color: "white",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      py: 1.5,
                      textAlign: "center"
                    }} />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                      Number of Tanks: {tanks.length}
                    </Typography>
                    {tanks.map((t, i) => (
                      <Typography key={i} sx={{ fontSize: "1rem", mb: 0.5 }}>
                        Tank {t.tank_index}: {t.tank_capacity} L
                      </Typography>
                    ))}
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

export default View5;
