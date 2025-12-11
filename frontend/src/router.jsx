// frontend/src/router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Screens
import Login from "./modules/customer/app/auth/index.jsx";
import Signup from "./modules/customer/app/auth/signup.jsx";

// Public pages
const Welcome = () => <div>Welcome!</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

const AppRouter = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Login />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboard */}
      <Route path="/app/welcome" element={<Welcome />} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
