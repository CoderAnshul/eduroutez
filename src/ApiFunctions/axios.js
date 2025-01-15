import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? window.VITE_BASE_URL : import.meta.env.VITE_BASE_URL
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
      req.headers['x-access-token'] = accessToken;
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

    // Handle response errors globally
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/auth/refresh-token', { token: refreshToken });

        if (response.data && response.data.accessToken) {
          const { accessToken } = response.data;

          localStorage.setItem('accessToken', accessToken);
          axiosInstance.defaults.headers.common['x-access-token'] = accessToken;
          originalRequest.headers['x-access-token'] = accessToken;

          return axiosInstance(originalRequest);
        } else {
          throw new Error('Invalid response from refresh token endpoint');
        }
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
