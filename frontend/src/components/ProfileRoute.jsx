import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Profile from './Profile';
import EmployeeProfile from './EmployeeProfile';

const ProfileRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect employees to EmployeeProfile, others to regular Profile
  if (user.role === 'employee') {
    return <EmployeeProfile />;
  }

  // For other roles (admin, institute, user), show regular Profile
  return <Profile />;
};

export default ProfileRoute; 