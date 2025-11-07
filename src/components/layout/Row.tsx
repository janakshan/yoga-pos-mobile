import React from 'react';
import {View, ViewProps, StyleSheet, ViewStyle} from 'react-native';

type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

type Gap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface RowProps extends ViewProps {
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  gap?: Gap;
  wrap?: boolean;
  children?: React.ReactNode;
}

const gapValues: Record<Gap, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const Row: React.FC<RowProps> = ({
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  gap,
  wrap = false,
  style,
  children,
  ...props
}) => {
  const rowStyle = StyleSheet.flatten([
    styles.row,
    {
      justifyContent,
      alignItems,
      gap: gap ? gapValues[gap] : undefined,
      flexWrap: wrap ? 'wrap' : 'nowrap',
    },
    style,
  ]);

  return (
    <View style={rowStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
