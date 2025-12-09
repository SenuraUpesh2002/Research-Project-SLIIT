import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './modules/customer/app/(auth)/index.jsx'; // Assuming Login component is here
import RegisterScreen from './modules/customer/app/(auth)/register.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app/welcome" element={<div>Welcome!</div>} /> {/* Placeholder for welcome page */}
      <Route path="/auth/register" element={<RegisterScreen />} />
      {/* Add other routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;
