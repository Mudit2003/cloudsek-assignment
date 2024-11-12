import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  element: React.ReactElement;
  path: string;  // You can pass the path here manually
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, path }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Route path={path} element={element} />;
};

export default ProtectedRoute;
