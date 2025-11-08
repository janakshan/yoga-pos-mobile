/**
 * Cloud Storage Service
 * Provides integration with multiple cloud storage providers
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { CloudProvider, CloudStorageCredentials } from '../types/backup.types';

export class CloudStorageService {
  private static readonly CREDENTIALS_KEY = 'cloud_storage_credentials';

  /**
   * Upload backup to cloud storage
   */
  static async uploadBackup(
    provider: CloudProvider,
    localPath: string,
    fileName: string
  ): Promise<string> {
    try {
      const credentials = await this.getCredentials(provider);

      switch (provider) {
        case 'google-drive':
          return await this.uploadToGoogleDrive(localPath, fileName, credentials);
        case 'dropbox':
          return await this.uploadToDropbox(localPath, fileName, credentials);
        case 's3':
          return await this.uploadToS3(localPath, fileName, credentials);
        default:
          throw new Error(`Unsupported cloud provider: ${provider}`);
      }
    } catch (error) {
      console.error('Cloud upload error:', error);
      throw new Error(`Failed to upload to ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download backup from cloud storage
   */
  static async downloadBackup(
    provider: CloudProvider,
    cloudPath: string,
    localPath: string
  ): Promise<void> {
    try {
      const credentials = await this.getCredentials(provider);

      switch (provider) {
        case 'google-drive':
          await this.downloadFromGoogleDrive(cloudPath, localPath, credentials);
          break;
        case 'dropbox':
          await this.downloadFromDropbox(cloudPath, localPath, credentials);
          break;
        case 's3':
          await this.downloadFromS3(cloudPath, localPath, credentials);
          break;
        default:
          throw new Error(`Unsupported cloud provider: ${provider}`);
      }
    } catch (error) {
      console.error('Cloud download error:', error);
      throw new Error(`Failed to download from ${provider}`);
    }
  }

  /**
   * Delete backup from cloud storage
   */
  static async deleteBackup(provider: CloudProvider, cloudPath: string): Promise<void> {
    try {
      const credentials = await this.getCredentials(provider);

      switch (provider) {
        case 'google-drive':
          await this.deleteFromGoogleDrive(cloudPath, credentials);
          break;
        case 'dropbox':
          await this.deleteFromDropbox(cloudPath, credentials);
          break;
        case 's3':
          await this.deleteFromS3(cloudPath, credentials);
          break;
        default:
          throw new Error(`Unsupported cloud provider: ${provider}`);
      }
    } catch (error) {
      console.error('Cloud delete error:', error);
      throw new Error(`Failed to delete from ${provider}`);
    }
  }

  /**
   * List backups from cloud storage
   */
  static async listBackups(provider: CloudProvider): Promise<any[]> {
    try {
      const credentials = await this.getCredentials(provider);

      switch (provider) {
        case 'google-drive':
          return await this.listGoogleDriveBackups(credentials);
        case 'dropbox':
          return await this.listDropboxBackups(credentials);
        case 's3':
          return await this.listS3Backups(credentials);
        default:
          throw new Error(`Unsupported cloud provider: ${provider}`);
      }
    } catch (error) {
      console.error('Cloud list error:', error);
      return [];
    }
  }

  // ==================== Google Drive ====================

  private static async uploadToGoogleDrive(
    localPath: string,
    fileName: string,
    credentials: CloudStorageCredentials
  ): Promise<string> {
    if (!credentials.accessToken) {
      throw new Error('Google Drive access token not found');
    }

    try {
      // Read file content
      const fileContent = await RNFS.readFile(localPath, 'base64');

      // Create file metadata
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: ['appDataFolder'], // Store in app data folder
      };

      // Upload file to Google Drive
      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
            'Content-Type': 'multipart/related; boundary=boundary',
          },
          body: this.createMultipartBody(metadata, fileContent, 'boundary'),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Drive upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.id; // Return file ID as cloud path
    } catch (error) {
      console.error('Google Drive upload error:', error);
      throw error;
    }
  }

  private static async downloadFromGoogleDrive(
    fileId: string,
    localPath: string,
    credentials: CloudStorageCredentials
  ): Promise<void> {
    if (!credentials.accessToken) {
      throw new Error('Google Drive access token not found');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Drive download failed: ${response.statusText}`);
      }

      const content = await response.text();
      await RNFS.writeFile(localPath, content, 'utf8');
    } catch (error) {
      console.error('Google Drive download error:', error);
      throw error;
    }
  }

  private static async deleteFromGoogleDrive(
    fileId: string,
    credentials: CloudStorageCredentials
  ): Promise<void> {
    if (!credentials.accessToken) {
      throw new Error('Google Drive access token not found');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Drive delete failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Google Drive delete error:', error);
      throw error;
    }
  }

  private static async listGoogleDriveBackups(
    credentials: CloudStorageCredentials
  ): Promise<any[]> {
    if (!credentials.accessToken) {
      throw new Error('Google Drive access token not found');
    }

    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name contains "backup_"',
        {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Drive list failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.files || [];
    } catch (error) {
      console.error('Google Drive list error:', error);
      return [];
    }
  }

  // ==================== Dropbox ====================

  private static async uploadToDropbox(
    localPath: string,
    fileName: string,
    credentials: CloudStorageCredentials
  ): Promise<string> {
    if (!credentials.accessToken) {
      throw new Error('Dropbox access token not found');
    }

    try {
      const fileContent = await RNFS.readFile(localPath, 'utf8');
      const path = `/yoga_pos_backups/${fileName}`;

      const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path,
            mode: 'add',
            autorename: true,
            mute: false,
          }),
        },
        body: fileContent,
      });

      if (!response.ok) {
        throw new Error(`Dropbox upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.path_display;
    } catch (error) {
      console.error('Dropbox upload error:', error);
      throw error;
    }
  }

  private static async downloadFromDropbox(
    path: string,
    localPath: string,
    credentials: CloudStorageCredentials
  ): Promise<void> {
    if (!credentials.accessToken) {
      throw new Error('Dropbox access token not found');
    }

    try {
      const response = await fetch('https://content.dropboxapi.com/2/files/download', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({ path }),
        },
      });

      if (!response.ok) {
        throw new Error(`Dropbox download failed: ${response.statusText}`);
      }

      const content = await response.text();
      await RNFS.writeFile(localPath, content, 'utf8');
    } catch (error) {
      console.error('Dropbox download error:', error);
      throw error;
    }
  }

  private static async deleteFromDropbox(
    path: string,
    credentials: CloudStorageCredentials
  ): Promise<void> {
    if (!credentials.accessToken) {
      throw new Error('Dropbox access token not found');
    }

    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/delete_v2', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });

      if (!response.ok) {
        throw new Error(`Dropbox delete failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Dropbox delete error:', error);
      throw error;
    }
  }

  private static async listDropboxBackups(
    credentials: CloudStorageCredentials
  ): Promise<any[]> {
    if (!credentials.accessToken) {
      throw new Error('Dropbox access token not found');
    }

    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: '/yoga_pos_backups',
          recursive: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Dropbox list failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.entries || [];
    } catch (error) {
      console.error('Dropbox list error:', error);
      return [];
    }
  }

  // ==================== AWS S3 ====================

  private static async uploadToS3(
    localPath: string,
    fileName: string,
    credentials: CloudStorageCredentials
  ): Promise<string> {
    if (!credentials.apiKey || !credentials.secretKey || !credentials.bucket) {
      throw new Error('AWS S3 credentials incomplete');
    }

    // Note: For production, use AWS SDK or a proper signing mechanism
    // This is a simplified implementation
    throw new Error('S3 upload not fully implemented - requires AWS SDK integration');
  }

  private static async downloadFromS3(
    key: string,
    localPath: string,
    credentials: CloudStorageCredentials
  ): Promise<void> {
    throw new Error('S3 download not fully implemented - requires AWS SDK integration');
  }

  private static async deleteFromS3(
    key: string,
    credentials: CloudStorageCredentials
  ): Promise<void> {
    throw new Error('S3 delete not fully implemented - requires AWS SDK integration');
  }

  private static async listS3Backups(credentials: CloudStorageCredentials): Promise<any[]> {
    throw new Error('S3 list not fully implemented - requires AWS SDK integration');
  }

  // ==================== Utilities ====================

  /**
   * Save cloud storage credentials
   */
  static async saveCredentials(credentials: CloudStorageCredentials): Promise<void> {
    try {
      const existing = await this.getAllCredentials();
      existing[credentials.provider] = credentials;
      await AsyncStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw new Error('Failed to save cloud storage credentials');
    }
  }

  /**
   * Get credentials for a provider
   */
  static async getCredentials(provider: CloudProvider): Promise<CloudStorageCredentials> {
    try {
      const all = await this.getAllCredentials();
      const credentials = all[provider];

      if (!credentials) {
        throw new Error(`No credentials found for ${provider}`);
      }

      // Check if token is expired
      if (credentials.expiresAt && credentials.expiresAt < Date.now()) {
        throw new Error(`Credentials for ${provider} have expired`);
      }

      return credentials;
    } catch (error) {
      console.error('Error getting credentials:', error);
      throw error;
    }
  }

  /**
   * Get all credentials
   */
  static async getAllCredentials(): Promise<Record<CloudProvider, CloudStorageCredentials>> {
    try {
      const json = await AsyncStorage.getItem(this.CREDENTIALS_KEY);
      return json ? JSON.parse(json) : {};
    } catch (error) {
      console.error('Error getting all credentials:', error);
      return {} as Record<CloudProvider, CloudStorageCredentials>;
    }
  }

  /**
   * Remove credentials for a provider
   */
  static async removeCredentials(provider: CloudProvider): Promise<void> {
    try {
      const all = await this.getAllCredentials();
      delete all[provider];
      await AsyncStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(all));
    } catch (error) {
      console.error('Error removing credentials:', error);
      throw new Error('Failed to remove cloud storage credentials');
    }
  }

  /**
   * Test cloud connection
   */
  static async testConnection(provider: CloudProvider): Promise<boolean> {
    try {
      await this.listBackups(provider);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Create multipart body for Google Drive upload
   */
  private static createMultipartBody(
    metadata: any,
    content: string,
    boundary: string
  ): string {
    const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
    const contentPart = `--${boundary}\r\nContent-Type: application/json\r\nContent-Transfer-Encoding: base64\r\n\r\n${content}\r\n`;
    const endBoundary = `--${boundary}--`;

    return metadataPart + contentPart + endBoundary;
  }
}
