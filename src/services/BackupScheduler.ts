/**
 * Backup Scheduler
 * Handles automatic backup scheduling using background tasks
 */

import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackupConfig, BackupFrequency, BackgroundBackupJob } from '../types/backup.types';
import { BackupService } from './BackupService';

export class BackupScheduler {
  private static readonly SCHEDULER_KEY = 'backup_scheduler';
  private static readonly TASK_ID = 'com.yogapos.backup';
  private static isInitialized = false;

  /**
   * Initialize background fetch
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Configure background fetch
      const status = await BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Minimum 15 minutes
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
          requiresCharging: false,
          requiresDeviceIdle: false,
          requiresBatteryNotLow: false,
          requiresStorageNotLow: false,
        },
        async (taskId) => {
          console.log('[BackgroundFetch] Task executed:', taskId);
          await this.executeBackupTask();
          BackgroundFetch.finish(taskId);
        },
        (taskId) => {
          console.log('[BackgroundFetch] Task timeout:', taskId);
          BackgroundFetch.finish(taskId);
        }
      );

      console.log('[BackgroundFetch] Status:', status);
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing background fetch:', error);
      throw new Error('Failed to initialize backup scheduler');
    }
  }

  /**
   * Schedule automatic backups based on configuration
   */
  static async scheduleBackup(config: BackupConfig): Promise<void> {
    try {
      await this.initialize();

      if (!config.enabled) {
        await this.stopBackup();
        return;
      }

      // Calculate next run time
      const nextRun = this.calculateNextRun(config);

      // Create job
      const job: BackgroundBackupJob = {
        id: this.TASK_ID,
        scheduledTime: Date.now(),
        nextRun,
        frequency: config.frequency,
        enabled: true,
      };

      // Save job
      await AsyncStorage.setItem(this.SCHEDULER_KEY, JSON.stringify(job));

      // Schedule task based on frequency
      await this.scheduleTaskByFrequency(config.frequency);

      console.log('[BackupScheduler] Backup scheduled for:', new Date(nextRun));
    } catch (error) {
      console.error('Error scheduling backup:', error);
      throw new Error('Failed to schedule backup');
    }
  }

  /**
   * Stop automatic backups
   */
  static async stopBackup(): Promise<void> {
    try {
      await BackgroundFetch.stop(this.TASK_ID);
      await AsyncStorage.removeItem(this.SCHEDULER_KEY);
      console.log('[BackupScheduler] Backup stopped');
    } catch (error) {
      console.error('Error stopping backup:', error);
    }
  }

  /**
   * Get current backup schedule
   */
  static async getSchedule(): Promise<BackgroundBackupJob | null> {
    try {
      const json = await AsyncStorage.getItem(this.SCHEDULER_KEY);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('Error getting backup schedule:', error);
      return null;
    }
  }

  /**
   * Execute backup task
   */
  private static async executeBackupTask(): Promise<void> {
    try {
      console.log('[BackupScheduler] Executing backup task...');

      // Get current job
      const job = await this.getSchedule();
      if (!job || !job.enabled) {
        console.log('[BackupScheduler] Backup job not enabled');
        return;
      }

      // Check if it's time to run
      const now = Date.now();
      if (now < job.nextRun) {
        console.log('[BackupScheduler] Not yet time to run backup');
        return;
      }

      // Get backup configuration from settings
      const settingsJson = await AsyncStorage.getItem('yoga-pos-settings');
      if (!settingsJson) {
        console.log('[BackupScheduler] Settings not found');
        return;
      }

      const settings = JSON.parse(settingsJson);
      const backupConfig: BackupConfig = settings.backup;

      if (!backupConfig || !backupConfig.enabled) {
        console.log('[BackupScheduler] Backup not enabled in settings');
        return;
      }

      // Create backup
      const result = await BackupService.createBackup(backupConfig);

      if (result.success) {
        console.log('[BackupScheduler] Backup created successfully:', result.backupId);

        // Update job with next run time
        job.nextRun = this.calculateNextRun(backupConfig);
        await AsyncStorage.setItem(this.SCHEDULER_KEY, JSON.stringify(job));
      } else {
        console.error('[BackupScheduler] Backup failed:', result.error);
      }
    } catch (error) {
      console.error('[BackupScheduler] Error executing backup task:', error);
    }
  }

  /**
   * Calculate next run time based on frequency
   */
  private static calculateNextRun(config: BackupConfig): number {
    const now = new Date();
    let nextRun = new Date();

    switch (config.frequency) {
      case 'hourly':
        nextRun.setHours(now.getHours() + 1, 0, 0, 0);
        break;

      case 'daily':
        if (config.time) {
          const [hours, minutes] = config.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);

          // If the time has passed today, schedule for tomorrow
          if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
          }
        } else {
          nextRun.setDate(now.getDate() + 1);
          nextRun.setHours(2, 0, 0, 0); // Default to 2 AM
        }
        break;

      case 'weekly':
        if (config.time) {
          const [hours, minutes] = config.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);
        } else {
          nextRun.setHours(2, 0, 0, 0);
        }

        // Set to the specified day of week (default to Sunday)
        const targetDay = config.dayOfWeek ?? 0;
        const currentDay = now.getDay();
        const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;
        nextRun.setDate(now.getDate() + daysUntilTarget);

        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 7);
        }
        break;

      case 'monthly':
        if (config.time) {
          const [hours, minutes] = config.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);
        } else {
          nextRun.setHours(2, 0, 0, 0);
        }

        // Set to the specified day of month (default to 1st)
        const targetDate = config.dayOfMonth ?? 1;
        nextRun.setDate(targetDate);

        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1);
        }
        break;

      case 'custom':
        // For custom, default to daily
        nextRun.setDate(now.getDate() + 1);
        nextRun.setHours(2, 0, 0, 0);
        break;

      default:
        nextRun.setDate(now.getDate() + 1);
        nextRun.setHours(2, 0, 0, 0);
    }

    return nextRun.getTime();
  }

  /**
   * Schedule task by frequency
   */
  private static async scheduleTaskByFrequency(frequency: BackupFrequency): Promise<void> {
    let minimumInterval: number;

    switch (frequency) {
      case 'hourly':
        minimumInterval = 60; // 60 minutes
        break;
      case 'daily':
        minimumInterval = 1440; // 24 hours
        break;
      case 'weekly':
        minimumInterval = 10080; // 7 days
        break;
      case 'monthly':
        minimumInterval = 43200; // 30 days
        break;
      default:
        minimumInterval = 1440; // 24 hours
    }

    // Note: BackgroundFetch has a minimum interval of 15 minutes
    // For longer intervals, we'll check the schedule in the task execution
    try {
      await BackgroundFetch.scheduleTask({
        taskId: this.TASK_ID,
        delay: Math.max(15 * 60 * 1000, minimumInterval * 60 * 1000), // Convert to milliseconds
        periodic: true,
        forceAlarmManager: true,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error('Error scheduling task:', error);
    }
  }

  /**
   * Check backup schedule status
   */
  static async getScheduleStatus(): Promise<{
    enabled: boolean;
    nextRun: number | null;
    lastRun: number | null;
  }> {
    try {
      const job = await this.getSchedule();
      if (!job) {
        return { enabled: false, nextRun: null, lastRun: null };
      }

      const history = await BackupService.getBackupHistory();
      const lastAutoBackup = history.find(item => item.type === 'automatic');

      return {
        enabled: job.enabled,
        nextRun: job.nextRun,
        lastRun: lastAutoBackup?.timestamp || null,
      };
    } catch (error) {
      console.error('Error getting schedule status:', error);
      return { enabled: false, nextRun: null, lastRun: null };
    }
  }

  /**
   * Force run backup now
   */
  static async runNow(): Promise<void> {
    try {
      await this.executeBackupTask();
    } catch (error) {
      console.error('Error running backup now:', error);
      throw new Error('Failed to run backup');
    }
  }
}

/**
 * Headless task for background execution
 * This runs even when the app is terminated
 */
export const BackupHeadlessTask = async (event: any) => {
  const { taskId } = event;
  console.log('[BackupHeadlessTask] Task executed:', taskId);

  try {
    // Execute backup task
    await BackupScheduler.runNow();
    BackgroundFetch.finish(taskId);
  } catch (error) {
    console.error('[BackupHeadlessTask] Error:', error);
    BackgroundFetch.finish(taskId);
  }
};
