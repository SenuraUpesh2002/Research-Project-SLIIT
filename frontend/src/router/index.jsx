import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRoutes from '../modules/admin/routes/admin.routes';
import ProtectedRoute from './ProtectedRoute';

// Public Pages (assuming these will be created)
const HomePage = () => (
  <div>
    <h1>Welcome to the Home Page!</h1>
    <p>If you see this, the routing is working correctly.</p>
  </div>
);
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

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
