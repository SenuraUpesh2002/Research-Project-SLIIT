import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { UiProvider } from './hooks/useUiStore'; // Assuming you'll create this

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UiProvider>
          <Router>
            <AppRoutes />
          </Router>
        </UiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
