import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import constants from '../configs/constants';

export interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
  retryAfter: number | null;
}

const parseHeaderNumber = (value: unknown): number | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const getRateLimitInfo = (response: Pick<AxiosResponse, 'headers'>): RateLimitInfo => ({
  limit: parseHeaderNumber(response.headers['x-ratelimit-limit']),
  remaining: parseHeaderNumber(response.headers['x-ratelimit-remaining']),
  reset: parseHeaderNumber(response.headers['x-ratelimit-reset']),
  retryAfter: parseHeaderNumber(response.headers['retry-after']),
});

let latestRateLimitInfo: RateLimitInfo | null = null;

const apiClient = axios.create({
  baseURL: constants.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

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

apiClient.interceptors.response.use(
  (response) => {
    latestRateLimitInfo = getRateLimitInfo(response);
    return response;
  },
  async (error) => {
    if (error.response) {
      latestRateLimitInfo = getRateLimitInfo(error.response);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${constants.apiUrl}/auth/refresh`, { refreshToken });
        const newAccessToken = response.data.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const getLatestRateLimitInfo = (): RateLimitInfo | null => latestRateLimitInfo;

export default apiClient;