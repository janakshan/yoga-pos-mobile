import React from 'react';
import {View, ViewProps, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '@hooks/useTheme';

export interface ContainerProps extends ViewProps {
  padding?: boolean;
  fullWidth?: boolean;
  centered?: boolean;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  padding = true,
  fullWidth = false,
  centered = false,
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme();

  const containerStyle = StyleSheet.flatten([
    styles.container,
    {
      paddingHorizontal: padding ? theme.layout.containerPadding : 0,
      maxWidth: fullWidth ? '100%' : theme.layout.maxWidth,
    },
    centered && styles.centered,
    style,
  ]);

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
