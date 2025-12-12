// frontend/src/router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Screens
import Login from "./modules/customer/app/auth/index.jsx";
import Signup from "./modules/customer/app/auth/signup.jsx";
import Welcome from "./modules/customer/app/tabs/welcome.jsx";
import UserType from "./modules/customer/app/tabs/user-type.jsx";

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
      <Route path="/user-type" element={<UserType />} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
