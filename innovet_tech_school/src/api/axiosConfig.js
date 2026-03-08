import axios from 'axios';

const getBaseUrl = () => {
  try {
    const host = typeof window !== 'undefined' ? window.location.hostname : '';

    if (host.includes('vercel.app') || host === 'innovet-tech-school.vercel.app') {
      return 'https://innovet-tech-sch.onrender.com/';
    }

    const envUrl = import.meta?.env?.VITE_API_URL;
    const finalUrl = envUrl || 'http://127.0.0.1:8000';

    return finalUrl.replace(/\/+$/, '') + '/';
  } catch (error) {
    console.error("Critical: getBaseUrl failed, falling back to local.", error);
    return 'http://127.0.0.1:8000/';
  }
};

const BASE_URL = getBaseUrl();

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {

          const response = await axios.post(`${BASE_URL}api/token/refresh/`, {
            refresh: refreshToken
          });

          if (response.status === 200) {
            const newAccessToken = response.data.access;
            localStorage.setItem('token', newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return API(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh token expired', refreshError);
        }
      }
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login?message=session_expired';
    }
    return Promise.reject(error);
  }
);

export default API;