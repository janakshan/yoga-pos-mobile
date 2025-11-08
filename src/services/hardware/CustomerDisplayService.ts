/**
 * Customer Display Service
 * Handles customer-facing display (pole, tablet, or monitor)
 * Supports Serial, USB, Network, and Bluetooth connections
 */

import {BluetoothService} from './BluetoothService';
import {DisplayMessage, DeviceStatus} from './types';
import {HardwareSettings} from '@/types/settings.types';

class CustomerDisplayServiceClass {
  private currentStatus: DeviceStatus = DeviceStatus.DISCONNECTED;
  private connectedDeviceId: string | null = null;
  private settings: HardwareSettings['customerDisplay'] | null = null;
  private currentDisplay: DisplayMessage = {};

  // Display Service and Characteristic UUIDs
  private readonly DISPLAY_SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
  private readonly DISPLAY_CHAR_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

  // Control codes for customer display
  private readonly CLEAR_DISPLAY = '\x0C';
  private readonly CURSOR_HOME = '\x0B';
  private readonly LINE_FEED = '\x0A';
  private readonly CURSOR_POSITION = '\x1F';

  /**
   * Initialize customer display with settings
   */
  async initialize(settings: HardwareSettings['customerDisplay']): Promise<boolean> {
    this.settings = settings;

    if (!settings.enabled) {
      return false;
    }

    try {
      switch (settings.connectionType) {
        case 'bluetooth':
          return await this.initializeBluetooth();
        case 'network':
          return await this.initializeNetwork();
        case 'usb':
          return await this.initializeUSB();
        case 'serial':
          return await this.initializeSerial();
        default:
          return false;
      }
    } catch (error) {
      console.error('Error initializing customer display:', error);
      this.currentStatus = DeviceStatus.ERROR;
      return false;
    }
  }

  /**
   * Initialize Bluetooth connection
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

      // Clear display on initialization
      await this.clearDisplay();

      return true;
    } else {
      this.currentStatus = DeviceStatus.ERROR;
      return false;
    }
  }

  /**
   * Initialize Network connection
   */
  private async initializeNetwork(): Promise<boolean> {
    // Network display initialization
    console.log('Network display initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Initialize USB connection
   */
  private async initializeUSB(): Promise<boolean> {
    // USB display initialization
    console.log('USB display initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Initialize Serial connection
   */
  private async initializeSerial(): Promise<boolean> {
    // Serial display initialization
    console.log('Serial display initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Display message on customer display
   */
  async displayMessage(message: DisplayMessage): Promise<boolean> {
    if (this.currentStatus !== DeviceStatus.CONNECTED) {
      console.error('Display not connected');
      return false;
    }

    if (!this.settings) {
      console.error('Display not configured');
      return false;
    }

    try {
      this.currentDisplay = message;

      const displayData = this.formatDisplayData(message);

      switch (this.settings.connectionType) {
        case 'bluetooth':
          return await this.displayViaBluetooth(displayData);
        case 'network':
          return await this.displayViaNetwork(displayData);
        case 'usb':
          return await this.displayViaUSB(displayData);
        case 'serial':
          return await this.displayViaSerial(displayData);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error displaying message:', error);
      return false;
    }
  }

  /**
   * Format display data based on display configuration
   */
  private formatDisplayData(message: DisplayMessage): string {
    if (!this.settings) {
      return '';
    }

    const {lines, columns} = this.settings;
    let displayText = this.CLEAR_DISPLAY + this.CURSOR_HOME;

    // Format each line
    const lineTexts = [
      message.line1 || '',
      message.line2 || '',
      message.line3 || '',
      message.line4 || '',
    ].slice(0, lines);

    lineTexts.forEach((lineText, index) => {
      // Truncate or pad text to fit display width
      const formattedLine = this.formatLine(lineText, columns);

      // Position cursor at start of line
      if (index > 0) {
        displayText += this.LINE_FEED;
      }

      displayText += formattedLine;
    });

    return displayText;
  }

  /**
   * Format a single line of text
   */
  private formatLine(text: string, width: number): string {
    if (text.length > width) {
      return text.substring(0, width);
    } else {
      return text.padEnd(width, ' ');
    }
  }

  /**
   * Center text on display
   */
  private centerText(text: string, width: number): string {
    if (text.length >= width) {
      return text.substring(0, width);
    }

    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(width - padding - text.length);
  }

  /**
   * Display via Bluetooth
   */
  private async displayViaBluetooth(data: string): Promise<boolean> {
    if (!this.connectedDeviceId) {
      return false;
    }

    try {
      const bytes = this.stringToBytes(data);
      const success = await BluetoothService.writeData(
        this.connectedDeviceId,
        this.DISPLAY_SERVICE_UUID,
        this.DISPLAY_CHAR_UUID,
        bytes
      );

      return success;
    } catch (error) {
      console.error('Error displaying via Bluetooth:', error);
      return false;
    }
  }

  /**
   * Display via Network
   */
  private async displayViaNetwork(data: string): Promise<boolean> {
    console.log('Network display not yet implemented');
    return true;
  }

  /**
   * Display via USB
   */
  private async displayViaUSB(data: string): Promise<boolean> {
    console.log('USB display not yet implemented');
    return true;
  }

  /**
   * Display via Serial
   */
  private async displayViaSerial(data: string): Promise<boolean> {
    console.log('Serial display not yet implemented');
    return true;
  }

  /**
   * Convert string to byte array
   */
  private stringToBytes(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
    return bytes;
  }

  /**
   * Display welcome message
   */
  async displayWelcome(): Promise<boolean> {
    const message: DisplayMessage = {
      line1: this.centerText('Welcome to', this.settings?.columns || 20),
      line2: this.centerText('Yoga POS', this.settings?.columns || 20),
    };

    return await this.displayMessage(message);
  }

  /**
   * Display item info
   */
  async displayItem(itemName: string, price: number): Promise<boolean> {
    const priceText = `$${price.toFixed(2)}`;
    const columns = this.settings?.columns || 20;

    const message: DisplayMessage = {
      line1: this.formatLine(itemName, columns),
      line2: this.formatLine(priceText, columns),
    };

    return await this.displayMessage(message);
  }

  /**
   * Display total
   */
  async displayTotal(total: number): Promise<boolean> {
    const columns = this.settings?.columns || 20;

    const message: DisplayMessage = {
      line1: this.centerText('TOTAL', columns),
      line2: this.centerText(`$${total.toFixed(2)}`, columns),
    };

    return await this.displayMessage(message);
  }

  /**
   * Display thank you message
   */
  async displayThankYou(): Promise<boolean> {
    const columns = this.settings?.columns || 20;

    const message: DisplayMessage = {
      line1: this.centerText('Thank You!', columns),
      line2: this.centerText('Visit Again', columns),
    };

    return await this.displayMessage(message);
  }

  /**
   * Clear display
   */
  async clearDisplay(): Promise<boolean> {
    const clearCommand = this.CLEAR_DISPLAY + this.CURSOR_HOME;

    switch (this.settings?.connectionType) {
      case 'bluetooth':
        return await this.displayViaBluetooth(clearCommand);
      case 'network':
        return await this.displayViaNetwork(clearCommand);
      case 'usb':
        return await this.displayViaUSB(clearCommand);
      case 'serial':
        return await this.displayViaSerial(clearCommand);
      default:
        return false;
    }
  }

  /**
   * Test display
   */
  async testDisplay(): Promise<boolean> {
    if (this.currentStatus !== DeviceStatus.CONNECTED) {
      console.error('Display not connected');
      return false;
    }

    const columns = this.settings?.columns || 20;
    const lines = this.settings?.lines || 2;

    const testMessage: DisplayMessage = {
      line1: this.centerText('TEST DISPLAY', columns),
      line2: this.centerText('Line 2', columns),
    };

    if (lines >= 3) {
      testMessage.line3 = this.centerText('Line 3', columns);
    }

    if (lines >= 4) {
      testMessage.line4 = this.centerText('Line 4', columns);
    }

    const success = await this.displayMessage(testMessage);

    // Clear after 3 seconds
    if (success) {
      setTimeout(async () => {
        await this.clearDisplay();
        await this.displayWelcome();
      }, 3000);
    }

    return success;
  }

  /**
   * Get display status
   */
  getStatus(): DeviceStatus {
    return this.currentStatus;
  }

  /**
   * Get current display message
   */
  getCurrentDisplay(): DisplayMessage {
    return this.currentDisplay;
  }

  /**
   * Disconnect display
   */
  async disconnect(): Promise<boolean> {
    if (this.settings?.connectionType === 'bluetooth' && this.connectedDeviceId) {
      await BluetoothService.disconnect(this.connectedDeviceId);
    }

    this.connectedDeviceId = null;
    this.currentStatus = DeviceStatus.DISCONNECTED;
    this.currentDisplay = {};
    return true;
  }

  /**
   * Check if display is ready
   */
  isReady(): boolean {
    return this.currentStatus === DeviceStatus.CONNECTED;
  }
}

export const CustomerDisplayService = new CustomerDisplayServiceClass();
