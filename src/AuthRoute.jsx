import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
console.log(isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthRoute;