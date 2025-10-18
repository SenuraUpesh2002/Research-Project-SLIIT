import axios from "axios";
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
    nic: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});

  // Function to validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.nic.trim()) newErrors.nic = "NIC is required.";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required.";
    else if (!/^\d+$/.test(formData.contact)) {
      newErrors.contact = "Contact number must contain only digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClear = () => {
    setFormData({ name: "", dob: "", address: "", nic: "", contact: "" });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .post("http://localhost:8081/create", formData)
      .then((res) => {
        alert(res.data.message || "User created successfully!");
        setFormData({ name: "", dob: "", address: "", nic: "", contact: "" });
      })
      .catch((err) => {
        console.error("Error submitting the form:", err);
        alert("Error occurred while submitting. Please try again.");
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#e3f2fd",
      }}
    >
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#ffffff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            ADD NEW DRIVER
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Mahapola Ports & Maritime Academy - Sri Lanka Ports Authority
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <TextField
            fullWidth
            type="date"
            label="Date Of Birth"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            value={formData.dob}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dob: e.target.value }))
            }
            error={!!errors.dob}
            helperText={errors.dob}
            required
          />

          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            margin="normal"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            error={!!errors.address}
            helperText={errors.address}
            required
          />

          <TextField
            fullWidth
            label="National Identity Card Number (NIC)"
            variant="outlined"
            margin="normal"
            value={formData.nic}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nic: e.target.value }))
            }
            error={!!errors.nic}
            helperText={errors.nic}
            required
          />

          <TextField
            fullWidth
            label="Contact Number"
            variant="outlined"
            margin="normal"
            value={formData.contact}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contact: e.target.value }))
            }
            error={!!errors.contact}
            helperText={errors.contact}
            required
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)} // Navigates to the previous page
              >
                Back
              </Button>
            </Box>

            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={handleClear}
            >
              Clear All
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default CreateUser;
