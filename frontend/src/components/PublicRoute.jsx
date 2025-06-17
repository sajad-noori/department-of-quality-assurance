import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });
        if (res.data?.user) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Only set error if it's not an authentication error
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          setError('An error occurred while checking authentication');
        }
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Only redirect to profile if we're on the login page and user is authenticated
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
