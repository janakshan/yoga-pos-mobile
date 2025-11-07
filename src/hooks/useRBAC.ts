import {useMemo} from 'react';
import {useAuthStore} from '@store/slices/authSlice';
import {UserRole, Permission} from '@types/api.types';
import {RBACUtility} from '@utils/rbac.utils';

/**
 * RBAC Hooks
 * React hooks for role-based access control
 */

/**
 * Hook to check if user has a specific permission
 */
export const usePermission = (permission: Permission): boolean => {
  const {user} = useAuthStore();

  return useMemo(() => {
    return RBACUtility.hasPermission(user, permission);
  }, [user, permission]);
};

/**
 * Hook to check if user has any of the specified permissions
 */
export const useAnyPermission = (permissions: Permission[]): boolean => {
  const {user} = useAuthStore();

  return useMemo(() => {
    return RBACUtility.hasAnyPermission(user, permissions);
  }, [user, permissions]);
};

/**
 * Hook to check if user has all of the specified permissions
 */
export const useAllPermissions = (permissions: Permission[]): boolean => {
  const {user} = useAuthStore();

  return useMemo(() => {
    return RBACUtility.hasAllPermissions(user, permissions);
  }, [user, permissions]);
};

/**
 * Hook to check if user has a specific role
 */
export const useRole = (role: UserRole): boolean => {
  const {user} = useAuthStore();

  return useMemo(() => {
    return RBACUtility.hasRole(user, role);
  }, [user, role]);
};

/**
 * Hook to check if user has any of the specified roles
 */
export const useAnyRole = (roles: UserRole[]): boolean => {
  const {user} = useAuthStore();

  return useMemo(() => {
    return RBACUtility.hasAnyRole(user, roles);
  }, [user, roles]);
};

/**
 * Hook to check if user's role is higher or equal in hierarchy
 */
export const useMinimumRole = (minimumRole: UserRole): boolean => {
  const {user} = useAuthStore();

  return useMemo(() => {
    return RBACUtility.hasMinimumRole(user, minimumRole);
  }, [user, minimumRole]);
};

/**
 * Hook to get all user permissions
 */
export const useUserPermissions = (): Permission[] => {
  const {user} = useAuthStore();

  return useMemo(() => {
    return RBACUtility.getUserPermissions(user);
  }, [user]);
};

/**
 * Hook for common role checks
 */
export const useRoleChecks = () => {
  const {user} = useAuthStore();

  return useMemo(
    () => ({
      isAdmin: RBACUtility.isAdmin(user),
      isManager: RBACUtility.isManager(user),
      canAccessPOS: RBACUtility.canAccessPOS(user),
      canManageInventory: RBACUtility.canManageInventory(user),
      canManageUsers: RBACUtility.canManageUsers(user),
      canViewReports: RBACUtility.canViewReports(user),
    }),
    [user],
  );
};

/**
 * Complete RBAC hook with all utilities
 */
export const useRBAC = () => {
  const {user} = useAuthStore();

  return useMemo(
    () => ({
      user,
      hasPermission: (permission: Permission) =>
        RBACUtility.hasPermission(user, permission),
      hasAnyPermission: (permissions: Permission[]) =>
        RBACUtility.hasAnyPermission(user, permissions),
      hasAllPermissions: (permissions: Permission[]) =>
        RBACUtility.hasAllPermissions(user, permissions),
      hasRole: (role: UserRole) => RBACUtility.hasRole(user, role),
      hasAnyRole: (roles: UserRole[]) => RBACUtility.hasAnyRole(user, roles),
      hasMinimumRole: (minimumRole: UserRole) =>
        RBACUtility.hasMinimumRole(user, minimumRole),
      getUserPermissions: () => RBACUtility.getUserPermissions(user),
      isAdmin: RBACUtility.isAdmin(user),
      isManager: RBACUtility.isManager(user),
      canAccessPOS: RBACUtility.canAccessPOS(user),
      canManageInventory: RBACUtility.canManageInventory(user),
      canManageUsers: RBACUtility.canManageUsers(user),
      canViewReports: RBACUtility.canViewReports(user),
    }),
    [user],
  );
};
