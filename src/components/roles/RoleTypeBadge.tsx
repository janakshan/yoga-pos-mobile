import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';

interface RoleTypeBadgeProps {
  isSystemRole: boolean;
  isCustom: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleTypeBadge: React.FC<RoleTypeBadgeProps> = ({
  isSystemRole,
  isCustom,
  size = 'md',
}) => {
  const {theme} = useTheme();

  const getBadgeColor = () => {
    if (isSystemRole) {
      return {
        bg: theme.colors.info[100],
        text: theme.colors.info[700],
      };
    }
    if (isCustom) {
      return {
        bg: theme.colors.primary[100],
        text: theme.colors.primary[700],
      };
    }
    return {
      bg: theme.colors.text.disabled + '30',
      text: theme.colors.text.secondary,
    };
  };

  const getBadgeText = () => {
    if (isSystemRole) return 'System';
    if (isCustom) return 'Custom';
    return 'Default';
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return {paddingHorizontal: 6, paddingVertical: 2};
      case 'lg':
        return {paddingHorizontal: 12, paddingVertical: 6};
      default:
        return {paddingHorizontal: 8, paddingVertical: 4};
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'sm':
        return 'caption' as const;
      case 'lg':
        return 'bodySmall' as const;
      default:
        return 'caption' as const;
    }
  };

  const colors = getBadgeColor();

  return (
    <View
      style={[
        styles.badge,
        {backgroundColor: colors.bg},
        getPadding(),
      ]}>
      <Typography
        variant={getTextVariant()}
        weight="medium"
        color={colors.text}>
        {getBadgeText()}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});
