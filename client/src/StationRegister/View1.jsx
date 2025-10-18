//Launching screen

import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import fuelwatchLogo from "../assets/fuelwatch_logo.png";

function View1() {
  const navigate = useNavigate(); // Initialize navigate

  const handleGetStartedClick = () => {
    navigate("/fs-view2"); // Path to navigate
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={fuelwatchLogo}
        alt="FuelWatch Logo"
        style={{ maxWidth: 240, marginBottom: 32 }}
      />
      <br /><br /><br />
      <Button
        variant="contained"
        size="large"
        sx={{
          fontWeight: "bold",
          letterSpacing: 1,
          fontSize: 18,
          backgroundColor: "#9667D9",
          "&:hover": {
            backgroundColor: "#351B65",
          },
        }}
        onClick={handleGetStartedClick} // Add click handler
      >
        Get Started
      </Button>
    </Box>
  );
}

export default View1;
