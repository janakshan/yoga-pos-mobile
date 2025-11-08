/**
 * Hardware Manager
 * Coordinates all hardware devices and provides centralized hardware management
 */

import {PrinterService} from './PrinterService';
import {BarcodeScannerService} from './BarcodeScannerService';
import {CashDrawerService} from './CashDrawerService';
import {CustomerDisplayService} from './CustomerDisplayService';
import {BluetoothService} from './BluetoothService';
import {DeviceStatus, ReceiptData, ScanResult, DisplayMessage} from './types';
import {HardwareSettings} from '@/types/settings.types';

export interface HardwareStatus {
  printer: DeviceStatus;
  scanner: DeviceStatus;
  cashDrawer: DeviceStatus;
  customerDisplay: DeviceStatus;
}

class HardwareManagerClass {
  private isInitialized = false;
  private settings: HardwareSettings | null = null;

  /**
   * Initialize all hardware devices
   */
  async initialize(settings: HardwareSettings): Promise<boolean> {
    if (this.isInitialized) {
      await this.disconnect();
    }

    this.settings = settings;

    try {
      // Initialize Bluetooth service first (needed for wireless devices)
      await BluetoothService.initialize();

      // Initialize all devices in parallel
      const results = await Promise.allSettled([
        PrinterService.initialize(settings.receiptPrinter),
        BarcodeScannerService.initialize(settings.barcodeScanner),
        CashDrawerService.initialize(settings.cashDrawer),
        CustomerDisplayService.initialize(settings.customerDisplay),
      ]);

      // Log initialization results
      results.forEach((result, index) => {
        const deviceNames = ['Printer', 'Scanner', 'Cash Drawer', 'Customer Display'];
        if (result.status === 'fulfilled' && result.value) {
          console.log(`${deviceNames[index]} initialized successfully`);
        } else if (result.status === 'rejected') {
          console.error(`${deviceNames[index]} initialization failed:`, result.reason);
        }
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing hardware:', error);
      return false;
    }
  }

  /**
   * Reinitialize hardware with new settings
   */
  async reinitialize(settings: HardwareSettings): Promise<boolean> {
    await this.disconnect();
    return await this.initialize(settings);
  }

  /**
   * Get status of all hardware devices
   */
  getHardwareStatus(): HardwareStatus {
    return {
      printer: PrinterService.getStatus(),
      scanner: BarcodeScannerService.getStatus(),
      cashDrawer: CashDrawerService.getStatus(),
      customerDisplay: CustomerDisplayService.getStatus(),
    };
  }

  /**
   * Check if all enabled devices are ready
   */
  areDevicesReady(): boolean {
    const status = this.getHardwareStatus();

    const printerReady = !this.settings?.receiptPrinter.enabled || PrinterService.isReady();
    const scannerReady = !this.settings?.barcodeScanner.enabled || BarcodeScannerService.isReady();
    const drawerReady = !this.settings?.cashDrawer.enabled || CashDrawerService.isReady();
    const displayReady = !this.settings?.customerDisplay.enabled || CustomerDisplayService.isReady();

    return printerReady && scannerReady && drawerReady && displayReady;
  }

  // ===== Printer Methods =====

  /**
   * Print receipt
   */
  async printReceipt(data: ReceiptData, openDrawer: boolean = false): Promise<boolean> {
    if (!this.settings?.receiptPrinter.enabled) {
      console.log('Printer not enabled');
      return false;
    }

    const success = await PrinterService.printReceipt(data, {
      openDrawer: openDrawer || this.settings.receiptPrinter.openDrawer,
    });

    return success;
  }

  /**
   * Print test page
   */
  async printTestPage(): Promise<boolean> {
    if (!this.settings?.receiptPrinter.enabled) {
      return false;
    }

    return await PrinterService.printTestPage();
  }

  // ===== Scanner Methods =====

  /**
   * Set scan callback
   */
  setScanCallback(callback: (result: ScanResult) => void): void {
    if (!this.settings?.barcodeScanner.enabled) {
      return;
    }

    BarcodeScannerService.setScanCallback(callback);
  }

  /**
   * Handle manual scan
   */
  handleScan(data: string): void {
    if (!this.settings?.barcodeScanner.enabled) {
      return;
    }

    BarcodeScannerService.handleScan(data);
  }

  /**
   * Test scanner
   */
  async testScanner(): Promise<boolean> {
    if (!this.settings?.barcodeScanner.enabled) {
      return false;
    }

    return await BarcodeScannerService.testScanner();
  }

  // ===== Cash Drawer Methods =====

  /**
   * Open cash drawer
   */
  async openCashDrawer(): Promise<boolean> {
    if (!this.settings?.cashDrawer.enabled) {
      return false;
    }

    return await CashDrawerService.openDrawer();
  }

  /**
   * Check if drawer should auto-open on sale
   */
  shouldAutoOpenDrawer(): boolean {
    if (!this.settings?.cashDrawer.enabled) {
      return false;
    }

    return CashDrawerService.shouldAutoOpenOnSale();
  }

  /**
   * Test cash drawer
   */
  async testCashDrawer(): Promise<boolean> {
    if (!this.settings?.cashDrawer.enabled) {
      return false;
    }

    return await CashDrawerService.testDrawer();
  }

  // ===== Customer Display Methods =====

  /**
   * Display message on customer display
   */
  async displayMessage(message: DisplayMessage): Promise<boolean> {
    if (!this.settings?.customerDisplay.enabled) {
      return false;
    }

    return await CustomerDisplayService.displayMessage(message);
  }

  /**
   * Display welcome message
   */
  async displayWelcome(): Promise<boolean> {
    if (!this.settings?.customerDisplay.enabled) {
      return false;
    }

    return await CustomerDisplayService.displayWelcome();
  }

  /**
   * Display item on customer display
   */
  async displayItem(itemName: string, price: number): Promise<boolean> {
    if (!this.settings?.customerDisplay.enabled) {
      return false;
    }

    return await CustomerDisplayService.displayItem(itemName, price);
  }

  /**
   * Display total on customer display
   */
  async displayTotal(total: number): Promise<boolean> {
    if (!this.settings?.customerDisplay.enabled) {
      return false;
    }

    return await CustomerDisplayService.displayTotal(total);
  }

  /**
   * Display thank you message
   */
  async displayThankYou(): Promise<boolean> {
    if (!this.settings?.customerDisplay.enabled) {
      return false;
    }

    return await CustomerDisplayService.displayThankYou();
  }

  /**
   * Clear customer display
   */
  async clearDisplay(): Promise<boolean> {
    if (!this.settings?.customerDisplay.enabled) {
      return false;
    }

    return await CustomerDisplayService.clearDisplay();
  }

  /**
   * Test customer display
   */
  async testDisplay(): Promise<boolean> {
    if (!this.settings?.customerDisplay.enabled) {
      return false;
    }

    return await CustomerDisplayService.testDisplay();
  }

  // ===== Bluetooth Methods =====

  /**
   * Scan for Bluetooth devices
   */
  async scanForDevices(duration: number = 10) {
    return await BluetoothService.scanForDevices(duration);
  }

  /**
   * Stop Bluetooth scan
   */
  async stopScan(): Promise<void> {
    return await BluetoothService.stopScan();
  }

  /**
   * Get paired Bluetooth devices
   */
  async getPairedDevices() {
    return await BluetoothService.getPairedDevices();
  }

  // ===== Lifecycle Methods =====

  /**
   * Disconnect all devices
   */
  async disconnect(): Promise<void> {
    await Promise.all([
      PrinterService.disconnect(),
      BarcodeScannerService.disconnect(),
      CashDrawerService.disconnect(),
      CustomerDisplayService.disconnect(),
    ]);

    this.isInitialized = false;
  }

  /**
   * Cleanup all resources
   */
  cleanup(): void {
    BluetoothService.cleanup();
    this.isInitialized = false;
    this.settings = null;
  }

  /**
   * Handle sale completion
   * This is a convenience method that handles all hardware actions on sale completion
   */
  async handleSaleComplete(
    receiptData: ReceiptData,
    paymentMethod: string
  ): Promise<void> {
    try {
      // Print receipt if enabled
      if (this.settings?.receiptPrinter.enabled) {
        await this.printReceipt(receiptData, false);
      }

      // Open cash drawer if cash payment and auto-open is enabled
      if (paymentMethod === 'cash' && this.shouldAutoOpenDrawer()) {
        await this.openCashDrawer();
      }

      // Display thank you message
      if (this.settings?.customerDisplay.enabled) {
        await this.displayThankYou();

        // Clear and show welcome after 3 seconds
        setTimeout(async () => {
          await this.displayWelcome();
        }, 3000);
      }
    } catch (error) {
      console.error('Error handling sale completion:', error);
    }
  }

  /**
   * Check if hardware manager is initialized
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

export const HardwareManager = new HardwareManagerClass();
