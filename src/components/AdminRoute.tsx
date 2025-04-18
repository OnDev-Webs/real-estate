
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (user?.role !== 'admin') {
    // Redirect non-admin users
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
