import constants from '../configs/constants';
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

class AuthService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = constants.apiUrl;
  }

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

    const response = await fetch(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData.data),
    });

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response, 'Registration failed'));
    }

    const payload = await response.json();
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

    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData.data),
    });

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response, 'Login failed'));
    }

    const payload = await response.json();
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

    const response = await fetch(`${this.apiUrl}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken();
      }
      throw new Error(await getApiErrorMessage(response, 'Failed to get user data'));
    }

    const payload = await response.json();
    const result = userResponseSchema.safeParse(payload);
    if (!result.success) {
      throw new Error('Unexpected response format while fetching user data');
    }

    return result.data;
  }

  // Logout user
  logout(): void {
    this.removeToken();
  }
}

const authService = new AuthService();

export default authService;

export type { RegisterData, LoginData, AuthResponse, UserResponse };
