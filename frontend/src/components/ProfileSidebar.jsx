import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileSidebar = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [hover, setHover] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sync activeStage with the current route
    if (location.pathname === '/profile') setActiveStage(1);
    else if (location.pathname === '/step2') setActiveStage(2);
    else if (location.pathname === '/step3') setActiveStage(3);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });
        setUser(res.data.user);
        if (res.data.user.profileImage) {
          setProfileImage(res.data.user.profileImage);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        const response = await axios.post('http://localhost:5000/api/upload-profile-image', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProfileImage(response.data.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-sidebar">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
          <CircularProgress sx={{ color: '#3b82f6' }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-sidebar">
        <div className="profile-content">
          <p>Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="profile-sidebar"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-content">
        <motion.div 
          className="profile-image-container"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {profileImage ? (
            <motion.img
              src={profileImage}
              alt="Profile"
              className="profile-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div 
              className="profile-initial"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </motion.div>
          )}
          {uploading ? (
            <motion.div 
              className="upload-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CircularProgress size={24} sx={{ color: '#ffffff' }} />
            </motion.div>
          ) : (
            <Tooltip title="Change profile picture" placement="top">
              <motion.label 
                className={`upload-button ${hover ? 'hover' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <i className="fas fa-camera"></i>
              </motion.label>
            </Tooltip>
          )}
        </motion.div>
        <motion.h2 
          className="user-name"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {user.name}
        </motion.h2>
        <motion.p 
          className="user-email"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {user.email}
        </motion.p>
        
        <motion.div 
          className="progress-stages"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[1, 2, 3].map((stage) => (
            <motion.div 
              key={stage}
              className={`stage ${activeStage === stage ? 'active' : ''}`}
              onClick={() => {
                setActiveStage(stage);
                if (stage === 1) navigate('/profile');
                if (stage === 2) navigate('/step2');
                if (stage === 3) navigate('/step3');
              }}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="stage-number"
                whileHover={{ scale: 1.1 }}
              >
                {stage}
              </motion.div>
              <div className="stage-text">
                <a href="#" onClick={e => e.preventDefault()}>
                  {stage === 1 ? 'مرحله اول' : stage === 2 ? 'مرحله دوم' : 'مرحله سوم'}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="logout-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loggingOut ? (
              <CircularProgress size={20} sx={{ color: '#ffffff' }} />
            ) : (
              <>
                <i className="fas fa-sign-out-alt"></i>
                <span>خروج</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        .profile-sidebar {
          width: 300px;
          padding: 3rem 2rem;
          position: absolute;
          right: 0;
          top: 0;
          height: 100vh;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          border-left: 1px solid rgba(0, 212, 255, 0.1);
        }

        .profile-content {
          text-align: center;
          color: #d1d8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 2rem;
        }

        .profile-image-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 2rem;
          padding: 4px;
          background: linear-gradient(145deg, #0dcaf0, #00b5d7);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(13, 202, 240, 0.3);
        }

        .profile-image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #1a1a1a;
          background: #1a1a1a;
        }

        .profile-initial {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(145deg, #0dcaf0, #00b5d7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2.5rem;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 3px solid #1a1a1a;
          box-shadow: 0 4px 12px rgba(13, 202, 240, 0.3);
        }

        .upload-button {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #0dcaf0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 2px solid #1a1a1a;
          opacity: 0;
          transform: scale(0.8);
        }

        .upload-button.hover {
          opacity: 1;
          transform: scale(1);
        }

        .upload-loading {
          position: absolute;
          bottom: 0;
          right: 0;
          background: rgba(13, 202, 240, 0.9);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #1a1a1a;
        }

        .user-name {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          color: #a9e5ff;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .user-email {
          color: #7b8bbf;
          font-size: 1rem;
          margin-bottom: 0;
          opacity: 0.9;
          font-weight: 500;
        }

        .progress-stages {
          margin-top: 2rem;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .stage {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.03);
        }

        .stage.active {
          background: rgba(13, 202, 240, 0.15);
          border-right: 3px solid #0dcaf0;
        }

        .stage-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(145deg, #0dcaf0, #00b5d7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 2px 8px rgba(13, 202, 240, 0.3);
        }

        .stage-text {
          color: #a9e5ff;
          font-size: 1rem;
          font-weight: 500;
        }

        .stage.active .stage-text {
          color: #0dcaf0;
          font-weight: 600;
        }

        .logout-container {
          margin-top: 2rem;
          width: 100%;
          padding: 0 1.5rem;
        }

        .logout-button {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(145deg, #ef4444, #dc2626);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .logout-button:hover {
          background: linear-gradient(145deg, #dc2626, #b91c1c);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .logout-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .logout-button i {
          font-size: 1.1rem;
        }
      `}</style>
      {/* Light mode styles for ProfileSidebar */}
      <style>{`
        [data-theme="light"] .profile-sidebar {
          background: #fff;
          color: #222;
          border-left: 1.5px solid #e0e0e0;
        }
        [data-theme="light"] .profile-content {
          color: #222;
        }
        [data-theme="light"] .profile-image-container {
          background: linear-gradient(145deg, #0dcaf0, #00b5d7);
          box-shadow: 0 4px 12px rgba(13, 202, 240, 0.13);
        }
        [data-theme="light"] .profile-image {
          border: 3px solid #fff;
          background: #fff;
        }
        [data-theme="light"] .profile-initial {
          background: linear-gradient(145deg, #0dcaf0, #00b5d7);
          color: #fff;
          border: 3px solid #fff;
          box-shadow: 0 4px 12px rgba(13, 202, 240, 0.13);
        }
        [data-theme="light"] .upload-button {
          background: #0dcaf0;
          border: 2px solid #fff;
        }
        [data-theme="light"] .upload-loading {
          background: rgba(13, 202, 240, 0.9);
          border: 2px solid #fff;
        }
        [data-theme="light"] .user-name {
          color: #0dcaf0;
        }
        [data-theme="light"] .user-email {
          color: #00b5d7;
        }
        [data-theme="light"] .progress-stages {
          background: #f5f5f5;
        }
        [data-theme="light"] .stage {
          background: #f9f9f9;
          color: #222;
        }
        [data-theme="light"] .stage.active {
          background: #e8f8fc;
          border-right: 3px solid #0dcaf0;
        }
        [data-theme="light"] .stage-number {
          background: linear-gradient(145deg, #0dcaf0, #00b5d7);
          color: #fff;
        }
        [data-theme="light"] .stage-text {
          color: #00b5d7;
        }
        [data-theme="light"] .stage.active .stage-text {
          color: #0dcaf0;
        }
        [data-theme="light"] .logout-container {
          background: none;
        }
        [data-theme="light"] .logout-button {
          background: linear-gradient(145deg, #ef4444, #dc2626);
          color: #fff;
        }
        [data-theme="light"] .logout-button:hover {
          background: linear-gradient(145deg, #dc2626, #b91c1c);
        }
      `}</style>
    </motion.div>
  );
};

export default ProfileSidebar; 