import axios from 'axios';
import type { User } from '../types/user';

const BASE_URL = 'http://localhost:5275';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        const token = user.authToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Błąd parsowania użytkownika z localStorage", error);
        localStorage.removeItem("user");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {      
        const storedUser = localStorage.getItem("user");        
        const user = storedUser ? JSON.parse(storedUser) : null;
        const refreshToken = user?.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post('http://localhost:5275/auth/refresh-token', {
          refreshToken: refreshToken,          
        });
        
        const { token: newAuthToken, refreshToken: newRefreshToken } = response.data;
        
        const updatedUser = { ...user, authToken: newAuthToken, refreshToken: newRefreshToken };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAuthToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newAuthToken;
        
        processQueue(null, newAuthToken);

        return axiosClient(originalRequest);

      } catch (refreshError) {        
        processQueue(refreshError, null);        
        localStorage.removeItem("user");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);