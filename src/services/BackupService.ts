/**
 * Backup Service
 * Handles backup creation, storage, and management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import {
  BackupData,
  BackupMetadata,
  BackupResult,
  BackupConfig,
  BackupFile,
  CloudProvider,
} from '../types/backup.types';
import { EncryptionService } from './EncryptionService';
import { CloudStorageService } from './CloudStorageService';

export class BackupService {
  private static readonly BACKUP_DIR = `${RNFS.DocumentDirectoryPath}/backups`;
  private static readonly BACKUP_HISTORY_KEY = 'backup_history';
  private static readonly BACKUP_PASSWORD_KEY = 'backup_password';
  private static readonly MAX_BACKUP_SIZE = 100 * 1024 * 1024; // 100MB
  private static readonly APP_VERSION = '1.0.0';

  /**
   * Initialize backup directory
   */
  static async initialize(): Promise<void> {
    try {
      const dirExists = await RNFS.exists(this.BACKUP_DIR);
      if (!dirExists) {
        await RNFS.mkdir(this.BACKUP_DIR);
      }
    } catch (error) {
      console.error('Error initializing backup directory:', error);
      throw new Error('Failed to initialize backup directory');
    }
  }

  /**
   * Create a manual backup
   */
  static async createBackup(config: BackupConfig): Promise<BackupResult> {
    const startTime = Date.now();

    try {
      await this.initialize();

      // Collect data to backup
      const backupData = await this.collectBackupData(config);

      // Generate backup ID and metadata
      const backupId = this.generateBackupId();
      const metadata = await this.createMetadata(backupId, config.cloudProvider, config.encryption);

      // Create backup package
      const backupPackage: BackupData = {
        metadata,
        data: backupData,
      };

      // Convert to JSON
      let backupContent = JSON.stringify(backupPackage, null, 2);

      // Encrypt if enabled
      if (config.encryption) {
        const password = await this.getOrCreateBackupPassword();
        backupContent = await EncryptionService.encryptObject(backupPackage, password);
      }

      // Check size
      const backupSize = Buffer.byteLength(backupContent, 'utf8');
      if (backupSize > this.MAX_BACKUP_SIZE) {
        throw new Error('Backup size exceeds maximum allowed size');
      }

      // Save to local storage
      const fileName = `backup_${backupId}.json${config.encryption ? '.enc' : ''}`;
      const localPath = `${this.BACKUP_DIR}/${fileName}`;
      await RNFS.writeFile(localPath, backupContent, 'utf8');

      // Upload to cloud if not local-only
      let cloudPath: string | undefined;
      if (config.cloudProvider !== 'local') {
        cloudPath = await CloudStorageService.uploadBackup(
          config.cloudProvider,
          localPath,
          fileName
        );
      }

      // Save to backup history
      await this.addToHistory({
        id: backupId,
        timestamp: metadata.timestamp,
        type: 'manual',
        status: 'completed',
        size: backupSize,
        cloudProvider: config.cloudProvider,
        encrypted: config.encryption,
        localPath,
        cloudPath,
      });

      // Clean up old backups
      await this.cleanupOldBackups(config.retainCount);

      const duration = Date.now() - startTime;

      return {
        success: true,
        backupId,
        localPath,
        cloudPath,
        size: backupSize,
        duration,
      };
    } catch (error) {
      console.error('Backup creation error:', error);
      const duration = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown backup error',
        duration,
      };
    }
  }

  /**
   * Collect data for backup
   */
  private static async collectBackupData(config: BackupConfig): Promise<any> {
    const data: any = {};

    try {
      // Always include settings
      const settingsJson = await AsyncStorage.getItem('yoga-pos-settings');
      data.settings = settingsJson ? JSON.parse(settingsJson) : {};

      // Include auth data if enabled
      if (config.includeAuthData) {
        const credentials = await Keychain.getGenericPassword({ service: 'yoga_pos' });
        if (credentials) {
          data.authData = {
            username: credentials.username,
            // Note: We store tokens separately for security
          };
        }

        // Get tokens
        const accessToken = await Keychain.getGenericPassword({
          service: 'yoga_pos_access_token'
        });
        const refreshToken = await Keychain.getGenericPassword({
          service: 'yoga_pos_refresh_token'
        });

        if (accessToken) {
          data.authData = data.authData || {};
          data.authData.hasAccessToken = true;
        }
        if (refreshToken) {
          data.authData = data.authData || {};
          data.authData.hasRefreshToken = true;
        }
      }

      // Include POS data if enabled
      if (config.includePosData) {
        const posDataKeys = await AsyncStorage.getAllKeys();
        const posKeys = posDataKeys.filter(key =>
          key.startsWith('pos_') || key.startsWith('cart_') || key.startsWith('held_')
        );

        if (posKeys.length > 0) {
          const posDataArray = await AsyncStorage.multiGet(posKeys);
          data.posData = {};
          posDataArray.forEach(([key, value]) => {
            if (value) {
              try {
                data.posData[key] = JSON.parse(value);
              } catch {
                data.posData[key] = value;
              }
            }
          });
        }
      }

      // Include any custom data
      data.customData = {
        backupVersion: this.APP_VERSION,
        platform: Platform.OS,
        deviceInfo: {
          brand: DeviceInfo.getBrand(),
          model: DeviceInfo.getModel(),
          systemVersion: DeviceInfo.getSystemVersion(),
        },
      };

      return data;
    } catch (error) {
      console.error('Error collecting backup data:', error);
      throw new Error('Failed to collect backup data');
    }
  }

  /**
   * Create backup metadata
   */
  private static async createMetadata(
    backupId: string,
    cloudProvider: CloudProvider,
    encrypted: boolean
  ): Promise<BackupMetadata> {
    const timestamp = Date.now();

    return {
      id: backupId,
      timestamp,
      size: 0, // Will be updated after compression
      encrypted,
      cloudProvider,
      version: this.APP_VERSION,
      checksum: '', // Will be generated after content is created
      deviceInfo: {
        platform: Platform.OS,
        osVersion: DeviceInfo.getSystemVersion(),
        appVersion: this.APP_VERSION,
      },
    };
  }

  /**
   * Generate a unique backup ID
   */
  private static generateBackupId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${random}`;
  }

  /**
   * Get or create backup password
   */
  private static async getOrCreateBackupPassword(): Promise<string> {
    try {
      const existing = await Keychain.getGenericPassword({
        service: this.BACKUP_PASSWORD_KEY
      });

      if (existing && existing.password) {
        return existing.password;
      }

      // Generate new password
      const newPassword = await EncryptionService.generateBackupPassword();
      await Keychain.setGenericPassword(
        'backup',
        newPassword,
        { service: this.BACKUP_PASSWORD_KEY }
      );

      return newPassword;
    } catch (error) {
      console.error('Error getting backup password:', error);
      throw new Error('Failed to get backup password');
    }
  }

  /**
   * Get all local backups
   */
  static async getLocalBackups(): Promise<BackupFile[]> {
    try {
      await this.initialize();

      const files = await RNFS.readDir(this.BACKUP_DIR);
      const backupFiles: BackupFile[] = [];

      for (const file of files) {
        if (file.name.startsWith('backup_') && file.name.endsWith('.json')) {
          const content = await RNFS.readFile(file.path, 'utf8');
          let metadata: BackupMetadata;

          try {
            if (file.name.endsWith('.enc')) {
              // Encrypted backup - we can't read metadata without decryption
              // Use filename to extract basic info
              const idMatch = file.name.match(/backup_(\d+_[a-z0-9]+)\.json\.enc/);
              if (idMatch) {
                metadata = {
                  id: idMatch[1],
                  timestamp: parseInt(idMatch[1].split('_')[0]),
                  size: file.size,
                  encrypted: true,
                  cloudProvider: 'local',
                  version: this.APP_VERSION,
                  checksum: '',
                };
              } else {
                continue;
              }
            } else {
              const backup: BackupData = JSON.parse(content);
              metadata = backup.metadata;
            }

            backupFiles.push({
              metadata,
              localPath: file.path,
              status: 'completed',
            });
          } catch (error) {
            console.error('Error reading backup file:', file.name, error);
          }
        }
      }

      return backupFiles.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);
    } catch (error) {
      console.error('Error getting local backups:', error);
      return [];
    }
  }

  /**
   * Delete a backup
   */
  static async deleteBackup(backupId: string): Promise<boolean> {
    try {
      const backups = await this.getLocalBackups();
      const backup = backups.find(b => b.metadata.id === backupId);

      if (!backup) {
        throw new Error('Backup not found');
      }

      // Delete local file
      if (backup.localPath) {
        const exists = await RNFS.exists(backup.localPath);
        if (exists) {
          await RNFS.unlink(backup.localPath);
        }
      }

      // Delete from cloud if exists
      if (backup.cloudPath && backup.metadata.cloudProvider !== 'local') {
        await CloudStorageService.deleteBackup(
          backup.metadata.cloudProvider,
          backup.cloudPath
        );
      }

      // Remove from history
      await this.removeFromHistory(backupId);

      return true;
    } catch (error) {
      console.error('Error deleting backup:', error);
      return false;
    }
  }

  /**
   * Clean up old backups based on retention count
   */
  private static async cleanupOldBackups(retainCount: number): Promise<void> {
    try {
      const backups = await this.getLocalBackups();

      if (backups.length > retainCount) {
        const backupsToDelete = backups.slice(retainCount);

        for (const backup of backupsToDelete) {
          await this.deleteBackup(backup.metadata.id);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  /**
   * Add backup to history
   */
  private static async addToHistory(item: any): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem(this.BACKUP_HISTORY_KEY);
      const history = historyJson ? JSON.parse(historyJson) : [];

      history.unshift(item);

      // Keep only last 50 history items
      const trimmedHistory = history.slice(0, 50);

      await AsyncStorage.setItem(
        this.BACKUP_HISTORY_KEY,
        JSON.stringify(trimmedHistory)
      );
    } catch (error) {
      console.error('Error adding to backup history:', error);
    }
  }

  /**
   * Remove backup from history
   */
  private static async removeFromHistory(backupId: string): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem(this.BACKUP_HISTORY_KEY);
      if (!historyJson) return;

      const history = JSON.parse(historyJson);
      const filteredHistory = history.filter((item: any) => item.id !== backupId);

      await AsyncStorage.setItem(
        this.BACKUP_HISTORY_KEY,
        JSON.stringify(filteredHistory)
      );
    } catch (error) {
      console.error('Error removing from backup history:', error);
    }
  }

  /**
   * Get backup history
   */
  static async getBackupHistory(): Promise<any[]> {
    try {
      const historyJson = await AsyncStorage.getItem(this.BACKUP_HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting backup history:', error);
      return [];
    }
  }

  /**
   * Export backup to device downloads
   */
  static async exportBackup(backupId: string): Promise<string> {
    try {
      const backups = await this.getLocalBackups();
      const backup = backups.find(b => b.metadata.id === backupId);

      if (!backup || !backup.localPath) {
        throw new Error('Backup not found');
      }

      const downloadPath = `${RNFS.DownloadDirectoryPath}/yoga_pos_backup_${backupId}.json`;
      await RNFS.copyFile(backup.localPath, downloadPath);

      return downloadPath;
    } catch (error) {
      console.error('Error exporting backup:', error);
      throw new Error('Failed to export backup');
    }
  }

  /**
   * Import backup from file
   */
  static async importBackup(filePath: string): Promise<string> {
    try {
      await this.initialize();

      // Read the file
      const content = await RNFS.readFile(filePath, 'utf8');

      // Generate new backup ID
      const backupId = this.generateBackupId();
      const fileName = `backup_${backupId}.json`;
      const localPath = `${this.BACKUP_DIR}/${fileName}`;

      // Copy to backups directory
      await RNFS.writeFile(localPath, content, 'utf8');

      return backupId;
    } catch (error) {
      console.error('Error importing backup:', error);
      throw new Error('Failed to import backup');
    }
  }
}
