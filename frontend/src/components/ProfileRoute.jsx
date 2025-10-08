import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Profile from './Profile';
import EmployeeProfile from './EmployeeProfile';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const ProfileRoute = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        
        const role = response.data?.user?.role;
        setUserRole(role);
      } catch (err) {
        console.error('Error fetching user role:', err);
        if (err.response?.status === 401) {
          setError('Please log in to access this page');
        } else {
          setError('An error occurred while checking authentication');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    if (error.includes('log in')) {
      return <Navigate to="/login" replace />;
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Redirect employees to EmployeeProfile, others to regular Profile
  if (userRole === 'employee') {
    return <EmployeeProfile />;
  }

  // For other roles (admin, institute, user), show regular Profile
  return <Profile />;
};

export default ProfileRoute; 