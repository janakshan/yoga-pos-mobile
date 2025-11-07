import React from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';
import {useTheme} from '@hooks/useTheme';

type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type SpacerDirection = 'horizontal' | 'vertical';

export interface SpacerProps extends ViewProps {
  size?: SpacerSize;
  direction?: SpacerDirection;
  customSize?: number;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  customSize,
  style,
  ...props
}) => {
  const {theme} = useTheme();

  const spacing = customSize ?? theme.spacing[size];

  const spacerStyle: ViewStyle = {
    width: direction === 'horizontal' ? spacing : undefined,
    height: direction === 'vertical' ? spacing : undefined,
  };

  return <View style={[spacerStyle, style]} {...props} />;
};
