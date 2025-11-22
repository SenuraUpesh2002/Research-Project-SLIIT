import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress, Button } from "@mui/material";

function GeneralInformation() {
  const { stationId } = useParams(); // Or use location.state if passed as props/state
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch(`http://localhost:8081/fs-view2/${stationId}`);
        const data = await res.json();
        setInfo(data);
      } catch {
        setInfo(null);
      }
      setLoading(false);
    }
    fetchInfo();
  }, [stationId]);

  if (loading) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, maxWidth: 500, margin: "auto" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          General Station Information
        </Typography>
        {info ? (
          <>
            <Typography gutterBottom><b>Unique Station ID:</b> {info.Id}</Typography>
            <Typography gutterBottom><b>Station Name:</b> {info.Name}</Typography>
            <Typography gutterBottom><b>Location:</b> {info.Location}</Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#351B65" }}
              onClick={() => navigate(-1)}
            >Back</Button>
          </>
        ) : (
          <Typography color="error">No information found for this station!</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default GeneralInformation;
