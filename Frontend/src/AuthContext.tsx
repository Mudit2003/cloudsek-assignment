import React, { createContext, useState, useContext } from 'react';

// Define the context type
interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define the type for children props
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider component that wraps the app and provides context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => setUser(username);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export an empty export to ensure this file is treated as a module
export {};
