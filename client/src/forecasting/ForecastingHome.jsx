import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Dialog,
  DialogActions,
  DialogTitle,
} from '@mui/material';

function Forecastings() {
  const [forecastings, setForecastings] = useState([
    {
      officerName: "Mr.Ruwan Amarasinghe",
      place: "Finance Division",
      purpose: "Cash Transfer",
      requiredOn: "2024/10/10",
      returnOn: "2024/10/10",
      travellingOfficerNames: "Mr.Aruna Perera",
      contactNumber: "0711234567",
      officerSignature: "xxxx",
      approvedOrNot: "Not Approved",
      approvalSignature: "xxxx",
    },
  ]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForecastingNic, setSelectedRequisitionNic] = useState(null);

  const handleDelete = (userNic) => {
    setRequisitions(forecastings.filter((forecasting) => forecasting.nic !== userNic));
    alert("Forecasting deleted successfully!");
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (userNic) => {
    setSelectedForecastingNic(userNic);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedForecastingNic(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper sx={{ width: '90%', padding: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
           Forecasting
        </Typography>

        <Button
          component={Link}
          to="/create"
          variant="contained"
          color="success"
          sx={{ marginBottom: 2 }}
        >
          Add New Forecast
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Officer Name</TableCell>
                <TableCell align="center">Places Visit</TableCell>
                <TableCell align="center">Purpose</TableCell>
                <TableCell align="center">Required On</TableCell>
                <TableCell align="center">Expected Return On</TableCell>
                <TableCell align="center">Travelling Officers</TableCell>
                <TableCell align="center">Contact Number</TableCell>
                <TableCell align="center">Officer Signature</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Approval Signature</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forecastings.map((forecasting, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{forecasting.officerName}</TableCell>
                  <TableCell align="center">{forecasting.place}</TableCell>
                  <TableCell align="center">{forecasting.purpose}</TableCell>
                  <TableCell align="center">{forecasting.requiredOn}</TableCell>
                  <TableCell align="center">{forecasting.returnOn}</TableCell>
                  <TableCell align="center">{forecasting.travellingOfficerNames}</TableCell>
                  <TableCell align="center">{forecasting.contactNumber}</TableCell>
                  <TableCell align="center">{forecasting.officerSignature}</TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        color: forecasting.approvedOrNot === "Approved" ? "blue" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {forecasting.approvedOrNot}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{forecasting.approvalSignature}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button
                        component={Link}
                        to="/update"
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => openDeleteDialog(forecasting.nic)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Are you sure you want to delete this forecasting?</DialogTitle>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(selectedForecastingNic)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Forecastings;
