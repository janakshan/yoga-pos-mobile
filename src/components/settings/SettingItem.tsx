/**
 * Setting Item Component
 * Individual setting row with label, description, and action
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Typography} from '@components/ui';
import {useTheme} from '@hooks/useTheme';

interface SettingItemProps {
  label: string;
  description?: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  disabled?: boolean;
  last?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  value,
  icon,
  onPress,
  rightComponent,
  disabled = false,
  last = false,
}) => {
  const {theme} = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: theme.colors.border,
          borderBottomWidth: last ? 0 : 1,
          backgroundColor: disabled
            ? theme.colors.background.secondary
            : 'transparent',
        },
      ]}>
      <View style={styles.leftContent}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={styles.textContent}>
          <Typography
            variant="body"
            color={
              disabled ? theme.colors.text.disabled : theme.colors.text.primary
            }
            style={styles.label}>
            {label}
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
      </View>

      <View style={styles.rightContent}>
        {value && (
          <Typography
            variant="body"
            color={theme.colors.text.secondary}
            style={styles.value}>
            {value}
          </Typography>
        )}
        {rightComponent}
      </View>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  label: {
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    lineHeight: 18,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  value: {
    marginRight: 8,
  },
});
