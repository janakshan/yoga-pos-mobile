/**
 * Setting Section Component
 * Groups related settings with a title
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from '@components/ui';
import {useTheme} from '@hooks/useTheme';

interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  description,
  children,
}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          variant="h5"
          color={theme.colors.text.primary}
          style={styles.title}>
          {title}
        </Typography>
        {description && (
          <Typography
            variant="bodySmall"
            color={theme.colors.text.secondary}
            style={styles.description}>
            {description}
          </Typography>
        )}
      </View>
      <View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.background.primary,
            borderColor: theme.colors.border,
          },
        ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    lineHeight: 18,
  },
  content: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
