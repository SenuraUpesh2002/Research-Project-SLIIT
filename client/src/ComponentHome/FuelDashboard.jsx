import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';  // Icon for Register
import { useNavigate } from "react-router-dom";

function FuelDashboard() {
  const navigate = useNavigate();

  const dashboardLinks = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Filling Station Information", icon: <InfoIcon />, path: "/StationInfo" },
    { label: "Fuel Level", icon: <LocalGasStationIcon />, path: "/fuel-level" },
    { label: "Sensor Readings", icon: <LocalGasStationIcon />, path: "/sensor" },
    { label: "Notifications", icon: <NotificationsActiveIcon />, path: "/notifications" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
    { label: "Register", icon: <PersonAddIcon />, path: "/register" }  // New Register option
  ];

  return (
    <Box sx={{ display: "flex" }}>
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
              button={true}
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
    </Box>
  );
}

export default FuelDashboard;
