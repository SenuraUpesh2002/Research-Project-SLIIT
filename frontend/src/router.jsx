// frontend/src/router.jsx
// jsx runtime handles React imports
import { createBrowserRouter } from "react-router-dom";

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
import Analytics from "./modules/admin/pages/Analytics.jsx";
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
import FuelResultsScreen from "./modules/customer/app/results/fuel-results.jsx";
import EVResultsScreen from "./modules/customer/app/results/ev-results.jsx"; // <-- Add this import

/* =======================
   NOT FOUND
======================= */
const NotFound = () => <div>404 - Page Not Found</div>;

const routes = [
   { path: "/", element: <EntryPage /> },
   { path: "/login", element: <Login /> },
   { path: "/signup", element: <Signup /> },

   // Customer routes with layout
   {
      element: <CustomerLayout />,
      children: [
         { path: "/app/welcome", element: <Welcome /> },
         { path: "/user-type", element: <UserType /> },
         { path: "/forms/fuel-form", element: <FuelForm /> },
         { path: "/forms/ev-form", element: <EVForm /> },
         { path: "/profile", element: <Profile /> },
         { path: "/results", element: <Results /> },
         { path: "/fuel-results", element: <FuelResultsScreen /> },
         { path: "/ev-results", element: <EVResultsScreen /> }, // <-- Add this route
      ],
   },

   // Admin routes
   { path: "/admin/login", element: <AdminLogin /> },
   { path: "/admin/signup", element: <AdminSignup /> },
   { path: "/admin", element: <LandingPage /> },
   { path: "/admin/analytics", element: <Analytics /> },
   { path: "/admin/dashboard", element: <Dashboard /> },
   { path: "/admin/submissions", element: <Submissions /> },
   { path: "/admin/duplicates", element: <Duplicates /> },
   { path: "/admin/alerts", element: <Alerts /> },
   { path: "/admin/reports", element: <Reports /> },
   { path: "/admin/users", element: <Users /> },

   // Catch-all
   { path: "*", element: <NotFound /> },
];

const router = createBrowserRouter(routes, {
   future: {
      v7_startTransition: true,
   },
});

export default router;
