import {ViewStyle, TextStyle, ImageStyle} from 'react-native';

/**
 * Conditionally apply styles based on a boolean condition
 * @param condition - The condition to check
 * @param trueStyle - Style to apply if condition is true
 * @param falseStyle - Style to apply if condition is false
 */
export const conditionalStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  condition: boolean,
  trueStyle: T,
  falseStyle?: T,
): T | undefined => {
  return condition ? trueStyle : falseStyle;
};

/**
 * Create a style object with only defined values
 * Useful for avoiding undefined style properties
 */
export const createStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  style: Partial<T>,
): Partial<T> => {
  return Object.entries(style).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

/**
 * Merge multiple styles, filtering out undefined values
 */
export const mergeStyles = <T extends ViewStyle | TextStyle | ImageStyle>(
  ...styles: (T | undefined | false | null)[]
): T => {
  return styles.reduce((acc, style) => {
    if (style) {
      return {...acc, ...style};
    }
    return acc;
  }, {} as T);
};

/**
 * Create responsive padding based on device size
 */
export const getResponsivePadding = (
  baseSize: number,
  multiplier: {phone: number; tablet: number; desktop: number},
  deviceType: 'phone' | 'tablet' | 'desktop',
): number => {
  return baseSize * multiplier[deviceType];
};

/**
 * Create responsive font size based on device size
 */
export const getResponsiveFontSize = (
  baseSize: number,
  deviceType: 'phone' | 'tablet' | 'desktop',
): number => {
  const multipliers = {
    phone: 1,
    tablet: 1.15,
    desktop: 1.25,
  };
  return baseSize * multipliers[deviceType];
};

/**
 * Apply opacity to a hex color
 * @param color - Hex color string
 * @param opacity - Opacity value between 0 and 1
 */
export const hexToRgba = (color: string, opacity: number = 1): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Scale a value based on screen width
 * Useful for creating responsive dimensions
 */
export const scaleSize = (size: number, screenWidth: number): number => {
  const baseWidth = 375; // iPhone SE width as base
  return (screenWidth / baseWidth) * size;
};

/**
 * Create spacing array for consistent margins/paddings
 */
export const createSpacing = (
  top: number,
  right?: number,
  bottom?: number,
  left?: number,
): ViewStyle => {
  return {
    paddingTop: top,
    paddingRight: right ?? top,
    paddingBottom: bottom ?? top,
    paddingLeft: left ?? right ?? top,
  };
};

/**
 * Create margin array for consistent margins
 */
export const createMargin = (
  top: number,
  right?: number,
  bottom?: number,
  left?: number,
): ViewStyle => {
  return {
    marginTop: top,
    marginRight: right ?? top,
    marginBottom: bottom ?? top,
    marginLeft: left ?? right ?? top,
  };
};

/**
 * Interpolate between two values based on a progress value (0-1)
 */
export const interpolate = (
  progress: number,
  inputRange: [number, number],
  outputRange: [number, number],
): number => {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  const clampedProgress = Math.max(
    inputMin,
    Math.min(inputMax, progress),
  );
  const ratio = (clampedProgress - inputMin) / (inputMax - inputMin);

  return outputMin + ratio * (outputMax - outputMin);
};
