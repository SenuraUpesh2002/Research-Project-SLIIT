import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

function FuelDashboard() {
  // Sidebar drawer links
  const dashboardLinks = [
    { label: "Home", icon: <HomeIcon /> },
    { label: "Station Info", icon: <InfoIcon /> },
    { label: "Fuel Level", icon: <LocalGasStationIcon /> },
    { label: "Notifications", icon: <NotificationsActiveIcon /> },
    { label: "Settings", icon: <SettingsIcon /> }
  ];

  return (
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
  );
}

export default FuelDashboard;
