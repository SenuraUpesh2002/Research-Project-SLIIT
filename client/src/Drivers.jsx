import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from 'react-router-dom';


function Users() {

  const navigate = useNavigate();


  const [users, setUsers] = useState([
    {
      name: "senura",
      dob: "senura@gmail.com",
      address: 20,
      nic: 100700988,
      contact: "0712345666",
    },
  ]);

  const handleDelete = (userNic) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      setUsers(users.filter((user) => user.nic !== userNic));
      alert("User deleted successfully!");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "90%",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >

          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>Back</Button>

          <Typography variant="h5" component="div">
            Driver Biographics
          </Typography>
          <Button
            component={Link}
            to="/create"
            variant="contained"
            sx={{ backgroundColor: "darkblue" }}
          >
            Add New Driver
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Full Name</TableCell>
                <TableCell align="center">Date Of Birth</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">NIC</TableCell>
                <TableCell align="center">Contact Number</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.nic}>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.dob}</TableCell>
                  <TableCell align="center">{user.address}</TableCell>
                  <TableCell align="center">{user.nic}</TableCell>
                  <TableCell align="center">{user.contact}</TableCell>
                  <TableCell align="center">
                    <Button
                      component={Link}
                      to="/update"
                      variant="contained"
                      size="small"
                      sx={{
                        marginRight: 1,
                        backgroundColor: "navy",
                        color: "white",
                      }}
                      startIcon={<EditIcon />}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(user.nic)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Users;
