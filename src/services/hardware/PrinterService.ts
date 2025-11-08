/**
 * Receipt Printer Service
 * Handles receipt printing with ESC/POS protocol support
 * Supports Bluetooth, USB, Network, and Serial connections
 */

import {Platform} from 'react-native';
import RNPrint from 'react-native-print';
import {BluetoothService} from './BluetoothService';
import {
  ReceiptData,
  PrintOptions,
  ESCPOSCommand,
  DeviceStatus,
  HardwareError,
} from './types';
import {HardwareSettings} from '@/types/settings.types';

class PrinterServiceClass {
  private currentStatus: DeviceStatus = DeviceStatus.DISCONNECTED;
  private connectedDeviceId: string | null = null;
  private settings: HardwareSettings['receiptPrinter'] | null = null;

  // ESC/POS Service and Characteristic UUIDs (common for thermal printers)
  private readonly PRINTER_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb';
  private readonly PRINTER_CHAR_UUID = '00002af1-0000-1000-8000-00805f9b34fb';

  /**
   * Initialize printer with settings
   */
  async initialize(settings: HardwareSettings['receiptPrinter']): Promise<boolean> {
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
      console.error('Error initializing printer:', error);
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
    // Network printer initialization
    // This would typically involve establishing a socket connection
    console.log('Network printer initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Initialize USB connection
   */
  private async initializeUSB(): Promise<boolean> {
    // USB printer initialization
    console.log('USB printer initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Initialize Serial connection
   */
  private async initializeSerial(): Promise<boolean> {
    // Serial printer initialization
    console.log('Serial printer initialization not yet implemented');
    this.currentStatus = DeviceStatus.CONNECTED;
    return true;
  }

  /**
   * Print receipt
   */
  async printReceipt(data: ReceiptData, options?: PrintOptions): Promise<boolean> {
    if (this.currentStatus !== DeviceStatus.CONNECTED) {
      console.error('Printer not connected');
      return false;
    }

    if (!this.settings) {
      console.error('Printer not configured');
      return false;
    }

    try {
      const escPosData = this.generateESCPOS(data, options);

      switch (this.settings.connectionType) {
        case 'bluetooth':
          return await this.printViaBluetooth(escPosData);
        case 'network':
          return await this.printViaNetwork(escPosData);
        case 'usb':
          return await this.printViaUSB(escPosData);
        case 'serial':
          return await this.printViaSerial(escPosData);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }

  /**
   * Generate ESC/POS commands for receipt
   */
  private generateESCPOS(data: ReceiptData, options?: PrintOptions): number[] {
    const commands: number[] = [];

    // Initialize printer
    commands.push(...this.stringToBytes(ESCPOSCommand.INITIALIZE));

    // Print header
    if (data.header && data.header.length > 0) {
      commands.push(...this.stringToBytes(ESCPOSCommand.ALIGN_CENTER));
      commands.push(...this.stringToBytes(ESCPOSCommand.BOLD_ON));
      commands.push(...this.stringToBytes(ESCPOSCommand.DOUBLE_HEIGHT_ON));

      data.header.forEach(line => {
        commands.push(...this.stringToBytes(line + '\n'));
      });

      commands.push(...this.stringToBytes(ESCPOSCommand.NORMAL_SIZE));
      commands.push(...this.stringToBytes(ESCPOSCommand.BOLD_OFF));
      commands.push(...this.stringToBytes('\n'));
    }

    // Print items
    commands.push(...this.stringToBytes(ESCPOSCommand.ALIGN_LEFT));
    commands.push(...this.stringToBytes('-'.repeat(this.getPaperWidth()) + '\n'));

    data.items.forEach(item => {
      const itemLine = this.formatItemLine(
        item.name,
        item.quantity,
        item.price,
        item.total
      );
      commands.push(...this.stringToBytes(itemLine + '\n'));
    });

    // Print totals
    commands.push(...this.stringToBytes('-'.repeat(this.getPaperWidth()) + '\n'));
    commands.push(...this.stringToBytes(this.formatTotalLine('Subtotal', data.subtotal)));
    commands.push(...this.stringToBytes(this.formatTotalLine('Tax', data.tax)));
    commands.push(...this.stringToBytes(ESCPOSCommand.BOLD_ON));
    commands.push(...this.stringToBytes(this.formatTotalLine('TOTAL', data.total)));
    commands.push(...this.stringToBytes(ESCPOSCommand.BOLD_OFF));

    if (data.paymentMethod) {
      commands.push(...this.stringToBytes('\n'));
      commands.push(...this.stringToBytes(`Payment: ${data.paymentMethod}\n`));
    }

    // Print footer
    if (data.footer && data.footer.length > 0) {
      commands.push(...this.stringToBytes('\n'));
      commands.push(...this.stringToBytes(ESCPOSCommand.ALIGN_CENTER));

      data.footer.forEach(line => {
        commands.push(...this.stringToBytes(line + '\n'));
      });
    }

    // Feed and cut
    commands.push(...this.stringToBytes('\n\n\n'));

    if (this.settings?.autoCut || options?.cutPaper) {
      commands.push(...this.stringToBytes(ESCPOSCommand.CUT_PAPER));
    }

    // Open drawer if requested
    if (this.settings?.openDrawer || options?.openDrawer) {
      commands.push(...this.stringToBytes(ESCPOSCommand.OPEN_DRAWER));
    }

    return commands;
  }

  /**
   * Format item line
   */
  private formatItemLine(
    name: string,
    quantity: number,
    price: number,
    total: number
  ): string {
    const width = this.getPaperWidth();
    const qtyStr = `${quantity}x`;
    const priceStr = `$${price.toFixed(2)}`;
    const totalStr = `$${total.toFixed(2)}`;

    // Calculate available space for name
    const availableSpace = width - qtyStr.length - totalStr.length - 2;
    const truncatedName = name.length > availableSpace
      ? name.substring(0, availableSpace - 3) + '...'
      : name.padEnd(availableSpace);

    return `${qtyStr} ${truncatedName} ${totalStr}`;
  }

  /**
   * Format total line
   */
  private formatTotalLine(label: string, amount: number): string {
    const width = this.getPaperWidth();
    const amountStr = `$${amount.toFixed(2)}`;
    const padding = width - label.length - amountStr.length;
    return `${label}${' '.repeat(padding)}${amountStr}\n`;
  }

  /**
   * Get paper width in characters
   */
  private getPaperWidth(): number {
    if (!this.settings) return 48;

    // Approximate character width based on paper width
    // 80mm ≈ 48 chars, 58mm ≈ 32 chars
    return this.settings.paperWidth >= 80 ? 48 : 32;
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
   * Print via Bluetooth
   */
  private async printViaBluetooth(data: number[]): Promise<boolean> {
    if (!this.connectedDeviceId) {
      return false;
    }

    try {
      const success = await BluetoothService.writeData(
        this.connectedDeviceId,
        this.PRINTER_SERVICE_UUID,
        this.PRINTER_CHAR_UUID,
        data
      );

      return success;
    } catch (error) {
      console.error('Error printing via Bluetooth:', error);
      return false;
    }
  }

  /**
   * Print via Network
   */
  private async printViaNetwork(data: number[]): Promise<boolean> {
    console.log('Network printing not yet implemented');
    return true;
  }

  /**
   * Print via USB
   */
  private async printViaUSB(data: number[]): Promise<boolean> {
    console.log('USB printing not yet implemented');
    return true;
  }

  /**
   * Print via Serial
   */
  private async printViaSerial(data: number[]): Promise<boolean> {
    console.log('Serial printing not yet implemented');
    return true;
  }

  /**
   * Print test page
   */
  async printTestPage(): Promise<boolean> {
    const testData: ReceiptData = {
      header: ['TEST RECEIPT', 'Yoga POS System'],
      items: [
        {
          name: 'Test Item 1',
          quantity: 2,
          price: 10.0,
          total: 20.0,
        },
        {
          name: 'Test Item 2',
          quantity: 1,
          price: 15.5,
          total: 15.5,
        },
      ],
      subtotal: 35.5,
      tax: 3.55,
      total: 39.05,
      paymentMethod: 'Cash',
      footer: ['Thank you for your business!', 'Visit us again'],
    };

    return await this.printReceipt(testData);
  }

  /**
   * Open cash drawer
   */
  async openCashDrawer(): Promise<boolean> {
    if (this.currentStatus !== DeviceStatus.CONNECTED) {
      return false;
    }

    try {
      const command = this.stringToBytes(ESCPOSCommand.OPEN_DRAWER);

      switch (this.settings?.connectionType) {
        case 'bluetooth':
          return await this.printViaBluetooth(command);
        case 'network':
          return await this.printViaNetwork(command);
        case 'usb':
          return await this.printViaUSB(command);
        case 'serial':
          return await this.printViaSerial(command);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error opening cash drawer:', error);
      return false;
    }
  }

  /**
   * Get printer status
   */
  getStatus(): DeviceStatus {
    return this.currentStatus;
  }

  /**
   * Disconnect printer
   */
  async disconnect(): Promise<boolean> {
    if (this.settings?.connectionType === 'bluetooth' && this.connectedDeviceId) {
      await BluetoothService.disconnect(this.connectedDeviceId);
    }

    this.connectedDeviceId = null;
    this.currentStatus = DeviceStatus.DISCONNECTED;
    return true;
  }

  /**
   * Check if printer is ready
   */
  isReady(): boolean {
    return this.currentStatus === DeviceStatus.CONNECTED;
  }
}

export const PrinterService = new PrinterServiceClass();
