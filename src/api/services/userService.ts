/**
 * User Service
 * API service for user management
 */

import apiClient from '../client';
import {
  User,
  PaginatedResponse,
  PaginationParams,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserPermissionsRequest,
  UpdateUserStatusRequest,
  ChangeUserPasswordRequest,
  ResetUserPasswordRequest,
  UserFilterParams,
  UserActivityLog,
  UserStatistics,
  PinSetupRequest,
} from '@types/api.types';

export const userService = {
  /**
   * Get all users with optional pagination and filters
   */
  async getUsers(params?: UserFilterParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', {
      params,
    });
    return response.data!;
  },

  /**
   * Get a single user by ID
   */
  async getUser(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data!;
  },

  /**
   * Search users by username, name, or email
   */
  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users/search', {
      params: {q: query},
    });
    return response.data!;
  },

  /**
   * Create a new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data!;
  },

  /**
   * Update a user
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data!;
  },

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  /**
   * Update user permissions
   */
  async updateUserPermissions(
    id: string,
    data: UpdateUserPermissionsRequest,
  ): Promise<User> {
    const response = await apiClient.patch<User>(
      `/users/${id}/permissions`,
      data,
    );
    return response.data!;
  },

  /**
   * Update user status
   */
  async updateUserStatus(
    id: string,
    data: UpdateUserStatusRequest,
  ): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/status`, data);
    return response.data!;
  },

  /**
   * Change user password
   */
  async changePassword(
    id: string,
    data: ChangeUserPasswordRequest,
  ): Promise<void> {
    await apiClient.post(`/users/${id}/change-password`, data);
  },

  /**
   * Reset user password (admin action)
   */
  async resetPassword(id: string): Promise<{temporaryPassword: string}> {
    const response = await apiClient.post<{temporaryPassword: string}>(
      `/users/${id}/reset-password`,
    );
    return response.data!;
  },

  /**
   * Request password reset by email
   */
  async requestPasswordReset(data: ResetUserPasswordRequest): Promise<void> {
    await apiClient.post('/users/request-password-reset', data);
  },

  /**
   * Setup PIN for user
   */
  async setupPin(id: string, data: PinSetupRequest): Promise<void> {
    await apiClient.post(`/users/${id}/setup-pin`, data);
  },

  /**
   * Disable PIN for user
   */
  async disablePin(id: string): Promise<void> {
    await apiClient.post(`/users/${id}/disable-pin`);
  },

  /**
   * Enable biometric authentication for user
   */
  async enableBiometric(id: string): Promise<void> {
    await apiClient.post(`/users/${id}/enable-biometric`);
  },

  /**
   * Disable biometric authentication for user
   */
  async disableBiometric(id: string): Promise<void> {
    await apiClient.post(`/users/${id}/disable-biometric`);
  },

  /**
   * Get user activity log
   */
  async getUserActivityLog(
    id: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<UserActivityLog>> {
    const response = await apiClient.get<PaginatedResponse<UserActivityLog>>(
      `/users/${id}/activity-log`,
      {params},
    );
    return response.data!;
  },

  /**
   * Get user statistics
   */
  async getUserStatistics(id: string): Promise<UserStatistics> {
    const response = await apiClient.get<UserStatistics>(
      `/users/${id}/statistics`,
    );
    return response.data!;
  },

  /**
   * Get users by branch
   */
  async getUsersByBranch(branchId: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(
      `/branches/${branchId}/users`,
    );
    return response.data!;
  },

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users/by-role', {
      params: {role},
    });
    return response.data!;
  },

  /**
   * Upload user profile photo
   */
  async uploadProfilePhoto(id: string, photo: FormData): Promise<User> {
    const response = await apiClient.post<User>(
      `/users/${id}/upload-photo`,
      photo,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data!;
  },

  /**
   * Remove user profile photo
   */
  async removeProfilePhoto(id: string): Promise<User> {
    const response = await apiClient.delete<User>(`/users/${id}/photo`);
    return response.data!;
  },

  /**
   * Bulk import users
   */
  async importUsers(
    data: CreateUserRequest[],
  ): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const response = await apiClient.post('/users/import', {users: data});
    return response.data!;
  },

  /**
   * Export users
   */
  async exportUsers(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await apiClient.get('/users/export', {
      params: {format},
      responseType: 'blob',
    });
    return response.data!;
  },

  /**
   * Get active users count
   */
  async getActiveUsersCount(): Promise<{count: number}> {
    const response = await apiClient.get<{count: number}>(
      '/users/active/count',
    );
    return response.data!;
  },

  /**
   * Get user analytics
   */
  async getUserAnalytics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    suspendedUsers: number;
    usersByRole: Record<string, number>;
    usersByBranch: Record<string, number>;
    newUsersThisMonth: number;
    averageLoginFrequency: number;
  }> {
    const response = await apiClient.get('/users/analytics');
    return response.data!;
  },
};
