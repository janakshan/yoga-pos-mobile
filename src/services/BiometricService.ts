import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Biometric Authentication Service
 * Handles Face ID, Touch ID, and Fingerprint authentication
 */

export enum BiometricType {
  FINGERPRINT = 'fingerprint',
  FACE_ID = 'face-id',
  IRIS = 'iris',
  NONE = 'none',
}

class BiometricServiceClass {
  /**
   * Check if biometric authentication is available on device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) return false;

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   */
  async getSupportedTypes(): Promise<BiometricType[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const biometricTypes: BiometricType[] = [];

      types.forEach(type => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            biometricTypes.push(BiometricType.FINGERPRINT);
            break;
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            biometricTypes.push(BiometricType.FACE_ID);
            break;
          case LocalAuthentication.AuthenticationType.IRIS:
            biometricTypes.push(BiometricType.IRIS);
            break;
        }
      });

      return biometricTypes;
    } catch (error) {
      console.error('Error getting supported biometric types:', error);
      return [];
    }
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate(
    promptMessage?: string,
    cancelLabel?: string,
  ): Promise<{success: boolean; error?: string}> {
    try {
      const isAvailable = await this.isAvailable();

      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available',
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'Authenticate to continue',
        cancelLabel: cancelLabel || 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        return {success: true};
      } else {
        return {
          success: false,
          error: result.error || 'Authentication failed',
        };
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed',
      };
    }
  }

  /**
   * Check if device has biometric hardware
   */
  async hasHardware(): Promise<boolean> {
    try {
      return await LocalAuthentication.hasHardwareAsync();
    } catch (error) {
      console.error('Error checking biometric hardware:', error);
      return false;
    }
  }

  /**
   * Check if biometric data is enrolled
   */
  async isEnrolled(): Promise<boolean> {
    try {
      return await LocalAuthentication.isEnrolledAsync();
    } catch (error) {
      console.error('Error checking biometric enrollment:', error);
      return false;
    }
  }

  /**
   * Get biometric authentication level
   */
  async getSecurityLevel(): Promise<number> {
    try {
      const level = await LocalAuthentication.getEnrolledLevelAsync();
      return level;
    } catch (error) {
      console.error('Error getting security level:', error);
      return 0;
    }
  }

  /**
   * Get friendly name for biometric type
   */
  getBiometricName(types: BiometricType[]): string {
    if (types.includes(BiometricType.FACE_ID)) {
      return 'Face ID';
    }
    if (types.includes(BiometricType.FINGERPRINT)) {
      return 'Fingerprint';
    }
    if (types.includes(BiometricType.IRIS)) {
      return 'Iris';
    }
    return 'Biometric';
  }
}

export const BiometricService = new BiometricServiceClass();
