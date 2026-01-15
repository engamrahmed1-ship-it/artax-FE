// api/apiClient.js (or wherever this file is located)

import axios from 'axios';
// import { Navigate } from 'react-router-dom'; // NOTE: This import is not needed here
import { triggerGlobalLogout } from '../context/AuthContext'; // Assuming this function exists and handles navigation to /login


export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Check for Unauthorized (401) or Forbidden (403)
    if (status === 401 || status === 403) {
      triggerGlobalLogout(); // This must clear the token and use navigate('/login')
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);
// You will need to export apiClient if you haven't already
// export default apiClient;