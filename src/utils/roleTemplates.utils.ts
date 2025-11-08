/**
 * Role Templates and Permission Categories Utility
 * Predefined role templates and permission category definitions
 */

import {Permission, RoleTemplate, PermissionCategory} from '@types/api.types';

/**
 * Permission Categories
 * Organized grouping of permissions for better UX
 */
export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Access',
    description: 'Access to dashboard and overview screens',
    icon: 'view-dashboard',
    permissions: [],
  },
  {
    id: 'pos',
    name: 'POS Operations',
    description: 'Point of Sale system permissions',
    icon: 'cash-register',
    permissions: [
      Permission.POS_ACCESS,
      Permission.POS_VOID_TRANSACTION,
      Permission.POS_APPLY_DISCOUNT,
      Permission.POS_REFUND,
      Permission.POS_VIEW_REPORTS,
    ],
  },
  {
    id: 'products',
    name: 'Product Management',
    description: 'Manage products and catalog',
    icon: 'package-variant',
    permissions: [
      Permission.PRODUCT_VIEW,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_UPDATE,
      Permission.PRODUCT_DELETE,
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    description: 'Stock levels, adjustments, and transfers',
    icon: 'archive',
    permissions: [
      Permission.INVENTORY_VIEW,
      Permission.INVENTORY_MANAGE,
      Permission.INVENTORY_ADJUST,
    ],
  },
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Purchase orders and supplier management',
    icon: 'truck-delivery',
    permissions: [
      Permission.PROCUREMENT_VIEW,
      Permission.PROCUREMENT_CREATE,
      Permission.PROCUREMENT_APPROVE,
      Permission.PROCUREMENT_RECEIVE,
      Permission.SUPPLIER_VIEW,
      Permission.SUPPLIER_MANAGE,
    ],
  },
  {
    id: 'customers',
    name: 'Customer Management',
    description: 'Customer data and relationships',
    icon: 'account-group',
    permissions: [
      Permission.CUSTOMER_VIEW,
      Permission.CUSTOMER_CREATE,
      Permission.CUSTOMER_UPDATE,
      Permission.CUSTOMER_DELETE,
    ],
  },
  {
    id: 'branches',
    name: 'Branch Management',
    description: 'Multi-location management',
    icon: 'store',
    permissions: [
      Permission.BRANCH_VIEW,
      Permission.BRANCH_CREATE,
      Permission.BRANCH_UPDATE,
      Permission.BRANCH_DELETE,
      Permission.BRANCH_MANAGE_STAFF,
      Permission.BRANCH_VIEW_PERFORMANCE,
      Permission.BRANCH_MANAGE_SETTINGS,
    ],
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage system users and roles',
    icon: 'account-cog',
    permissions: [
      Permission.USER_VIEW,
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
    ],
  },
  {
    id: 'financial',
    name: 'Financial Access',
    description: 'Financial data and operations',
    icon: 'currency-usd',
    permissions: [
      Permission.FINANCIAL_VIEW,
      Permission.FINANCIAL_MANAGE,
      Permission.INVOICE_CREATE,
      Permission.INVOICE_UPDATE,
      Permission.INVOICE_DELETE,
      Permission.INVOICE_SEND,
      Permission.PAYMENT_CREATE,
      Permission.PAYMENT_PROCESS,
      Permission.PAYMENT_REFUND,
      Permission.PAYMENT_RECONCILE,
      Permission.EXPENSE_CREATE,
      Permission.EXPENSE_UPDATE,
      Permission.EXPENSE_DELETE,
      Permission.EXPENSE_APPROVE,
      Permission.BANK_ACCOUNT_VIEW,
      Permission.BANK_ACCOUNT_MANAGE,
      Permission.BANK_RECONCILE,
      Permission.FINANCIAL_REPORTS,
    ],
  },
  {
    id: 'reports',
    name: 'Report Viewing',
    description: 'Access to reports and analytics',
    icon: 'chart-bar',
    permissions: [Permission.REPORTS_VIEW, Permission.REPORTS_EXPORT],
  },
  {
    id: 'settings',
    name: 'Settings Management',
    description: 'System configuration and settings',
    icon: 'cog',
    permissions: [Permission.SETTINGS_VIEW, Permission.SETTINGS_MANAGE],
  },
];

/**
 * Role Templates
 * Predefined role configurations for common use cases
 */
export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'store-manager',
    name: 'Store Manager',
    description:
      'Full store operations management including staff, inventory, and reporting',
    icon: 'briefcase',
    category: 'management',
    hierarchy: 80,
    permissions: [
      // POS
      Permission.POS_ACCESS,
      Permission.POS_VOID_TRANSACTION,
      Permission.POS_APPLY_DISCOUNT,
      Permission.POS_REFUND,
      Permission.POS_VIEW_REPORTS,
      // Products
      Permission.PRODUCT_VIEW,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_UPDATE,
      // Inventory
      Permission.INVENTORY_VIEW,
      Permission.INVENTORY_MANAGE,
      Permission.INVENTORY_ADJUST,
      // Customers
      Permission.CUSTOMER_VIEW,
      Permission.CUSTOMER_CREATE,
      Permission.CUSTOMER_UPDATE,
      // Users
      Permission.USER_VIEW,
      // Reports
      Permission.REPORTS_VIEW,
      Permission.REPORTS_EXPORT,
      // Settings
      Permission.SETTINGS_VIEW,
    ],
  },
  {
    id: 'assistant-manager',
    name: 'Assistant Manager',
    description:
      'Supports store operations with limited administrative access',
    icon: 'account-tie',
    category: 'management',
    hierarchy: 70,
    permissions: [
      Permission.POS_ACCESS,
      Permission.POS_APPLY_DISCOUNT,
      Permission.POS_VIEW_REPORTS,
      Permission.PRODUCT_VIEW,
      Permission.PRODUCT_UPDATE,
      Permission.INVENTORY_VIEW,
      Permission.INVENTORY_MANAGE,
      Permission.CUSTOMER_VIEW,
      Permission.CUSTOMER_CREATE,
      Permission.CUSTOMER_UPDATE,
      Permission.REPORTS_VIEW,
      Permission.SETTINGS_VIEW,
    ],
  },
  {
    id: 'inventory-specialist',
    name: 'Inventory Specialist',
    description:
      'Focused on inventory management, stock control, and procurement',
    icon: 'package-variant',
    category: 'inventory',
    hierarchy: 60,
    permissions: [
      Permission.PRODUCT_VIEW,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_UPDATE,
      Permission.INVENTORY_VIEW,
      Permission.INVENTORY_MANAGE,
      Permission.INVENTORY_ADJUST,
      Permission.PROCUREMENT_VIEW,
      Permission.PROCUREMENT_CREATE,
      Permission.PROCUREMENT_RECEIVE,
      Permission.SUPPLIER_VIEW,
      Permission.SUPPLIER_MANAGE,
      Permission.REPORTS_VIEW,
    ],
  },
  {
    id: 'cashier-lead',
    name: 'Lead Cashier',
    description:
      'Senior cashier with additional POS privileges and customer management',
    icon: 'cash-register',
    category: 'sales',
    hierarchy: 45,
    permissions: [
      Permission.POS_ACCESS,
      Permission.POS_APPLY_DISCOUNT,
      Permission.POS_VOID_TRANSACTION,
      Permission.PRODUCT_VIEW,
      Permission.CUSTOMER_VIEW,
      Permission.CUSTOMER_CREATE,
      Permission.CUSTOMER_UPDATE,
    ],
  },
  {
    id: 'cashier',
    name: 'Cashier',
    description:
      'Basic POS operations and customer service',
    icon: 'cash-register',
    category: 'sales',
    hierarchy: 40,
    permissions: [
      Permission.POS_ACCESS,
      Permission.POS_APPLY_DISCOUNT,
      Permission.PRODUCT_VIEW,
      Permission.CUSTOMER_VIEW,
      Permission.CUSTOMER_CREATE,
    ],
  },
  {
    id: 'sales-associate',
    name: 'Sales Associate',
    description:
      'Customer-facing sales and basic product information',
    icon: 'account-cash',
    category: 'sales',
    hierarchy: 35,
    permissions: [
      Permission.POS_ACCESS,
      Permission.PRODUCT_VIEW,
      Permission.CUSTOMER_VIEW,
      Permission.CUSTOMER_CREATE,
    ],
  },
  {
    id: 'stock-clerk',
    name: 'Stock Clerk',
    description:
      'Stock management and inventory tasks',
    icon: 'dolly',
    category: 'inventory',
    hierarchy: 30,
    permissions: [
      Permission.PRODUCT_VIEW,
      Permission.INVENTORY_VIEW,
      Permission.INVENTORY_MANAGE,
      Permission.PROCUREMENT_RECEIVE,
    ],
  },
  {
    id: 'kitchen-manager',
    name: 'Kitchen Manager',
    description:
      'Kitchen operations management with inventory access',
    icon: 'chef-hat',
    category: 'kitchen',
    hierarchy: 65,
    permissions: [
      Permission.PRODUCT_VIEW,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_UPDATE,
      Permission.INVENTORY_VIEW,
      Permission.INVENTORY_MANAGE,
      Permission.PROCUREMENT_VIEW,
      Permission.PROCUREMENT_CREATE,
      Permission.REPORTS_VIEW,
    ],
  },
  {
    id: 'kitchen-staff',
    name: 'Kitchen Staff',
    description:
      'Basic kitchen operations and product viewing',
    icon: 'chef-hat',
    category: 'kitchen',
    hierarchy: 25,
    permissions: [Permission.PRODUCT_VIEW],
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description:
      'Full financial access with limited operational permissions',
    icon: 'calculator',
    category: 'management',
    hierarchy: 75,
    permissions: [
      // Financial
      Permission.FINANCIAL_VIEW,
      Permission.FINANCIAL_MANAGE,
      Permission.INVOICE_CREATE,
      Permission.INVOICE_UPDATE,
      Permission.INVOICE_DELETE,
      Permission.INVOICE_SEND,
      Permission.PAYMENT_CREATE,
      Permission.PAYMENT_PROCESS,
      Permission.PAYMENT_REFUND,
      Permission.PAYMENT_RECONCILE,
      Permission.EXPENSE_CREATE,
      Permission.EXPENSE_UPDATE,
      Permission.EXPENSE_DELETE,
      Permission.EXPENSE_APPROVE,
      Permission.BANK_ACCOUNT_VIEW,
      Permission.BANK_ACCOUNT_MANAGE,
      Permission.BANK_RECONCILE,
      Permission.FINANCIAL_REPORTS,
      // Reports
      Permission.REPORTS_VIEW,
      Permission.REPORTS_EXPORT,
      // Basic access
      Permission.CUSTOMER_VIEW,
      Permission.PRODUCT_VIEW,
      Permission.INVENTORY_VIEW,
    ],
  },
  {
    id: 'read-only',
    name: 'Read-Only Analyst',
    description:
      'View-only access to reports and analytics',
    icon: 'eye',
    category: 'custom',
    hierarchy: 15,
    permissions: [
      Permission.PRODUCT_VIEW,
      Permission.INVENTORY_VIEW,
      Permission.CUSTOMER_VIEW,
      Permission.REPORTS_VIEW,
      Permission.FINANCIAL_VIEW,
      Permission.SETTINGS_VIEW,
    ],
  },
];

/**
 * Get permission category by ID
 */
export const getPermissionCategory = (
  categoryId: string,
): PermissionCategory | undefined => {
  return PERMISSION_CATEGORIES.find(cat => cat.id === categoryId);
};

/**
 * Get role template by ID
 */
export const getRoleTemplate = (
  templateId: string,
): RoleTemplate | undefined => {
  return ROLE_TEMPLATES.find(template => template.id === templateId);
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (
  category: string,
): RoleTemplate[] => {
  if (category === 'all') {
    return ROLE_TEMPLATES;
  }
  return ROLE_TEMPLATES.filter(template => template.category === category);
};
