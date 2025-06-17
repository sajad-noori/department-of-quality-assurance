import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function RoleBasedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });

        const userRole = res.data?.user?.role;
        if (allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
          setError('You do not have permission to access this page');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Only set error if it's an authentication error
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Please log in to access this page');
        } else {
          setError('An error occurred while checking authentication');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (loading) return <div>در حال بارگذاری...</div>;
  
  if (error) {
    if (error.includes('log in')) {
      return <Navigate to="/login" replace />;
    }
    return <div className="alert alert-danger">{error}</div>;
  }
  
  if (!authorized) {
    return <div className="alert alert-warning">You do not have permission to access this page</div>;
  }
  
  return children;
}

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
