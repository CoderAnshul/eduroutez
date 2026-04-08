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

// Simple in-memory GET cache to dedupe identical concurrent requests
if (typeof window !== 'undefined' && !window.__axiosGetCache) {
  window.__axiosGetCache = new Map();
}

export const cachedGet = (url, config = {}, ttl = 30000) => {
  const paramsKey = config && config.params ? JSON.stringify(config.params) : '';
  const key = `${url}|${paramsKey}`;

  const cache = typeof window !== 'undefined' ? window.__axiosGetCache : null;
  if (cache && cache.has(key)) {
    return cache.get(key);
  }

  const promise = axiosInstance.get(url, config).then((res) => {
    // keep the resolved promise in cache for `ttl` ms
    if (cache) {
      cache.set(key, Promise.resolve(res));
      setTimeout(() => cache.delete(key), ttl);
    }
    return res;
  }).catch((err) => {
    if (cache) cache.delete(key);
    throw err;
  });

  if (cache) cache.set(key, promise);
  return promise;
};
// Attach interceptors only once (prevents duplicate handlers during HMR or multiple imports)
if (typeof window !== 'undefined') {
  if (!window.__axiosInterceptorsInstalled) {
    // Request interceptor
    axiosInstance.interceptors.request.use(
      (config) => {
        // Add authentication header if token exists
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken) {
          config.headers['x-access-token'] = accessToken;
        }
        if (refreshToken) {
          config.headers['x-refresh-token'] = refreshToken;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Keep behavior simple: bubble up the error
        return Promise.reject(error);
      }
    );

    window.__axiosInterceptorsInstalled = true;
  }
}

export default axiosInstance;
