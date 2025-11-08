/**
 * Backup & Recovery System Types
 * Defines interfaces and types for the backup and recovery functionality
 */

export type BackupFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
export type CloudProvider = 'google-drive' | 'dropbox' | 's3' | 'local';
export type BackupStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

/**
 * Backup metadata interface
 */
export interface BackupMetadata {
  id: string;
  timestamp: number;
  size: number;
  encrypted: boolean;
  cloudProvider: CloudProvider;
  version: string;
  checksum: string;
  description?: string;
  deviceInfo?: {
    platform: string;
    osVersion: string;
    appVersion: string;
  };
}

/**
 * Backup data structure
 */
export interface BackupData {
  metadata: BackupMetadata;
  data: {
    settings: any;
    authData?: any;
    posData?: any;
    customData?: Record<string, any>;
  };
}

/**
 * Backup file structure
 */
export interface BackupFile {
  metadata: BackupMetadata;
  localPath: string;
  cloudPath?: string;
  status: BackupStatus;
}

/**
 * Backup configuration
 */
export interface BackupConfig {
  enabled: boolean;
  frequency: BackupFrequency;
  time?: string; // HH:mm format for daily/weekly/monthly
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  cloudProvider: CloudProvider;
  encryption: boolean;
  retainCount: number;
  includeLocal: boolean;
  includeAuthData: boolean;
  includePosData: boolean;
  autoRestore: boolean;
}

/**
 * Backup result
 */
export interface BackupResult {
  success: boolean;
  backupId?: string;
  localPath?: string;
  cloudPath?: string;
  size?: number;
  error?: string;
  duration?: number;
}

/**
 * Restore result
 */
export interface RestoreResult {
  success: boolean;
  backupId: string;
  restoredData?: {
    settings: boolean;
    authData: boolean;
    posData: boolean;
  };
  error?: string;
  duration?: number;
}

/**
 * Cloud storage credentials
 */
export interface CloudStorageCredentials {
  provider: CloudProvider;
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  secretKey?: string;
  bucket?: string; // For S3
  region?: string; // For S3
  expiresAt?: number;
}

/**
 * Backup history item
 */
export interface BackupHistoryItem {
  id: string;
  timestamp: number;
  type: 'manual' | 'automatic';
  status: BackupStatus;
  size: number;
  cloudProvider: CloudProvider;
  encrypted: boolean;
  localPath?: string;
  cloudPath?: string;
  error?: string;
}

/**
 * Backup verification result
 */
export interface BackupVerificationResult {
  isValid: boolean;
  backupId: string;
  checksumMatch: boolean;
  structureValid: boolean;
  errors: string[];
}

/**
 * Background backup job
 */
export interface BackgroundBackupJob {
  id: string;
  scheduledTime: number;
  nextRun: number;
  frequency: BackupFrequency;
  enabled: boolean;
}
