import {useEffect, useRef, useCallback} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useAuthStore} from '@store/slices/authSlice';

/**
 * Inactivity Logout Hook
 * Automatically logs out user after a period of inactivity
 */

interface UseInactivityLogoutOptions {
  /** Inactivity timeout in milliseconds (default: 15 minutes) */
  timeout?: number;
  /** Whether to enable inactivity logout (default: true) */
  enabled?: boolean;
  /** Callback when user is about to be logged out */
  onInactivityWarning?: (secondsRemaining: number) => void;
  /** Warning time before logout in milliseconds (default: 1 minute) */
  warningTime?: number;
}

const DEFAULT_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const DEFAULT_WARNING_TIME = 60 * 1000; // 1 minute

export const useInactivityLogout = (options: UseInactivityLogoutOptions = {}) => {
  const {
    timeout = DEFAULT_TIMEOUT,
    enabled = true,
    onInactivityWarning,
    warningTime = DEFAULT_WARNING_TIME,
  } = options;

  const {isAuthenticated, logout} = useAuthStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  /**
   * Clear all timers
   */
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);

  /**
   * Handle auto logout
   */
  const handleAutoLogout = useCallback(async () => {
    console.log('Auto logout triggered due to inactivity');
    clearTimers();
    await logout();
  }, [logout, clearTimers]);

  /**
   * Show warning before logout
   */
  const showInactivityWarning = useCallback(() => {
    if (onInactivityWarning) {
      const secondsRemaining = Math.floor(warningTime / 1000);
      onInactivityWarning(secondsRemaining);
    }
  }, [onInactivityWarning, warningTime]);

  /**
   * Reset inactivity timer
   */
  const resetTimer = useCallback(() => {
    if (!enabled || !isAuthenticated) {
      return;
    }

    lastActivityRef.current = Date.now();
    clearTimers();

    // Set warning timer
    if (onInactivityWarning && warningTime > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        showInactivityWarning();
      }, timeout - warningTime);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      handleAutoLogout();
    }, timeout);
  }, [
    enabled,
    isAuthenticated,
    timeout,
    warningTime,
    onInactivityWarning,
    showInactivityWarning,
    handleAutoLogout,
    clearTimers,
  ]);

  /**
   * Handle app state change
   */
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground
        const inactiveTime = Date.now() - lastActivityRef.current;

        if (inactiveTime >= timeout && isAuthenticated) {
          // User was inactive for too long, logout
          handleAutoLogout();
        } else {
          // Reset timer when app comes to foreground
          resetTimer();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background
        lastActivityRef.current = Date.now();
      }

      appStateRef.current = nextAppState;
    },
    [timeout, isAuthenticated, handleAutoLogout, resetTimer],
  );

  /**
   * Track user activity
   */
  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      clearTimers();
      return;
    }

    // Start the timer
    resetTimer();

    // Listen to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      clearTimers();
      subscription.remove();
    };
  }, [enabled, isAuthenticated, resetTimer, handleAppStateChange, clearTimers]);

  /**
   * Manually reset the inactivity timer (call on user interaction)
   */
  const recordActivity = useCallback(() => {
    if (enabled && isAuthenticated) {
      resetTimer();
    }
  }, [enabled, isAuthenticated, resetTimer]);

  /**
   * Get time remaining until auto logout (in seconds)
   */
  const getTimeRemaining = useCallback((): number => {
    if (!enabled || !isAuthenticated) {
      return 0;
    }

    const elapsed = Date.now() - lastActivityRef.current;
    const remaining = Math.max(0, timeout - elapsed);

    return Math.floor(remaining / 1000);
  }, [enabled, isAuthenticated, timeout]);

  return {
    recordActivity,
    getTimeRemaining,
    resetTimer,
  };
};

/**
 * Hook to wrap component with inactivity tracking
 * Automatically tracks touch events and resets inactivity timer
 */
export const useAutoInactivityTracking = (
  options: UseInactivityLogoutOptions = {},
) => {
  const inactivity = useInactivityLogout(options);

  // Auto-track on mount
  useEffect(() => {
    inactivity.recordActivity();
  }, []);

  return inactivity;
};
