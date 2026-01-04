// src/App.jsx
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";

// Context Providers
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { UiProvider } from "./hooks/useUiStore";

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
        </UiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
