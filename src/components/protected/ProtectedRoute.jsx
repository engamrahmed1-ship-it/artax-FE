import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // console.log('ProtectedRoute - User:', user, 'Loading:', loading);

  // ---> FIX HERE <---
  if (loading) return null;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const hasRequiredRole =
    allowedRoles ? user.roles.some(role => allowedRoles.includes(role)) : true;

  // console.log('hasRequiredRole:', hasRequiredRole);

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;



