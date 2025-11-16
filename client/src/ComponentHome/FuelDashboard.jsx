import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

function FuelDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "";

  const [open, setOpen] = useState(!!role);

  useEffect(() => {
    setOpen(!!role);
  }, [role]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const dashboardLinks = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Filling Station Information", icon: <InfoIcon />, path: "/StationInfo" },
    { label: "Fuel Level", icon: <LocalGasStationIcon />, path: "/fuel-level" },
    { label: "Sensor Readings", icon: <LocalGasStationIcon />, path: "/sensor" },
    { label: "Behavior Identification", icon: <LocalGasStationIcon />, path: "/anomaly" },
    { label: "Notifications", icon: <NotificationsActiveIcon />, path: "/notifications" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" }
  ];

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 200,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: "border-box",
            backgroundColor: "#9667d9",
            color: "#fff"
          }
        }}
      >
        <List>
          {dashboardLinks.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                marginY: 1,
                borderRadius: 2,
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
      
      {/* Notification popup for user role */}
      <Snackbar
        open={open}
        autoHideDuration={20000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%", background: "#351B65", color: "#fff", fontWeight: "bold" }}
        >
          {role ? `You are logged in as a ${role}` : ""}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FuelDashboard;
