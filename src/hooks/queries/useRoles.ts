/**
 * Role Query Hooks
 * React Query hooks for role data fetching
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {roleService} from '@api/services/roleService';
import {
  Role,
  RoleStatistics,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleFilterParams,
  RoleTemplate,
  PermissionCategory,
} from '@types/api.types';

// Query Keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: any) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  search: (query: string) => [...roleKeys.all, 'search', query] as const,
  statistics: (id: string) => [...roleKeys.detail(id), 'statistics'] as const,
  users: (id: string) => [...roleKeys.detail(id), 'users'] as const,
  templates: () => [...roleKeys.all, 'templates'] as const,
  permissionCategories: () => [...roleKeys.all, 'permission-categories'] as const,
  permissions: () => [...roleKeys.all, 'permissions'] as const,
  analytics: () => [...roleKeys.all, 'analytics'] as const,
};

/**
 * Hook to fetch roles with pagination and filters
 */
export const useRoles = (params?: RoleFilterParams) => {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleService.getRoles(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single role
 */
export const useRole = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleService.getRole(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to search roles
 */
export const useSearchRoles = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: roleKeys.search(query),
    queryFn: () => roleService.searchRoles(query),
    enabled: !!query && enabled,
    retry: false,
  });
};

/**
 * Hook to create a role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => roleService.createRole(data),
    onSuccess: newRole => {
      queryClient.invalidateQueries({queryKey: roleKeys.lists()});
      queryClient.invalidateQueries({queryKey: roleKeys.analytics()});
      queryClient.setQueryData(roleKeys.detail(newRole.id), newRole);
    },
  });
};

/**
 * Hook to update a role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateRoleRequest}) =>
      roleService.updateRole(id, data),
    onSuccess: (updatedRole, variables) => {
      queryClient.invalidateQueries({queryKey: roleKeys.lists()});
      queryClient.setQueryData(roleKeys.detail(variables.id), updatedRole);
      // Invalidate user queries as role changes might affect users
      queryClient.invalidateQueries({queryKey: ['users']});
    },
  });
};

/**
 * Hook to delete a role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: roleKeys.all});
      queryClient.invalidateQueries({queryKey: roleKeys.analytics()});
      // Invalidate user queries as role deletion might affect users
      queryClient.invalidateQueries({queryKey: ['users']});
    },
  });
};

/**
 * Hook to duplicate a role
 */
export const useDuplicateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, name}: {id: string; name: string}) =>
      roleService.duplicateRole(id, name),
    onSuccess: newRole => {
      queryClient.invalidateQueries({queryKey: roleKeys.lists()});
      queryClient.invalidateQueries({queryKey: roleKeys.analytics()});
      queryClient.setQueryData(roleKeys.detail(newRole.id), newRole);
    },
  });
};

/**
 * Hook to fetch role statistics
 */
export const useRoleStatistics = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: roleKeys.statistics(id),
    queryFn: () => roleService.getRoleStatistics(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch users by role
 */
export const useUsersByRole = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: roleKeys.users(id),
    queryFn: () => roleService.getUsersByRole(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch role templates
 */
export const useRoleTemplates = () => {
  return useQuery({
    queryKey: roleKeys.templates(),
    queryFn: () => roleService.getRoleTemplates(),
    staleTime: 1000 * 60 * 30, // 30 minutes (templates don't change often)
  });
};

/**
 * Hook to create role from template
 */
export const useCreateRoleFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data: {name: string; description?: string};
    }) => roleService.createRoleFromTemplate(templateId, data),
    onSuccess: newRole => {
      queryClient.invalidateQueries({queryKey: roleKeys.lists()});
      queryClient.invalidateQueries({queryKey: roleKeys.analytics()});
      queryClient.setQueryData(roleKeys.detail(newRole.id), newRole);
    },
  });
};

/**
 * Hook to fetch permission categories
 */
export const usePermissionCategories = () => {
  return useQuery({
    queryKey: roleKeys.permissionCategories(),
    queryFn: () => roleService.getPermissionCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes (categories don't change often)
  });
};

/**
 * Hook to fetch all permissions
 */
export const useAllPermissions = () => {
  return useQuery({
    queryKey: roleKeys.permissions(),
    queryFn: () => roleService.getAllPermissions(),
    staleTime: 1000 * 60 * 30, // 30 minutes (permissions don't change often)
  });
};

/**
 * Hook to validate role name
 */
export const useValidateRoleName = () => {
  return useMutation({
    mutationFn: ({name, excludeId}: {name: string; excludeId?: string}) =>
      roleService.validateRoleName(name, excludeId),
  });
};

/**
 * Hook to validate role code
 */
export const useValidateRoleCode = () => {
  return useMutation({
    mutationFn: ({code, excludeId}: {code: string; excludeId?: string}) =>
      roleService.validateRoleCode(code, excludeId),
  });
};

/**
 * Hook to fetch role analytics
 */
export const useRoleAnalytics = () => {
  return useQuery({
    queryKey: roleKeys.analytics(),
    queryFn: () => roleService.getRoleAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
