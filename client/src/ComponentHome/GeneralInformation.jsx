// src/pages/GeneralInformation.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

function GeneralInformation() {
  const [stationId, setStationId] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async () => {
    if (!stationId.trim()) {
      setErrorMsg("Please enter a Unique Station ID");
      setInfo(null);
      return;
    }
    setErrorMsg("");
    setLoading(true);
    setInfo(null);
    try {
      const res = await fetch(`http://localhost:8081/fs-general/${stationId}`);
      if (!res.ok) {
        throw new Error("Request failed");
      }
      const data = await res.json();
      if (!data || data.length === 0) {
        setErrorMsg("No information found for this station ID");
        setInfo(null);
      } else {
        // if backend returns an array, take first row
        setInfo(Array.isArray(data) ? data[0] : data);
      }
    } catch (err) {
      setErrorMsg("Error loading data. Please try again.");
      setInfo(null);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ mt: 8, px: 2 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 900,
          margin: "auto",
          background:
            "linear-gradient(135deg, #351B65 0%, #5C3FA3 40%, #ffffff 40%, #ffffff 100%)",
        }}
      >
        <Grid container spacing={3}>
          {/* Left side: form */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="white"
              gutterBottom
            >
              General Station Information
            </Typography>
            <Typography variant="body2" color="#E0D7FF" gutterBottom>
              Enter the Unique Station ID to view stored general information.
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              label="Unique Station ID"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              sx={{
                mt: 2,
                input: { color: "white" },
                label: { color: "#E0D7FF" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E0D7FF",
                },
              }}
            />

            {errorMsg && (
              <Typography
                variant="body2"
                color="#FFE0E0"
                sx={{ mt: 1, fontWeight: 500 }}
              >
                {errorMsg}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, backgroundColor: "#FFB300", fontWeight: "bold" }}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "View Information"}
            </Button>
          </Grid>

          {/* Right side: card with results */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #E0E0E0",
              }}
            >
              <CardContent>
                {!info && !loading && !errorMsg && (
                  <Typography color="text.secondary">
                    Station details will appear here once you search by ID.
                  </Typography>
                )}

                {loading && (
                  <Box textAlign="center" mt={4}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }} color="text.secondary">
                      Loading station information…
                    </Typography>
                  </Box>
                )}

                {info && !loading && (
                  <>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mb: 2, color: "#351B65" }}
                    >
                      Station Overview
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Unique Station ID
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {info.Id}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Station Name
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {info.Name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {info.Location}
                        </Typography>
                      </Grid>

                      {/* Add more fields from fs_general_information as needed */}
                      {info.ContactNumber && (
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Contact Number
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {info.ContactNumber}
                          </Typography>
                        </Grid>
                      )}

                      {info.OwnerName && (
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Owner Name
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {info.OwnerName}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      Data source: fs_general_information table.
                    </Typography>
                  </>
                )}

                {!info && !loading && errorMsg && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {errorMsg}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default GeneralInformation
