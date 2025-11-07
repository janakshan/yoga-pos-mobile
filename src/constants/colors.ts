/**
 * Color Theme & Design System for Yoga POS
 * Based on Sky Blue primary and Purple secondary palette
 */

export const Colors = {
  // Primary Colors - Sky Blue
  primary: {
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
  },

  // Secondary Colors - Purple
  secondary: {
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
  },

  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },

  // Text Colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
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
    active: '#10b981',
    inactive: '#6b7280',
    pending: '#f59e0b',
    completed: '#10b981',
    cancelled: '#ef4444',
  },

  // Common
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorScheme = typeof Colors;
