import {apiClient} from '../client';
import {
  LoginRequest,
  PinLoginRequest,
  AuthResponse,
  User,
  ApiResponse,
} from '@types/api.types';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials,
    );
    return response.data!;
  },

  /**
   * Login with PIN
   */
  async loginWithPin(credentials: PinLoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login/pin',
      credentials,
    );
    return response.data!;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data!;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data!;
  },

  /**
   * Set user PIN
   */
  async setPin(userId: string, pin: string): Promise<void> {
    await apiClient.post('/auth/pin/set', {
      userId,
      newPIN: pin,
    });
  },

  /**
   * Disable PIN authentication
   */
  async disablePin(userId: string): Promise<void> {
    await apiClient.post('/auth/pin/disable', {
      userId,
    });
  },

  /**
   * Reset PIN attempts (admin only)
   */
  async resetPinAttempts(userId: string): Promise<void> {
    await apiClient.post('/auth/pin/reset-attempts', {
      userId,
    });
  },
};
