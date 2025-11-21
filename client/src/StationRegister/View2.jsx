import React, { useState } from "react";
import { Box, Button, TextField, Typography, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import fuelwatchLogo from "../assets/fuelwatch_logo.png";

function View2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Location: "",
  });
  const [errors, setErrors] = useState({});
  const [autoFillError, setAutoFillError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitError, setSubmitError] = useState("");
  const purpleColor = "#351B65";

  // Auto-fill handler when typing Station ID
  const handleIdChange = async (e) => {
    const value = e.target.value.trim().toUpperCase();
    setFormData((prev) => ({
      ...prev,
      Id: value,
      Name: "",
      Location: "",
    }));
    setSuccessMsg("");
    setSubmitError("");

    if (value === "") {
      setAutoFillError("");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8081/api/fs_ceypetco/${value}`);
      if (res.data && res.data.Name) {
        setFormData({
          Id: value,
          Name: res.data.Name,
          Location: res.data.Location,
        });
        setAutoFillError("");
      } else {
        setFormData({ Id: value, Name: "", Location: "" });
        setAutoFillError("⚠️ No matching station found for this ID.");
      }
    } catch (err) {
      console.error("Error fetching station:", err);
      setFormData({ Id: value, Name: "", Location: "" });
      setAutoFillError("❌ Error - Wrong ID.");
    }
  };

  // Validate before submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.Id.trim()) newErrors.Id = "Station ID is required.";
    if (!formData.Name.trim()) newErrors.Name = "Station Name is required.";
    if (!formData.Location.trim()) newErrors.Location = "Location is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form to backend (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setSubmitError("");

    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:8081/fs-view2", formData);
      setSuccessMsg("✅ " + res.data.message);
      setAutoFillError("");
      setErrors({});
      navigate('/fs-view3');  // Navigate to View3.jsx after success
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError("❌ Failed to save data. Please try again.");
    }
  };

  // Clear button handler
  const handleClear = () => {
    setFormData({ Id: "", Name: "", Location: "" });
    setErrors({});
    setAutoFillError("");
    setSuccessMsg("");
    setSubmitError("");
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      {/* Logo */}
      <Box sx={{ position: "absolute", top: 24, left: 24 }}>
        <img
          src={fuelwatchLogo}
          alt="FuelWatch Logo"
          style={{ width: 100, height: "auto" }}
        />
      </Box>

      {/* Form Box */}
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Filling Station - General Information
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            FuelWatch - Stage 1
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Station ID */}
          <TextField
            fullWidth
            label="Filling Station Unique ID (Confidential ID)"
            variant="outlined"
            margin="normal"
            value={formData.Id}
            onChange={handleIdChange}
            error={!!errors.Id}
            helperText={errors.Id || autoFillError}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor },
              },
            }}
          />

          {/* Station Name */}
          <TextField
            fullWidth
            label="Filling Station Name"
            variant="outlined"
            margin="normal"
            value={formData.Name}
            InputProps={{ readOnly: true }}
            error={!!errors.Name}
            helperText={errors.Name}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor },
              },
            }}
          />

          {/* Location */}
          <TextField
            fullWidth
            label="Location"
            variant="outlined"
            margin="normal"
            value={formData.Location}
            InputProps={{ readOnly: true }}
            error={!!errors.Location}
            helperText={errors.Location}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor },
              },
            }}
          />

          {/* Success / Error Messages */}
          {successMsg && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMsg}
            </Alert>
          )}
          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: purpleColor,
                  "&:hover": { backgroundColor: "#351B65" },
                  borderRadius: 1,
                }}
              >
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
                }}
              >
                Back
              </Button>
            </Box>

            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={handleClear}
              sx={{
                backgroundColor: purpleColor,
                "&:hover": { backgroundColor: "#351B65" },
                borderRadius: 1,
              }}
            >
              Clear All
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default View2;
