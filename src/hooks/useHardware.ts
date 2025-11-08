/**
 * useHardware Hook
 * Custom hook for hardware management
 */

import {useEffect, useState, useCallback} from 'react';
import {HardwareManager, DeviceStatus, HardwareStatus} from '@/services/hardware';
import {useSettingsStore} from '@/store/slices/settingsSlice';

export const useHardware = () => {
  const {settings} = useSettingsStore();
  const [hardwareStatus, setHardwareStatus] = useState<HardwareStatus>({
    printer: DeviceStatus.DISCONNECTED,
    scanner: DeviceStatus.DISCONNECTED,
    cashDrawer: DeviceStatus.DISCONNECTED,
    customerDisplay: DeviceStatus.DISCONNECTED,
  });
  const [isInitializing, setIsInitializing] = useState(false);

  /**
   * Initialize hardware
   */
  const initializeHardware = useCallback(async () => {
    setIsInitializing(true);
    try {
      await HardwareManager.initialize(settings.hardware);
      updateStatus();
    } catch (error) {
      console.error('Error initializing hardware:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [settings.hardware]);

  /**
   * Update hardware status
   */
  const updateStatus = useCallback(() => {
    const status = HardwareManager.getHardwareStatus();
    setHardwareStatus(status);
  }, []);

  /**
   * Initialize hardware on mount and when settings change
   */
  useEffect(() => {
    // Initialize hardware if any device is enabled
    const anyEnabled =
      settings.hardware.receiptPrinter.enabled ||
      settings.hardware.barcodeScanner.enabled ||
      settings.hardware.cashDrawer.enabled ||
      settings.hardware.customerDisplay.enabled;

    if (anyEnabled) {
      initializeHardware();
    }

    // Setup status update interval
    const interval = setInterval(updateStatus, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [settings.hardware, initializeHardware, updateStatus]);

  return {
    hardwareStatus,
    isInitializing,
    initializeHardware,
    updateStatus,
    areDevicesReady: HardwareManager.areDevicesReady(),
  };
};
