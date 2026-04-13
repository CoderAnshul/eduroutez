import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('accessToken');
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ backgroundLocation: location }} />;
  }

  return children;
};

export default AuthRoute;
