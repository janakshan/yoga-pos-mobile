import {apiClient} from '../client';
import {
  DashboardData,
  DashboardMetrics,
  DashboardFilters,
  TimePeriod,
  YogaClass,
  RecentTransaction,
  ActivityItem,
} from '@types/dashboard.types';

/**
 * Dashboard API Service
 * Handles all dashboard-related API calls
 */

export const dashboardService = {
  /**
   * Get complete dashboard data
   */
  async getDashboardData(
    filters?: DashboardFilters,
  ): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/dashboard', {
      params: filters,
    });
    return response.data!;
  },

  /**
   * Get dashboard metrics
   */
  async getMetrics(
    timePeriod: TimePeriod = 'today',
    branchId?: string,
  ): Promise<DashboardMetrics> {
    const response = await apiClient.get<DashboardMetrics>(
      '/dashboard/metrics',
      {
        params: {timePeriod, branchId},
      },
    );
    return response.data!;
  },

  /**
   * Get today's class schedule
   */
  async getTodayClasses(branchId?: string): Promise<YogaClass[]> {
    const response = await apiClient.get<YogaClass[]>('/classes/today', {
      params: {branchId},
    });
    return response.data || [];
  },

  /**
   * Get recent transactions
   */
  async getRecentTransactions(
    limit: number = 10,
    branchId?: string,
  ): Promise<RecentTransaction[]> {
    const response = await apiClient.get<RecentTransaction[]>(
      '/transactions/recent',
      {
        params: {limit, branchId},
      },
    );
    return response.data || [];
  },

  /**
   * Get activity feed
   */
  async getActivityFeed(
    limit: number = 20,
    branchId?: string,
  ): Promise<ActivityItem[]> {
    const response = await apiClient.get<ActivityItem[]>(
      '/dashboard/activity',
      {
        params: {limit, branchId},
      },
    );
    return response.data || [];
  },

  /**
   * Get revenue data for charts
   */
  async getRevenueData(
    timePeriod: TimePeriod,
    branchId?: string,
  ): Promise<{chartData: any[]; total: number; percentageChange: number}> {
    const response = await apiClient.get('/dashboard/revenue', {
      params: {timePeriod, branchId},
    });
    return response.data!;
  },

  /**
   * Refresh all dashboard data
   */
  async refreshDashboard(filters?: DashboardFilters): Promise<DashboardData> {
    return this.getDashboardData(filters);
  },
};
