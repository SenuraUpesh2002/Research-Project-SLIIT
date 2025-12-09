import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from './hooks/useAuth';
import { UiProvider } from './hooks/useUiStore'; // Assuming you'll create this

function App() {
  return (
    <AuthProvider>
      <UiProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UiProvider>
    </AuthProvider>
  );
}

export default App;
