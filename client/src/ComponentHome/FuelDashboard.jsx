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
  Alert,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Chip,
  Stack
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";


function FuelDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "";
  const email = location.state?.email || "";

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
    { label: "Sensor Health", icon: <LocalGasStationIcon />, path: "/sensor-health" },
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
      
      {/* Info panel right side (add your actual dashboard content here) */}
      <Box sx={{ flexGrow: 1, p: 4, marginLeft: 8 }}>
  <Card
    elevation={6}
    sx={{
      maxWidth: 380,
      background: "linear-gradient(90deg, #eceaff 0%, #e5d5fa 100%)",
      borderRadius: 4,
      p: 2,
      boxShadow: "0 8px 24px -8px #9667d9"
    }}
  >
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: "#351B65", width: 56, height: 56 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
      }
      title={
        <Typography variant="h6" fontWeight="bold" color="#351B65">
          {email || "No email"}
        </Typography>
      }
      subheader={
        <Stack direction="row" alignItems="center" spacing={1}>
          <WorkIcon sx={{ color: "#8051c9" }} />
          <Chip
            label={role || "No role"}
            sx={{
              background: "#8051c9",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem"
            }}
          />
        </Stack>
      }
    />
    <CardContent>
      <Typography variant="body2" color="#351B65">
        Welcome to your personalized dashboard. You are logged in with <b>{email}</b> as <b>{role}</b>.
      </Typography>
    </CardContent>
  </Card>
</Box>
      
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
          {role && email ? `You are logged in as ${role} ` : ""}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FuelDashboard;
