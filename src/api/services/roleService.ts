/**
 * Role Service
 * API service for role and permission management
 */

import apiClient from '../client';
import {
  Role,
  RoleStatistics,
  PaginatedResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleFilterParams,
  RoleTemplate,
  PermissionCategory,
  Permission,
} from '@types/api.types';

export const roleService = {
  /**
   * Get all roles with optional pagination and filters
   */
  async getRoles(params?: RoleFilterParams): Promise<PaginatedResponse<Role>> {
    const response = await apiClient.get<PaginatedResponse<Role>>('/roles', {
      params,
    });
    return response.data!;
  },

  /**
   * Get a single role by ID
   */
  async getRole(id: string): Promise<Role> {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data!;
  },

  /**
   * Search roles by name or code
   */
  async searchRoles(query: string): Promise<Role[]> {
    const response = await apiClient.get<Role[]>('/roles/search', {
      params: {q: query},
    });
    return response.data!;
  },

  /**
   * Create a new role
   */
  async createRole(data: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.post<Role>('/roles', data);
    return response.data!;
  },

  /**
   * Update a role
   */
  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    const response = await apiClient.put<Role>(`/roles/${id}`, data);
    return response.data!;
  },

  /**
   * Delete a role
   */
  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`/roles/${id}`);
  },

  /**
   * Duplicate a role
   */
  async duplicateRole(id: string, name: string): Promise<Role> {
    const response = await apiClient.post<Role>(`/roles/${id}/duplicate`, {
      name,
    });
    return response.data!;
  },

  /**
   * Get role statistics
   */
  async getRoleStatistics(id: string): Promise<RoleStatistics> {
    const response = await apiClient.get<RoleStatistics>(
      `/roles/${id}/statistics`,
    );
    return response.data!;
  },

  /**
   * Get users by role
   */
  async getUsersByRole(id: string): Promise<any[]> {
    const response = await apiClient.get(`/roles/${id}/users`);
    return response.data!;
  },

  /**
   * Get predefined role templates
   */
  async getRoleTemplates(): Promise<RoleTemplate[]> {
    const response = await apiClient.get<RoleTemplate[]>('/roles/templates');
    return response.data!;
  },

  /**
   * Create role from template
   */
  async createRoleFromTemplate(
    templateId: string,
    data: {name: string; description?: string},
  ): Promise<Role> {
    const response = await apiClient.post<Role>(
      `/roles/templates/${templateId}/create`,
      data,
    );
    return response.data!;
  },

  /**
   * Get permission categories
   */
  async getPermissionCategories(): Promise<PermissionCategory[]> {
    const response = await apiClient.get<PermissionCategory[]>(
      '/roles/permission-categories',
    );
    return response.data!;
  },

  /**
   * Get all available permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>('/roles/permissions');
    return response.data!;
  },

  /**
   * Validate role name uniqueness
   */
  async validateRoleName(name: string, excludeId?: string): Promise<boolean> {
    const response = await apiClient.get<{isUnique: boolean}>(
      '/roles/validate-name',
      {
        params: {name, excludeId},
      },
    );
    return response.data!.isUnique;
  },

  /**
   * Validate role code uniqueness
   */
  async validateRoleCode(code: string, excludeId?: string): Promise<boolean> {
    const response = await apiClient.get<{isUnique: boolean}>(
      '/roles/validate-code',
      {
        params: {code, excludeId},
      },
    );
    return response.data!.isUnique;
  },

  /**
   * Get role analytics
   */
  async getRoleAnalytics(): Promise<{
    totalRoles: number;
    systemRoles: number;
    customRoles: number;
    totalUsers: number;
    rolesByCategory: Record<string, number>;
    mostUsedRoles: {role: Role; userCount: number}[];
    averagePermissionsPerRole: number;
  }> {
    const response = await apiClient.get('/roles/analytics');
    return response.data!;
  },
};
