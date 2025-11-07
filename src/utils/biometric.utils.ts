import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {BiometricAuthResult} from '@types/api.types';

/**
 * Biometric Authentication Utility
 * Handles biometric authentication (Face ID, Touch ID, Fingerprint)
 */

class BiometricUtilityClass {
  private rnBiometrics: ReactNativeBiometrics;

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
  }

  /**
   * Check if biometric authentication is available
   */
  async isBiometricAvailable(): Promise<{
    available: boolean;
    biometryType?: string;
  }> {
    try {
      const {available, biometryType} =
        await this.rnBiometrics.isSensorAvailable();

      return {
        available,
        biometryType: this.getBiometryTypeName(biometryType),
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return {available: false};
    }
  }

  /**
   * Authenticate with biometrics
   */
  async authenticate(
    promptMessage?: string,
  ): Promise<BiometricAuthResult> {
    try {
      const {available, biometryType} = await this.isBiometricAvailable();

      if (!available) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      const message =
        promptMessage ||
        `Authenticate with ${this.getBiometryTypeName(biometryType)}`;

      const {success} = await this.rnBiometrics.simplePrompt({
        promptMessage: message,
        cancelButtonText: 'Cancel',
      });

      return {
        success,
        biometryType: this.getBiometryTypeName(biometryType),
      };
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error.message || 'Biometric authentication failed',
      };
    }
  }

  /**
   * Create biometric keys (for advanced crypto operations)
   */
  async createKeys(): Promise<boolean> {
    try {
      const {publicKey} = await this.rnBiometrics.createKeys();
      return !!publicKey;
    } catch (error) {
      console.error('Error creating biometric keys:', error);
      return false;
    }
  }

  /**
   * Check if biometric keys exist
   */
  async biometricKeysExist(): Promise<boolean> {
    try {
      const {keysExist} = await this.rnBiometrics.biometricKeysExist();
      return keysExist;
    } catch (error) {
      console.error('Error checking biometric keys:', error);
      return false;
    }
  }

  /**
   * Delete biometric keys
   */
  async deleteKeys(): Promise<boolean> {
    try {
      const {keysDeleted} = await this.rnBiometrics.deleteKeys();
      return keysDeleted;
    } catch (error) {
      console.error('Error deleting biometric keys:', error);
      return false;
    }
  }

  /**
   * Create and verify biometric signature (for secure authentication)
   */
  async createSignature(
    payload: string,
    promptMessage?: string,
  ): Promise<{success: boolean; signature?: string; error?: string}> {
    try {
      const {available} = await this.isBiometricAvailable();

      if (!available) {
        return {
          success: false,
          error: 'Biometric authentication is not available',
        };
      }

      // Ensure keys exist
      const keysExist = await this.biometricKeysExist();
      if (!keysExist) {
        await this.createKeys();
      }

      const message = promptMessage || 'Sign in with biometrics';

      const {success, signature} = await this.rnBiometrics.createSignature({
        promptMessage: message,
        payload,
        cancelButtonText: 'Cancel',
      });

      if (success && signature) {
        return {success: true, signature};
      }

      return {
        success: false,
        error: 'Failed to create biometric signature',
      };
    } catch (error: any) {
      console.error('Error creating biometric signature:', error);
      return {
        success: false,
        error: error.message || 'Biometric signature creation failed',
      };
    }
  }

  /**
   * Get human-readable biometry type name
   */
  private getBiometryTypeName(biometryType?: BiometryTypes): string {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.Biometrics:
        return 'Fingerprint';
      default:
        return 'Biometric';
    }
  }

  /**
   * Get biometry type for display
   */
  async getBiometryType(): Promise<string | null> {
    const {available, biometryType} = await this.isBiometricAvailable();
    return available ? biometryType || null : null;
  }
}

export const BiometricUtility = new BiometricUtilityClass();
