import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRoute = ({ children }) => {
  const isAuthenticated = !!Cookies.get('accessToken');
console.log(isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthRoute;