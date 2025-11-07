import {User} from '@types/api.types';

/**
 * RBAC Utilities
 * Permission and role checking utilities
 */

// Predefined user roles as per requirements
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  INSTRUCTOR = 'instructor',
  CASHIER = 'cashier',
  ACCOUNTANT = 'accountant',
}

// Permission categories
export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = 'view:dashboard',

  // POS
  ACCESS_POS = 'access:pos',
  PROCESS_SALE = 'process:sale',
  PROCESS_REFUND = 'process:refund',
  VIEW_TRANSACTIONS = 'view:transactions',
  HOLD_SALE = 'hold:sale',

  // Products
  VIEW_PRODUCTS = 'view:products',
  CREATE_PRODUCTS = 'create:products',
  UPDATE_PRODUCTS = 'update:products',
  DELETE_PRODUCTS = 'delete:products',

  // Inventory
  VIEW_INVENTORY = 'view:inventory',
  UPDATE_INVENTORY = 'update:inventory',
  CREATE_INVENTORY_TRANSACTION = 'create:inventory-transaction',
  APPROVE_INVENTORY_ADJUSTMENT = 'approve:inventory-adjustment',

  // Customers
  VIEW_CUSTOMERS = 'view:customers',
  CREATE_CUSTOMERS = 'create:customers',
  UPDATE_CUSTOMERS = 'update:customers',
  DELETE_CUSTOMERS = 'delete:customers',
  VIEW_CUSTOMER_CREDIT = 'view:customer-credit',
  UPDATE_CUSTOMER_CREDIT = 'update:customer-credit',

  // Users
  VIEW_USERS = 'view:users',
  CREATE_USERS = 'create:users',
  UPDATE_USERS = 'update:users',
  DELETE_USERS = 'delete:users',
  MANAGE_ROLES = 'manage:roles',
  MANAGE_PERMISSIONS = 'manage:permissions',

  // Financial
  VIEW_FINANCIAL = 'view:financial',
  CREATE_INVOICE = 'create:invoice',
  UPDATE_INVOICE = 'update:invoice',
  DELETE_INVOICE = 'delete:invoice',
  PROCESS_PAYMENT = 'process:payment',
  VIEW_PAYMENTS = 'view:payments',
  CREATE_EXPENSE = 'create:expense',
  UPDATE_EXPENSE = 'update:expense',
  DELETE_EXPENSE = 'delete:expense',
  VIEW_REPORTS = 'view:reports',
  EXPORT_REPORTS = 'export:reports',

  // Branches
  VIEW_BRANCHES = 'view:branches',
  CREATE_BRANCH = 'create:branch',
  UPDATE_BRANCH = 'update:branch',
  DELETE_BRANCH = 'delete:branch',

  // Suppliers
  VIEW_SUPPLIERS = 'view:suppliers',
  CREATE_SUPPLIER = 'create:supplier',
  UPDATE_SUPPLIER = 'update:supplier',
  DELETE_SUPPLIER = 'delete:supplier',

  // Purchase Orders
  VIEW_PURCHASE_ORDERS = 'view:purchase-orders',
  CREATE_PURCHASE_ORDER = 'create:purchase-order',
  UPDATE_PURCHASE_ORDER = 'update:purchase-order',
  APPROVE_PURCHASE_ORDER = 'approve:purchase-order',
  RECEIVE_PURCHASE_ORDER = 'receive:purchase-order',

  // Settings
  VIEW_SETTINGS = 'view:settings',
  UPDATE_SETTINGS = 'update:settings',
  MANAGE_HARDWARE = 'manage:hardware',

  // Backup
  CREATE_BACKUP = 'create:backup',
  RESTORE_BACKUP = 'restore:backup',
}

// Role-based permission mappings
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    ...Object.values(Permission),
  ],

  [UserRole.MANAGER]: [
    // Dashboard
    Permission.VIEW_DASHBOARD,

    // POS
    Permission.ACCESS_POS,
    Permission.PROCESS_SALE,
    Permission.PROCESS_REFUND,
    Permission.VIEW_TRANSACTIONS,
    Permission.HOLD_SALE,

    // Products
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCTS,
    Permission.UPDATE_PRODUCTS,
    Permission.DELETE_PRODUCTS,

    // Inventory
    Permission.VIEW_INVENTORY,
    Permission.UPDATE_INVENTORY,
    Permission.CREATE_INVENTORY_TRANSACTION,
    Permission.APPROVE_INVENTORY_ADJUSTMENT,

    // Customers
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMERS,
    Permission.UPDATE_CUSTOMERS,
    Permission.DELETE_CUSTOMERS,
    Permission.VIEW_CUSTOMER_CREDIT,
    Permission.UPDATE_CUSTOMER_CREDIT,

    // Users
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.UPDATE_USERS,

    // Financial
    Permission.VIEW_FINANCIAL,
    Permission.CREATE_INVOICE,
    Permission.UPDATE_INVOICE,
    Permission.PROCESS_PAYMENT,
    Permission.VIEW_PAYMENTS,
    Permission.CREATE_EXPENSE,
    Permission.UPDATE_EXPENSE,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,

    // Branches
    Permission.VIEW_BRANCHES,
    Permission.UPDATE_BRANCH,

    // Suppliers
    Permission.VIEW_SUPPLIERS,
    Permission.CREATE_SUPPLIER,
    Permission.UPDATE_SUPPLIER,

    // Purchase Orders
    Permission.VIEW_PURCHASE_ORDERS,
    Permission.CREATE_PURCHASE_ORDER,
    Permission.UPDATE_PURCHASE_ORDER,
    Permission.APPROVE_PURCHASE_ORDER,
    Permission.RECEIVE_PURCHASE_ORDER,

    // Settings
    Permission.VIEW_SETTINGS,

    // Backup
    Permission.CREATE_BACKUP,
  ],

  [UserRole.STAFF]: [
    // Dashboard
    Permission.VIEW_DASHBOARD,

    // POS
    Permission.ACCESS_POS,
    Permission.PROCESS_SALE,
    Permission.VIEW_TRANSACTIONS,
    Permission.HOLD_SALE,

    // Products
    Permission.VIEW_PRODUCTS,
    Permission.UPDATE_PRODUCTS,

    // Inventory
    Permission.VIEW_INVENTORY,
    Permission.UPDATE_INVENTORY,
    Permission.CREATE_INVENTORY_TRANSACTION,

    // Customers
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMERS,
    Permission.UPDATE_CUSTOMERS,
    Permission.VIEW_CUSTOMER_CREDIT,

    // Financial
    Permission.VIEW_FINANCIAL,
    Permission.CREATE_INVOICE,
    Permission.PROCESS_PAYMENT,
    Permission.VIEW_PAYMENTS,

    // Purchase Orders
    Permission.VIEW_PURCHASE_ORDERS,
    Permission.RECEIVE_PURCHASE_ORDER,
  ],

  [UserRole.INSTRUCTOR]: [
    // Dashboard
    Permission.VIEW_DASHBOARD,

    // Customers
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMERS,
    Permission.UPDATE_CUSTOMERS,

    // Products (for class packages)
    Permission.VIEW_PRODUCTS,
  ],

  [UserRole.CASHIER]: [
    // Dashboard
    Permission.VIEW_DASHBOARD,

    // POS
    Permission.ACCESS_POS,
    Permission.PROCESS_SALE,
    Permission.VIEW_TRANSACTIONS,
    Permission.HOLD_SALE,

    // Products
    Permission.VIEW_PRODUCTS,

    // Customers
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMERS,
    Permission.VIEW_CUSTOMER_CREDIT,

    // Financial
    Permission.CREATE_INVOICE,
    Permission.PROCESS_PAYMENT,
    Permission.VIEW_PAYMENTS,
  ],

  [UserRole.ACCOUNTANT]: [
    // Dashboard
    Permission.VIEW_DASHBOARD,

    // Financial
    Permission.VIEW_FINANCIAL,
    Permission.CREATE_INVOICE,
    Permission.UPDATE_INVOICE,
    Permission.DELETE_INVOICE,
    Permission.PROCESS_PAYMENT,
    Permission.VIEW_PAYMENTS,
    Permission.CREATE_EXPENSE,
    Permission.UPDATE_EXPENSE,
    Permission.DELETE_EXPENSE,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,

    // Customers (for financial tracking)
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_CUSTOMER_CREDIT,
    Permission.UPDATE_CUSTOMER_CREDIT,

    // Purchase Orders
    Permission.VIEW_PURCHASE_ORDERS,

    // Backup
    Permission.CREATE_BACKUP,
  ],
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (
  user: User | null,
  permission: Permission,
): boolean => {
  if (!user) return false;

  // Check if user has explicit permission
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }

  // Check role-based permissions
  const userRole = user.role as UserRole;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  return rolePermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  user: User | null,
  permissions: Permission[],
): boolean => {
  if (!user) return false;
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (
  user: User | null,
  permissions: Permission[],
): boolean => {
  if (!user) return false;
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;

  // Check primary role
  if (user.role === role) return true;

  // Check additional roles
  if (user.roles && user.roles.includes(role)) return true;

  return false;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.some(role => hasRole(user, role));
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.every(role => hasRole(user, role));
};

/**
 * Get all permissions for a user
 */
export const getUserPermissions = (user: User | null): Permission[] => {
  if (!user) return [];

  const userRole = user.role as UserRole;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  // Combine role permissions with explicit permissions
  const explicitPermissions = (user.permissions || []) as Permission[];

  // Remove duplicates
  return Array.from(new Set([...rolePermissions, ...explicitPermissions]));
};

/**
 * Check if role is admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

/**
 * Check if role is manager or above
 */
export const isManagerOrAbove = (user: User | null): boolean => {
  return hasAnyRole(user, [UserRole.ADMIN, UserRole.MANAGER]);
};
