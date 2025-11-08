/**
 * Bluetooth Service
 * Handles Bluetooth device discovery, pairing, and connection management
 */

import BleManager, {Peripheral} from 'react-native-ble-manager';
import {NativeModules, NativeEventEmitter, Platform, PermissionsAndroid} from 'react-native';
import {BluetoothDevice, DeviceConnectionResult, DeviceStatus} from './types';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class BluetoothServiceClass {
  private isInitialized = false;
  private discoveredDevices: Map<string, BluetoothDevice> = new Map();
  private connectedDevices: Set<string> = new Set();
  private listeners: any[] = [];

  /**
   * Initialize Bluetooth service
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Request permissions on Android
      if (Platform.OS === 'android') {
        const granted = await this.requestBluetoothPermissions();
        if (!granted) {
          console.error('Bluetooth permissions not granted');
          return false;
        }
      }

      // Start BLE Manager
      await BleManager.start({showAlert: false});
      this.isInitialized = true;

      // Setup event listeners
      this.setupListeners();

      console.log('Bluetooth service initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Bluetooth service:', error);
      return false;
    }
  }

  /**
   * Request Bluetooth permissions (Android)
   */
  private async requestBluetoothPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_ADMIN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      }
    } catch (error) {
      console.error('Error requesting Bluetooth permissions:', error);
      return false;
    }
  }

  /**
   * Setup event listeners
   */
  private setupListeners(): void {
    // Cleanup existing listeners
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];

    // Discover peripheral
    this.listeners.push(
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (peripheral: Peripheral) => {
        this.handleDiscoverPeripheral(peripheral);
      })
    );

    // Stop scan
    this.listeners.push(
      bleManagerEmitter.addListener('BleManagerStopScan', () => {
        console.log('Bluetooth scan stopped');
      })
    );

    // Device disconnected
    this.listeners.push(
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', (data: any) => {
        console.log('Device disconnected:', data);
        this.connectedDevices.delete(data.peripheral);
      })
    );

    // Device connected
    this.listeners.push(
      bleManagerEmitter.addListener('BleManagerConnectPeripheral', (data: any) => {
        console.log('Device connected:', data);
        this.connectedDevices.add(data.peripheral);
      })
    );
  }

  /**
   * Handle discovered peripheral
   */
  private handleDiscoverPeripheral(peripheral: Peripheral): void {
    if (peripheral.name) {
      const device: BluetoothDevice = {
        id: peripheral.id,
        name: peripheral.name,
        address: peripheral.id,
        rssi: peripheral.rssi,
        connected: false,
      };

      this.discoveredDevices.set(peripheral.id, device);
    }
  }

  /**
   * Scan for Bluetooth devices
   */
  async scanForDevices(duration: number = 10): Promise<BluetoothDevice[]> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        return [];
      }
    }

    try {
      // Clear previous devices
      this.discoveredDevices.clear();

      // Start scanning
      await BleManager.scan([], duration, false);

      // Wait for scan to complete
      await new Promise(resolve => setTimeout(resolve, duration * 1000));

      // Return discovered devices
      return Array.from(this.discoveredDevices.values());
    } catch (error) {
      console.error('Error scanning for devices:', error);
      return [];
    }
  }

  /**
   * Stop scanning for devices
   */
  async stopScan(): Promise<void> {
    try {
      await BleManager.stopScan();
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  }

  /**
   * Connect to a Bluetooth device
   */
  async connect(deviceId: string): Promise<DeviceConnectionResult> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          message: 'Bluetooth service not initialized',
        };
      }
    }

    try {
      // Connect to peripheral
      await BleManager.connect(deviceId);

      // Retrieve services
      await BleManager.retrieveServices(deviceId);

      this.connectedDevices.add(deviceId);

      const device = this.discoveredDevices.get(deviceId);

      return {
        success: true,
        message: 'Connected successfully',
        device: device ? {...device, connected: true} : undefined,
      };
    } catch (error) {
      console.error('Error connecting to device:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect',
      };
    }
  }

  /**
   * Disconnect from a Bluetooth device
   */
  async disconnect(deviceId: string): Promise<boolean> {
    try {
      await BleManager.disconnect(deviceId);
      this.connectedDevices.delete(deviceId);
      return true;
    } catch (error) {
      console.error('Error disconnecting from device:', error);
      return false;
    }
  }

  /**
   * Check if device is connected
   */
  async isConnected(deviceId: string): Promise<boolean> {
    try {
      const connected = await BleManager.isPeripheralConnected(deviceId, []);
      return connected;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get connected devices
   */
  getConnectedDevices(): string[] {
    return Array.from(this.connectedDevices);
  }

  /**
   * Write data to a Bluetooth device
   */
  async writeData(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    data: number[]
  ): Promise<boolean> {
    try {
      await BleManager.write(deviceId, serviceUUID, characteristicUUID, data);
      return true;
    } catch (error) {
      console.error('Error writing data to device:', error);
      return false;
    }
  }

  /**
   * Read data from a Bluetooth device
   */
  async readData(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string
  ): Promise<number[] | null> {
    try {
      const data = await BleManager.read(deviceId, serviceUUID, characteristicUUID);
      return data;
    } catch (error) {
      console.error('Error reading data from device:', error);
      return null;
    }
  }

  /**
   * Get paired devices
   */
  async getPairedDevices(): Promise<BluetoothDevice[]> {
    try {
      const peripherals = await BleManager.getBondedPeripherals();
      return peripherals.map(peripheral => ({
        id: peripheral.id,
        name: peripheral.name || 'Unknown',
        address: peripheral.id,
        connected: this.connectedDevices.has(peripheral.id),
      }));
    } catch (error) {
      console.error('Error getting paired devices:', error);
      return [];
    }
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
    this.discoveredDevices.clear();
    this.connectedDevices.clear();
  }
}

export const BluetoothService = new BluetoothServiceClass();
