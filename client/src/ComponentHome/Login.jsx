import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, TextField, Button, Paper, Typography
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Login successful");
        // Redirect or store user info/token as needed
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <Paper elevation={6} sx={{ maxWidth: 400, margin: "auto", padding: 4, mt: 8 }}>
      <Typography variant="h5" mb={3} align="center" fontWeight="bold">
        Login
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
        {error && (
          <Typography color="error" mt={1} align="center">
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, fontWeight: "bold", backgroundColor: "#351B65",
            "&:hover": { backgroundColor: "#2a144d" }
          }}
        >
          Login
        </Button>
      </Box>
    </Paper>
  );
}

export default Login;
