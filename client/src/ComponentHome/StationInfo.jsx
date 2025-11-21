import React, { useState } from 'react';
import { Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StationInfo = () => {
  const [proceeded, setProceeded] = useState(false);
  const navigate = useNavigate();

  // Show only the buttons, no data/cards/tables
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
        {!proceeded ? (
          <Button
            variant="contained"
            sx={{
              
              fontSize: "1rem",
              px: 4,
              py: 1,
              backgroundColor: "#351B65",
              mb: 4,
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
  );
};

export default StationInfo;
