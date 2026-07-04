import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute  = ({ children }) => {
  const  isAuthenticated  = useSelector((state) => state.auth.isAuthenticated);
  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;