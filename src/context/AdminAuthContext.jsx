/**
 * @file AdminAuthContext.jsx
 * @description React Context Provider managing administrator authentication state.
 * Validates credentials against specified admin login details and persists session in localStorage.
 */

import React, { createContext, useContext, useState } from 'react';
import {
  ADMIN_CREDENTIALS,
  getAdminSession,
  setAdminSession,
  clearAdminSession,
} from '../services/adminService';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => getAdminSession());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAdminSession()));

  const login = (username, password) => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (
      trimmedUsername === ADMIN_CREDENTIALS.username &&
      trimmedPassword === ADMIN_CREDENTIALS.password
    ) {
      const userSession = {
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        email: ADMIN_CREDENTIALS.email,
        loginTime: new Date().toISOString(),
      };

      setAdminSession(userSession);
      setAdminUser(userSession);
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid username or password. Please check your credentials.',
    };
  };

  const logout = () => {
    clearAdminSession();
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    adminUser,
    isAuthenticated,
    login,
    logout,
    defaultCredentials: {
      username: ADMIN_CREDENTIALS.username,
      password: ADMIN_CREDENTIALS.password,
    },
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

export default AdminAuthContext;
