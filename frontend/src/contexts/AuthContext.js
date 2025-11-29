import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user on app load if authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        });
        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        // Only clear user if it's an authentication error (401/403)
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
        }
        // For other errors (network, server), keep current state
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear user state even if server logout fails
      setUser(null);
    }
  };

  // Log visit once per day when user is set
  useEffect(() => {
    if (!user || loading) return;
    const today = new Date().toISOString().slice(0, 10);
    const lastVisitLogged = localStorage.getItem("lastVisitLogged");
    if (lastVisitLogged === today) return;
    axios
      .post(`${API_BASE_URL}/api/logs/visit`, {}, { withCredentials: true })
      .then(() => {
        localStorage.setItem("lastVisitLogged", today);
      })
      .catch((err) => {
        // Optionally handle error
        console.error("Error logging daily visit:", err);
      });
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
