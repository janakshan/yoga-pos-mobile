/**
 * Settings Store Slice
 * Manages application settings with persistence
 */

import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  GeneralSettings,
  LocalizationSettings,
  BrandingSettings,
  HardwareSettings,
  NotificationSettings,
  BackupSettings,
} from '@/types/settings.types';

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  lastSyncedAt?: string;
}

interface SettingsActions {
  // General Settings
  updateGeneralSettings: (settings: Partial<GeneralSettings>) => void;

  // Localization Settings
  updateLocalizationSettings: (settings: Partial<LocalizationSettings>) => void;

  // Branding Settings
  updateBrandingSettings: (settings: Partial<BrandingSettings>) => void;

  // Hardware Settings
  updateHardwareSettings: (settings: Partial<HardwareSettings>) => void;

  // Notification Settings
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // Backup Settings
  updateBackupSettings: (settings: Partial<BackupSettings>) => void;

  // Utility Actions
  resetSettings: () => void;
  resetCategory: (category: keyof AppSettings) => void;
  exportSettings: () => AppSettings;
  importSettings: (settings: Partial<AppSettings>) => void;
}

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      lastSyncedAt: undefined,

      // Update General Settings
      updateGeneralSettings: (newSettings) => {
        set((state) => {
          state.settings.general = {
            ...state.settings.general,
            ...newSettings,
          };
          state.lastSyncedAt = new Date().toISOString();
        });
      },

      // Update Localization Settings
      updateLocalizationSettings: (newSettings) => {
        set((state) => {
          state.settings.localization = {
            ...state.settings.localization,
            ...newSettings,
          };
          state.lastSyncedAt = new Date().toISOString();
        });
      },

      // Update Branding Settings
      updateBrandingSettings: (newSettings) => {
        set((state) => {
          state.settings.branding = {
            ...state.settings.branding,
            ...newSettings,
          };
          state.lastSyncedAt = new Date().toISOString();
        });
      },

      // Update Hardware Settings
      updateHardwareSettings: (newSettings) => {
        set((state) => {
          state.settings.hardware = {
            ...state.settings.hardware,
            ...newSettings,
          };
          state.lastSyncedAt = new Date().toISOString();
        });
      },

      // Update Notification Settings
      updateNotificationSettings: (newSettings) => {
        set((state) => {
          state.settings.notifications = {
            ...state.settings.notifications,
            ...newSettings,
          };
          state.lastSyncedAt = new Date().toISOString();
        });
      },

      // Update Backup Settings
      updateBackupSettings: (newSettings) => {
        set((state) => {
          state.settings.backup = {
            ...state.settings.backup,
            ...newSettings,
          };
          state.lastSyncedAt = new Date().toISOString();
        });
      },

      // Reset All Settings
      resetSettings: () => {
        set((state) => {
          state.settings = DEFAULT_SETTINGS;
          state.lastSyncedAt = new Date().toISOString();
        });
      },

      // Reset Specific Category
      resetCategory: (category) => {
        set((state) => {
          state.settings[category] = DEFAULT_SETTINGS[category] as any;
          state.lastSyncedAt = new Date().toISOString();
        });
      },

      // Export Settings
      exportSettings: () => {
        return get().settings;
      },

      // Import Settings
      importSettings: (newSettings) => {
        set((state) => {
          state.settings = {
            ...state.settings,
            ...newSettings,
          };
          state.lastSyncedAt = new Date().toISOString();
        });
      },
    })),
    {
      name: 'yoga-pos-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);

// Selector hooks for better performance
export const useGeneralSettings = () =>
  useSettingsStore((state) => state.settings.general);

export const useLocalizationSettings = () =>
  useSettingsStore((state) => state.settings.localization);

export const useBrandingSettings = () =>
  useSettingsStore((state) => state.settings.branding);

export const useHardwareSettings = () =>
  useSettingsStore((state) => state.settings.hardware);

export const useNotificationSettings = () =>
  useSettingsStore((state) => state.settings.notifications);

export const useBackupSettings = () =>
  useSettingsStore((state) => state.settings.backup);
