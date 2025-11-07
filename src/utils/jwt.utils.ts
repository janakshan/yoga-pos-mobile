import {jwtDecode} from 'jwt-decode';
import {DecodedToken} from '@types/api.types';

/**
 * JWT Utility
 * Handles JWT token decoding and validation
 */

class JWTUtilityClass {
  /**
   * Decode JWT token
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return true;
      }

      // exp is in seconds, Date.now() is in milliseconds
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  isTokenExpiringSoon(token: string, minutesBeforeExpiry: number = 5): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return true;
      }

      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;
      const secondsBeforeExpiry = minutesBeforeExpiry * 60;

      return timeUntilExpiry < secondsBeforeExpiry;
    } catch (error) {
      console.error('Error checking token expiry time:', error);
      return true;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpirationTime(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return null;
      }

      // Convert exp from seconds to milliseconds
      return new Date(decoded.exp * 1000);
    } catch (error) {
      console.error('Error getting token expiration time:', error);
      return null;
    }
  }

  /**
   * Get time remaining until token expires (in seconds)
   */
  getTimeUntilExpiry(token: string): number {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return 0;
      }

      const currentTime = Date.now() / 1000;
      const timeRemaining = decoded.exp - currentTime;

      return Math.max(0, timeRemaining);
    } catch (error) {
      console.error('Error getting time until expiry:', error);
      return 0;
    }
  }

  /**
   * Validate token structure and expiration
   */
  validateToken(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return false;
      }

      // Check if token has required fields
      if (!decoded.userId || !decoded.email || !decoded.exp) {
        return false;
      }

      // Check if token is expired
      return !this.isTokenExpired(token);
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Get user ID from token
   */
  getUserIdFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.userId || null;
  }

  /**
   * Get user email from token
   */
  getUserEmailFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.email || null;
  }

  /**
   * Get user role from token
   */
  getUserRoleFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }

  /**
   * Get user permissions from token
   */
  getUserPermissionsFromToken(token: string): string[] {
    const decoded = this.decodeToken(token);
    return decoded?.permissions || [];
  }
}

export const JWTUtility = new JWTUtilityClass();
