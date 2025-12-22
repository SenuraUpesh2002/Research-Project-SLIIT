// frontend/src/router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

/* =======================
   AUTH SCREENS
======================= */
import Login from "./modules/customer/app/auth/index.jsx";
import Signup from "./modules/customer/app/auth/signup.jsx";

/* =======================
   ENTRY PAGE
======================= */
import EntryPage from "./modules/entry/EntryPage";

/* =======================
   ADMIN SCREENS
======================= */
import AdminLogin from "./modules/admin/pages/AdminLogin.jsx";
import AdminSignup from "./modules/admin/pages/AdminSignup.jsx";
import LandingPage from "./modules/admin/pages/LandingPage.jsx";
import Dashboard from "./modules/admin/pages/Dashboard.jsx";
import Submissions from "./modules/admin/pages/Submissions.jsx";
import Duplicates from "./modules/admin/pages/Duplicates.jsx";
import Alerts from "./modules/admin/pages/Alerts.jsx";
import Reports from "./modules/admin/pages/Reports.jsx";
import Users from "./modules/admin/pages/Users.jsx";

/* =======================
   CUSTOMER SCREENS
======================= */
import CustomerLayout from "./modules/customer/app/_layout.jsx";
import Welcome from "./modules/customer/app/tabs/welcome.jsx";
import UserType from "./modules/customer/app/tabs/user-type.jsx";
import FuelForm from "./modules/customer/app/forms/fuel-form.jsx";
import EVForm from "./modules/customer/app/forms/ev-form.jsx";
import Profile from "./modules/customer/app/tabs/profile.jsx";
import Results from "./modules/customer/app/tabs/results.jsx";

/* =======================
   NOT FOUND
======================= */
const NotFound = () => <div>404 - Page Not Found</div>;

const AppRouter = () => {
  return (
    <Routes>

      {/* =======================
          ENTRY / AUTH
      ======================= */}
      <Route path="/" element={<EntryPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* =======================
          CUSTOMER ROUTES
          (With Navbar Layout)
      ======================= */}
      <Route element={<CustomerLayout />}>
        <Route path="/app/welcome" element={<Welcome />} />
        <Route path="/user-type" element={<UserType />} />
        <Route path="/forms/fuel-form" element={<FuelForm />} />
        <Route path="/forms/ev-form" element={<EVForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/results" element={<Results />} />
      </Route>

      {/* =======================
          ADMIN ROUTES
      ======================= */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin" element={<LandingPage />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/submissions" element={<Submissions />} />
      <Route path="/admin/duplicates" element={<Duplicates />} />
      <Route path="/admin/alerts" element={<Alerts />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/users" element={<Users />} />

      {/* =======================
          CATCH ALL
      ======================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRouter;
