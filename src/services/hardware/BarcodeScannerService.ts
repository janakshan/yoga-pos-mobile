/**
 * Barcode Scanner Service
 * Handles barcode scanning via camera, Bluetooth, USB, or Serial
 */

import {BluetoothService} from './BluetoothService';
import {ScanResult, BarcodeFormat, DeviceStatus} from './types';
import {HardwareSettings} from '@/types/settings.types';

type ScanCallback = (result: ScanResult) => void;

class BarcodeScannerServiceClass {
  private currentStatus: DeviceStatus = DeviceStatus.DISCONNECTED;
  private connectedDeviceId: string | null = null;
  private settings: HardwareSettings['barcodeScanner'] | null = null;
  private scanCallback: ScanCallback | null = null;
  private scanBuffer: string = '';

  // Scanner Service and Characteristic UUIDs (common for barcode scanners)
  private readonly SCANNER_SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
  private readonly SCANNER_CHAR_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';

  /**
   * Initialize scanner with settings
   */
  async initialize(settings: HardwareSettings['barcodeScanner']): Promise<boolean> {
    this.settings = settings;

    if (!settings.enabled) {
      return false;
    }

    try {
      switch (settings.type) {
        case 'camera':
          return await this.initializeCamera();
        case 'bluetooth':
          return await this.initializeBluetooth();
        case 'usb':
          return await this.initializeUSB();
        case 'serial':
          return await this.initializeSerial();
        default:
          return false;
      }
    } catch (error) {
      console.error('Error initializing scanner:', error);
      this.currentStatus = DeviceStatus.ERROR;
      return false;
    }
  }

  /**
   * Initialize camera scanner
   */
  private async initializeCamera(): Promise<boolean> {
    // Camera scanning is handled by the UI component (QRCodeScanner)
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Initialize Bluetooth scanner
   */
  private async initializeBluetooth(): Promise<boolean> {
    if (!this.settings?.deviceAddress) {
      console.error('No device address configured');
      return false;
    }

    this.currentStatus = DeviceStatus.CONNECTING;

    const result = await BluetoothService.connect(this.settings.deviceAddress);

    if (result.success) {
      this.connectedDeviceId = this.settings.deviceAddress;
      this.currentStatus = DeviceStatus.CONNECTED;

      // Setup listener for scan data
      this.setupBluetoothListener();

      return true;
    } else {
      this.currentStatus = DeviceStatus.ERROR;
      return false;
    }
  }

  /**
   * Initialize USB scanner
   */
  private async initializeUSB(): Promise<boolean> {
    // USB scanner initialization
    console.log('USB scanner initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Initialize Serial scanner
   */
  private async initializeSerial(): Promise<boolean> {
    // Serial scanner initialization
    console.log('Serial scanner initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Setup Bluetooth listener for scan data
   */
  private setupBluetoothListener(): void {
    // This would typically listen for notifications from the scanner
    // and call the scan callback when data is received
    console.log('Bluetooth scanner listener setup');
  }

  /**
   * Set scan callback
   */
  setScanCallback(callback: ScanCallback): void {
    this.scanCallback = callback;
  }

  /**
   * Process scanned data
   */
  private processScanData(rawData: string): ScanResult {
    let processedData = rawData;

    // Apply prefix and suffix if configured
    if (this.settings?.prefix) {
      processedData = processedData.replace(this.settings.prefix, '');
    }

    if (this.settings?.suffix) {
      processedData = processedData.replace(this.settings.suffix, '');
    }

    // Detect barcode format (simplified)
    const format = this.detectBarcodeFormat(processedData);

    const result: ScanResult = {
      data: processedData.trim(),
      format,
      timestamp: Date.now(),
    };

    return result;
  }

  /**
   * Detect barcode format based on data
   */
  private detectBarcodeFormat(data: string): BarcodeFormat {
    const length = data.length;

    // Simple format detection based on length and content
    if (length === 12 && /^\d+$/.test(data)) {
      return BarcodeFormat.UPC_A;
    } else if (length === 8 && /^\d+$/.test(data)) {
      return BarcodeFormat.UPC_E;
    } else if (length === 13 && /^\d+$/.test(data)) {
      return BarcodeFormat.EAN_13;
    } else if (length === 8 && /^\d+$/.test(data)) {
      return BarcodeFormat.EAN_8;
    } else if (/^[A-Z0-9\-\.\$\/\+\%\s]+$/i.test(data)) {
      return BarcodeFormat.CODE_39;
    }

    return BarcodeFormat.CODE_128;
  }

  /**
   * Handle scanned barcode (called by UI or hardware)
   */
  handleScan(rawData: string): void {
    const result = this.processScanData(rawData);

    if (this.scanCallback) {
      this.scanCallback(result);
    }

    // Auto-submit if enabled
    if (this.settings?.autoSubmit) {
      // This would trigger product search or addition in the UI
      console.log('Auto-submit scan result:', result);
    }
  }

  /**
   * Start camera scanning (for camera mode)
   */
  async startCameraScanning(): Promise<boolean> {
    if (this.settings?.type !== 'camera') {
      console.error('Not in camera mode');
      return false;
    }

    // Camera scanning is handled by the UI component
    return true;
  }

  /**
   * Stop camera scanning
   */
  async stopCameraScanning(): Promise<boolean> {
    if (this.settings?.type !== 'camera') {
      return false;
    }

    // Camera scanning is handled by the UI component
    return true;
  }

  /**
   * Test scanner
   */
  async testScanner(): Promise<boolean> {
    if (this.currentStatus !== DeviceStatus.CONNECTED) {
      console.error('Scanner not connected');
      return false;
    }

    // Simulate a test scan
    const testData = '1234567890123';
    this.handleScan(testData);

    return true;
  }

  /**
   * Get scanner status
   */
  getStatus(): DeviceStatus {
    return this.currentStatus;
  }

  /**
   * Disconnect scanner
   */
  async disconnect(): Promise<boolean> {
    if (this.settings?.type === 'bluetooth' && this.connectedDeviceId) {
      await BluetoothService.disconnect(this.connectedDeviceId);
    }

    this.connectedDeviceId = null;
    this.currentStatus = DeviceStatus.DISCONNECTED;
    this.scanCallback = null;
    return true;
  }

  /**
   * Check if scanner is ready
   */
  isReady(): boolean {
    return this.currentStatus === DeviceStatus.CONNECTED;
  }

  /**
   * Get supported formats
   */
  getSupportedFormats(): BarcodeFormat[] {
    return [
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_128,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.PDF_417,
    ];
  }
}

export const BarcodeScannerService = new BarcodeScannerServiceClass();
