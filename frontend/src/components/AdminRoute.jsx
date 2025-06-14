import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if token is expired
    const currentTime = Date.now() / 1000; // in seconds
    if (decoded.exp < currentTime) {
      console.warn('Token expired');
      return <Navigate to="/login" replace />;
    }

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return <Navigate to="/login" replace />;
    }

    // Token is valid and user is admin
    return children;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" replace />;
  }
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
