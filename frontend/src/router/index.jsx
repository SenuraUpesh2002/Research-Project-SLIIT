import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRoutes from '../modules/admin/routes/admin.routes';
import ProtectedRoute from './ProtectedRoute';

import Welcome from '../modules/customer/app/(tabs)/welcome';
import Profile from '../modules/customer/app/(tabs)/profile';
import Results from '../modules/customer/app/(tabs)/results';
import UserType from '../modules/customer/app/(tabs)/user-type';

// Public Pages (assuming these will be created)
const LoginPage = () => (
  <div>
    <h1>Login</h1>
    <p>Please log in to access the application.</p>
  </div>
);
const NotFoundPage = () => <div>404 Not Found</div>;

const AppRouter = () => {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Customer Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={['customer', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute roles={['customer', 'admin']}>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-type"
          element={
            <ProtectedRoute roles={['customer', 'admin']}>
              <UserType />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
};

export default AppRouter;
