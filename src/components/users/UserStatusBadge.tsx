import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type UserStatus = 'active' | 'inactive' | 'suspended';
type BadgeSize = 'sm' | 'md' | 'lg';

interface UserStatusBadgeProps {
  status: UserStatus;
  size?: BadgeSize;
  showIcon?: boolean;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const {theme} = useTheme();

  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          icon: 'check-circle',
          backgroundColor: theme.colors.success[100],
          textColor: theme.colors.success[700],
          iconColor: theme.colors.success[600],
        };
      case 'inactive':
        return {
          label: 'Inactive',
          icon: 'minus-circle',
          backgroundColor: theme.colors.text.secondary + '20',
          textColor: theme.colors.text.secondary,
          iconColor: theme.colors.text.secondary,
        };
      case 'suspended':
        return {
          label: 'Suspended',
          icon: 'alert-circle',
          backgroundColor: theme.colors.error[100],
          textColor: theme.colors.error[700],
          iconColor: theme.colors.error[600],
        };
      default:
        return {
          label: status,
          icon: 'help-circle',
          backgroundColor: theme.colors.text.tertiary + '20',
          textColor: theme.colors.text.tertiary,
          iconColor: theme.colors.text.tertiary,
        };
    }
  };

  const getSizeConfig = (size: BadgeSize) => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 6,
          paddingVertical: 2,
          iconSize: 10,
          variant: 'caption' as const,
        };
      case 'md':
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          iconSize: 12,
          variant: 'bodySmall' as const,
        };
      case 'lg':
        return {
          paddingHorizontal: 10,
          paddingVertical: 6,
          iconSize: 14,
          variant: 'bodyMedium' as const,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          iconSize: 12,
          variant: 'bodySmall' as const,
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const sizeConfig = getSizeConfig(size);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: statusConfig.backgroundColor,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          paddingVertical: sizeConfig.paddingVertical,
          borderRadius: theme.borderRadius.full,
        },
      ]}>
      {showIcon && (
        <Icon
          name={statusConfig.icon}
          size={sizeConfig.iconSize}
          color={statusConfig.iconColor}
          style={styles.icon}
        />
      )}
      <Typography
        variant={sizeConfig.variant}
        color={statusConfig.textColor}
        weight="medium">
        {statusConfig.label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
});
