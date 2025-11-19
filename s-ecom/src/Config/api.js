// import axios from 'axios';

// export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// console.log("API_BASE_URL =", API_BASE_URL);

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// const token = localStorage.getItem('jwt');
// api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// api.defaults.headers.post['Content-Type'] = 'application/json';

// export default api;


// src/utils/api.js

import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_React_BASE_API_URL;
console.log("API_BASE_URL =", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

const token = localStorage.getItem('jwt');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
api.defaults.headers.post['Content-Type'] = 'application/json';


// ✅ Retry interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // If ERR_FAILED and we haven't retried yet, retry up to 3 times
    if (
      error.message.includes("ERR_FAILED") &&
      (!config._retryCount || config._retryCount < 3)
    ) {
      config._retryCount = config._retryCount ? config._retryCount + 1 : 1;
      console.warn(`⚠️ Backend sleeping, retrying... (${config._retryCount}/3)`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 sec
      return api(config); // Retry the request
    }

    return Promise.reject(error);
  }
);

export default api;
