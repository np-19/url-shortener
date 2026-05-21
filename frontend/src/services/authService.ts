import axios from 'axios';
import apiClient from './apiClient';
import {
  apiErrorSchema,
  authResponseSchema,
  loginDataSchema,
  registerDataSchema,
  userResponseSchema,
  type AuthResponse,
  type LoginData,
  type RegisterData,
  type UserResponse,
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

class AuthService {
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  removeTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const validatedData = registerDataSchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error(getReadableZodError(validatedData.error));
    }

    try {
      const response = await apiClient.post('/auth/register', validatedData.data);
      const payload = response.data;
      const result = authResponseSchema.safeParse(payload);
      if (!result.success) {
        throw new Error('Unexpected response format during registration');
      }

      this.setTokens(result.data.data.accessToken, result.data.data.refreshToken);
      return result.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Registration failed'));
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const validatedData = loginDataSchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error(getReadableZodError(validatedData.error));
    }

    try {
      const response = await apiClient.post('/auth/login', validatedData.data);
      const payload = response.data;
      const result = authResponseSchema.safeParse(payload);
      if (!result.success) {
        throw new Error('Unexpected response format during login');
      }

      this.setTokens(result.data.data.accessToken, result.data.data.refreshToken);
      return result.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Login failed'));
    }
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken = response.data.data.accessToken;
      if (!newAccessToken) {
        throw new Error('Invalid response from refresh token endpoint');
      }

      this.setTokens(newAccessToken, refreshToken);
      return newAccessToken;
    } catch (error) {
      this.removeTokens();
      throw new Error('Failed to refresh token');
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await apiClient.get('/auth/me');

      const payload = response.data;
      const result = userResponseSchema.safeParse(payload);
      if (!result.success) {
        throw new Error('Unexpected response format while fetching user data');
      }

      return result.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.removeTokens();
      }

      throw new Error(getApiErrorMessage(error, 'Failed to get user data'));
    }
  }

  logout(): void {
    this.removeTokens();
  }
}

const authService = new AuthService();

export default authService;

export type { RegisterData, LoginData, AuthResponse, UserResponse };
