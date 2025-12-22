// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";

// Context Providers
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { UiProvider } from "./hooks/useUiStore";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UiProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </UiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
