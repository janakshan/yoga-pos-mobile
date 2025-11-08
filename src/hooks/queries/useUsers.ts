/**
 * User Query Hooks
 * React Query hooks for user data fetching
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {userService} from '@api/services/userService';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserPermissionsRequest,
  UpdateUserStatusRequest,
  ChangeUserPasswordRequest,
  UserFilterParams,
  UserActivityLog,
  UserStatistics,
  PaginationParams,
  PinSetupRequest,
} from '@types/api.types';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: any) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
  activityLog: (id: string) => [...userKeys.detail(id), 'activity-log'] as const,
  statistics: (id: string) => [...userKeys.detail(id), 'statistics'] as const,
  byBranch: (branchId: string) => [...userKeys.all, 'branch', branchId] as const,
  byRole: (role: string) => [...userKeys.all, 'role', role] as const,
  analytics: () => [...userKeys.all, 'analytics'] as const,
  activeCount: () => [...userKeys.all, 'active-count'] as const,
};

/**
 * Hook to fetch users with pagination and filters
 */
export const useUsers = (params?: UserFilterParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single user
 */
export const useUser = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to search users
 */
export const useSearchUsers = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => userService.searchUsers(query),
    enabled: !!query && enabled,
    retry: false,
  });
};

/**
 * Hook to create a user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: newUser => {
      queryClient.invalidateQueries({queryKey: userKeys.lists()});
      queryClient.invalidateQueries({queryKey: userKeys.analytics()});
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },
  });
};

/**
 * Hook to update a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateUserRequest}) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.invalidateQueries({queryKey: userKeys.lists()});
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
      if (updatedUser.branchId) {
        queryClient.invalidateQueries({
          queryKey: userKeys.byBranch(updatedUser.branchId),
        });
      }
      if (updatedUser.role) {
        queryClient.invalidateQueries({
          queryKey: userKeys.byRole(updatedUser.role),
        });
      }
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: userKeys.all});
      queryClient.invalidateQueries({queryKey: userKeys.analytics()});
    },
  });
};

/**
 * Hook to update user permissions
 */
export const useUpdateUserPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateUserPermissionsRequest}) =>
      userService.updateUserPermissions(id, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
      queryClient.invalidateQueries({queryKey: userKeys.lists()});
    },
  });
};

/**
 * Hook to update user status
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateUserStatusRequest}) =>
      userService.updateUserStatus(id, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
      queryClient.invalidateQueries({queryKey: userKeys.lists()});
      queryClient.invalidateQueries({queryKey: userKeys.analytics()});
    },
  });
};

/**
 * Hook to change user password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({id, data}: {id: string; data: ChangeUserPasswordRequest}) =>
      userService.changePassword(id, data),
  });
};

/**
 * Hook to reset user password (admin action)
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (id: string) => userService.resetPassword(id),
  });
};

/**
 * Hook to setup user PIN
 */
export const useSetupPin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: PinSetupRequest}) =>
      userService.setupPin(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: userKeys.detail(variables.id)});
    },
  });
};

/**
 * Hook to disable user PIN
 */
export const useDisablePin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.disablePin(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: userKeys.detail(id)});
    },
  });
};

/**
 * Hook to enable biometric authentication
 */
export const useEnableBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.enableBiometric(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: userKeys.detail(id)});
    },
  });
};

/**
 * Hook to disable biometric authentication
 */
export const useDisableBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.disableBiometric(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: userKeys.detail(id)});
    },
  });
};

/**
 * Hook to fetch user activity log
 */
export const useUserActivityLog = (
  id: string,
  params?: PaginationParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [...userKeys.activityLog(id), params],
    queryFn: () => userService.getUserActivityLog(id, params),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch user statistics
 */
export const useUserStatistics = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.statistics(id),
    queryFn: () => userService.getUserStatistics(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch users by branch
 */
export const useUsersByBranch = (branchId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.byBranch(branchId),
    queryFn: () => userService.getUsersByBranch(branchId),
    enabled: !!branchId && enabled,
  });
};

/**
 * Hook to fetch users by role
 */
export const useUsersByRole = (role: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.byRole(role),
    queryFn: () => userService.getUsersByRole(role),
    enabled: !!role && enabled,
  });
};

/**
 * Hook to upload user profile photo
 */
export const useUploadProfilePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, photo}: {id: string; photo: FormData}) =>
      userService.uploadProfilePhoto(id, photo),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
      queryClient.invalidateQueries({queryKey: userKeys.lists()});
    },
  });
};

/**
 * Hook to remove user profile photo
 */
export const useRemoveProfilePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.removeProfilePhoto(id),
    onSuccess: (updatedUser, id) => {
      queryClient.setQueryData(userKeys.detail(id), updatedUser);
      queryClient.invalidateQueries({queryKey: userKeys.lists()});
    },
  });
};

/**
 * Hook to get active users count
 */
export const useActiveUsersCount = () => {
  return useQuery({
    queryKey: userKeys.activeCount(),
    queryFn: () => userService.getActiveUsersCount(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch user analytics
 */
export const useUserAnalytics = () => {
  return useQuery({
    queryKey: userKeys.analytics(),
    queryFn: () => userService.getUserAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to import users
 */
export const useImportUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest[]) => userService.importUsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: userKeys.all});
      queryClient.invalidateQueries({queryKey: userKeys.analytics()});
    },
  });
};
