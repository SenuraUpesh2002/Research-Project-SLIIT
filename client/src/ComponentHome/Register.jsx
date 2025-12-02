import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  IconButton,
  InputAdornment,
  Paper
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const roles = ["Admin", "Station Manager", "Data Analyst"];

function Register() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("error"); // "success" | "error" | "warning" |  "info"

  const handleClose = (_, reason) => {
  if (reason === "clickaway") return;
  setOpen(false);
};

setMsg("Email already exists");
setSeverity("error");
setOpen(true);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await fetch("http://localhost:8081/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      navigate("/Login");
      // Optionally navigate to login or home page
    } else {
      alert(result.error || "Registration failed");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  const handleLoginNavigate = () => {
    navigate("/Login");
  };

  return (
    <Paper elevation={6} sx={{ maxWidth: 500, margin: "auto", padding: 4, mt: 8 }}>
      <Typography variant="h5" mb={3} align="center" fontWeight="bold">
        Sign Up<br></br><h6>FuelWatch - Real Time Fuel Availability Monitoring</h6>
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="role-select-label">Select Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            label="Select Role"
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>,
          }}
        />

        <Button
  type="submit"
  variant="contained"
  fullWidth
  sx={{
    mt: 3,
    py: 1.5,
    fontWeight: "bold",
    backgroundColor: "#351B65",
    "&:hover": {
      backgroundColor: "#2a144d",  // A darker shade for hover effect
    },
  }}
>
  Register
</Button>

<Button
          variant="text"
          fullWidth
          onClick={handleLoginNavigate}
          sx={{
            mt: 2,
            fontWeight: "bold",
            color: "#351B65",
            "&:hover": {
              backgroundColor: "#ECEAF7"
            },
          }}
        >
          LOGIN
        </Button>


      </Box>

      <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          bgcolor: "#ff4b5c",
          color: "#fff",
          fontWeight: 600,
          borderRadius: 2,
          boxShadow: 3,
          "& .MuiAlert-icon": { color: "#fff" }
        }}
      >
        {msg}
      </Alert>
    </Snackbar>
    </Paper>
  );
}

export default Register;
