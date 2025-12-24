import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeRegistration from './pages/EmployeeRegistration';
import MobileCheckIn from './pages/MobileCheckIn';
import { Toaster } from 'sonner';

import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-employee"
          element={
            <ProtectedRoute>
              <EmployeeRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mobile-checkin"
          element={
            <ProtectedRoute>
              <MobileCheckIn />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
