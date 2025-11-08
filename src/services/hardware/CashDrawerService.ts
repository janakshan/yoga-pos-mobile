/**
 * Cash Drawer Service
 * Handles cash drawer operations via printer, serial, or USB connection
 */

import {BluetoothService} from './BluetoothService';
import {PrinterService} from './PrinterService';
import {DeviceStatus} from './types';
import {HardwareSettings} from '@/types/settings.types';

class CashDrawerServiceClass {
  private currentStatus: DeviceStatus = DeviceStatus.DISCONNECTED;
  private connectedDeviceId: string | null = null;
  private settings: HardwareSettings['cashDrawer'] | null = null;

  // ESC/POS command to open cash drawer
  private readonly OPEN_DRAWER_COMMAND = '\x1B\x70\x00';

  /**
   * Initialize cash drawer with settings
   */
  async initialize(settings: HardwareSettings['cashDrawer']): Promise<boolean> {
    this.settings = settings;

    if (!settings.enabled) {
      return false;
    }

    try {
      switch (settings.connectionType) {
        case 'printer':
          return await this.initializeViaPrinter();
        case 'serial':
          return await this.initializeSerial();
        case 'usb':
          return await this.initializeUSB();
        default:
          return false;
      }
    } catch (error) {
      console.error('Error initializing cash drawer:', error);
      this.currentStatus = DeviceStatus.ERROR;
      return false;
    }
  }

  /**
   * Initialize via printer connection
   */
  private async initializeViaPrinter(): Promise<boolean> {
    // Cash drawer is connected through the printer
    // Check if printer is ready
    if (PrinterService.isReady()) {
      this.currentStatus = DeviceStatus.CONNECTED;
      return true;
    } else {
      console.log('Printer not ready, cash drawer will be available when printer connects');
      this.currentStatus = DeviceStatus.DISCONNECTED;
      return false;
    }
  }

  /**
   * Initialize Serial connection
   */
  private async initializeSerial(): Promise<boolean> {
    // Serial cash drawer initialization
    console.log('Serial cash drawer initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Initialize USB connection
   */
  private async initializeUSB(): Promise<boolean> {
    // USB cash drawer initialization
    console.log('USB cash drawer initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Open cash drawer
   */
  async openDrawer(): Promise<boolean> {
    if (!this.settings?.enabled) {
      console.error('Cash drawer not enabled');
      return false;
    }

    try {
      switch (this.settings.connectionType) {
        case 'printer':
          return await this.openViaPrinter();
        case 'serial':
          return await this.openViaSerial();
        case 'usb':
          return await this.openViaUSB();
        default:
          return false;
      }
    } catch (error) {
      console.error('Error opening cash drawer:', error);
      return false;
    }
  }

  /**
   * Open drawer via printer
   */
  private async openViaPrinter(): Promise<boolean> {
    if (!PrinterService.isReady()) {
      console.error('Printer not connected');
      return false;
    }

    // Use printer service to open drawer
    return await PrinterService.openCashDrawer();
  }

  /**
   * Open drawer via Serial
   */
  private async openViaSerial(): Promise<boolean> {
    // Generate pulse command with configured pulse width
    const pulseCommand = this.generatePulseCommand();

    console.log('Serial drawer open not yet implemented');
    return true;
  }

  /**
   * Open drawer via USB
   */
  private async openViaUSB(): Promise<boolean> {
    // Generate pulse command with configured pulse width
    const pulseCommand = this.generatePulseCommand();

    console.log('USB drawer open not yet implemented');
    return true;
  }

  /**
   * Generate pulse command based on configured pulse width
   */
  private generatePulseCommand(): string {
    if (!this.settings) {
      return this.OPEN_DRAWER_COMMAND;
    }

    // ESC/POS pulse command format: ESC p m t1 t2
    // m = pin number (0 or 1)
    // t1 = ON time (in 2ms units)
    // t2 = OFF time (in 2ms units)

    const pulseWidth = this.settings.pulseWidth || 100;
    const t1 = Math.floor(pulseWidth / 2); // Convert ms to 2ms units
    const t2 = Math.floor(pulseWidth / 2);

    return `\x1B\x70\x00${String.fromCharCode(t1)}${String.fromCharCode(t2)}`;
  }

  /**
   * Test cash drawer
   */
  async testDrawer(): Promise<boolean> {
    return await this.openDrawer();
  }

  /**
   * Check if drawer should auto-open on sale
   */
  shouldAutoOpenOnSale(): boolean {
    return this.settings?.openOnSale ?? false;
  }

  /**
   * Get cash drawer status
   */
  getStatus(): DeviceStatus {
    // If connected via printer, check printer status
    if (this.settings?.connectionType === 'printer') {
      if (PrinterService.isReady()) {
        return DeviceStatus.CONNECTED;
      } else {
        return DeviceStatus.DISCONNECTED;
      }
    }

    return this.currentStatus;
  }

  /**
   * Disconnect cash drawer
   */
  async disconnect(): Promise<boolean> {
    // Cash drawer doesn't need explicit disconnection
    // It's controlled through printer or direct connection
    this.currentStatus = DeviceStatus.DISCONNECTED;
    return true;
  }

  /**
   * Check if cash drawer is ready
   */
  isReady(): boolean {
    if (this.settings?.connectionType === 'printer') {
      return PrinterService.isReady();
    }

    return this.currentStatus === DeviceStatus.CONNECTED;
  }

  /**
   * Get pulse width
   */
  getPulseWidth(): number {
    return this.settings?.pulseWidth ?? 100;
  }

  /**
   * Set pulse width
   */
  setPulseWidth(pulseWidth: number): void {
    if (this.settings) {
      this.settings.pulseWidth = pulseWidth;
    }
  }
}

export const CashDrawerService = new CashDrawerServiceClass();
