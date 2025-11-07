import {AppState, AppStateStatus} from 'react-native';

/**
 * Inactivity Service
 * Handles auto-logout after inactivity
 */

type InactivityCallback = () => void;

class InactivityServiceClass {
  private inactivityTimeout: NodeJS.Timeout | null = null;
  private inactivityDuration: number = 15 * 60 * 1000; // 15 minutes default
  private callback: InactivityCallback | null = null;
  private isActive: boolean = false;
  private appStateSubscription: any = null;

  /**
   * Start inactivity timer
   */
  start(callback: InactivityCallback, durationMinutes: number = 15): void {
    this.callback = callback;
    this.inactivityDuration = durationMinutes * 60 * 1000;
    this.isActive = true;

    // Reset timer
    this.reset();

    // Listen to app state changes
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  /**
   * Stop inactivity timer
   */
  stop(): void {
    this.isActive = false;
    this.clear();

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  /**
   * Reset inactivity timer
   */
  reset(): void {
    if (!this.isActive) return;

    this.clear();

    this.inactivityTimeout = setTimeout(() => {
      if (this.callback && this.isActive) {
        this.callback();
      }
    }, this.inactivityDuration);
  }

  /**
   * Clear inactivity timer
   */
  private clear(): void {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
  }

  /**
   * Handle app state changes
   */
  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if (nextAppState === 'active') {
      // App came to foreground, reset timer
      this.reset();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App went to background, pause timer
      this.clear();
    }
  };

  /**
   * Update inactivity duration
   */
  updateDuration(durationMinutes: number): void {
    this.inactivityDuration = durationMinutes * 60 * 1000;
    if (this.isActive) {
      this.reset();
    }
  }

  /**
   * Check if service is active
   */
  isServiceActive(): boolean {
    return this.isActive;
  }
}

export const InactivityService = new InactivityServiceClass();
