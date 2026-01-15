import React, { createContext, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { jwtAuth } from '../api/AuthApi';
import { apiClient } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

let globalLogout = null; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. STABILIZE LOGOUT
  const logout = useCallback(() => {
    console.log("Session terminating. Cleaning up...");
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  // 2. ASSIGN GLOBAL LOGOUT SAFELY
  // useLayoutEffect ensures the global variable is set before any interceptors can call it
  useLayoutEffect(() => {
    globalLogout = logout;
  }, [logout]);

  // 3. INTERNAL HELPER: Extract user data from token
  const extractUserData = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const roles = decoded?.resource_access?.["artax-client"]?.roles ||
                    decoded?.realm_access?.roles || [];
      
      return {
        name: decoded.name,
        email: decoded.email,
        roles: roles,
        exp: decoded.exp
      };
    } catch (e) {
      return null;
    }
  }, []);

  // 4. INITIAL LOAD & TOKEN SYNC
  useEffect(() => {
    if (token) {
      const userData = extractUserData(token);
      
      if (!userData || (userData.exp * 1000 < Date.now())) {
        console.warn("Token invalid or expired on load.");
        logout();
      } else {
        setUser({ name: userData.name, email: userData.email, roles: userData.roles });
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token, logout, extractUserData]);

  // 5. ENHANCED LOGIN
  const login = async (username, password) => {
    try {
      const response = await jwtAuth(username, password);
      const newToken = response.data;
      console.log("Login API Response Token:", newToken);
      // Handle cases where server sends "Error: ..." as a string inside 200 OK
      if (!newToken || typeof newToken !== 'string' || !newToken.includes('.')) {
        throw new Error(typeof newToken === 'string' ? newToken : 'Invalid credentials');
      }

      // Validate decodeability before saving
      const userData = extractUserData(newToken);
      if (!userData) {
        throw new Error('Received malformed token from server.');
      }

      if (userData.exp * 1000 < Date.now()) {
        throw new Error('Received an already expired token.');
      }

      // Success Path
      localStorage.setItem('authToken', newToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken); // This triggers the useEffect to set the User state
      
      return userData; // Return for any component-level logic
    } catch (error) {
      const msg = error.response?.data || error.message;
      throw new Error(msg);
    }
  };

  const value = { user, token, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const triggerGlobalLogout = () => {
  if (globalLogout) globalLogout();
};