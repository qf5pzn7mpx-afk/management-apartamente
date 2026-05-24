import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext) || {};
  const userRole = user?.role;

  if (!userRole) {
    // Not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Authenticated but not authorized for this route - redirect to their dashboard
    return <Navigate to={userRole === 'manager' ? '/manager/dashboard' : '/chirias/dashboard'} replace />;
  }

  return children;
}
