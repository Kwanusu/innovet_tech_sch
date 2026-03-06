import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/',
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
            const response = await axios.post(`http://localhost:8000/api/token/refresh/`, {
                refresh: refreshToken
            });

            
            if (response.status === 200) {
                const newAccessToken = response.data.access;
                localStorage.setItem('token', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return API(originalRequest);
            }
        } catch (refreshError) {
            console.error('Refresh token expired',refreshError)
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