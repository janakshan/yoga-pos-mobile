/**
 * Device Status Indicator
 * Shows the connection status of a hardware device
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DeviceStatus} from '@/services/hardware';

interface DeviceStatusIndicatorProps {
  deviceName: string;
  status: DeviceStatus;
  compact?: boolean;
}

export const DeviceStatusIndicator: React.FC<DeviceStatusIndicatorProps> = ({
  deviceName,
  status,
  compact = false,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case DeviceStatus.CONNECTED:
        return '#10B981'; // Green
      case DeviceStatus.CONNECTING:
        return '#F59E0B'; // Yellow
      case DeviceStatus.ERROR:
        return '#EF4444'; // Red
      case DeviceStatus.DISCONNECTED:
      default:
        return '#6B7280'; // Gray
    }
  };

  const getStatusText = () => {
    switch (status) {
      case DeviceStatus.CONNECTED:
        return 'Connected';
      case DeviceStatus.CONNECTING:
        return 'Connecting...';
      case DeviceStatus.ERROR:
        return 'Error';
      case DeviceStatus.DISCONNECTED:
      default:
        return 'Disconnected';
    }
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactIndicator, {backgroundColor: getStatusColor()}]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.indicator, {backgroundColor: getStatusColor()}]} />
        <View style={styles.textContainer}>
          <Text style={styles.deviceName}>{deviceName}</Text>
          <Text style={[styles.statusText, {color: getStatusColor()}]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  compactContainer: {
    padding: 4,
  },
  compactIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
