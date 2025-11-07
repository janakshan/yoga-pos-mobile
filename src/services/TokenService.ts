import * as Keychain from 'react-native-keychain';
import {User} from '@types/api.types';

/**
 * Token Service
 * Handles secure storage and retrieval of authentication tokens
 * Uses react-native-keychain for iOS Keychain and Android Keystore
 */

const ACCESS_TOKEN_KEY = 'yoga_pos_access_token';
const REFRESH_TOKEN_KEY = 'yoga_pos_refresh_token';
const USER_DATA_KEY = 'yoga_pos_user_data';

class TokenServiceClass {
  /**
   * Save access and refresh tokens securely
   */
  async saveTokens(
    accessToken: string,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(
        ACCESS_TOKEN_KEY,
        JSON.stringify({
          accessToken,
          refreshToken,
        }),
        {
          service: ACCESS_TOKEN_KEY,
        },
      );
      return true;
    } catch (error) {
      console.error('Error saving tokens:', error);
      return false;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: ACCESS_TOKEN_KEY,
      });

      if (credentials) {
        const data = JSON.parse(credentials.password);
        return data.accessToken || null;
      }

      return null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: ACCESS_TOKEN_KEY,
      });

      if (credentials) {
        const data = JSON.parse(credentials.password);
        return data.refreshToken || null;
      }

      return null;
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Save user data
   */
  async saveUser(user: User): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(USER_DATA_KEY, JSON.stringify(user), {
        service: USER_DATA_KEY,
      });
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  /**
   * Get user data
   */
  async getUser(): Promise<User | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: USER_DATA_KEY,
      });

      if (credentials) {
        return JSON.parse(credentials.password);
      }

      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Clear all tokens and user data
   */
  async clearTokens(): Promise<boolean> {
    try {
      await Promise.all([
        Keychain.resetGenericPassword({service: ACCESS_TOKEN_KEY}),
        Keychain.resetGenericPassword({service: USER_DATA_KEY}),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing tokens:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  }
}

export const TokenService = new TokenServiceClass();
