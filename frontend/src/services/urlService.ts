import constants from '../configs/constants';
import authService from './authService';
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

const getApiErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  try {
    const payload = await response.json();
    const parsed = apiErrorSchema.safeParse(payload);

    if (parsed.success) {
      return parsed.data.message || parsed.data.error || fallback;
    }
  } catch {
    return fallback;
  }

  return fallback;
};

class UrlService {
  private apiUrl: string;
  private backendUrl: string;

  constructor() {
    this.apiUrl = constants.apiUrl;
    this.backendUrl = constants.backendUrl;
  }

  async createUrl(urlData: UrlData): Promise<UrlResponse> {
    const validatedData = urlDataSchema.safeParse(urlData);
    if (!validatedData.success) {
      throw new Error(getReadableZodError(validatedData.error));
    }

    const token = authService.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const body = validatedData.data;



    const response = await fetch(`${this.apiUrl}/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Custom alias is already in use. Please choose a different one.');
      }
      throw new Error(await getApiErrorMessage(response, 'Failed to create short URL'));
    }

    const payload = await response.json();
    const result = urlResponseSchema.safeParse(payload);
    if (!result.success) {
      throw new Error('Unexpected response format while creating short URL');
    }

    return result.data;
  }

  async getAllUrls(): Promise<UrlsResponse> {
    const response = await fetch(`${this.apiUrl}/urls`);

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response, 'Failed to fetch URLs'));
    }

    const payload = await response.json();
    const result = urlsResponseSchema.safeParse(payload);
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? 'Unexpected response format while fetching URLs');
    }

    return result.data;
  }

  async getMyUrls(): Promise<UrlsResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.apiUrl}/my-urls`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response, 'Failed to fetch URLs'));
    }

    const payload = await response.json();
    const result = urlsResponseSchema.safeParse(payload);
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? 'Unexpected response format while fetching your URLs');
    }

    return result.data;
  }

  getShortUrl(shortId: string): string {
    return `${this.backendUrl}/${shortId}`;
  }
}

const urlService = new UrlService();

export default urlService;

export type { UrlData, UrlItem, UrlResponse, UrlsResponse };
