import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Screens
import Login from "./modules/customer/app/auth/index.jsx"; // login page
import Signup from "./modules/customer/app/auth/signup.jsx";

// Public / Placeholder Pages
const Welcome = () => <div>Welcome!</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

const AppRouter = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Public / Default Page */}
      <Route path="/app/welcome" element={<Welcome />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
