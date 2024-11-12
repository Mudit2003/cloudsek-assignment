import React, { createContext, useContext, useState, ReactNode } from "react";
import IUser from "../@types/user";

interface AuthContextType {
  user: IUser | null; // Replace 'any' with a more specific type based on your user data structure
  setUser: (user: IUser | null) => void; // Function to update user data
}

// interface User {
//     id: number;
//     username: string;
//     email: string;
//     token: string; // Assuming you have a token in the response
// }

interface AuthContextType {
  user: IUser | null; // User can be null if not logged in
  setUser: (user: IUser | null) => void; // Function to update user data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const [user, setUser] = useState<any>(null); // Initialize user state
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
