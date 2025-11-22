import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Skip auth check for verification page
    if (location.pathname === "/verify-code") {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        });
        if (res.data?.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        // Only set error if it's not an authentication error
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          setError("An error occurred while checking authentication");
        }
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (loading) return <div>در حال بارگذاری...</div>;

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Only redirect to profile if we're on the login page and user is authenticated
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
