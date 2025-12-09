import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './modules/customer/app/(auth)/index.jsx'; // Assuming Login component is here

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app/welcome" element={<div>Welcome!</div>} /> {/* Placeholder for welcome page */}
      {/* Add other routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;
