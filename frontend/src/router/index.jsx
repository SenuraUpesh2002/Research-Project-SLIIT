import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from '../modules/admin/routes/admin.routes';
import ProtectedRoute from './ProtectedRoute';

// Public Pages (assuming these will be created)
const HomePage = () => <div>Home Page</div>;
const LoginPage = () => <div>Login Page</div>;
const NotFoundPage = () => <div>404 Not Found</div>;

const AppRouter = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default AppRouter;
