// frontend/src/modules/admin/routes/admin.routes.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

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

// Route guard for admin authentication
const RequireAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check for admin token in localStorage
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        {/* Default Landing Page */}
        <Route index element={<LandingPage />} />

        {/* Admin Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<Users />} />
        <Route path="duplicates" element={<Duplicates />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;