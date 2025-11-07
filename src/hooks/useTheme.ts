import {useContext} from 'react';
import {ThemeContext} from '@context/ThemeContext';

/**
 * Hook to access the theme context
 * Provides theme, themeMode, isDark, setThemeMode, and toggleTheme
 *
 * @throws Error if used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
