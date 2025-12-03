import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import admin components
import AdminDashboard from '../pages/AdminDashboard'; // Assuming this will be created
import AdminLayout from '../components/AdminLayout'; // Assuming this will be created
import AlertCard from '../components/AlertCard';
import ReportCharts from '../components/ReportCharts';
import SubmissionTable from '../components/SubmissionTable';
import UserTable from '../components/UserTable';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="alerts" element={<AlertCard />} />
        <Route path="reports" element={<ReportCharts />} />
        <Route path="submissions" element={<SubmissionTable />} />
        <Route path="users" element={<UserTable />} />
        {/* Add other admin-specific routes here */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
