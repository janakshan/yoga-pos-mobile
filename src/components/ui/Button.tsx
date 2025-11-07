import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from './Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme();

  const isDisabled = disabled || loading;

  const getVariantStyle = (): ViewStyle => {
    const {colors} = theme;

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled
            ? colors.primary[300]
            : colors.primary[500],
          borderColor: colors.transparent,
        };
      case 'secondary':
        return {
          backgroundColor: isDisabled
            ? colors.secondary[300]
            : colors.secondary[500],
          borderColor: colors.transparent,
        };
      case 'outline':
        return {
          backgroundColor: colors.transparent,
          borderColor: isDisabled ? colors.border.light : colors.primary[500],
        };
      case 'ghost':
        return {
          backgroundColor: colors.transparent,
          borderColor: colors.transparent,
        };
      case 'danger':
        return {
          backgroundColor: isDisabled ? colors.error : colors.error,
          borderColor: colors.transparent,
        };
      default:
        return {
          backgroundColor: colors.primary[500],
          borderColor: colors.transparent,
        };
    }
  };

  const getTextColor = (): string => {
    const {colors} = theme;

    if (isDisabled) {
      return variant === 'outline' || variant === 'ghost'
        ? colors.text.tertiary
        : colors.white;
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return colors.white;
      case 'outline':
      case 'ghost':
        return colors.primary[500];
      default:
        return colors.white;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    const {button} = theme;
    return {
      height: button.height[size],
      paddingHorizontal: button.paddingHorizontal[size],
    };
  };

  const buttonStyle = StyleSheet.flatten([
    styles.button,
    getVariantStyle(),
    getSizeStyle(),
    {
      borderWidth: theme.button.borderWidth,
      borderRadius: theme.borderRadius.base,
      opacity: isDisabled ? 0.6 : 1,
    },
    fullWidth && styles.fullWidth,
    style,
  ]);

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Typography
            variant="button"
            color={textColor}
            style={styles.buttonText}>
            {children}
          </Typography>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
