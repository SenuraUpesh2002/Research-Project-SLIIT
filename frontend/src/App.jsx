// src/App.jsx
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

// Context Providers
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { UiProvider } from "./hooks/useUiStore";
import FuelResultsScreen from "./modules/customer/app/results/fuel-results.jsx";

function App() {
  useEffect(() => {
    const handler = (e) => {
      const msg = e?.reason?.message;
      if (
        typeof msg === "string" &&
        msg.includes("Could not establish connection. Receiving end does not exist")
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);
  return (
    <ThemeProvider>
      <AuthProvider>
        <UiProvider>
          <RouterProvider router={router} />
          <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </UiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

// Remove this block:
// <Routes>
//   <Route path="/fuel-results" element={<FuelResultsScreen />} />
// </Routes>
