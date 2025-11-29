import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>در حال بارگذاری...</div>;

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
