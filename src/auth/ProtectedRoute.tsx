import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: ReactNode; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); 

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
