/**
 * Branch Query Hooks
 * React Query hooks for branch data fetching
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {branchService} from '@api/services/branchService';
import {
  Branch,
  BranchCreateRequest,
  BranchUpdateRequest,
  BranchFilters,
  BranchStaffAssignment,
  BranchTransferRequest,
  PaginationParams,
} from '@types/api.types';

// Query Keys
export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  list: (params?: any) => [...branchKeys.lists(), params] as const,
  details: () => [...branchKeys.all, 'detail'] as const,
  detail: (id: string) => [...branchKeys.details(), id] as const,
  search: (query: string) => [...branchKeys.all, 'search', query] as const,
  performance: (id: string, period?: any) =>
    [...branchKeys.detail(id), 'performance', period] as const,
  comparison: (branchIds: string[], period: any) =>
    [...branchKeys.all, 'comparison', {branchIds, period}] as const,
  inventory: (id: string) => [...branchKeys.detail(id), 'inventory'] as const,
  staff: (id: string) => [...branchKeys.detail(id), 'staff'] as const,
  transfers: (id: string, type: string) =>
    [...branchKeys.detail(id), 'transfers', type] as const,
  active: () => [...branchKeys.all, 'active'] as const,
  dashboard: (id: string) => [...branchKeys.detail(id), 'dashboard'] as const,
  nearby: (latitude: number, longitude: number, radius: number) =>
    [...branchKeys.all, 'nearby', {latitude, longitude, radius}] as const,
};

/**
 * Hook to fetch branches with pagination and filters
 */
export const useBranches = (params?: PaginationParams & BranchFilters) => {
  return useQuery({
    queryKey: branchKeys.list(params),
    queryFn: () => branchService.getBranches(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single branch
 */
export const useBranch = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => branchService.getBranch(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to search branches
 */
export const useSearchBranches = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: branchKeys.search(query),
    queryFn: () => branchService.searchBranches(query),
    enabled: !!query && enabled,
    retry: false,
  });
};

/**
 * Hook to fetch branch performance metrics
 */
export const useBranchPerformance = (
  branchId: string,
  period?: {startDate?: string; endDate?: string},
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: branchKeys.performance(branchId, period),
    queryFn: () => branchService.getBranchPerformanceMetrics(branchId, period),
    enabled: !!branchId && enabled,
  });
};

/**
 * Hook to compare multiple branches
 */
export const useBranchComparison = (
  branchIds: string[],
  period: {startDate: string; endDate: string},
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: branchKeys.comparison(branchIds, period),
    queryFn: () => branchService.compareBranches(branchIds, period),
    enabled: branchIds.length > 0 && enabled,
  });
};

/**
 * Hook to fetch branch inventory status
 */
export const useBranchInventory = (branchId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: branchKeys.inventory(branchId),
    queryFn: () => branchService.getBranchInventoryStatus(branchId),
    enabled: !!branchId && enabled,
  });
};

/**
 * Hook to fetch branch staff
 */
export const useBranchStaff = (branchId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: branchKeys.staff(branchId),
    queryFn: () => branchService.getBranchStaff(branchId),
    enabled: !!branchId && enabled,
  });
};

/**
 * Hook to fetch branch transfer requests
 */
export const useBranchTransfers = (
  branchId: string,
  type: 'incoming' | 'outgoing' | 'all' = 'all',
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: branchKeys.transfers(branchId, type),
    queryFn: () => branchService.getBranchTransferRequests(branchId, type),
    enabled: !!branchId && enabled,
  });
};

/**
 * Hook to fetch active branches (for selectors)
 */
export const useActiveBranches = () => {
  return useQuery({
    queryKey: branchKeys.active(),
    queryFn: () => branchService.getActiveBranches(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch branch dashboard
 */
export const useBranchDashboard = (branchId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: branchKeys.dashboard(branchId),
    queryFn: () => branchService.getBranchDashboard(branchId),
    enabled: !!branchId && enabled,
  });
};

/**
 * Hook to fetch nearby branches
 */
export const useNearbyBranches = (
  latitude: number,
  longitude: number,
  radius: number = 10,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: branchKeys.nearby(latitude, longitude, radius),
    queryFn: () => branchService.getNearbyBranches(latitude, longitude, radius),
    enabled: !!latitude && !!longitude && enabled,
  });
};

/**
 * Hook to create a branch
 */
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchCreateRequest) => branchService.createBranch(data),
    onSuccess: newBranch => {
      queryClient.invalidateQueries({queryKey: branchKeys.lists()});
      queryClient.invalidateQueries({queryKey: branchKeys.active()});
      queryClient.setQueryData(branchKeys.detail(newBranch.id), newBranch);
    },
  });
};

/**
 * Hook to update a branch
 */
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: BranchUpdateRequest}) =>
      branchService.updateBranch(id, data),
    onSuccess: (updatedBranch, {id}) => {
      queryClient.invalidateQueries({queryKey: branchKeys.lists()});
      queryClient.invalidateQueries({queryKey: branchKeys.active()});
      queryClient.setQueryData(branchKeys.detail(id), updatedBranch);
    },
  });
};

/**
 * Hook to delete a branch
 */
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchService.deleteBranch(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: branchKeys.lists()});
      queryClient.invalidateQueries({queryKey: branchKeys.active()});
      queryClient.removeQueries({queryKey: branchKeys.detail(id)});
    },
  });
};

/**
 * Hook to toggle branch status
 */
export const useToggleBranchStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({branchId, isActive}: {branchId: string; isActive: boolean}) =>
      branchService.toggleBranchStatus(branchId, isActive),
    onSuccess: (updatedBranch, {branchId}) => {
      queryClient.invalidateQueries({queryKey: branchKeys.lists()});
      queryClient.invalidateQueries({queryKey: branchKeys.active()});
      queryClient.setQueryData(branchKeys.detail(branchId), updatedBranch);
    },
  });
};

/**
 * Hook to assign staff to branch
 */
export const useAssignStaffToBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchStaffAssignment) => branchService.assignStaffToBranch(data),
    onSuccess: (_, {branchId}) => {
      queryClient.invalidateQueries({queryKey: branchKeys.staff(branchId)});
      queryClient.invalidateQueries({queryKey: branchKeys.detail(branchId)});
    },
  });
};

/**
 * Hook to remove staff from branch
 */
export const useRemoveStaffFromBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({branchId, userId}: {branchId: string; userId: string}) =>
      branchService.removeStaffFromBranch(branchId, userId),
    onSuccess: (_, {branchId}) => {
      queryClient.invalidateQueries({queryKey: branchKeys.staff(branchId)});
      queryClient.invalidateQueries({queryKey: branchKeys.detail(branchId)});
    },
  });
};

/**
 * Hook to transfer staff between branches
 */
export const useTransferStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      fromBranchId,
      toBranchId,
    }: {
      userId: string;
      fromBranchId: string;
      toBranchId: string;
    }) => branchService.transferStaff(userId, fromBranchId, toBranchId),
    onSuccess: (_, {fromBranchId, toBranchId}) => {
      queryClient.invalidateQueries({queryKey: branchKeys.staff(fromBranchId)});
      queryClient.invalidateQueries({queryKey: branchKeys.staff(toBranchId)});
      queryClient.invalidateQueries({queryKey: branchKeys.detail(fromBranchId)});
      queryClient.invalidateQueries({queryKey: branchKeys.detail(toBranchId)});
    },
  });
};

/**
 * Hook to request branch transfer
 */
export const useRequestBranchTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchTransferRequest) =>
      branchService.requestBranchTransfer(data),
    onSuccess: (_, {fromBranchId, toBranchId}) => {
      queryClient.invalidateQueries({
        queryKey: branchKeys.transfers(fromBranchId, 'all'),
      });
      queryClient.invalidateQueries({
        queryKey: branchKeys.transfers(toBranchId, 'all'),
      });
    },
  });
};

/**
 * Hook to update transfer request status
 */
export const useUpdateTransferStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transferId,
      status,
      notes,
    }: {
      transferId: string;
      status: 'approved' | 'rejected';
      notes?: string;
    }) => branchService.updateTransferRequestStatus(transferId, status, notes),
    onSuccess: () => {
      // Invalidate all transfer queries
      queryClient.invalidateQueries({queryKey: branchKeys.all});
    },
  });
};

/**
 * Hook to update branch settings
 */
export const useUpdateBranchSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({branchId, settings}: {branchId: string; settings: any}) =>
      branchService.updateBranchSettings(branchId, settings),
    onSuccess: (updatedBranch, {branchId}) => {
      queryClient.setQueryData(branchKeys.detail(branchId), updatedBranch);
      queryClient.invalidateQueries({queryKey: branchKeys.lists()});
    },
  });
};
