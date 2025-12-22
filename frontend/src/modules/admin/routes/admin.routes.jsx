import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import admin components
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import Alerts from '../pages/Alerts';
import Reports from '../pages/Reports';
import Submissions from '../pages/Submissions';
import Users from '../pages/Users';
import Duplicates from '../pages/Duplicates';
import Analytics from '../pages/Analytics';
import LandingPage from '../pages/LandingPage';
import AdminLayout from '../components/AdminLayout';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="landing" element={<LandingPage />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="users" element={<Users />} />
        <Route path="duplicates" element={<Duplicates />} />
        <Route path="analytics" element={<Analytics />} />
        {/* Add other admin-specific routes here */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
