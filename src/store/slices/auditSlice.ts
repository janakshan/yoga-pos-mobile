import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
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
import {auditService} from '../../api/services/auditService';
import AuditServiceInstance from '../../services/AuditService';

/**
 * Audit Store
 * Manages audit logging state and actions
 */

interface AuditState {
  // Audit Logs
  logs: AuditLog[];
  currentLog: AuditLog | null;
  totalLogs: number;
  isLoading: boolean;
  error: string | null;

  // Filters
  filters: AuditLogFilters;

  // Statistics
  statistics: AuditStatistics | null;
  statisticsLoading: boolean;

  // Sessions
  activeSessions: UserSession[];
  concurrentUserCount: number;
  sessionsLoading: boolean;

  // Export
  exportStatus: AuditExportResponse | null;
  exportLoading: boolean;

  // Sync
  syncInProgress: boolean;
  lastSyncTime: Date | null;
  unsyncedCount: number;
}

interface AuditActions {
  // Fetch audit logs
  fetchAuditLogs: (filters?: AuditLogFilters) => Promise<void>;
  fetchAuditLog: (id: string) => Promise<void>;
  searchAuditLogs: (query: string) => Promise<void>;

  // Update filters
  setFilters: (filters: Partial<AuditLogFilters>) => void;
  clearFilters: () => void;

  // Statistics
  fetchStatistics: (startDate?: string, endDate?: string) => Promise<void>;

  // Sessions
  fetchActiveSessions: () => Promise<void>;
  fetchUserSessions: (userId: string, includeInactive?: boolean) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;

  // Export
  exportLogs: (request: AuditExportRequest) => Promise<void>;
  checkExportStatus: (exportId: string) => Promise<void>;

  // Sync
  syncLocalLogs: () => Promise<void>;
  getUnsyncedCount: () => Promise<void>;

  // Clear state
  clearError: () => void;
  reset: () => void;
}

type AuditStore = AuditState & AuditActions;

const initialFilters: AuditLogFilters = {
  page: 1,
  limit: 50,
  sortBy: 'timestamp',
  sortOrder: 'desc',
};

export const useAuditStore = create<AuditStore>()(
  immer((set, get) => ({
    // Initial state
    logs: [],
    currentLog: null,
    totalLogs: 0,
    isLoading: false,
    error: null,
    filters: initialFilters,
    statistics: null,
    statisticsLoading: false,
    activeSessions: [],
    concurrentUserCount: 0,
    sessionsLoading: false,
    exportStatus: null,
    exportLoading: false,
    syncInProgress: false,
    lastSyncTime: null,
    unsyncedCount: 0,

    // Actions
    fetchAuditLogs: async (filters?: AuditLogFilters) => {
      try {
        set(state => {
          state.isLoading = true;
          state.error = null;
          if (filters) {
            state.filters = {...state.filters, ...filters};
          }
        });

        const response = await auditService.getAuditLogs(get().filters);

        set(state => {
          state.logs = response.logs;
          state.totalLogs = response.pagination.total;
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch audit logs';
          state.isLoading = false;
        });
        throw error;
      }
    },

    fetchAuditLog: async (id: string) => {
      try {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        const log = await auditService.getAuditLog(id);

        set(state => {
          state.currentLog = log;
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch audit log';
          state.isLoading = false;
        });
        throw error;
      }
    },

    searchAuditLogs: async (query: string) => {
      try {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        const response = await auditService.searchAuditLogs(query, get().filters);

        set(state => {
          state.logs = response.logs;
          state.totalLogs = response.pagination.total;
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to search audit logs';
          state.isLoading = false;
        });
        throw error;
      }
    },

    setFilters: (filters: Partial<AuditLogFilters>) => {
      set(state => {
        state.filters = {...state.filters, ...filters};
      });
    },

    clearFilters: () => {
      set(state => {
        state.filters = initialFilters;
      });
    },

    fetchStatistics: async (startDate?: string, endDate?: string) => {
      try {
        set(state => {
          state.statisticsLoading = true;
          state.error = null;
        });

        const statistics = await auditService.getAuditStatistics(startDate, endDate);

        set(state => {
          state.statistics = statistics;
          state.statisticsLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch statistics';
          state.statisticsLoading = false;
        });
        throw error;
      }
    },

    fetchActiveSessions: async () => {
      try {
        set(state => {
          state.sessionsLoading = true;
          state.error = null;
        });

        const response = await auditService.getActiveSessions();

        set(state => {
          state.activeSessions = response.sessions;
          state.concurrentUserCount = response.concurrentSessions;
          state.sessionsLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch active sessions';
          state.sessionsLoading = false;
        });
        throw error;
      }
    },

    fetchUserSessions: async (userId: string, includeInactive?: boolean) => {
      try {
        set(state => {
          state.sessionsLoading = true;
          state.error = null;
        });

        const sessions = await auditService.getUserSessions(userId, includeInactive);

        set(state => {
          state.activeSessions = sessions;
          state.sessionsLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch user sessions';
          state.sessionsLoading = false;
        });
        throw error;
      }
    },

    endSession: async (sessionId: string) => {
      try {
        await auditService.endSession(sessionId);

        // Remove from active sessions
        set(state => {
          state.activeSessions = state.activeSessions.filter(s => s.id !== sessionId);
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to end session';
        });
        throw error;
      }
    },

    exportLogs: async (request: AuditExportRequest) => {
      try {
        set(state => {
          state.exportLoading = true;
          state.error = null;
        });

        const exportResponse = await auditService.exportAuditLogs(request);

        set(state => {
          state.exportStatus = exportResponse;
          state.exportLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to export audit logs';
          state.exportLoading = false;
        });
        throw error;
      }
    },

    checkExportStatus: async (exportId: string) => {
      try {
        const exportResponse = await auditService.checkExportStatus(exportId);

        set(state => {
          state.exportStatus = exportResponse;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to check export status';
        });
        throw error;
      }
    },

    syncLocalLogs: async () => {
      try {
        set(state => {
          state.syncInProgress = true;
          state.error = null;
        });

        const unsyncedLogs = await AuditServiceInstance.getUnsyncedLogs();

        if (unsyncedLogs.length > 0) {
          const syncedLogs = await auditService.batchCreateAuditLogs(unsyncedLogs);
          await AuditServiceInstance.markLogsAsSynced(syncedLogs.map(log => log.id));
        }

        set(state => {
          state.syncInProgress = false;
          state.lastSyncTime = new Date();
          state.unsyncedCount = 0;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to sync logs';
          state.syncInProgress = false;
        });
        throw error;
      }
    },

    getUnsyncedCount: async () => {
      try {
        const unsyncedLogs = await AuditServiceInstance.getUnsyncedLogs();
        set(state => {
          state.unsyncedCount = unsyncedLogs.length;
        });
      } catch (error: any) {
        console.error('Failed to get unsynced count:', error);
      }
    },

    clearError: () => {
      set(state => {
        state.error = null;
      });
    },

    reset: () => {
      set(state => {
        state.logs = [];
        state.currentLog = null;
        state.totalLogs = 0;
        state.error = null;
        state.filters = initialFilters;
        state.statistics = null;
        state.activeSessions = [];
        state.concurrentUserCount = 0;
        state.exportStatus = null;
      });
    },
  })),
);

export default useAuditStore;
