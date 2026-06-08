import React, { createContext, useContext, useState, useEffect } from 'react';
import { blogApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await blogApi.getCurrentUser();
        if (session) {
          setCurrentUser(session.user);
          setSessionToken(session.token);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    setError(null);
    try {
      const session = await blogApi.login(usernameOrEmail, password);
      setCurrentUser(session.user);
      setSessionToken(session.token);
      return session.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const session = await blogApi.register(username, email, password, name);
      setCurrentUser(session.user);
      setSessionToken(session.token);
      return session.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await blogApi.logout();
      setCurrentUser(null);
      setSessionToken(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    currentUser,
    sessionToken,
    loading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
