import React, { useState } from 'react';
import { Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Use your image path (if in public folder, reference as /istockphoto-1367957675-612x612.jpg)
const backgroundImg = "/stationinfo.jpg";

const StationInfo = () => {
  const [proceeded, setProceeded] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255,0.75)",
            borderRadius: 4,
            py: 6,
            px: 2,
            textAlign: "center",
            boxShadow: 3,
          }}
        >
          {!proceeded ? (
            <Button
              variant="contained"
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                px: 4,
                py: 1,
                backgroundColor: "#351B65",
                mb: 1,
                mt: 1,
                '&:hover': { backgroundColor: "#2a154f" }
              }}
              onClick={() => {
                setProceeded(true);
                navigate('/fs-view1');
              }}
            >
              PROCEED WITH YOUR STATION
            </Button>
          ) : (
            <Button
              variant="outlined"
              sx={{
                fontWeight: "bold",
                px: 4,
                py: 2,
                color: "#351B65",
                borderColor: "#351B65",
                width: 300,
                '&:hover': { borderColor: "#2a154f" }
              }}
              onClick={() => setProceeded(false)}
            >
              BACK
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default StationInfo;
