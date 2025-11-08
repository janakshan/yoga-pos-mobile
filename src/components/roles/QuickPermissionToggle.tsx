import React from 'react';
import {View, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import {Permission} from '@types/api.types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface QuickPermissionToggleProps {
  label: string;
  description?: string;
  icon: string;
  permission: Permission;
  isEnabled: boolean;
  onToggle: (permission: Permission, enabled: boolean) => void;
  disabled?: boolean;
}

export const QuickPermissionToggle: React.FC<QuickPermissionToggleProps> = ({
  label,
  description,
  icon,
  permission,
  isEnabled,
  onToggle,
  disabled = false,
}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isEnabled
            ? theme.colors.primary[50]
            : theme.colors.background.secondary,
          borderColor: isEnabled
            ? theme.colors.primary[200]
            : theme.colors.border.light,
        },
      ]}
      onPress={() => !disabled && onToggle(permission, !isEnabled)}
      disabled={disabled}
      activeOpacity={0.7}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isEnabled
              ? theme.colors.primary[100]
              : theme.colors.background.tertiary,
          },
        ]}>
        <Icon
          name={icon}
          size={24}
          color={
            isEnabled ? theme.colors.primary[600] : theme.colors.text.secondary
          }
        />
      </View>

      <View style={styles.textContainer}>
        <Typography
          variant="bodyMedium"
          weight="semibold"
          color={
            isEnabled ? theme.colors.primary[700] : theme.colors.text.primary
          }>
          {label}
        </Typography>
        {description && (
          <Typography
            variant="caption"
            color={theme.colors.text.secondary}
            numberOfLines={1}>
            {description}
          </Typography>
        )}
      </View>

      <Switch
        value={isEnabled}
        onValueChange={enabled => !disabled && onToggle(permission, enabled)}
        disabled={disabled}
        trackColor={{
          false: theme.colors.text.disabled,
          true: theme.colors.primary[400],
        }}
        thumbColor={isEnabled ? theme.colors.primary[600] : theme.colors.white}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
});
