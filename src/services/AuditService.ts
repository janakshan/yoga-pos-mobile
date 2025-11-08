/**
 * Audit Service
 * Comprehensive audit logging service for tracking user actions and system events
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {
  AuditLog,
  AuditEventType,
  AuditEventPayload,
  AuditContext,
  DeviceInfo as DeviceInfoType,
  AuditStatus,
  AuditSeverity,
  ResourceType,
  DataChanges,
} from '../types/audit.types';

const AUDIT_LOGS_KEY = 'yoga_pos_audit_logs';
const MAX_LOCAL_LOGS = 1000; // Maximum logs to store locally
const SYNC_BATCH_SIZE = 50; // Number of logs to sync at once

/**
 * Generate a simple UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * AuditService - Core service for audit logging
 */
class AuditService {
  private deviceInfo: DeviceInfoType | null = null;
  private currentContext: Partial<AuditContext> = {};

  /**
   * Initialize the audit service
   */
  async initialize(): Promise<void> {
    try {
      this.deviceInfo = await this.collectDeviceInfo();
      console.log('[AuditService] Initialized with device info:', this.deviceInfo);
    } catch (error) {
      console.error('[AuditService] Failed to initialize:', error);
    }
  }

  /**
   * Set the current audit context (user, session, branch, etc.)
   */
  setContext(context: Partial<AuditContext>): void {
    this.currentContext = {
      ...this.currentContext,
      ...context,
    };
  }

  /**
   * Clear specific context fields
   */
  clearContext(fields?: (keyof AuditContext)[]): void {
    if (!fields) {
      this.currentContext = {};
      return;
    }

    fields.forEach(field => {
      delete this.currentContext[field];
    });
  }

  /**
   * Log an audit event
   */
  async logEvent(payload: AuditEventPayload): Promise<AuditLog> {
    try {
      const auditLog = await this.createAuditLog(payload);
      await this.saveLocalLog(auditLog);

      // Queue for background sync
      this.queueForSync(auditLog);

      return auditLog;
    } catch (error) {
      console.error('[AuditService] Failed to log event:', error);
      throw error;
    }
  }

  /**
   * Log authentication event
   */
  async logAuth(
    eventType: AuditEventType,
    userId: string,
    status: AuditStatus,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.logEvent({
      eventType,
      action: this.getActionDescription(eventType),
      resourceType: ResourceType.SESSION,
      resourceId: this.currentContext.sessionId,
      status,
      severity: status === AuditStatus.FAILURE ? AuditSeverity.WARNING : AuditSeverity.INFO,
      metadata: {
        ...metadata,
        userId,
      },
    });
  }

  /**
   * Log user management event
   */
  async logUserEvent(
    eventType: AuditEventType,
    userId: string,
    userName: string,
    changes?: DataChanges,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.logEvent({
      eventType,
      action: this.getActionDescription(eventType),
      resourceType: ResourceType.USER,
      resourceId: userId,
      resourceName: userName,
      changes,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.INFO,
      metadata,
    });
  }

  /**
   * Log POS transaction event
   */
  async logPOSEvent(
    eventType: AuditEventType,
    transactionId: string,
    amount?: number,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.logEvent({
      eventType,
      action: this.getActionDescription(eventType),
      resourceType: ResourceType.TRANSACTION,
      resourceId: transactionId,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.INFO,
      metadata: {
        ...metadata,
        amount,
      },
    });
  }

  /**
   * Log inventory event
   */
  async logInventoryEvent(
    eventType: AuditEventType,
    resourceId: string,
    resourceName: string,
    changes?: DataChanges,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.logEvent({
      eventType,
      action: this.getActionDescription(eventType),
      resourceType: ResourceType.INVENTORY,
      resourceId,
      resourceName,
      changes,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.INFO,
      metadata,
    });
  }

  /**
   * Log financial event
   */
  async logFinancialEvent(
    eventType: AuditEventType,
    resourceId: string,
    amount: number,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.logEvent({
      eventType,
      action: this.getActionDescription(eventType),
      resourceType: this.getFinancialResourceType(eventType),
      resourceId,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.INFO,
      metadata: {
        ...metadata,
        amount,
      },
    });
  }

  /**
   * Log settings change event
   */
  async logSettingsEvent(
    eventType: AuditEventType,
    settingName: string,
    changes: DataChanges,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.logEvent({
      eventType,
      action: this.getActionDescription(eventType),
      resourceType: ResourceType.SETTINGS,
      resourceName: settingName,
      changes,
      status: AuditStatus.SUCCESS,
      severity: AuditSeverity.INFO,
      metadata,
    });
  }

  /**
   * Log system event
   */
  async logSystemEvent(
    eventType: AuditEventType,
    status: AuditStatus,
    metadata?: Record<string, any>,
    errorMessage?: string,
  ): Promise<AuditLog> {
    return this.logEvent({
      eventType,
      action: this.getActionDescription(eventType),
      resourceType: ResourceType.SYSTEM,
      status,
      severity: status === AuditStatus.FAILURE ? AuditSeverity.ERROR : AuditSeverity.INFO,
      metadata,
      errorMessage,
    });
  }

  /**
   * Log error event
   */
  async logError(
    eventType: AuditEventType,
    error: Error,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.logEvent({
      eventType,
      action: this.getActionDescription(eventType),
      resourceType: ResourceType.SYSTEM,
      status: AuditStatus.FAILURE,
      severity: AuditSeverity.ERROR,
      errorMessage: error.message,
      metadata: {
        ...metadata,
        errorStack: error.stack,
      },
    });
  }

  /**
   * Create an audit log entry
   */
  private async createAuditLog(payload: AuditEventPayload): Promise<AuditLog> {
    const timestamp = new Date().toISOString();

    return {
      id: generateUUID(),
      timestamp,
      userId: this.currentContext.userId || 'system',
      eventType: payload.eventType,
      action: payload.action,
      resourceType: payload.resourceType,
      resourceId: payload.resourceId,
      resourceName: payload.resourceName,
      ipAddress: this.currentContext.ipAddress,
      deviceInfo: this.deviceInfo || undefined,
      sessionId: this.currentContext.sessionId,
      branchId: this.currentContext.branchId,
      changes: payload.changes,
      status: payload.status || AuditStatus.SUCCESS,
      severity: payload.severity || AuditSeverity.INFO,
      metadata: {
        ...this.currentContext.metadata,
        ...payload.metadata,
      },
      errorMessage: payload.errorMessage,
      synced: false,
    };
  }

  /**
   * Collect device information
   */
  private async collectDeviceInfo(): Promise<DeviceInfoType> {
    try {
      const [
        uniqueId,
        deviceName,
        deviceType,
        systemName,
        systemVersion,
        appVersion,
        model,
        manufacturer,
      ] = await Promise.all([
        DeviceInfo.getUniqueId(),
        DeviceInfo.getDeviceName(),
        DeviceInfo.getDeviceType(),
        DeviceInfo.getSystemName(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getVersion(),
        DeviceInfo.getModel(),
        DeviceInfo.getManufacturer(),
      ]);

      const platform = systemName.toLowerCase();

      return {
        deviceId: uniqueId,
        deviceName,
        deviceType: this.mapDeviceType(deviceType),
        platform: this.mapPlatform(platform),
        platformVersion: systemVersion,
        appVersion,
        model,
        manufacturer,
      };
    } catch (error) {
      console.error('[AuditService] Failed to collect device info:', error);
      return {
        deviceType: 'unknown',
        platform: 'unknown',
        appVersion: '1.0.0',
      };
    }
  }

  /**
   * Map device type to our type system
   */
  private mapDeviceType(deviceType: string): DeviceInfoType['deviceType'] {
    const type = deviceType.toLowerCase();
    if (type.includes('phone')) return 'mobile';
    if (type.includes('tablet')) return 'tablet';
    if (type.includes('desktop')) return 'desktop';
    return 'unknown';
  }

  /**
   * Map platform to our type system
   */
  private mapPlatform(platform: string): DeviceInfoType['platform'] {
    if (platform.includes('ios')) return 'ios';
    if (platform.includes('android')) return 'android';
    if (platform.includes('web')) return 'web';
    return 'unknown';
  }

  /**
   * Save audit log to local storage
   */
  private async saveLocalLog(log: AuditLog): Promise<void> {
    try {
      const logsJson = await AsyncStorage.getItem(AUDIT_LOGS_KEY);
      const logs: AuditLog[] = logsJson ? JSON.parse(logsJson) : [];

      logs.push(log);

      // Keep only the most recent logs
      if (logs.length > MAX_LOCAL_LOGS) {
        logs.splice(0, logs.length - MAX_LOCAL_LOGS);
      }

      await AsyncStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('[AuditService] Failed to save local log:', error);
    }
  }

  /**
   * Get local audit logs
   */
  async getLocalLogs(): Promise<AuditLog[]> {
    try {
      const logsJson = await AsyncStorage.getItem(AUDIT_LOGS_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('[AuditService] Failed to get local logs:', error);
      return [];
    }
  }

  /**
   * Get unsynced logs
   */
  async getUnsyncedLogs(): Promise<AuditLog[]> {
    const logs = await this.getLocalLogs();
    return logs.filter(log => !log.synced);
  }

  /**
   * Mark logs as synced
   */
  async markLogsAsSynced(logIds: string[]): Promise<void> {
    try {
      const logs = await this.getLocalLogs();
      const updatedLogs = logs.map(log =>
        logIds.includes(log.id) ? {...log, synced: true, syncedAt: new Date().toISOString()} : log,
      );
      await AsyncStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('[AuditService] Failed to mark logs as synced:', error);
    }
  }

  /**
   * Clear synced logs older than specified days
   */
  async clearOldLogs(daysToKeep: number = 30): Promise<void> {
    try {
      const logs = await this.getLocalLogs();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return !log.synced || logDate > cutoffDate;
      });

      await AsyncStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(filteredLogs));
      console.log(`[AuditService] Cleared ${logs.length - filteredLogs.length} old logs`);
    } catch (error) {
      console.error('[AuditService] Failed to clear old logs:', error);
    }
  }

  /**
   * Queue log for background sync
   */
  private queueForSync(log: AuditLog): void {
    // This will be implemented with the sync service
    // For now, just log that it's queued
    console.log('[AuditService] Log queued for sync:', log.id);
  }

  /**
   * Get human-readable action description
   */
  private getActionDescription(eventType: AuditEventType): string {
    const descriptions: Record<AuditEventType, string> = {
      // Authentication
      [AuditEventType.AUTH_LOGIN]: 'User logged in',
      [AuditEventType.AUTH_LOGIN_FAILED]: 'Failed login attempt',
      [AuditEventType.AUTH_LOGOUT]: 'User logged out',
      [AuditEventType.AUTH_TOKEN_REFRESH]: 'Token refreshed',
      [AuditEventType.AUTH_SESSION_TIMEOUT]: 'Session timed out',
      [AuditEventType.AUTH_BIOMETRIC]: 'Biometric authentication',

      // User Management
      [AuditEventType.USER_CREATE]: 'User created',
      [AuditEventType.USER_UPDATE]: 'User updated',
      [AuditEventType.USER_DELETE]: 'User deleted',
      [AuditEventType.USER_PASSWORD_CHANGE]: 'Password changed',
      [AuditEventType.USER_PIN_SET]: 'PIN set',
      [AuditEventType.USER_PIN_DISABLE]: 'PIN disabled',
      [AuditEventType.USER_STATUS_CHANGE]: 'User status changed',
      [AuditEventType.USER_ROLE_CHANGE]: 'User role changed',

      // Permissions
      [AuditEventType.PERMISSION_GRANT]: 'Permission granted',
      [AuditEventType.PERMISSION_REVOKE]: 'Permission revoked',
      [AuditEventType.PERMISSION_UPDATE]: 'Permission updated',

      // POS Transactions
      [AuditEventType.POS_TRANSACTION_CREATE]: 'Transaction created',
      [AuditEventType.POS_TRANSACTION_VOID]: 'Transaction voided',
      [AuditEventType.POS_TRANSACTION_REFUND]: 'Transaction refunded',
      [AuditEventType.POS_DISCOUNT_APPLY]: 'Discount applied',
      [AuditEventType.POS_PAYMENT_PROCESS]: 'Payment processed',
      [AuditEventType.POS_SALE_HOLD]: 'Sale held',

      // Products
      [AuditEventType.PRODUCT_CREATE]: 'Product created',
      [AuditEventType.PRODUCT_UPDATE]: 'Product updated',
      [AuditEventType.PRODUCT_DELETE]: 'Product deleted',
      [AuditEventType.PRODUCT_PRICE_CHANGE]: 'Product price changed',

      // Inventory
      [AuditEventType.INVENTORY_ADJUST]: 'Inventory adjusted',
      [AuditEventType.INVENTORY_TRANSFER]: 'Inventory transferred',
      [AuditEventType.INVENTORY_COUNT]: 'Inventory count performed',
      [AuditEventType.INVENTORY_RECEIVE]: 'Inventory received',
      [AuditEventType.INVENTORY_LEVEL_LOW]: 'Low inventory alert',
      [AuditEventType.INVENTORY_LOCATION_CHANGE]: 'Inventory location changed',
      [AuditEventType.INVENTORY_BARCODE_SCAN]: 'Barcode scanned',

      // Financial
      [AuditEventType.FINANCIAL_TRANSACTION_CREATE]: 'Financial transaction created',
      [AuditEventType.FINANCIAL_INVOICE_CREATE]: 'Invoice created',
      [AuditEventType.FINANCIAL_PAYMENT_RECORD]: 'Payment recorded',
      [AuditEventType.FINANCIAL_EXPENSE_RECORD]: 'Expense recorded',
      [AuditEventType.FINANCIAL_RECONCILIATION]: 'Bank reconciliation performed',
      [AuditEventType.FINANCIAL_BANK_ACCOUNT_ADD]: 'Bank account added',
      [AuditEventType.FINANCIAL_BANK_ACCOUNT_UPDATE]: 'Bank account updated',
      [AuditEventType.FINANCIAL_BUDGET_CHANGE]: 'Budget changed',

      // Procurement
      [AuditEventType.PROCUREMENT_ORDER_CREATE]: 'Purchase order created',
      [AuditEventType.PROCUREMENT_ORDER_APPROVE]: 'Purchase order approved',
      [AuditEventType.PROCUREMENT_ORDER_RECEIVE]: 'Purchase order received',
      [AuditEventType.PROCUREMENT_SUPPLIER_ADD]: 'Supplier added',
      [AuditEventType.PROCUREMENT_SUPPLIER_UPDATE]: 'Supplier updated',

      // Customers
      [AuditEventType.CUSTOMER_CREATE]: 'Customer created',
      [AuditEventType.CUSTOMER_UPDATE]: 'Customer updated',
      [AuditEventType.CUSTOMER_DELETE]: 'Customer deleted',
      [AuditEventType.CUSTOMER_LOYALTY_REDEEM]: 'Loyalty points redeemed',

      // Branches
      [AuditEventType.BRANCH_CREATE]: 'Branch created',
      [AuditEventType.BRANCH_UPDATE]: 'Branch updated',
      [AuditEventType.BRANCH_DELETE]: 'Branch deleted',
      [AuditEventType.BRANCH_TRANSFER]: 'Branch transfer',

      // Settings
      [AuditEventType.SETTINGS_UPDATE]: 'Settings updated',
      [AuditEventType.SETTINGS_BRANDING_CHANGE]: 'Branding changed',
      [AuditEventType.SETTINGS_HARDWARE_CONFIG]: 'Hardware configured',
      [AuditEventType.SETTINGS_NOTIFICATION_CHANGE]: 'Notification settings changed',
      [AuditEventType.SETTINGS_BACKUP_CONFIG]: 'Backup configuration changed',

      // Reports
      [AuditEventType.REPORT_GENERATE]: 'Report generated',
      [AuditEventType.REPORT_EXPORT]: 'Report exported',
      [AuditEventType.REPORT_VIEW]: 'Report viewed',

      // System
      [AuditEventType.SYSTEM_BACKUP_CREATE]: 'Backup created',
      [AuditEventType.SYSTEM_BACKUP_RESTORE]: 'Backup restored',
      [AuditEventType.SYSTEM_ERROR]: 'System error',
      [AuditEventType.SYSTEM_SYNC]: 'Data synchronized',
      [AuditEventType.SYSTEM_HARDWARE_CONNECT]: 'Hardware connected',

      // Data Access
      [AuditEventType.DATA_EXPORT]: 'Data exported',
      [AuditEventType.DATA_IMPORT]: 'Data imported',
      [AuditEventType.DATA_BULK_UPDATE]: 'Bulk data update',
    };

    return descriptions[eventType] || 'Unknown action';
  }

  /**
   * Get resource type for financial events
   */
  private getFinancialResourceType(eventType: AuditEventType): ResourceType {
    if (eventType.includes('invoice')) return ResourceType.INVOICE;
    if (eventType.includes('payment')) return ResourceType.PAYMENT;
    if (eventType.includes('expense')) return ResourceType.EXPENSE;
    return ResourceType.SYSTEM;
  }
}

// Export singleton instance
export default new AuditService();
