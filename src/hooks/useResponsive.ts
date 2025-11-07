import {useState, useEffect} from 'react';
import {Dimensions, ScaledSize} from 'react-native';

export type DeviceType = 'phone' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

interface ResponsiveInfo {
  width: number;
  height: number;
  deviceType: DeviceType;
  orientation: Orientation;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  scale: number;
  fontScale: number;
}

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

const getDeviceType = (width: number): DeviceType => {
  if (width < TABLET_BREAKPOINT) {
    return 'phone';
  } else if (width < DESKTOP_BREAKPOINT) {
    return 'tablet';
  }
  return 'desktop';
};

const getOrientation = (width: number, height: number): Orientation => {
  return width > height ? 'landscape' : 'portrait';
};

const getResponsiveInfo = (dimensions: ScaledSize): ResponsiveInfo => {
  const {width, height, scale, fontScale} = dimensions;
  const deviceType = getDeviceType(width);
  const orientation = getOrientation(width, height);

  return {
    width,
    height,
    deviceType,
    orientation,
    isPhone: deviceType === 'phone',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    scale,
    fontScale,
  };
};

/**
 * Hook to get responsive information about the device
 * Updates automatically when dimensions change
 */
export const useResponsive = (): ResponsiveInfo => {
  const [responsiveInfo, setResponsiveInfo] = useState<ResponsiveInfo>(
    getResponsiveInfo(Dimensions.get('window')),
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setResponsiveInfo(getResponsiveInfo(window));
    });

    return () => subscription?.remove();
  }, []);

  return responsiveInfo;
};
