module.exports = {
  name: 'Yoga POS',
  slug: 'yoga-pos-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yogapos.mobile',
    infoPlist: {
      NSCameraUsageDescription:
        'This app requires access to the camera for scanning QR codes and taking photos.',
      NSPhotoLibraryUsageDescription:
        'This app requires access to the photo library to select images.',
      NSMicrophoneUsageDescription:
        'This app may require access to the microphone.',
      NSBluetoothAlwaysUsageDescription:
        'This app requires Bluetooth to connect to printers and other devices.',
      NSBluetoothPeripheralUsageDescription:
        'This app requires Bluetooth to connect to printers and other devices.',
      NSLocationWhenInUseUsageDescription:
        'This app may require location access for certain features.',
      NSFaceIDUsageDescription:
        'This app uses Face ID for secure authentication.',
    },
  },
  android: {
    package: 'com.yogapos.mobile',
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'BLUETOOTH',
      'BLUETOOTH_ADMIN',
      'BLUETOOTH_CONNECT',
      'BLUETOOTH_SCAN',
      'ACCESS_FINE_LOCATION',
      'RECORD_AUDIO',
      'USE_BIOMETRIC',
      'USE_FINGERPRINT',
    ],
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          minSdkVersion: 23,
        },
        ios: {
          deploymentTarget: '15.1',
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
  },
};
