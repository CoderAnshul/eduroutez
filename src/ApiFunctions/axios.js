import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: typeof window !== 'undefined' ? window.VITE_BASE_URL : process.env.VITE_BASE_URL
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication header if token exists
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers['x-access-token'] = accessToken;
    }
    const refreshToken = Cookies.get('refreshToken');
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
  (error) => {
    // Handle response errors globally
    if (error.response?.status === 401) {
      // redirect to login page
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
