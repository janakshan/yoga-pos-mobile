import Config from 'react-native-config';

/**
 * Environment Configuration
 * Centralized access to environment variables
 */

export const ENV = {
  API_BASE_URL: Config.API_BASE_URL || 'https://api.yourdomain.com/api/v1',
  API_TIMEOUT: Number(Config.API_TIMEOUT) || 30000,
  NODE_ENV: Config.NODE_ENV || 'development',
  APP_NAME: Config.APP_NAME || 'Yoga POS',
  APP_VERSION: Config.APP_VERSION || '1.0.0',
  ENABLE_BIOMETRIC_AUTH: Config.ENABLE_BIOMETRIC_AUTH === 'true',
  ENABLE_OFFLINE_MODE: Config.ENABLE_OFFLINE_MODE === 'true',
  ENABLE_PUSH_NOTIFICATIONS: Config.ENABLE_PUSH_NOTIFICATIONS === 'true',
} as const;

export const isDevelopment = ENV.NODE_ENV === 'development';
export const isProduction = ENV.NODE_ENV === 'production';
