import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // In a real app, this would come from an API or local storage
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    if (email === "test@example.com" && password === "password") {
      const userData = { email: email, name: "Test User" }; // Mock user data
      setUser(userData);
      console.log("Simulated login success:", userData);
      return { success: true };
    } else {
      return { success: false, error: "Invalid credentials" };
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    if (fullName && email && password === confirmPassword) {
      // In a real app, you'd send data to your backend and get a response
      console.log("Simulated registration success:", { fullName, email });
      return { success: true };
    } else {
      return { success: false, error: "Invalid registration data" };
    }
  };

  const logout = () => {
    setUser(null);
    // In a real app, you'd clear tokens, session, etc.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
