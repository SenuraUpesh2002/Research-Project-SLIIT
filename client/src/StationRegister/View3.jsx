import React, { useState } from "react";
import { Box, Button, TextField, Typography, Divider, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import fuelwatchLogo from "../assets/fuelwatch_logo.png";

// 12 hour times in half-hour intervals
const timeOptions = [
  "12:00 AM","12:30 AM","1:00 AM","1:30 AM","2:00 AM","2:30 AM","3:00 AM","3:30 AM",
  "4:00 AM","4:30 AM","5:00 AM","5:30 AM","6:00 AM","6:30 AM","7:00 AM","7:30 AM",
  "8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM",
  "4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM",
  "8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM"
];

function View3() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Id: "",
    PersonName: "",
    PersonDesignation: "",
    PersonEmail: "",
    ContactNumber: "",
    StartTime: "",
    EndTime: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Id.trim()) newErrors.Id = "Confidential Station ID is required.";
    if (!formData.PersonName.trim()) newErrors.PersonName = "Contact Person Name is required.";
    if (!formData.PersonDesignation.trim()) newErrors.PersonDesignation = "Contact Person Designation is required.";
    if (!formData.PersonEmail.trim()) newErrors.PersonEmail = "Contact Person Email is required.";
    if (!formData.ContactNumber.trim()) newErrors.ContactNumber = "Contact Number is required.";
    if (!formData.StartTime.trim()) newErrors.StartTime = "Start Time is required.";
    if (!formData.EndTime.trim()) newErrors.EndTime = "End Time is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClear = () => {
    setFormData({
      Id: "",
      PersonName: "",
      PersonDesignation: "",
      PersonEmail: "",
      ContactNumber: "",
      StartTime: "",
      EndTime: ""
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch('http://localhost:8081/fs-view3', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Contact details submitted successfully!");
        navigate("/fs-view4");
        handleClear();
      } else {
        alert(data.error || "Failed to submit.");
      }
    } catch (error) {
      alert("Error connecting to backend: " + error.message);
    }
  };

  const purpleColor = "#9667D9";

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
      <Box sx={{ position: "absolute", top: 24, left: 24 }}>
        <img
          src={fuelwatchLogo}
          alt="FuelWatch Logo"
          style={{ width: 100, height: "auto" }}
        />
      </Box>
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          mt: 30,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Filling Station - Contact Details
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            FuelWatch - Stage 2
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Filling Station Unique ID (Confidential ID)"
            variant="outlined"
            margin="normal"
            value={formData.Id}
            onChange={(e) => setFormData((prev) => ({ ...prev, Id: e.target.value }))}
            error={!!errors.Id}
            helperText={errors.Id}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor }
              }
            }}
          />
          <TextField
            fullWidth
            label="Contact Person Name"
            variant="outlined"
            margin="normal"
            value={formData.PersonName}
            onChange={(e) => setFormData((prev) => ({ ...prev, PersonName: e.target.value }))}
            error={!!errors.PersonName}
            helperText={errors.PersonName}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor }
              }
            }}
          />
          <TextField
            fullWidth
            label="Contact Person Designation"
            variant="outlined"
            margin="normal"
            value={formData.PersonDesignation}
            onChange={(e) => setFormData((prev) => ({ ...prev, PersonDesignation: e.target.value }))}
            error={!!errors.PersonDesignation}
            helperText={errors.PersonDesignation}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor }
              }
            }}
          />
          <TextField
            fullWidth
            label="Contact Person Email"
            variant="outlined"
            margin="normal"
            value={formData.PersonEmail}
            onChange={(e) => setFormData((prev) => ({ ...prev, PersonEmail: e.target.value }))}
            error={!!errors.PersonEmail}
            helperText={errors.PersonEmail}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor }
              }
            }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            variant="outlined"
            margin="normal"
            value={formData.ContactNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, ContactNumber: e.target.value }))}
            error={!!errors.ContactNumber}
            helperText={errors.ContactNumber}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor }
              }
            }}
          />
          <TextField
            select
            fullWidth
            label="Start Time"
            variant="outlined"
            margin="normal"
            value={formData.StartTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, StartTime: e.target.value }))
            }
            error={!!errors.StartTime}
            helperText={errors.StartTime}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor }
              }
            }}
          >
            {timeOptions.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="End Time"
            variant="outlined"
            margin="normal"
            value={formData.EndTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, EndTime: e.target.value }))
            }
            error={!!errors.EndTime}
            helperText={errors.EndTime}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: purpleColor },
                "&:hover fieldset": { borderColor: purpleColor },
                "&.Mui-focused fieldset": { borderColor: purpleColor }
              }
            }}
          >
            {timeOptions.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
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

export default View3;
