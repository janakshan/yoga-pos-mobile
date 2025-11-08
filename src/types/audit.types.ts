/**
 * Audit Logging Types
 * Comprehensive types for audit logging and event tracking system
 */

import {User} from './api.types';

// ===========================
// Audit Event Types (40+)
// ===========================

export enum AuditEventType {
  // Authentication Events (6)
  AUTH_LOGIN = 'auth.login',
  AUTH_LOGIN_FAILED = 'auth.login.failed',
  AUTH_LOGOUT = 'auth.logout',
  AUTH_TOKEN_REFRESH = 'auth.token.refresh',
  AUTH_SESSION_TIMEOUT = 'auth.session.timeout',
  AUTH_BIOMETRIC = 'auth.biometric',

  // User Management Events (8)
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  USER_PASSWORD_CHANGE = 'user.password.change',
  USER_PIN_SET = 'user.pin.set',
  USER_PIN_DISABLE = 'user.pin.disable',
  USER_STATUS_CHANGE = 'user.status.change',
  USER_ROLE_CHANGE = 'user.role.change',

  // Permission Events (3)
  PERMISSION_GRANT = 'permission.grant',
  PERMISSION_REVOKE = 'permission.revoke',
  PERMISSION_UPDATE = 'permission.update',

  // POS Transaction Events (6)
  POS_TRANSACTION_CREATE = 'pos.transaction.create',
  POS_TRANSACTION_VOID = 'pos.transaction.void',
  POS_TRANSACTION_REFUND = 'pos.transaction.refund',
  POS_DISCOUNT_APPLY = 'pos.discount.apply',
  POS_PAYMENT_PROCESS = 'pos.payment.process',
  POS_SALE_HOLD = 'pos.sale.hold',

  // Product Events (4)
  PRODUCT_CREATE = 'product.create',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_DELETE = 'product.delete',
  PRODUCT_PRICE_CHANGE = 'product.price.change',

  // Inventory Events (7)
  INVENTORY_ADJUST = 'inventory.adjust',
  INVENTORY_TRANSFER = 'inventory.transfer',
  INVENTORY_COUNT = 'inventory.count',
  INVENTORY_RECEIVE = 'inventory.receive',
  INVENTORY_LEVEL_LOW = 'inventory.level.low',
  INVENTORY_LOCATION_CHANGE = 'inventory.location.change',
  INVENTORY_BARCODE_SCAN = 'inventory.barcode.scan',

  // Financial Events (8)
  FINANCIAL_TRANSACTION_CREATE = 'financial.transaction.create',
  FINANCIAL_INVOICE_CREATE = 'financial.invoice.create',
  FINANCIAL_PAYMENT_RECORD = 'financial.payment.record',
  FINANCIAL_EXPENSE_RECORD = 'financial.expense.record',
  FINANCIAL_RECONCILIATION = 'financial.reconciliation',
  FINANCIAL_BANK_ACCOUNT_ADD = 'financial.bank_account.add',
  FINANCIAL_BANK_ACCOUNT_UPDATE = 'financial.bank_account.update',
  FINANCIAL_BUDGET_CHANGE = 'financial.budget.change',

  // Procurement Events (5)
  PROCUREMENT_ORDER_CREATE = 'procurement.order.create',
  PROCUREMENT_ORDER_APPROVE = 'procurement.order.approve',
  PROCUREMENT_ORDER_RECEIVE = 'procurement.order.receive',
  PROCUREMENT_SUPPLIER_ADD = 'procurement.supplier.add',
  PROCUREMENT_SUPPLIER_UPDATE = 'procurement.supplier.update',

  // Customer Events (4)
  CUSTOMER_CREATE = 'customer.create',
  CUSTOMER_UPDATE = 'customer.update',
  CUSTOMER_DELETE = 'customer.delete',
  CUSTOMER_LOYALTY_REDEEM = 'customer.loyalty.redeem',

  // Branch Events (4)
  BRANCH_CREATE = 'branch.create',
  BRANCH_UPDATE = 'branch.update',
  BRANCH_DELETE = 'branch.delete',
  BRANCH_TRANSFER = 'branch.transfer',

  // Settings Events (5)
  SETTINGS_UPDATE = 'settings.update',
  SETTINGS_BRANDING_CHANGE = 'settings.branding.change',
  SETTINGS_HARDWARE_CONFIG = 'settings.hardware.config',
  SETTINGS_NOTIFICATION_CHANGE = 'settings.notification.change',
  SETTINGS_BACKUP_CONFIG = 'settings.backup.config',

  // Report Events (3)
  REPORT_GENERATE = 'report.generate',
  REPORT_EXPORT = 'report.export',
  REPORT_VIEW = 'report.view',

  // System Events (5)
  SYSTEM_BACKUP_CREATE = 'system.backup.create',
  SYSTEM_BACKUP_RESTORE = 'system.backup.restore',
  SYSTEM_ERROR = 'system.error',
  SYSTEM_SYNC = 'system.sync',
  SYSTEM_HARDWARE_CONNECT = 'system.hardware.connect',

  // Data Access Events (3)
  DATA_EXPORT = 'data.export',
  DATA_IMPORT = 'data.import',
  DATA_BULK_UPDATE = 'data.bulk_update',
}

// ===========================
// Resource Types
// ===========================

export enum ResourceType {
  USER = 'user',
  CUSTOMER = 'customer',
  PRODUCT = 'product',
  CATEGORY = 'category',
  INVENTORY = 'inventory',
  TRANSACTION = 'transaction',
  PAYMENT = 'payment',
  INVOICE = 'invoice',
  EXPENSE = 'expense',
  PROCUREMENT = 'procurement',
  SUPPLIER = 'supplier',
  BRANCH = 'branch',
  ROLE = 'role',
  PERMISSION = 'permission',
  REPORT = 'report',
  SETTINGS = 'settings',
  BACKUP = 'backup',
  HARDWARE = 'hardware',
  SESSION = 'session',
  SYSTEM = 'system',
}

// ===========================
// Severity Levels
// ===========================

export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// ===========================
// Audit Status
// ===========================

export enum AuditStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PENDING = 'pending',
}

// ===========================
// Core Audit Log Entry
// ===========================

export interface AuditLog {
  id: string;
  timestamp: string;

  // User Information
  userId: string;
  user?: User;
  userName?: string;
  userEmail?: string;

  // Event Information
  eventType: AuditEventType;
  action: string; // Human-readable action description

  // Resource Information
  resourceType: ResourceType;
  resourceId?: string;
  resourceName?: string;

  // Context Information
  ipAddress?: string;
  deviceInfo?: DeviceInfo;
  userAgent?: string;
  location?: GeoLocation;

  // Session Information
  sessionId?: string;
  branchId?: string;
  branchName?: string;

  // Data Changes
  changes?: DataChanges;

  // Status and Severity
  status: AuditStatus;
  severity: AuditSeverity;

  // Additional Context
  metadata?: Record<string, any>;
  errorMessage?: string;
  errorStack?: string;

  // Sync Information
  synced: boolean;
  syncedAt?: string;
}

// ===========================
// Device Information
// ===========================

export interface DeviceInfo {
  deviceId?: string;
  deviceName?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  platform: 'ios' | 'android' | 'web' | 'unknown';
  platformVersion?: string;
  appVersion: string;
  model?: string;
  manufacturer?: string;
}

// ===========================
// Geo Location
// ===========================

export interface GeoLocation {
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country?: string;
}

// ===========================
// Data Changes Tracking
// ===========================

export interface DataChanges {
  before?: Record<string, any>;
  after?: Record<string, any>;
  fields?: ChangedField[];
}

export interface ChangedField {
  field: string;
  oldValue: any;
  newValue: any;
  fieldLabel?: string;
}

// ===========================
// Audit Query Filters
// ===========================

export interface AuditLogFilters {
  // Time Range
  startDate?: string;
  endDate?: string;

  // User Filters
  userId?: string;
  userIds?: string[];

  // Event Filters
  eventType?: AuditEventType;
  eventTypes?: AuditEventType[];

  // Resource Filters
  resourceType?: ResourceType;
  resourceTypes?: ResourceType[];
  resourceId?: string;

  // Status Filters
  status?: AuditStatus;
  severity?: AuditSeverity;

  // Branch Filter
  branchId?: string;

  // Search Query
  searchQuery?: string;

  // Sync Status
  synced?: boolean;

  // Pagination
  page?: number;
  limit?: number;
  sortBy?: 'timestamp' | 'eventType' | 'userId' | 'severity';
  sortOrder?: 'asc' | 'desc';
}

// ===========================
// Audit Log Response
// ===========================

export interface AuditLogResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    totalEvents: number;
    successEvents: number;
    failedEvents: number;
    criticalEvents: number;
    uniqueUsers: number;
  };
}

// ===========================
// Session Tracking
// ===========================

export interface UserSession {
  id: string;
  userId: string;
  user?: User;
  deviceInfo: DeviceInfo;
  ipAddress?: string;
  location?: GeoLocation;
  loginTime: string;
  lastActivityTime: string;
  logoutTime?: string;
  sessionDuration?: number; // in seconds
  isActive: boolean;
  branchId?: string;
  branchName?: string;
}

export interface ActiveSessionsResponse {
  sessions: UserSession[];
  totalActive: number;
  totalUsers: number;
  concurrentSessions: number;
}

// ===========================
// Audit Statistics
// ===========================

export interface AuditStatistics {
  period: {
    startDate: string;
    endDate: string;
  };
  totalEvents: number;
  eventsByType: {
    [key in AuditEventType]?: number;
  };
  eventsBySeverity: {
    [key in AuditSeverity]: number;
  };
  eventsByStatus: {
    [key in AuditStatus]: number;
  };
  topUsers: Array<{
    userId: string;
    userName: string;
    eventCount: number;
  }>;
  topActions: Array<{
    action: string;
    count: number;
  }>;
  failedActions: Array<{
    action: string;
    count: number;
    lastOccurrence: string;
  }>;
  eventTrend: Array<{
    date: string;
    count: number;
    successCount: number;
    failureCount: number;
  }>;
}

// ===========================
// Export Types
// ===========================

export interface AuditExportRequest {
  filters: AuditLogFilters;
  format: 'csv' | 'json' | 'excel' | 'pdf';
  includeMetadata?: boolean;
  includeChanges?: boolean;
}

export interface AuditExportResponse {
  exportId: string;
  status: 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  expiresAt?: string;
  error?: string;
}

// ===========================
// Audit Context for Logging
// ===========================

export interface AuditContext {
  userId?: string;
  sessionId?: string;
  branchId?: string;
  ipAddress?: string;
  deviceInfo?: DeviceInfo;
  metadata?: Record<string, any>;
}

// ===========================
// Audit Event Payload
// ===========================

export interface AuditEventPayload {
  eventType: AuditEventType;
  action: string;
  resourceType: ResourceType;
  resourceId?: string;
  resourceName?: string;
  changes?: DataChanges;
  status?: AuditStatus;
  severity?: AuditSeverity;
  metadata?: Record<string, any>;
  errorMessage?: string;
}
