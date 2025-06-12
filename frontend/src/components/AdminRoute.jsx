import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  let user = null;

  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Invalid user data in localStorage:', error);
    user = null;
  }

  // If no user or user role is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // If user is admin, render the children
  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
