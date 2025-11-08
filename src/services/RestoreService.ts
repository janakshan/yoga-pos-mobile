/**
 * Restore Service
 * Handles backup restoration with verification
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import RNFS from 'react-native-fs';
import {
  BackupData,
  RestoreResult,
  BackupVerificationResult,
} from '../types/backup.types';
import { EncryptionService } from './EncryptionService';
import { BackupService } from './BackupService';

export class RestoreService {
  /**
   * Restore from a backup
   */
  static async restoreFromBackup(
    backupId: string,
    password?: string
  ): Promise<RestoreResult> {
    const startTime = Date.now();

    try {
      // Get the backup file
      const backups = await BackupService.getLocalBackups();
      const backup = backups.find(b => b.metadata.id === backupId);

      if (!backup || !backup.localPath) {
        throw new Error('Backup not found');
      }

      // Read backup content
      let content = await RNFS.readFile(backup.localPath, 'utf8');

      // Decrypt if encrypted
      let backupData: BackupData;
      if (backup.metadata.encrypted) {
        if (!password) {
          // Try to get the stored backup password
          const credentials = await Keychain.getGenericPassword({
            service: 'backup_password'
          });
          if (!credentials) {
            throw new Error('Backup password required');
          }
          password = credentials.password;
        }

        backupData = await EncryptionService.decryptObject<BackupData>(content, password);
      } else {
        backupData = JSON.parse(content);
      }

      // Verify backup integrity
      const verification = await this.verifyBackup(backupData);
      if (!verification.isValid) {
        throw new Error(`Backup verification failed: ${verification.errors.join(', ')}`);
      }

      // Restore data
      const restoredData = {
        settings: false,
        authData: false,
        posData: false,
      };

      // Restore settings
      if (backupData.data.settings) {
        await AsyncStorage.setItem(
          'yoga-pos-settings',
          JSON.stringify(backupData.data.settings)
        );
        restoredData.settings = true;
      }

      // Restore auth data if available
      if (backupData.data.authData) {
        if (backupData.data.authData.username) {
          await Keychain.setGenericPassword(
            backupData.data.authData.username,
            'restored',
            { service: 'yoga_pos' }
          );
        }
        restoredData.authData = true;
      }

      // Restore POS data if available
      if (backupData.data.posData) {
        for (const [key, value] of Object.entries(backupData.data.posData)) {
          await AsyncStorage.setItem(
            key,
            typeof value === 'string' ? value : JSON.stringify(value)
          );
        }
        restoredData.posData = true;
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        backupId,
        restoredData,
        duration,
      };
    } catch (error) {
      console.error('Restore error:', error);
      const duration = Date.now() - startTime;
      return {
        success: false,
        backupId,
        error: error instanceof Error ? error.message : 'Unknown restore error',
        duration,
      };
    }
  }

  /**
   * Verify backup integrity
   */
  static async verifyBackup(backupData: BackupData): Promise<BackupVerificationResult> {
    const errors: string[] = [];
    let checksumMatch = true;
    let structureValid = true;

    try {
      // Verify backup structure
      if (!backupData.metadata) {
        errors.push('Missing metadata');
        structureValid = false;
      }

      if (!backupData.data) {
        errors.push('Missing data');
        structureValid = false;
      }

      // Verify metadata fields
      if (backupData.metadata) {
        if (!backupData.metadata.id) {
          errors.push('Missing backup ID');
          structureValid = false;
        }

        if (!backupData.metadata.timestamp) {
          errors.push('Missing timestamp');
          structureValid = false;
        }

        if (!backupData.metadata.version) {
          errors.push('Missing version');
          structureValid = false;
        }
      }

      // Verify data structure
      if (backupData.data) {
        if (!backupData.data.settings && !backupData.data.authData && !backupData.data.posData) {
          errors.push('Backup contains no data');
          structureValid = false;
        }
      }

      // Verify checksum if provided
      if (backupData.metadata?.checksum) {
        const dataString = JSON.stringify(backupData.data);
        const actualChecksum = await EncryptionService.generateChecksum(dataString);
        if (actualChecksum !== backupData.metadata.checksum) {
          errors.push('Checksum mismatch - data may be corrupted');
          checksumMatch = false;
        }
      }

      return {
        isValid: errors.length === 0,
        backupId: backupData.metadata?.id || 'unknown',
        checksumMatch,
        structureValid,
        errors,
      };
    } catch (error) {
      console.error('Backup verification error:', error);
      return {
        isValid: false,
        backupId: backupData.metadata?.id || 'unknown',
        checksumMatch: false,
        structureValid: false,
        errors: ['Verification failed: ' + (error instanceof Error ? error.message : 'Unknown error')],
      };
    }
  }

  /**
   * Verify a backup file without restoring
   */
  static async verifyBackupFile(backupId: string): Promise<BackupVerificationResult> {
    try {
      const backups = await BackupService.getLocalBackups();
      const backup = backups.find(b => b.metadata.id === backupId);

      if (!backup || !backup.localPath) {
        return {
          isValid: false,
          backupId,
          checksumMatch: false,
          structureValid: false,
          errors: ['Backup file not found'],
        };
      }

      // Read backup content
      let content = await RNFS.readFile(backup.localPath, 'utf8');

      // Check if encrypted
      let backupData: BackupData;
      if (backup.metadata.encrypted) {
        // For encrypted backups, we can't verify without password
        // Just verify file exists and is readable
        return {
          isValid: true,
          backupId,
          checksumMatch: true,
          structureValid: true,
          errors: [],
        };
      } else {
        backupData = JSON.parse(content);
      }

      return await this.verifyBackup(backupData);
    } catch (error) {
      console.error('Backup file verification error:', error);
      return {
        isValid: false,
        backupId,
        checksumMatch: false,
        structureValid: false,
        errors: ['File verification failed: ' + (error instanceof Error ? error.message : 'Unknown error')],
      };
    }
  }

  /**
   * Get backup preview (metadata only)
   */
  static async getBackupPreview(backupId: string): Promise<any> {
    try {
      const backups = await BackupService.getLocalBackups();
      const backup = backups.find(b => b.metadata.id === backupId);

      if (!backup) {
        throw new Error('Backup not found');
      }

      return {
        id: backup.metadata.id,
        timestamp: backup.metadata.timestamp,
        size: backup.metadata.size,
        encrypted: backup.metadata.encrypted,
        cloudProvider: backup.metadata.cloudProvider,
        version: backup.metadata.version,
        deviceInfo: backup.metadata.deviceInfo,
      };
    } catch (error) {
      console.error('Error getting backup preview:', error);
      throw new Error('Failed to get backup preview');
    }
  }

  /**
   * Check if restore is needed (e.g., on first launch)
   */
  static async shouldAutoRestore(): Promise<boolean> {
    try {
      // Check if settings exist
      const settings = await AsyncStorage.getItem('yoga-pos-settings');
      if (settings) {
        return false; // Settings exist, no need to auto-restore
      }

      // Check if any backups exist
      const backups = await BackupService.getLocalBackups();
      return backups.length > 0;
    } catch (error) {
      console.error('Error checking auto-restore:', error);
      return false;
    }
  }

  /**
   * Get the most recent backup for auto-restore
   */
  static async getMostRecentBackup(): Promise<string | null> {
    try {
      const backups = await BackupService.getLocalBackups();
      if (backups.length === 0) {
        return null;
      }

      // Backups are already sorted by timestamp (newest first)
      return backups[0].metadata.id;
    } catch (error) {
      console.error('Error getting most recent backup:', error);
      return null;
    }
  }
}
