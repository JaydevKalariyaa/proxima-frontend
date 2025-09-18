import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  
  // Don't render anything while loading (MainLayout handles the loading state)
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

