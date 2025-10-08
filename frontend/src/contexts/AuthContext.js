import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Restore user on app load if authenticated
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/me`, { withCredentials: true })
      .then(res => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Log visit once per day when user is set
  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const lastVisitLogged = localStorage.getItem('lastVisitLogged');
    if (lastVisitLogged === today) return;
    axios.post(`${API_BASE_URL}/api/logs/visit`, {}, { withCredentials: true })
      .then(() => {
        localStorage.setItem('lastVisitLogged', today);
      })
      .catch((err) => {
        // Optionally handle error
        // console.error('Error logging daily visit:', err);
      });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}
