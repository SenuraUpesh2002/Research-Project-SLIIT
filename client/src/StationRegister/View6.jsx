import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

function View6() {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [fuelData, setFuelData] = useState([]);
  const [capacities, setCapacities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch fuel types and tank counts from backend on mount
  useEffect(() => {
    async function fetchFuelData() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8081/fs_fuel_information/${stationId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fuel data");
        }
        const data = await response.json();

        setFuelData(data);

        // Initialize capacities state for each tank in each fuel type
        const initialCapacities = {};
        data.forEach(({ fuel_type, number_of_tanks }) => {
          initialCapacities[fuel_type] = Array(number_of_tanks).fill("");
        });
        setCapacities(initialCapacities);

        setError("");
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (stationId) {
      fetchFuelData();
    }
  }, [stationId]);

  // Handler for each tank capacity input change
  const handleCapacityChange = (fuelType, index, value) => {
    setCapacities((prev) => {
      const newCaps = { ...prev };
      newCaps[fuelType][index] = value;
      return newCaps;
    });
  };

  // Form submit handler to send tank capacity data to backend or process it
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation: all fields must be filled with positive numbers
    for (const [fuelType, tanks] of Object.entries(capacities)) {
      for (let i = 0; i < tanks.length; i++) {
        if (!tanks[i] || isNaN(tanks[i]) || Number(tanks[i]) <= 0) {
          setError(
            `Enter valid positive capacity for ${fuelType} tank #${i + 1}`
          );
          return;
        }
      }
    }

    setError("");
    console.log("Submitting capacities:", capacities);

    // TODO: Add backend API call here with capacities data

    // For example: navigate back or display success message
    alert("Tank capacities submitted successfully!");
    navigate(-1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f6f1fb",
        }}
      >
        <CircularProgress sx={{ color: "#42246A" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f6f1fb",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f6f1fb", minHeight: "100vh", p: 4 }}>
      <Paper sx={{ maxWidth: 700, mx: "auto", p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          sx={{ mb: 4, color: "#42246A", fontWeight: "bold", textAlign: "center" }}
        >
          Add Tank Capacities for Station ID: {stationId}
        </Typography>

        <form onSubmit={handleSubmit}>
          {fuelData.length === 0 ? (
            <Typography>No fuel information found for this station.</Typography>
          ) : (
            fuelData.map(({ fuel_type, number_of_tanks }) => (
              <Box key={fuel_type} sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "#42246A", fontWeight: "medium" }}
                >
                  {fuel_type}
                </Typography>
                {Array.from({ length: number_of_tanks }, (_, idx) => (
                  <TextField
                    key={idx}
                    label={`Tank ${idx + 1} Capacity (Liters)`}
                    value={capacities[fuel_type]?.[idx] || ""}
                    onChange={(e) =>
                      handleCapacityChange(fuel_type, idx, e.target.value)
                    }
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ mr: 3, mb: 2, width: "220px" }}
                    required
                  />
                ))}
              </Box>
            ))
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ color: "#42246A", borderColor: "#42246A" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#42246A" }}
            >
              Save Capacities
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default View6;
