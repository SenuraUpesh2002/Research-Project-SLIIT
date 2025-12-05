// src/pages/Anomaly.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Drawer,
  Divider,
  Button,
  CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ANOMALY_API = "http://localhost:8081/api/anomaly";

// Sample data for single station ST001 - replace with real API data
const SAMPLE_ANOMALIES = [
  {
    id: 1,
    date: "2025-12-04 10:45 AM",
    stationId: "ST001",
    stationName: "Ceypetco - Colombo 7",
    fuelType: "Petrol 92",
    volume: -1250,
    score: 0.945,
    status: "Critical",
    reason: "Sudden drop of 1250L (92% of tank) detected within 15 minutes - potential theft/leakage"
  },
  {
    id: 2,
    date: "2025-12-04 09:30 AM",
    stationId: "ST001",
    stationName: "Ceypetco - Colombo 7",
    fuelType: "Diesel",
    volume: 850,
    score: 0.823,
    status: "Warning",
    reason: "Unusually rapid refill (850L in 8 minutes) outside normal delivery hours"
  },
  {
    id: 3,
    date: "2025-12-04 08:15 AM",
    stationId: "ST001",
    stationName: "Ceypetco - Colombo 7",
    fuelType: "Petrol 95",
    volume: -45,
    score: 0.712,
    status: "Warning",
    reason: "High consumption rate detected during low-traffic morning hours"
  },
  {
    id: 4,
    date: "2025-12-04 07:22 AM",
    stationId: "ST001",
    stationName: "Ceypetco - Colombo 7",
    fuelType: "Petrol 92",
    volume: 320,
    score: 0.456,
    status: "Resolved",
    reason: "Previously flagged rapid refill confirmed as legitimate delivery"
  },
  {
    id: 5,
    date: "2025-12-03 11:10 PM",
    stationId: "ST001",
    stationName: "Ceypetco - Colombo 7",
    fuelType: "Diesel",
    volume: -210,
    score: 0.678,
    status: "Warning",
    reason: "Nighttime consumption spike detected - verify CCTV footage"
  },
  {
    id: 6,
    date: "2025-12-03 06:45 PM",
    stationId: "ST001",
    stationName: "Ceypetco - Colombo 7",
    fuelType: "Petrol 95",
    volume: -78,
    score: 0.389,
    status: "Info",
    reason: "Moderate deviation from expected evening consumption pattern"
  },
  {
    id: 7,
    date: "2025-12-03 03:20 PM",
    stationId: "ST001",
    stationName: "Ceypetco - Colombo 7",
    fuelType: "Petrol 92",
    volume: -950,
    score: 0.891,
    status: "Critical",
    reason: "Extreme drop detected (950L in 20 minutes) - immediate investigation required"
  },
  {
    id: 8,
    date: "2025-12-03 01:15 PM",
    stationId: "ST001",
    stationName: "Ceypetco - Colombo 7",
    fuelType: "Diesel",
    volume: 420,
    score: 0.521,
    status: "Warning",
    reason: "Accelerated refill rate detected during peak lunch hours"
  }
];

// helper for table sort
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function Anomaly() {
  const [anomalies, setAnomalies] = useState(SAMPLE_ANOMALIES); // Use sample data initially
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useSampleData, setUseSampleData] = useState(true); // Toggle for demo

  const [fuelFilter, setFuelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchId, setSearchId] = useState("");

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("score");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      if (useSampleData) {
        setAnomalies(SAMPLE_ANOMALIES);
      } else {
        const res = await fetch(ANOMALY_API);
        if (!res.ok) throw new Error("Failed to fetch anomaly data");
        const data = await res.json();
        setAnomalies(data || []);
      }
    } catch (err) {
      setError(err.message);
      // Fallback to sample data on API error
      setAnomalies(SAMPLE_ANOMALIES);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnomalies();
  }, [useSampleData]);

  // unique fuel types from data
  const fuelTypes = useMemo(
    () => ["All", ...Array.from(new Set(anomalies.map(a => a.fuelType)))],
    [anomalies]
  );

  // apply filters + search
  const filtered = useMemo(
    () =>
      anomalies.filter(a => {
        const fuelOk = fuelFilter === "All" || a.fuelType === fuelFilter;
        const statusOk = statusFilter === "All" || a.status === statusFilter;
        const idOk = !searchId || String(a.id).toLowerCase().includes(searchId.toLowerCase());
        return fuelOk && statusOk && idOk;
      }),
    [anomalies, fuelFilter, statusFilter, searchId]
  );

  const sorted = useMemo(
    () => filtered.slice().sort(getComparator(order, orderBy)),
    [filtered, order, orderBy]
  );

  const paginated = useMemo(
    () =>
      sorted.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [sorted, page, rowsPerPage]
  );

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const openDetails = row => {
    setSelected(row);
    setDrawerOpen(true);
  };

  const severityChip = status => {
    if (status === "Critical") {
      return (
        <Chip
          label="Critical"
          color="error"
          size="small"
          icon={<ErrorOutlineIcon />}
        />
      );
    }
    if (status === "Warning") {
      return (
        <Chip
          label="Warning"
          color="warning"
          size="small"
          icon={<WarningAmberIcon />}
        />
      );
    }
    if (status === "Resolved") {
      return (
        <Chip
          label="Resolved"
          color="success"
          size="small"
          icon={<CheckCircleOutlineIcon />}
        />
      );
    }
    return (
      <Chip
        label={status || "Info"}
        color="info"
        size="small"
        icon={<InfoOutlinedIcon />}
      />
    );
  };

  // summary KPIs
  const total = anomalies.length;
  const criticalCount = anomalies.filter(a => a.status === "Critical").length;
  const warningCount = anomalies.filter(a => a.status === "Warning").length;
  const resolvedCount = anomalies.filter(a => a.status === "Resolved").length;

  return (
    <Box sx={{ p: 4 }}>
      {/* Header + refresh + sample toggle */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#351B65">
            Real Time Fuel Availability - Fuel Anomaly Detection
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live view of abnormal fuel events - 8 anomalies detected today
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Toggle sample data">
            <Button
              variant={useSampleData ? "contained" : "outlined"}
              size="small"
              onClick={() => setUseSampleData(!useSampleData)}
            >
              {useSampleData ? "Sample" : "Live"}
            </Button>
          </Tooltip>
          <Tooltip title="Refresh anomaly data">
            <span>
              <IconButton
                color="primary"
                onClick={fetchAnomalies}
                disabled={loading}
                sx={{
                  bgcolor: "#ECEAF7",
                  "&:hover": { bgcolor: "#d4c9ff" }
                }}
              >
                {loading ? <CircularProgress size={22} /> : <RefreshIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Summary cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderLeft: "4px solid #351B65" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total anomalies
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderLeft: "4px solid #d32f2f" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Critical
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="error.main">
              {criticalCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderLeft: "4px solid #ed6c02" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Warnings
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="warning.main">
              {warningCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderLeft: "4px solid #2e7d32" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Resolved
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {resolvedCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search by Anomaly ID"
              variant="outlined"
              fullWidth
              size="small"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Fuel type"
              select
              fullWidth
              size="small"
              value={fuelFilter}
              onChange={e => setFuelFilter(e.target.value)}
            >
              {fuelTypes.map(ft => (
                <MenuItem key={ft} value={ft}>
                  {ft}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Status"
              select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="Warning">Warning</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Table / states */}
      {loading && anomalies.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : filtered.length === 0 ? (
        <Typography>No anomalies found for current filters.</Typography>
      ) : (
        <Paper>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={orderBy === "id" ? order : false}>
                    <TableSortLabel
                      active={orderBy === "id"}
                      direction={orderBy === "id" ? order : "asc"}
                      onClick={() => handleRequestSort("id")}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Date / Time</TableCell>
                  <TableCell>Station</TableCell>
                  <TableCell>Fuel type</TableCell>
                  <TableCell>Volume (L)</TableCell>
                  <TableCell sortDirection={orderBy === "score" ? order : false}>
                    <TableSortLabel
                      active={orderBy === "score"}
                      direction={orderBy === "score" ? order : "desc"}
                      onClick={() => handleRequestSort("score")}
                    >
                      Anomaly score
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map(row => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => openDetails(row)}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.stationName || row.stationId}</TableCell>
                    <TableCell>{row.fuelType}</TableCell>
                    <TableCell style={{ color: row.volume < 0 ? '#d32f2f' : '#2e7d32' }}>
                      {row.volume} L
                    </TableCell>
                    <TableCell>{Number(row.score).toFixed(3)}</TableCell>
                    <TableCell>{severityChip(row.status)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={e => {
                          e.stopPropagation();
                          openDetails(row);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={sorted.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}

      {/* Details drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 360 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Anomaly details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {selected?.id}
          </Typography>
        </Box>
        <Divider />
        {selected && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Station
            </Typography>
            <Typography mb={1}>
              {selected.stationName || selected.stationId || "-"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Date / Time
            </Typography>
            <Typography mb={1}>{selected.date}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Fuel type
            </Typography>
            <Typography mb={1}>{selected.fuelType}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Volume change
            </Typography>
            <Typography mb={1} style={{ color: selected.volume < 0 ? '#d32f2f' : '#2e7d32' }}>
              {selected.volume} L
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Anomaly score
            </Typography>
            <Typography mb={1}>{Number(selected.score).toFixed(3)}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Box mb={2}>{severityChip(selected.status)}</Box>

            <Typography variant="subtitle2" color="text.secondary">
              Explanation / notes
            </Typography>
            <Typography variant="body2" mb={2}>
              {selected.reason ||
                "Model detected an unusual change in fuel level compared to expected pattern."}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                backgroundColor: "#351B65",
                "&:hover": { backgroundColor: "#2a144d" }
              }}
            >
              Mark as resolved
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export default Anomaly;
