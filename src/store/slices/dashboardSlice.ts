import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {
  DashboardMetrics,
  DashboardFilters,
  TimePeriod,
  YogaClass,
  RecentTransaction,
  ActivityItem,
} from '@types/dashboard.types';
import {dashboardService} from '@api/services/dashboardService';

/**
 * Dashboard Store
 * Manages dashboard state and data
 */

interface DashboardState {
  // Data
  metrics: DashboardMetrics | null;
  todayClasses: YogaClass[];
  recentTransactions: RecentTransaction[];
  activityFeed: ActivityItem[];

  // Filters
  filters: DashboardFilters;

  // UI State
  isLoading: boolean;
  isRefreshing: boolean;
  lastRefreshed: Date | null;
  error: string | null;

  // Selected branch for filtering
  selectedBranchId: string | null;
}

interface DashboardActions {
  // Data fetching
  fetchDashboardData: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchTodayClasses: () => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  fetchActivityFeed: () => Promise<void>;
  refreshDashboard: () => Promise<void>;

  // Filters
  setTimePeriod: (period: TimePeriod) => void;
  setSelectedBranch: (branchId: string | null) => void;
  updateFilters: (filters: Partial<DashboardFilters>) => void;

  // UI State
  clearError: () => void;
  setError: (error: string) => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialFilters: DashboardFilters = {
  timePeriod: 'today',
  branchId: undefined,
};

export const useDashboardStore = create<DashboardStore>()(
  immer((set, get) => ({
    // Initial state
    metrics: null,
    todayClasses: [],
    recentTransactions: [],
    activityFeed: [],
    filters: initialFilters,
    isLoading: false,
    isRefreshing: false,
    lastRefreshed: null,
    error: null,
    selectedBranchId: null,

    // Actions
    fetchDashboardData: async () => {
      try {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        const {filters} = get();
        const data = await dashboardService.getDashboardData(filters);

        set(state => {
          state.metrics = data.metrics;
          state.todayClasses = data.todayClasses;
          state.recentTransactions = data.recentTransactions;
          state.activityFeed = data.activityFeed;
          state.lastRefreshed = new Date();
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch dashboard data';
          state.isLoading = false;
        });
      }
    },

    fetchMetrics: async () => {
      try {
        const {filters} = get();
        const metrics = await dashboardService.getMetrics(
          filters.timePeriod,
          filters.branchId,
        );

        set(state => {
          state.metrics = metrics;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch metrics';
        });
      }
    },

    fetchTodayClasses: async () => {
      try {
        const {selectedBranchId} = get();
        const classes = await dashboardService.getTodayClasses(
          selectedBranchId || undefined,
        );

        set(state => {
          state.todayClasses = classes;
        });
      } catch (error: any) {
        console.error('Failed to fetch classes:', error);
      }
    },

    fetchRecentTransactions: async () => {
      try {
        const {selectedBranchId} = get();
        const transactions = await dashboardService.getRecentTransactions(
          10,
          selectedBranchId || undefined,
        );

        set(state => {
          state.recentTransactions = transactions;
        });
      } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
      }
    },

    fetchActivityFeed: async () => {
      try {
        const {selectedBranchId} = get();
        const activities = await dashboardService.getActivityFeed(
          20,
          selectedBranchId || undefined,
        );

        set(state => {
          state.activityFeed = activities;
        });
      } catch (error: any) {
        console.error('Failed to fetch activity feed:', error);
      }
    },

    refreshDashboard: async () => {
      try {
        set(state => {
          state.isRefreshing = true;
          state.error = null;
        });

        const {filters} = get();
        const data = await dashboardService.refreshDashboard(filters);

        set(state => {
          state.metrics = data.metrics;
          state.todayClasses = data.todayClasses;
          state.recentTransactions = data.recentTransactions;
          state.activityFeed = data.activityFeed;
          state.lastRefreshed = new Date();
          state.isRefreshing = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to refresh dashboard';
          state.isRefreshing = false;
        });
      }
    },

    setTimePeriod: (period: TimePeriod) => {
      set(state => {
        state.filters.timePeriod = period;
      });
      // Automatically fetch new metrics when time period changes
      get().fetchMetrics();
    },

    setSelectedBranch: (branchId: string | null) => {
      set(state => {
        state.selectedBranchId = branchId;
        state.filters.branchId = branchId || undefined;
      });
      // Automatically refresh data when branch changes
      get().fetchDashboardData();
    },

    updateFilters: (newFilters: Partial<DashboardFilters>) => {
      set(state => {
        state.filters = {...state.filters, ...newFilters};
      });
      // Automatically refresh data when filters change
      get().fetchDashboardData();
    },

    clearError: () => {
      set(state => {
        state.error = null;
      });
    },

    setError: (error: string) => {
      set(state => {
        state.error = error;
      });
    },
  })),
);
