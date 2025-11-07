import {UserRole, Permission, User} from '@types/api.types';

/**
 * RBAC (Role-Based Access Control) Utility
 * Handles permission checking and role validation
 */

// Role hierarchy - higher roles inherit permissions from lower roles
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 100,
  [UserRole.MANAGER]: 80,
  [UserRole.INVENTORY_MANAGER]: 60,
  [UserRole.CASHIER]: 40,
  [UserRole.WAITER]: 20,
  [UserRole.WAITRESS]: 20,
  [UserRole.KITCHEN_STAFF]: 20,
};

// Default permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    Permission.POS_ACCESS,
    Permission.POS_VOID_TRANSACTION,
    Permission.POS_APPLY_DISCOUNT,
    Permission.POS_REFUND,
    Permission.POS_VIEW_REPORTS,
    Permission.PRODUCT_VIEW,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_DELETE,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_MANAGE,
    Permission.INVENTORY_ADJUST,
    Permission.CUSTOMER_VIEW,
    Permission.CUSTOMER_CREATE,
    Permission.CUSTOMER_UPDATE,
    Permission.CUSTOMER_DELETE,
    Permission.USER_VIEW,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_MANAGE,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_EXPORT,
  ],
  [UserRole.MANAGER]: [
    Permission.POS_ACCESS,
    Permission.POS_VOID_TRANSACTION,
    Permission.POS_APPLY_DISCOUNT,
    Permission.POS_REFUND,
    Permission.POS_VIEW_REPORTS,
    Permission.PRODUCT_VIEW,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_MANAGE,
    Permission.CUSTOMER_VIEW,
    Permission.CUSTOMER_CREATE,
    Permission.CUSTOMER_UPDATE,
    Permission.USER_VIEW,
    Permission.SETTINGS_VIEW,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_EXPORT,
  ],
  [UserRole.INVENTORY_MANAGER]: [
    Permission.PRODUCT_VIEW,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_MANAGE,
    Permission.INVENTORY_ADJUST,
    Permission.REPORTS_VIEW,
  ],
  [UserRole.CASHIER]: [
    Permission.POS_ACCESS,
    Permission.POS_APPLY_DISCOUNT,
    Permission.PRODUCT_VIEW,
    Permission.CUSTOMER_VIEW,
    Permission.CUSTOMER_CREATE,
  ],
  [UserRole.WAITER]: [
    Permission.POS_ACCESS,
    Permission.PRODUCT_VIEW,
    Permission.CUSTOMER_VIEW,
  ],
  [UserRole.WAITRESS]: [
    Permission.POS_ACCESS,
    Permission.PRODUCT_VIEW,
    Permission.CUSTOMER_VIEW,
  ],
  [UserRole.KITCHEN_STAFF]: [
    Permission.PRODUCT_VIEW,
  ],
};

class RBACUtilityClass {
  /**
   * Check if user has a specific permission
   */
  hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) {
      return false;
    }

    // Admins have all permissions
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Check explicit user permissions first
    if (user.permissions?.includes(permission)) {
      return true;
    }

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
    if (!user || permissions.length === 0) {
      return false;
    }

    return permissions.some(permission => this.hasPermission(user, permission));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
    if (!user || permissions.length === 0) {
      return false;
    }

    return permissions.every(permission =>
      this.hasPermission(user, permission),
    );
  }

  /**
   * Check if user has a specific role
   */
  hasRole(user: User | null, role: UserRole): boolean {
    if (!user) {
      return false;
    }

    // Check primary role
    if (user.role === role) {
      return true;
    }

    // Check additional roles
    return user.roles?.includes(role) || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    if (!user || roles.length === 0) {
      return false;
    }

    return roles.some(role => this.hasRole(user, role));
  }

  /**
   * Check if user's role is higher or equal in hierarchy
   */
  hasMinimumRole(user: User | null, minimumRole: UserRole): boolean {
    if (!user) {
      return false;
    }

    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
    const minimumRoleLevel = ROLE_HIERARCHY[minimumRole] || 0;

    return userRoleLevel >= minimumRoleLevel;
  }

  /**
   * Get all permissions for a user
   */
  getUserPermissions(user: User | null): Permission[] {
    if (!user) {
      return [];
    }

    // Get role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];

    // Merge with user's explicit permissions
    const allPermissions = new Set([
      ...rolePermissions,
      ...(user.permissions || []),
    ]);

    return Array.from(allPermissions);
  }

  /**
   * Check if user is admin
   */
  isAdmin(user: User | null): boolean {
    return this.hasRole(user, UserRole.ADMIN);
  }

  /**
   * Check if user is manager or higher
   */
  isManager(user: User | null): boolean {
    return this.hasAnyRole(user, [UserRole.ADMIN, UserRole.MANAGER]);
  }

  /**
   * Check if user can access POS
   */
  canAccessPOS(user: User | null): boolean {
    return this.hasPermission(user, Permission.POS_ACCESS);
  }

  /**
   * Check if user can manage inventory
   */
  canManageInventory(user: User | null): boolean {
    return this.hasPermission(user, Permission.INVENTORY_MANAGE);
  }

  /**
   * Check if user can manage users
   */
  canManageUsers(user: User | null): boolean {
    return this.hasAnyPermission(user, [
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
    ]);
  }

  /**
   * Check if user can view reports
   */
  canViewReports(user: User | null): boolean {
    return this.hasPermission(user, Permission.REPORTS_VIEW);
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(role: UserRole): string {
    const roleNames: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Administrator',
      [UserRole.MANAGER]: 'Manager',
      [UserRole.CASHIER]: 'Cashier',
      [UserRole.KITCHEN_STAFF]: 'Kitchen Staff',
      [UserRole.WAITER]: 'Waiter',
      [UserRole.WAITRESS]: 'Waitress',
      [UserRole.INVENTORY_MANAGER]: 'Inventory Manager',
    };

    return roleNames[role] || role;
  }

  /**
   * Get permission display name
   */
  getPermissionDisplayName(permission: Permission): string {
    return permission
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' - ');
  }
}

export const RBACUtility = new RBACUtilityClass();
