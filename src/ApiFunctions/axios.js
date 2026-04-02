import axios from 'axios';
import Cookies from 'js-cookie';

const getBaseUrl = () => {
  // For Vite dev server, use import.meta.env; for browser, use window. Fallback to localhost if not set.
  if (typeof window !== 'undefined' && window.VITE_BASE_URL) {
    return window.VITE_BASE_URL;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_BASE_URL) {
    return process.env.VITE_BASE_URL;
  }
  return 'http://localhost:4001/api/v1';
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl()
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication header if token exists
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('Access Token:', accessToken); // Debugging log
    console.log('Refresh Token:', refreshToken); // Debugging log

    if (accessToken) {
      console.log('Adding access token to request headers'); // Debugging log
      config.headers['x-access-token'] = accessToken;
    }
    if (refreshToken) {
      config.headers['x-refresh-token'] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('Error:', error.response); // Debugging log

    return Promise.reject(error);
  }
);

export default axiosInstance;
