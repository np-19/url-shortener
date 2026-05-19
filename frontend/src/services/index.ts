import urlService from './urlService';
import authService from './authService';
import type { UrlData, UrlResponse, UrlItem, UrlsResponse } from './urlService';
import type { RegisterData, LoginData, AuthResponse, UserResponse } from './authService';

export { urlService, authService };
export default urlService;
export type { UrlData, UrlResponse, UrlItem, UrlsResponse, RegisterData, LoginData, AuthResponse, UserResponse };
