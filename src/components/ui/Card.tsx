import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from './Typography';

type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  onPress,
  title,
  subtitle,
  header,
  footer,
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme();

  const getVariantStyle = (): ViewStyle => {
    const {colors, shadows} = theme;

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.background.card,
          ...shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: colors.background.card,
          borderWidth: 1,
          borderColor: colors.border.light,
        };
      case 'filled':
        return {
          backgroundColor: colors.background.secondary,
        };
      default:
        return {
          backgroundColor: colors.background.card,
          ...shadows.md,
        };
    }
  };

  const getPaddingStyle = (): ViewStyle => {
    const {spacing} = theme;

    switch (padding) {
      case 'none':
        return {padding: 0};
      case 'sm':
        return {padding: spacing.sm};
      case 'md':
        return {padding: spacing.md};
      case 'lg':
        return {padding: spacing.lg};
      default:
        return {padding: spacing.md};
    }
  };

  const cardStyle = StyleSheet.flatten([
    styles.card,
    getVariantStyle(),
    {
      borderRadius: theme.borderRadius.md,
    },
    style,
  ]);

  const contentStyle = StyleSheet.flatten([styles.content, getPaddingStyle()]);

  const renderHeader = () => {
    if (header) return header;

    if (title || subtitle) {
      return (
        <View style={styles.titleContainer}>
          {title && (
            <Typography variant="h5" color={theme.colors.text.primary}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
      );
    }

    return null;
  };

  const content = (
    <View style={cardStyle} {...props}>
      {renderHeader()}
      <View style={contentStyle}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    width: '100%',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
});
