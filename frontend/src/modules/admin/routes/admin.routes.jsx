import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import admin components
import Dashboard from '../pages/Dashboard';
import Alerts from '../pages/Alerts';
import Reports from '../pages/Reports';
import Submissions from '../pages/Submissions';
import Users from '../pages/Users';
import Duplicates from '../pages/Duplicates';
import AdminLayout from '../components/AdminLayout';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="users" element={<Users />} />
        <Route path="duplicates" element={<Duplicates />} />
        {/* Add other admin-specific routes here */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
