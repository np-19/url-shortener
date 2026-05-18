import axios, { type AxiosResponse } from 'axios';
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

apiClient.interceptors.response.use(
  (response) => {
    latestRateLimitInfo = getRateLimitInfo(response);
    return response;
  },
  (error) => {
    if (error.response) {
      latestRateLimitInfo = getRateLimitInfo(error.response);
    }

    return Promise.reject(error);
  }
);

export const getLatestRateLimitInfo = (): RateLimitInfo | null => latestRateLimitInfo;

export default apiClient;