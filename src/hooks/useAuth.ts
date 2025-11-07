import {useAuthStore} from '@store/slices/authSlice';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  getUserPermissions,
  isAdmin,
  isManagerOrAbove,
  Permission,
  UserRole,
} from '@utils/permissions';

/**
 * useAuth Hook
 * Provides easy access to authentication state and utilities
 */

export const useAuth = () => {
  const {user, isAuthenticated, isLoading, error, login, loginWithPin, logout} =
    useAuthStore();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    loginWithPin,
    logout,

    // Permission checks
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(user, permissions),

    // Role checks
    hasRole: (role: UserRole) => hasRole(user, role),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(user, roles),
    hasAllRoles: (roles: UserRole[]) => hasAllRoles(user, roles),

    // Utility
    getUserPermissions: () => getUserPermissions(user),
    isAdmin: () => isAdmin(user),
    isManagerOrAbove: () => isManagerOrAbove(user),
  };
};
