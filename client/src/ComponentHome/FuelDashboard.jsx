import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from "axios";

function FuelDashboard() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const [stationInfo, setStationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifCount, setNotifCount] = useState(1);
  const [activeSection, setActiveSection] = useState("stationInfo");

  // Fetch station info function
  const fetchStationInfo = () => {
    if (stationId) {
      setLoading(true);
      axios.get(`http://localhost:8081/api/fs_general_information/${stationId}`)
        .then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setStationInfo(res.data[0]);
          } else {
            setStationInfo(null);
          }
          setLoading(false);
        })
        .catch(() => {
          setStationInfo(null);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchStationInfo();
  }, [stationId]);

  // Sidebar drawer links with labels and icons
  const dashboardLinks = [
    { label: "Home", icon: <HomeIcon />, action: () => setActiveSection("home") },
    { label: "Station Info", icon: <InfoIcon />, action: () => navigate("StationInfo") },
    { label: "Fuel Level", icon: <LocalGasStationIcon />, action: () => navigate("FuelLevel") },
    { label: "Notifications", icon: <NotificationsActiveIcon />, action: () => setActiveSection("notifications") },
    { label: "Settings", icon: <SettingsIcon />, action: () => setActiveSection("settings") }
  ];

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f6f1fb", minHeight: "100vh" }}>
      {/* MUI Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: 200,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 200,
            boxSizing: "border-box",
            backgroundColor: "#9667d9",
            color: "#fff"
          }
        }}
      >
        <List>
          {dashboardLinks.map((item) => (
            <ListItem
              button={true}
              key={item.label}
              onClick={item.action}
              selected={activeSection === item.label.replace(/\s+/g, "").toLowerCase()}
              sx={{
                marginY: 1,
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: "#7b56c2"
                },
                "&:hover": {
                  backgroundColor: "#8051c9"
                }
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ bgcolor: "#fff" }} />
      </Drawer>

      {/* Main Dashboard Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* Header with icons */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h5" sx={{ color: "#9667d9", fontWeight: 700, letterSpacing: "0.015em" }}>
            Real-Time Fuel Availability Monitoring
          </Typography>
          <Box>
            <IconButton color="primary" onClick={fetchStationInfo}>
              <Tooltip title="Refresh Data">
                <RefreshIcon sx={{ fontSize: 28, color: "#502c8f" }} />
              </Tooltip>
            </IconButton>
            <IconButton color="primary">
              <Badge badgeContent={notifCount} color="error">
                <NotificationsActiveIcon sx={{ fontSize: 28, color: "#502c8f" }} />
              </Badge>
            </IconButton>
            <IconButton color="primary">
              <SettingsIcon sx={{ fontSize: 28, color: "#502c8f" }} />
            </IconButton>
          </Box>
        </Box>

        {/* Section Rendering */}
        {activeSection === "stationInfo" && (
          loading ? (
            <Card sx={{ boxShadow: 5, borderRadius: 3, maxWidth: 500, mx: "auto", my: 5, bgcolor: "#ece6fa" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <CircularProgress sx={{ color: "#9667d9", mb: 1 }} />
                <Typography variant="subtitle1" sx={{ color: "#9667d9" }}>
                  Loading station information...
                </Typography>
              </CardContent>
            </Card>
          ) : stationInfo ? (
            <Card sx={{ boxShadow: 8, borderRadius: 3, maxWidth: 520, mx: "auto", bgcolor: "#fff8fc", my: 5 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <InfoIcon sx={{ fontSize: 38, color: "#9667d9", mr: 1 }} />
                  <Typography variant="h6" sx={{ color: "#502c8f", fontWeight: 700 }}>
                    Station Details
                  </Typography>
                </Box>
                <Typography variant="subtitle1"><b>Station ID:</b> {stationInfo.Id}</Typography>
                <Typography variant="subtitle1"><b>Name:</b> {stationInfo.Name}</Typography>
                <Typography variant="subtitle1"><b>Location:</b> {stationInfo.Location}</Typography>
                <Typography variant="subtitle1"><b>Contact:</b> {stationInfo.Contact}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}><b>Last Updated:</b> {stationInfo.timestamp}</Typography>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ boxShadow: 5, borderRadius: 3, maxWidth: 500, mx: "auto", my: 5, bgcolor: "#fde2e2" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color="error" sx={{ fontWeight: 700 }}>
                  No general info found for this station.
                </Typography>
              </CardContent>
            </Card>
          )
        )}

        {/* Placeholder for other sections */}
        {(activeSection === "home" || activeSection === "notifications" || activeSection === "settings") && (
          <Typography variant="h5" color="text.secondary" align="center" mt={10}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section coming soon...
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default FuelDashboard;
