/**
 * Branch Service
 * API service for branch management
 */

import apiClient from '../client';
import {
  Branch,
  BranchCreateRequest,
  BranchUpdateRequest,
  BranchFilters,
  BranchPerformanceMetrics,
  BranchComparison,
  BranchInventoryStatus,
  BranchStaffAssignment,
  BranchTransferRequest,
  PaginatedResponse,
  PaginationParams,
  User,
} from '@types/api.types';

export const branchService = {
  /**
   * Get all branches with optional pagination and filters
   */
  async getBranches(
    params?: PaginationParams & BranchFilters,
  ): Promise<PaginatedResponse<Branch>> {
    const response = await apiClient.get<PaginatedResponse<Branch>>('/branches', {
      params,
    });
    return response.data!;
  },

  /**
   * Get a single branch by ID
   */
  async getBranch(id: string): Promise<Branch> {
    const response = await apiClient.get<Branch>(`/branches/${id}`);
    return response.data!;
  },

  /**
   * Search branches by name or code
   */
  async searchBranches(query: string): Promise<Branch[]> {
    const response = await apiClient.get<Branch[]>('/branches/search', {
      params: {q: query},
    });
    return response.data!;
  },

  /**
   * Create a new branch
   */
  async createBranch(data: BranchCreateRequest): Promise<Branch> {
    const response = await apiClient.post<Branch>('/branches', data);
    return response.data!;
  },

  /**
   * Update a branch
   */
  async updateBranch(id: string, data: BranchUpdateRequest): Promise<Branch> {
    const response = await apiClient.put<Branch>(`/branches/${id}`, data);
    return response.data!;
  },

  /**
   * Delete a branch
   */
  async deleteBranch(id: string): Promise<void> {
    await apiClient.delete(`/branches/${id}`);
  },

  /**
   * Get branch performance metrics
   */
  async getBranchPerformanceMetrics(
    branchId: string,
    period?: {startDate?: string; endDate?: string},
  ): Promise<BranchPerformanceMetrics> {
    const response = await apiClient.get<BranchPerformanceMetrics>(
      `/branches/${branchId}/performance`,
      {params: period},
    );
    return response.data!;
  },

  /**
   * Get branch comparison data
   */
  async compareBranches(
    branchIds: string[],
    period: {startDate: string; endDate: string},
  ): Promise<BranchComparison> {
    const response = await apiClient.post<BranchComparison>('/branches/compare', {
      branchIds,
      period,
    });
    return response.data!;
  },

  /**
   * Get branch inventory status
   */
  async getBranchInventoryStatus(branchId: string): Promise<BranchInventoryStatus> {
    const response = await apiClient.get<BranchInventoryStatus>(
      `/branches/${branchId}/inventory`,
    );
    return response.data!;
  },

  /**
   * Get branch staff
   */
  async getBranchStaff(branchId: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/branches/${branchId}/staff`);
    return response.data!;
  },

  /**
   * Assign staff to branch
   */
  async assignStaffToBranch(data: BranchStaffAssignment): Promise<void> {
    await apiClient.post('/branches/staff/assign', data);
  },

  /**
   * Remove staff from branch
   */
  async removeStaffFromBranch(branchId: string, userId: string): Promise<void> {
    await apiClient.delete(`/branches/${branchId}/staff/${userId}`);
  },

  /**
   * Transfer staff between branches
   */
  async transferStaff(
    userId: string,
    fromBranchId: string,
    toBranchId: string,
  ): Promise<void> {
    await apiClient.post('/branches/staff/transfer', {
      userId,
      fromBranchId,
      toBranchId,
    });
  },

  /**
   * Request inter-branch inventory transfer
   */
  async requestBranchTransfer(data: BranchTransferRequest): Promise<any> {
    const response = await apiClient.post('/branches/transfer/request', data);
    return response.data!;
  },

  /**
   * Get branch transfer requests
   */
  async getBranchTransferRequests(
    branchId: string,
    type: 'incoming' | 'outgoing' | 'all' = 'all',
  ): Promise<any[]> {
    const response = await apiClient.get(`/branches/${branchId}/transfers`, {
      params: {type},
    });
    return response.data!;
  },

  /**
   * Approve/reject branch transfer request
   */
  async updateTransferRequestStatus(
    transferId: string,
    status: 'approved' | 'rejected',
    notes?: string,
  ): Promise<any> {
    const response = await apiClient.put(`/branches/transfer/${transferId}/status`, {
      status,
      notes,
    });
    return response.data!;
  },

  /**
   * Toggle branch active status
   */
  async toggleBranchStatus(branchId: string, isActive: boolean): Promise<Branch> {
    const response = await apiClient.patch<Branch>(`/branches/${branchId}/status`, {
      isActive,
    });
    return response.data!;
  },

  /**
   * Update branch settings
   */
  async updateBranchSettings(branchId: string, settings: any): Promise<Branch> {
    const response = await apiClient.put<Branch>(
      `/branches/${branchId}/settings`,
      settings,
    );
    return response.data!;
  },

  /**
   * Get active branches (quick list for selectors)
   */
  async getActiveBranches(): Promise<Branch[]> {
    const response = await apiClient.get<Branch[]>('/branches/active');
    return response.data!;
  },

  /**
   * Get branch dashboard summary
   */
  async getBranchDashboard(branchId: string): Promise<any> {
    const response = await apiClient.get(`/branches/${branchId}/dashboard`);
    return response.data!;
  },

  /**
   * Get nearby branches based on coordinates
   */
  async getNearbyBranches(
    latitude: number,
    longitude: number,
    radius: number = 10,
  ): Promise<Branch[]> {
    const response = await apiClient.get<Branch[]>('/branches/nearby', {
      params: {latitude, longitude, radius},
    });
    return response.data!;
  },
};
