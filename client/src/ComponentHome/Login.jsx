import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, TextField, Button, Paper, Typography, Snackbar, Alert
} from "@mui/material";

function Login() {
  const [uniqueid, setUniqueId] = useState("");          // NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("info"); // "success" | "error" | "warning" | "info"

  const navigate = useNavigate();

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueid, email, password }),   // include uniqueId
      });

      const result = await response.json();

      if (response.ok) {
        setMsg("Login successful");
        setSeverity("success");
        setOpen(true);
        navigate("/FuelDashboard", {
          state: { role: result.user.role, email: result.user.email }
        });
      } else {
        setMsg(result.error || "Login failed");
        setSeverity("error");
        setOpen(true);
      }
    } catch (err) {
      setMsg("Error: " + err.message);
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <Paper elevation={6} sx={{ maxWidth: 400, margin: "auto", padding: 4, mt: 8 }}>
      <Typography variant="h5" mb={3} align="center" fontWeight="bold">
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>

        {/* New Unique ID field before Email */}
        <TextField
          label="Unique Station ID"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={uniqueid}
          onChange={e => setUniqueId(e.target.value)}
        />

        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            fontWeight: "bold",
            backgroundColor: "#351B65",
            "&:hover": { backgroundColor: "#2a144d" }
          }}
        >
          Login
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
            bgcolor: severity === "success" ? "#2e7d32" : "#ff0019ff",
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

export default Login;
