const axios = require('axios');

const apiClient = axios.create({
  timeout: 45000, // 45 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add retry interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;

    if (!config || !config.retry) {
      config.retry = 0;
    }

    if (config.retry >= 3) {
      return Promise.reject(error);
    }

    config.retry += 1;

    const backoff = new Promise(resolve => {
      setTimeout(() => resolve(), config.retry * 1000);
    });

    await backoff;
    return apiClient(config);
  }
);

module.exports = apiClient;
