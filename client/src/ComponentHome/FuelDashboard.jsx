import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from "react-router-dom";

function FuelDashboard() {
  const navigate = useNavigate();

  const dashboardLinks = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Filling Station Information", icon: <InfoIcon />, path: "/StationInfo" },
    { label: "Fuel Level", icon: <LocalGasStationIcon />, path: "/fuel-level" },
    { label: "Sensor Readings", icon: <LocalGasStationIcon />, path: "/sensor" },
    { label: "Behavior Identification", icon: <LocalGasStationIcon />, path: "/anomaly" },
    { label: "Notifications", icon: <NotificationsActiveIcon />, path: "/notifications" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" }
  ];

  const handleRegisterClick = () => {
    navigate("/register");
  };

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

      {/* Register button positioned top right */}
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1300, // higher than Drawer
        }}
      >
        <Tooltip title="Register">
          <IconButton
            color="primary"
            onClick={handleRegisterClick}
            sx={{
              bgcolor: "#351B65",
              color: "#fff",
              "&:hover": {
                bgcolor: "#9667D9"
              }
            }}
            size="large"
          >
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default FuelDashboard;
