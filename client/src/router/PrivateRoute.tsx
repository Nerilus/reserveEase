import { Navigate, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import React from "react";

interface ProtectedRouteProps extends RouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false, ...rest }) => {
  const { isAuthenticated, currentUserAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !currentUserAdmin) {
    return <Navigate to="/" />;
  }

  return <Route {...rest} />;
};

export default ProtectedRoute;