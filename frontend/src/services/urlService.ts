import axios from 'axios';
import constants from '../configs/constants';
import authService from './authService';
import apiClient from './apiClient';
import {
  apiErrorSchema,
  urlDataSchema,
  urlResponseSchema,
  urlsResponseSchema,
  type UrlData,
  type UrlItem,
  type UrlResponse,
  type UrlsResponse,
} from '../schemas/apiSchemas';

const getReadableZodError = (error: { issues: Array<{ message: string }> }): string =>
  error.issues[0]?.message ?? 'Invalid request payload';

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error) || !error.response) {
    return fallback;
  }

  const parsed = apiErrorSchema.safeParse(error.response.data);
  if (parsed.success) {
    return parsed.data.message || parsed.data.error || fallback;
  }

  return fallback;
};

class UrlService {
  private backendUrl: string;

  constructor() {
    this.backendUrl = constants.backendUrl;
  }

  async createUrl(urlData: UrlData): Promise<UrlResponse> {
    const validatedData = urlDataSchema.safeParse(urlData);
    if (!validatedData.success) {
      throw new Error(getReadableZodError(validatedData.error));
    }

    const token = authService.getAccessToken();
    if (!token) {
      throw new Error('You must be logged in to create short URLs');
    }

    try {
      const response = await apiClient.post('/create', validatedData.data);

      const payload = response.data;
      const result = urlResponseSchema.safeParse(payload);
      if (!result.success) {
        throw new Error('Unexpected response format while creating short URL');
      }

      return result.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new Error('Custom alias is already in use. Please choose a different one.');
      }

      throw new Error(getApiErrorMessage(error, 'Failed to create short URL'));
    }
  }

  async getAllUrls(cursor?: string): Promise<UrlsResponse> {
    const queryParams = cursor ? `?cursor=${cursor}` : '';
    const response = await apiClient.get(`/urls${queryParams}`);
    const payload = response.data;
    const result = urlsResponseSchema.safeParse(payload);
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? 'Unexpected response format while fetching URLs');
    }

    return result.data;
  }

  async getMyUrls(cursor?: string): Promise<UrlsResponse> {
    const token = authService.getAccessToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const queryParams = cursor ? `?cursor=${cursor}` : '';
      const response = await apiClient.get(`/my-urls${queryParams}`);

      const payload = response.data;
      const result = urlsResponseSchema.safeParse(payload);
      if (!result.success) {
        throw new Error(result.error.issues[0]?.message ?? 'Unexpected response format while fetching your URLs');
      }

      return result.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch URLs'));
    }
  }

  getShortUrl(shortId: string): string {
    return `${this.backendUrl}/${shortId}`;
  }
}

const urlService = new UrlService();

export default urlService;

export type { UrlData, UrlItem, UrlResponse, UrlsResponse };
