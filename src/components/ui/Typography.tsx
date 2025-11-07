import React from 'react';
import {Text, TextProps, StyleSheet, TextStyle} from 'react-native';
import {useTheme} from '@hooks/useTheme';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'bodySmall'
  | 'bodyLarge'
  | 'caption'
  | 'label'
  | 'button';

type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  weight?: FontWeight;
  color?: string;
  align?: TextAlign;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight,
  color,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme();

  const getVariantStyle = (): TextStyle => {
    const {fontSize, lineHeight, fontFamily, fontWeight} = theme.typography;

    switch (variant) {
      case 'h1':
        return {
          fontSize: fontSize['4xl'],
          lineHeight: fontSize['4xl'] * lineHeight.tight,
          fontFamily: fontFamily.bold,
          fontWeight: fontWeight.bold,
        };
      case 'h2':
        return {
          fontSize: fontSize['3xl'],
          lineHeight: fontSize['3xl'] * lineHeight.tight,
          fontFamily: fontFamily.bold,
          fontWeight: fontWeight.bold,
        };
      case 'h3':
        return {
          fontSize: fontSize['2xl'],
          lineHeight: fontSize['2xl'] * lineHeight.tight,
          fontFamily: fontFamily.semiBold,
          fontWeight: fontWeight.semiBold,
        };
      case 'h4':
        return {
          fontSize: fontSize.xl,
          lineHeight: fontSize.xl * lineHeight.normal,
          fontFamily: fontFamily.semiBold,
          fontWeight: fontWeight.semiBold,
        };
      case 'h5':
        return {
          fontSize: fontSize.lg,
          lineHeight: fontSize.lg * lineHeight.normal,
          fontFamily: fontFamily.medium,
          fontWeight: fontWeight.medium,
        };
      case 'h6':
        return {
          fontSize: fontSize.base,
          lineHeight: fontSize.base * lineHeight.normal,
          fontFamily: fontFamily.medium,
          fontWeight: fontWeight.medium,
        };
      case 'bodyLarge':
        return {
          fontSize: fontSize.lg,
          lineHeight: fontSize.lg * lineHeight.normal,
          fontFamily: fontFamily.regular,
          fontWeight: fontWeight.regular,
        };
      case 'body':
        return {
          fontSize: fontSize.base,
          lineHeight: fontSize.base * lineHeight.normal,
          fontFamily: fontFamily.regular,
          fontWeight: fontWeight.regular,
        };
      case 'bodySmall':
        return {
          fontSize: fontSize.sm,
          lineHeight: fontSize.sm * lineHeight.normal,
          fontFamily: fontFamily.regular,
          fontWeight: fontWeight.regular,
        };
      case 'caption':
        return {
          fontSize: fontSize.xs,
          lineHeight: fontSize.xs * lineHeight.normal,
          fontFamily: fontFamily.regular,
          fontWeight: fontWeight.regular,
        };
      case 'label':
        return {
          fontSize: fontSize.sm,
          lineHeight: fontSize.sm * lineHeight.normal,
          fontFamily: fontFamily.medium,
          fontWeight: fontWeight.medium,
        };
      case 'button':
        return {
          fontSize: fontSize.base,
          lineHeight: fontSize.base * lineHeight.tight,
          fontFamily: fontFamily.semiBold,
          fontWeight: fontWeight.semiBold,
        };
      default:
        return {
          fontSize: fontSize.base,
          lineHeight: fontSize.base * lineHeight.normal,
          fontFamily: fontFamily.regular,
          fontWeight: fontWeight.regular,
        };
    }
  };

  const getWeightStyle = (): TextStyle | undefined => {
    if (!weight) return undefined;

    const {fontFamily, fontWeight} = theme.typography;
    return {
      fontFamily: fontFamily[weight],
      fontWeight: fontWeight[weight],
    };
  };

  const textColor = color || theme.colors.text.primary;

  const textStyle = StyleSheet.flatten([
    getVariantStyle(),
    getWeightStyle(),
    {
      color: textColor,
      textAlign: align,
    },
    style,
  ]);

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};
