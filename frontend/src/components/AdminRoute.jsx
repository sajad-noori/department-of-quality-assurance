import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true, // very important for sending cookies
        });

        if (res.data?.user?.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;

  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
