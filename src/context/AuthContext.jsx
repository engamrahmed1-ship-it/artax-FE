import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { jwtAuth } from '../api/AuthApi';
import { apiClient } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

let globalLogout = null; // 👈 global variable for logout

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();

// --------------------------------------------------------------------------------
  // 1. STABILIZE LOGOUT FUNCTION: Use useCallback and include navigate in dependencies
  // --------------------------------------------------------------------------------
  const logout =  useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
    navigate('/login'); // <-- ADDED REDIRECT HERE
    
    // Optional: Add a console log to confirm interceptor trigger
    console.log("Session expired. Redirecting via global logout."); 
    
  }, [navigate]); // <-- Dependency: ONLY navigate is needed for stability


globalLogout = logout; //

// --------------------------------------------------------------------------------
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
            console.warn("Token expired on load. Logging out.");
            logout(); // Use the stable logout function
            setLoading(false);
            return; // Stop execution
        }

        console.log("this is the decoded JWT :", decodedToken)
        
        const roles =
          decodedToken?.resource_access?.["artax-client"]?.roles ||
                   decodedToken?.realm_access?.roles ||
          [];
        setUser({
          name: decodedToken.name,
          email: decodedToken.email,
          roles: roles,
        });
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Invalid token:", error);
        logout(); // Use the stable logout function for invalid token
      }
    } else {
        // Clear authorization header if token is null/empty
        delete apiClient.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token, logout]); // <-- Added logout dependency



// Login function (no change needed here)
  const login = async (username, password) => {
    console.log('Attempting login for user:', username);
    const response = await jwtAuth(username, password)
    const newToken = response.data;
    console.log('Login successful, token received:', newToken);
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const value = { user, token, login, logout ,loading };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export global logout for axios
export const triggerGlobalLogout = () => {
  if (globalLogout) globalLogout();
};

