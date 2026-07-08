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

type AuthOperation = 'login' | 'register' | 'current-user' | 'refresh';

const getBackendErrorMessage = (error: unknown): string | null => {
  if (!axios.isAxiosError(error) || !error.response) {
    return null;
  }

  const parsed = apiErrorSchema.safeParse(error.response.data);
  if (parsed.success) {
    return parsed.data.message || parsed.data.error || null;
  }

  const responseData = error.response.data as { message?: unknown; error?: unknown } | undefined;
  if (typeof responseData?.message === 'string' && responseData.message.trim().length > 0) {
    return responseData.message;
  }

  if (typeof responseData?.error === 'string' && responseData.error.trim().length > 0) {
    return responseData.error;
  }

  return null;
};

const normalizeAuthError = (error: unknown, operation: AuthOperation, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  const backendMessage = getBackendErrorMessage(error);
  const status = error.response.status;

  if (operation === 'login') {
    if (status === 401) {
      return 'Incorrect email or password.';
    }

    if (status === 400 && backendMessage?.toLowerCase().includes('validation error')) {
      return 'Please enter a valid email and password.';
    }
  }

  if (operation === 'register') {
    if (status === 409) {
      return 'An account with this email already exists. Please log in instead.';
    }

    if (status === 400 && backendMessage?.toLowerCase().includes('validation error')) {
      return 'Please check your name, email, and password and try again.';
    }
  }

  if (operation === 'refresh' && status === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  if (operation === 'current-user' && status === 401) {
    return 'Your session is no longer valid. Please sign in again.';
  }

  return backendMessage ?? fallback;
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
      throw new Error(normalizeAuthError(error, 'register', 'Registration failed. Please try again.'));
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
      throw new Error(normalizeAuthError(error, 'login', 'Login failed. Please try again.'));
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
      throw new Error(normalizeAuthError(error, 'refresh', 'Failed to refresh your session.'));
    }
  }

  async initializeSession(): Promise<UserResponse> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken && !refreshToken) {
      throw new Error('No session available');
    }

    try {
      if (!accessToken && refreshToken) {
        await this.refreshAccessToken();
      }

      return await this.getCurrentUser();
    } catch {
      if (!refreshToken) {
        throw new Error('Failed to initialize session');
      }

      // One retry path: refresh token then fetch user again.
      await this.refreshAccessToken();
      return this.getCurrentUser();
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
      throw new Error(normalizeAuthError(error, 'current-user', 'Failed to load your account details.'));
    }
  }

  logout(): void {
    this.removeTokens();
  }
}

const authService = new AuthService();

export default authService;

export type { RegisterData, LoginData, AuthResponse, UserResponse };
