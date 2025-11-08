/**
 * Setting Switch Component
 * Setting item with a toggle switch
 */

import React from 'react';
import {Switch} from 'react-native';
import {SettingItem} from './SettingItem';
import {useTheme} from '@hooks/useTheme';

interface SettingSwitchProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  last?: boolean;
  icon?: React.ReactNode;
}

export const SettingSwitch: React.FC<SettingSwitchProps> = ({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
  last = false,
  icon,
}) => {
  const {theme} = useTheme();

  return (
    <SettingItem
      label={label}
      description={description}
      icon={icon}
      disabled={disabled}
      last={last}
      rightComponent={
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: theme.colors.background.tertiary,
            true: theme.colors.primary[500],
          }}
          thumbColor={value ? '#FFFFFF' : theme.colors.background.primary}
          ios_backgroundColor={theme.colors.background.tertiary}
        />
      }
    />
  );
};
