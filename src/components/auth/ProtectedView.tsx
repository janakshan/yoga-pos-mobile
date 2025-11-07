import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useAuthStore} from '@store/slices/authSlice';
import {Permission, UserRole} from '@types/api.types';
import {RBACUtility} from '@utils/rbac.utils';
import {Typography} from '@components/ui';
import {useTheme} from '@hooks/useTheme';

/**
 * Protected View Component
 * Conditionally renders children based on user permissions or roles
 */

interface ProtectedViewProps {
  /** Required permission to view content */
  permission?: Permission;
  /** Required permissions (user must have any of these) */
  anyPermission?: Permission[];
  /** Required permissions (user must have all of these) */
  allPermissions?: Permission[];
  /** Required role to view content */
  role?: UserRole;
  /** Required roles (user must have any of these) */
  anyRole?: UserRole[];
  /** Minimum role level required */
  minimumRole?: UserRole;
  /** Component to render when access is denied */
  fallback?: React.ReactNode;
  /** Show default unauthorized message */
  showUnauthorized?: boolean;
  /** Children to render when authorized */
  children: React.ReactNode;
}

export const ProtectedView: React.FC<ProtectedViewProps> = ({
  permission,
  anyPermission,
  allPermissions,
  role,
  anyRole,
  minimumRole,
  fallback,
  showUnauthorized = false,
  children,
}) => {
  const {user} = useAuthStore();
  const {theme} = useTheme();

  // Check permissions
  let hasAccess = true;

  if (permission && !RBACUtility.hasPermission(user, permission)) {
    hasAccess = false;
  }

  if (anyPermission && !RBACUtility.hasAnyPermission(user, anyPermission)) {
    hasAccess = false;
  }

  if (
    allPermissions &&
    !RBACUtility.hasAllPermissions(user, allPermissions)
  ) {
    hasAccess = false;
  }

  if (role && !RBACUtility.hasRole(user, role)) {
    hasAccess = false;
  }

  if (anyRole && !RBACUtility.hasAnyRole(user, anyRole)) {
    hasAccess = false;
  }

  if (minimumRole && !RBACUtility.hasMinimumRole(user, minimumRole)) {
    hasAccess = false;
  }

  // Render based on access
  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUnauthorized) {
    return (
      <View
        style={[
          styles.unauthorizedContainer,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}>
        <Typography variant="bodySmall" color={theme.colors.text.secondary}>
          🔒 You don't have permission to view this content
        </Typography>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  unauthorizedContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
