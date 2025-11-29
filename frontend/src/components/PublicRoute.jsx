import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Skip auth check for verification page
  if (location.pathname === "/verify-code") {
    return children;
  }

  if (loading) return <div>در حال بارگذاری...</div>;

  // Only redirect to profile if we're on the login page and user is authenticated
  if (user && location.pathname === "/login") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
