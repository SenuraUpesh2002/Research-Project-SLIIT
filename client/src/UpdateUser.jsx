import React, { useState } from "react";
import { Box, TextField, Button, Typography, Divider } from "@mui/material";

function UpdateUser() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
    nic: "",
    contact: "",
  });

  const handleClear = () => {
    setFormData({
      name: "",
      dob: "",
      address: "",
      nic: "",
      contact: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle the form submission
    alert("Driver information updated!");
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
            UPDATE DRIVER INFORMATION
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            required
          />

          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            margin="normal"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />

          <TextField
            fullWidth
            label="National Identity Card Number (NIC)"
            variant="outlined"
            margin="normal"
            value={formData.nic}
            onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
            required
          />

          <TextField
            fullWidth
            label="Contact Number"
            variant="outlined"
            margin="normal"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            required
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
            <Button type="button" variant="contained" color="error" onClick={handleClear}>
              Clear All
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default UpdateUser;
