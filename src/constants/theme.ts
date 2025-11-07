import {ColorScheme, LightColors, DarkColors} from './colors';

/**
 * Theme Configuration
 * Centralized styling constants for the application
 */

// Theme-independent constants
const themeConstants = {
  // Typography
  typography: {
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semiBold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },

  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Shadows
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
    },
  },

  // Layout
  layout: {
    containerPadding: 16,
    screenPadding: 20,
    cardPadding: 16,
    maxWidth: 1200,
  },

  // Button Sizes
  button: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 56,
    },
    paddingHorizontal: {
      sm: 12,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderWidth: 1,
  },

  // Input
  input: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 16,
  },

  // Animation
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: 'linear' as const,
      ease: 'ease' as const,
      easeIn: 'ease-in' as const,
      easeOut: 'ease-out' as const,
      easeInOut: 'ease-in-out' as const,
    },
  },

  // Icon Sizes
  iconSize: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
  },

  // Z-Index
  zIndex: {
    dropdown: 1000,
    modal: 1100,
    popover: 1200,
    tooltip: 1300,
  },
} as const;

// Create theme with colors
export const createTheme = (colors: ColorScheme) => ({
  colors,
  ...themeConstants,
});

// Light and Dark themes
export const LightTheme = createTheme(LightColors);
export const DarkTheme = createTheme(DarkColors);

// Default theme (light)
export const Theme = LightTheme;

export type ThemeType = typeof LightTheme;
export type ThemeMode = 'light' | 'dark';
