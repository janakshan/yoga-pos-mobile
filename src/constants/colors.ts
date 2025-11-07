/**
 * Color Theme & Design System for Yoga POS
 * Based on Sky Blue primary and Purple secondary palette
 * Supports both light and dark modes
 */

// Primary Colors - Sky Blue
const primary = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9', // Main brand color
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
} as const;

// Secondary Colors - Purple
const secondary = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7', // Accent color
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
  950: '#3b0764',
} as const;

// Semantic Colors
const semanticColors = {
  success: '#10b981',
  successDark: '#34d399',
  warning: '#f59e0b',
  warningDark: '#fbbf24',
  error: '#ef4444',
  errorDark: '#f87171',
  info: '#3b82f6',
  infoDark: '#60a5fa',
} as const;

// Light Theme Colors
export const LightColors = {
  primary,
  secondary,

  // Semantic Colors
  success: semanticColors.success,
  warning: semanticColors.warning,
  error: semanticColors.error,
  info: semanticColors.info,

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    card: '#ffffff',
  },

  // Text Colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    link: primary[600],
  },

  // Border Colors
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Status Colors
  status: {
    active: semanticColors.success,
    inactive: '#6b7280',
    pending: semanticColors.warning,
    completed: semanticColors.success,
    cancelled: semanticColors.error,
  },

  // Common
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Dark Theme Colors
export const DarkColors = {
  primary,
  secondary,

  // Semantic Colors
  success: semanticColors.successDark,
  warning: semanticColors.warningDark,
  error: semanticColors.errorDark,
  info: semanticColors.infoDark,

  // Background Colors
  background: {
    primary: '#111827',
    secondary: '#1f2937',
    tertiary: '#374151',
    card: '#1f2937',
  },

  // Text Colors
  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    tertiary: '#9ca3af',
    inverse: '#1f2937',
    link: primary[400],
  },

  // Border Colors
  border: {
    light: '#374151',
    medium: '#4b5563',
    dark: '#6b7280',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Status Colors
  status: {
    active: semanticColors.successDark,
    inactive: '#9ca3af',
    pending: semanticColors.warningDark,
    completed: semanticColors.successDark,
    cancelled: semanticColors.errorDark,
  },

  // Common
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Default to light theme (will be overridden by ThemeProvider)
export const Colors = LightColors;

export type ColorScheme = typeof LightColors;
