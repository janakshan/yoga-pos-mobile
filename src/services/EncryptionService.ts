/**
 * Encryption Service
 * Provides AES-256-GCM encryption/decryption for backup data
 */

import Aes from 'react-native-aes-crypto';
import { Platform } from 'react-native';

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_SIZE = 256;
  private static readonly IV_SIZE = 16;
  private static readonly SALT_SIZE = 32;
  private static readonly ITERATIONS = 10000;

  /**
   * Generate a secure encryption key from a password
   */
  static async generateKey(password: string, salt?: string): Promise<{ key: string; salt: string }> {
    try {
      const actualSalt = salt || await this.generateSalt();
      const key = await Aes.pbkdf2(password, actualSalt, this.ITERATIONS, this.KEY_SIZE);
      return { key, salt: actualSalt };
    } catch (error) {
      console.error('Error generating encryption key:', error);
      throw new Error('Failed to generate encryption key');
    }
  }

  /**
   * Generate a random salt
   */
  static async generateSalt(): Promise<string> {
    try {
      return await Aes.randomKey(this.SALT_SIZE);
    } catch (error) {
      console.error('Error generating salt:', error);
      throw new Error('Failed to generate salt');
    }
  }

  /**
   * Generate a random IV (Initialization Vector)
   */
  static async generateIV(): Promise<string> {
    try {
      return await Aes.randomKey(this.IV_SIZE);
    } catch (error) {
      console.error('Error generating IV:', error);
      throw new Error('Failed to generate IV');
    }
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  static async encrypt(data: string, password: string): Promise<string> {
    try {
      // Generate key and IV
      const { key, salt } = await this.generateKey(password);
      const iv = await this.generateIV();

      // Encrypt the data
      const encrypted = await Aes.encrypt(data, key, iv, this.ALGORITHM);

      // Package the encrypted data with salt and IV
      const packagedData = {
        encrypted,
        salt,
        iv,
        algorithm: this.ALGORITHM,
        timestamp: Date.now(),
      };

      return JSON.stringify(packagedData);
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  static async decrypt(encryptedPackage: string, password: string): Promise<string> {
    try {
      // Unpackage the encrypted data
      const packagedData = JSON.parse(encryptedPackage);
      const { encrypted, salt, iv, algorithm } = packagedData;

      // Verify algorithm
      if (algorithm !== this.ALGORITHM) {
        throw new Error('Unsupported encryption algorithm');
      }

      // Regenerate key from password and salt
      const { key } = await this.generateKey(password, salt);

      // Decrypt the data
      const decrypted = await Aes.decrypt(encrypted, key, iv, algorithm);

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data. Invalid password or corrupted data.');
    }
  }

  /**
   * Encrypt a JSON object
   */
  static async encryptObject(obj: any, password: string): Promise<string> {
    try {
      const jsonString = JSON.stringify(obj);
      return await this.encrypt(jsonString, password);
    } catch (error) {
      console.error('Error encrypting object:', error);
      throw new Error('Failed to encrypt object');
    }
  }

  /**
   * Decrypt to a JSON object
   */
  static async decryptObject<T = any>(encryptedPackage: string, password: string): Promise<T> {
    try {
      const decryptedString = await this.decrypt(encryptedPackage, password);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Error decrypting object:', error);
      throw new Error('Failed to decrypt object');
    }
  }

  /**
   * Generate a SHA-256 hash for data verification
   */
  static async generateChecksum(data: string): Promise<string> {
    try {
      return await Aes.sha256(data);
    } catch (error) {
      console.error('Error generating checksum:', error);
      throw new Error('Failed to generate checksum');
    }
  }

  /**
   * Verify data integrity using checksum
   */
  static async verifyChecksum(data: string, expectedChecksum: string): Promise<boolean> {
    try {
      const actualChecksum = await this.generateChecksum(data);
      return actualChecksum === expectedChecksum;
    } catch (error) {
      console.error('Error verifying checksum:', error);
      return false;
    }
  }

  /**
   * Generate a secure random password for backup encryption
   */
  static async generateBackupPassword(): Promise<string> {
    try {
      const randomKey = await Aes.randomKey(32);
      return randomKey;
    } catch (error) {
      console.error('Error generating backup password:', error);
      throw new Error('Failed to generate backup password');
    }
  }
}
