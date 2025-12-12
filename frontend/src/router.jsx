// frontend/src/router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Screens
import Login from "./modules/customer/app/auth/index.jsx";
import Signup from "./modules/customer/app/auth/signup.jsx";

// Customer Layout
import CustomerLayout from "./modules/customer/app/_layout.jsx";
import Welcome from "./modules/customer/app/tabs/welcome.jsx";
import UserType from "./modules/customer/app/tabs/user-type.jsx";
import FuelForm from "./modules/customer/app/forms/fuel-form.jsx";
import EVForm from "./modules/customer/app/forms/ev-form.jsx";
import Profile from "./modules/customer/app/tabs/profile.jsx";
import Results from "./modules/customer/app/tabs/results.jsx";

const NotFound = () => <div>404 - Page Not Found</div>;

const AppRouter = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Login />} />

      {/* Auth Routes (no navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Customer Routes (with navbar) */}
      <Route element={<CustomerLayout />}>
        <Route path="/app/welcome" element={<Welcome />} />
        <Route path="/user-type" element={<UserType />} />
        <Route path="/forms/fuel-form" element={<FuelForm />} />
        <Route path="/forms/ev-form" element={<EVForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/results" element={<Results />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
