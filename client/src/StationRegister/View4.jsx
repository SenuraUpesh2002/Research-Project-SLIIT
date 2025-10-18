import React, { useState } from "react";
import { Box, Button, Typography, Divider, Checkbox, FormControlLabel, FormGroup, TextField, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import fuelwatchLogo from "../assets/fuelwatch_logo.png";

const fuelTypes = [
  { key: "Octane95", label: "Octane-95" },
  { key: "Octane92", label: "Octane-92" },
  { key: "SuperDiesel", label: "Super Diesel" },
  { key: "AutoDiesel", label: "Auto Diesel" },
  { key: "Kerosene", label: "Kerosene" }
];

const tankOptions = [1,2,3,4,5,6,7,8];

function View4() {
  const navigate = useNavigate();
  const [stationId, setStationId] = useState("");
  const [stationIdError, setStationIdError] = useState("");
  const [selectedFuels, setSelectedFuels] = useState({});
  const [numTanks, setNumTanks] = useState({});
  const [tankCapacities, setTankCapacities] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleCheckboxChange = (typeKey) => (event) => {
    const checked = event.target.checked;
    setSelectedFuels(prev => ({
      ...prev,
      [typeKey]: checked,
    }));
    if (!checked) {
      setNumTanks(prev => {
        const newObj = { ...prev };
        delete newObj[typeKey];
        return newObj;
      });
      setTankCapacities(prev => {
        const newObj = { ...prev };
        delete newObj[typeKey];
        return newObj;
      });
    }
  };

  const handleNumTanksChange = (typeKey) => (event) => {
    const tankCount = event.target.value;
    setNumTanks(prev => ({
      ...prev,
      [typeKey]: tankCount,
    }));
    setTankCapacities(prev => {
      const arr = Array(Number(tankCount)).fill("");
      return {
        ...prev,
        [typeKey]: arr
      };
    });
  };

  const handleCapacityChange = (typeKey, idx) => (event) => {
    const val = event.target.value;
    setTankCapacities(prev => {
      const arr = [...(prev[typeKey] || [])];
      arr[idx] = val;
      return {
        ...prev,
        [typeKey]: arr
      };
    });
  };

  const purpleColor = "#9667D9";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedFuelArray = fuelTypes
      .filter(f => selectedFuels[f.key])
      .map(f => ({
        fuelType: f.label,
        tanks: numTanks[f.key] || 1,
        capacities: tankCapacities[f.key] || []
      }));

    if (!stationId.trim()) {
      setStationIdError("Confidential Station ID is required.");
      return;
    }
    if (selectedFuelArray.length === 0) {
      alert("Please select at least one fuel type and number of tanks.");
      return;
    }
    for (const fuel of selectedFuelArray) {
      for (let i=0; i<fuel.tanks; i++) {
        if (!fuel.capacities[i] || isNaN(fuel.capacities[i]) || Number(fuel.capacities[i]) <= 0) {
          alert(`Enter valid positive number for ${fuel.fuelType} tank #${i+1}`);
          return;
        }
      }
    }
    setStationIdError("");
    setSubmitting(true);

    const result = { StationId: stationId, FuelInfo: selectedFuelArray };

    try {
      const res = await fetch('http://localhost:8081/fs-view4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Fuel information added successfully!");
        navigate(`/fs-view5/${stationId}`);
      } else {
        alert(data.error || "Failed to submit fuel information.");
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
    setSubmitting(false);
  };

  return (
    <Box sx={{
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#fff",
    }}>
      <Box sx={{ position: "absolute", top: 24, left: 24 }}>
        <img src={fuelwatchLogo} alt="FuelWatch Logo" style={{ width: 100, height: "auto" }}/>
      </Box>
      <Box sx={{
        width: "50%",
        backgroundColor: "#fff",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        mt: 10
      }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Filling Station - Fuel Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label="Filling Station Unique ID (Confidential ID)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={stationId}
            onChange={e => setStationId(e.target.value)}
            error={!!stationIdError}
            helperText={stationIdError}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor }
              }
            }}
          />
          <FormGroup sx={{ mt: 3 }}>
            {fuelTypes.map(fuel => (
              <Box key={fuel.key} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!selectedFuels[fuel.key]}
                      onChange={handleCheckboxChange(fuel.key)}
                      sx={{
                        color: purpleColor,
                        "&.Mui-checked": { color: purpleColor },
                      }}
                    />
                  }
                  label={fuel.label}
                />
                {!!selectedFuels[fuel.key] && (
                  <>
                    <TextField
                      select
                      label="Number of Tanks"
                      value={numTanks[fuel.key] || ""}
                      onChange={handleNumTanksChange(fuel.key)}
                      sx={{
                        ml: 2,
                        width: 150,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: purpleColor },
                          "&:hover fieldset": { borderColor: purpleColor },
                          "&.Mui-focused fieldset": { borderColor: purpleColor }
                        }
                      }}
                      required
                    >
                      {tankOptions.map(v => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                    </TextField>
                    {/* Capacity input fields for each tank */}
                    {
                      typeof numTanks[fuel.key] !== "undefined" &&
                      Array.from({ length: Number(numTanks[fuel.key] || 0) }, (_, idx) => (
                        <TextField
                          key={idx}
                          type="number"
                          label={`Tank ${idx + 1} Capacity (L)`}
                          required
                          inputProps={{ min: 1 }}
                          value={tankCapacities[fuel.key]?.[idx] || ""}
                          onChange={handleCapacityChange(fuel.key, idx)}
                          sx={{
                            ml: 2,
                            mb: 1,
                            width: 150,
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: purpleColor },
                              "&:hover fieldset": { borderColor: purpleColor },
                              "&.Mui-focused fieldset": { borderColor: purpleColor }
                            }
                          }}
                        />
                      ))
                    }
                  </>
                )}
              </Box>
            ))}
          </FormGroup>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ backgroundColor: purpleColor, "&:hover": { backgroundColor: "#351B65" }, borderRadius: 1 }}>
              Submit
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                color: purpleColor,
                borderColor: purpleColor,
                "&:hover": { borderColor: "#351B65", color: "#351B65" },
                borderRadius: 1,
              }}>
              Back
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default View4;
