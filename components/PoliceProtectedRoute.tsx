
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PoliceProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.type !== 'police') {
    return <Navigate to="/police/login" replace />;
  }

  return <Outlet />;
};

export default PoliceProtectedRoute;
