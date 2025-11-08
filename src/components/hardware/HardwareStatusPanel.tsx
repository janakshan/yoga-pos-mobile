/**
 * Hardware Status Panel
 * Shows the connection status of all hardware devices
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {DeviceStatusIndicator} from './DeviceStatusIndicator';
import {useHardware} from '@/hooks/useHardware';
import {useSettingsStore} from '@/store/slices/settingsSlice';

interface HardwareStatusPanelProps {
  onDevicePress?: (device: string) => void;
}

export const HardwareStatusPanel: React.FC<HardwareStatusPanelProps> = ({
  onDevicePress,
}) => {
  const {settings} = useSettingsStore();
  const {hardwareStatus, isInitializing, initializeHardware} = useHardware();
  const hardware = settings.hardware;

  const enabledDevices = [
    {
      name: 'Receipt Printer',
      key: 'printer',
      enabled: hardware.receiptPrinter.enabled,
      status: hardwareStatus.printer,
    },
    {
      name: 'Barcode Scanner',
      key: 'scanner',
      enabled: hardware.barcodeScanner.enabled,
      status: hardwareStatus.scanner,
    },
    {
      name: 'Cash Drawer',
      key: 'cashDrawer',
      enabled: hardware.cashDrawer.enabled,
      status: hardwareStatus.cashDrawer,
    },
    {
      name: 'Customer Display',
      key: 'customerDisplay',
      enabled: hardware.customerDisplay.enabled,
      status: hardwareStatus.customerDisplay,
    },
  ].filter(device => device.enabled);

  if (enabledDevices.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hardware Devices</Text>
        {isInitializing && (
          <Text style={styles.initializingText}>Initializing...</Text>
        )}
      </View>

      <View style={styles.devicesContainer}>
        {enabledDevices.map(device => (
          <TouchableOpacity
            key={device.key}
            onPress={() => onDevicePress?.(device.key)}
            disabled={!onDevicePress}
            activeOpacity={0.7}>
            <DeviceStatusIndicator
              deviceName={device.name}
              status={device.status}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={initializeHardware}
        disabled={isInitializing}>
        <Text style={styles.refreshButtonText}>
          {isInitializing ? 'Initializing...' : 'Refresh Connections'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  initializingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  devicesContainer: {
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
