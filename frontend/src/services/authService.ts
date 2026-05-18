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
  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const validatedData = registerDataSchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error(getReadableZodError(validatedData.error));
    }

    const response = await apiClient.post('/auth/register', validatedData.data);
    const payload = response.data;
    const result = authResponseSchema.safeParse(payload);
    if (!result.success) {
      throw new Error('Unexpected response format during registration');
    }

    this.setToken(result.data.data.token);
    return result.data;
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const validatedData = loginDataSchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error(getReadableZodError(validatedData.error));
    }

    const response = await apiClient.post('/auth/login', validatedData.data);
    const payload = response.data;
    const result = authResponseSchema.safeParse(payload);
    if (!result.success) {
      throw new Error('Unexpected response format during login');
    }

    this.setToken(result.data.data.token);
    return result.data;
  }

  // Get current user
  async getCurrentUser(): Promise<UserResponse> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await apiClient.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = response.data;
      const result = userResponseSchema.safeParse(payload);
      if (!result.success) {
        throw new Error('Unexpected response format while fetching user data');
      }

      return result.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.removeToken();
      }

      throw new Error(getApiErrorMessage(error, 'Failed to get user data'));
    }
  }

  // Logout user
  logout(): void {
    this.removeToken();
  }
}

const authService = new AuthService();

export default authService;

export type { RegisterData, LoginData, AuthResponse, UserResponse };
