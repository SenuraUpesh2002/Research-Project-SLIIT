// src/router/index.jsx
import { Routes, Route } from "react-router-dom";

/* =====================
   ROUTE GUARDS
===================== */
import ProtectedRoute from "./ProtectedRoute";

/* =====================
   ADMIN ROUTES
===================== */
import AdminRoutes from "../modules/admin/routes/admin.routes";
import AdminLogin from "../modules/admin/pages/AdminLogin";
import AdminSignup from "../modules/admin/pages/AdminSignup";

/* =====================
   CUSTOMER ROUTES
===================== */
import CustomerLayout from "../modules/customer/app/_layout";
import Welcome from "../modules/customer/app/tabs/welcome";
import UserType from "../modules/customer/app/tabs/user-type";
import FuelForm from "../modules/customer/app/forms/fuel-form";
import EVForm from "../modules/customer/app/forms/ev-form";
import Profile from "../modules/customer/app/tabs/profile";
import Results from "../modules/customer/app/tabs/results";

/* =====================
   AUTH
===================== */
import Login from "../modules/customer/app/auth";

/* =====================
   NOT FOUND
===================== */
const NotFoundPage = () => <div>404 - Page Not Found</div>;

const AppRouter = () => {
  console.log("AppRouter loaded");

  return (
    <Routes>

      {/* =====================
          PUBLIC ROUTES
      ===================== */}
      <Route path="/" element={<require('../modules/entry/EntryPage').default />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* =====================
          CUSTOMER ROUTES
      ===================== */}
      <Route
        element={
          <ProtectedRoute roles={["customer", "admin"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/app/welcome" element={<Welcome />} />
        <Route path="/user-type" element={<UserType />} />
        <Route path="/forms/fuel-form" element={<FuelForm />} />
        <Route path="/forms/ev-form" element={<EVForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/results" element={<Results />} />
      </Route>

      {/* =====================
          ADMIN ROUTES
      ===================== */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* =====================
          404
      ===================== */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default AppRouter;
