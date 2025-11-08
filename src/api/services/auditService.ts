/**
 * Audit Service API
 * API service for audit log management
 */

import apiClient from '../client';
import {
  AuditLog,
  AuditLogFilters,
  AuditLogResponse,
  AuditStatistics,
  AuditExportRequest,
  AuditExportResponse,
  ActiveSessionsResponse,
  UserSession,
} from '../../types/audit.types';

export const auditService = {
  /**
   * Get audit logs with filters and pagination
   */
  async getAuditLogs(filters?: AuditLogFilters): Promise<AuditLogResponse> {
    const response = await apiClient.get<AuditLogResponse>('/audit/logs', {
      params: filters,
    });
    return response.data!;
  },

  /**
   * Get a single audit log by ID
   */
  async getAuditLog(id: string): Promise<AuditLog> {
    const response = await apiClient.get<AuditLog>(`/audit/logs/${id}`);
    return response.data!;
  },

  /**
   * Create an audit log entry
   * This is typically called internally by the audit service
   */
  async createAuditLog(log: Partial<AuditLog>): Promise<AuditLog> {
    const response = await apiClient.post<AuditLog>('/audit/logs', log);
    return response.data!;
  },

  /**
   * Batch create audit logs (for syncing offline logs)
   */
  async batchCreateAuditLogs(logs: Partial<AuditLog>[]): Promise<AuditLog[]> {
    const response = await apiClient.post<AuditLog[]>('/audit/logs/batch', {
      logs,
    });
    return response.data!;
  },

  /**
   * Get audit statistics for a time period
   */
  async getAuditStatistics(
    startDate?: string,
    endDate?: string,
  ): Promise<AuditStatistics> {
    const response = await apiClient.get<AuditStatistics>('/audit/statistics', {
      params: {startDate, endDate},
    });
    return response.data!;
  },

  /**
   * Export audit logs
   */
  async exportAuditLogs(
    request: AuditExportRequest,
  ): Promise<AuditExportResponse> {
    const response = await apiClient.post<AuditExportResponse>(
      '/audit/export',
      request,
    );
    return response.data!;
  },

  /**
   * Check export status
   */
  async checkExportStatus(exportId: string): Promise<AuditExportResponse> {
    const response = await apiClient.get<AuditExportResponse>(
      `/audit/export/${exportId}`,
    );
    return response.data!;
  },

  /**
   * Get active user sessions
   */
  async getActiveSessions(): Promise<ActiveSessionsResponse> {
    const response = await apiClient.get<ActiveSessionsResponse>(
      '/audit/sessions/active',
    );
    return response.data!;
  },

  /**
   * Get user sessions by user ID
   */
  async getUserSessions(
    userId: string,
    includeInactive?: boolean,
  ): Promise<UserSession[]> {
    const response = await apiClient.get<UserSession[]>(
      `/audit/sessions/user/${userId}`,
      {
        params: {includeInactive},
      },
    );
    return response.data!;
  },

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<UserSession> {
    const response = await apiClient.get<UserSession>(
      `/audit/sessions/${sessionId}`,
    );
    return response.data!;
  },

  /**
   * End a user session (admin action)
   */
  async endSession(sessionId: string): Promise<void> {
    await apiClient.post(`/audit/sessions/${sessionId}/end`);
  },

  /**
   * Get concurrent user count
   */
  async getConcurrentUsers(): Promise<{
    count: number;
    users: Array<{userId: string; userName: string; sessionCount: number}>;
  }> {
    const response = await apiClient.get<{
      count: number;
      users: Array<{userId: string; userName: string; sessionCount: number}>;
    }>('/audit/concurrent-users');
    return response.data!;
  },

  /**
   * Search audit logs by query
   */
  async searchAuditLogs(query: string, filters?: AuditLogFilters): Promise<AuditLogResponse> {
    const response = await apiClient.get<AuditLogResponse>('/audit/logs/search', {
      params: {
        q: query,
        ...filters,
      },
    });
    return response.data!;
  },
};

export default auditService;
