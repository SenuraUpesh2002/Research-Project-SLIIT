import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Optionally render a loader component here
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // User authenticated but does not have the required role
    // Redirect to an unauthorized page or home page
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
