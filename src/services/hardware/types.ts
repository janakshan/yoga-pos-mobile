/**
 * Hardware Service Types
 * Type definitions for hardware integration services
 */

// Device connection status
export enum DeviceStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

// Bluetooth device information
export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  rssi?: number;
  connected: boolean;
}

// Device connection result
export interface DeviceConnectionResult {
  success: boolean;
  message: string;
  device?: BluetoothDevice;
}

// Print job options
export interface PrintOptions {
  copies?: number;
  cutPaper?: boolean;
  openDrawer?: boolean;
}

// Receipt data structure
export interface ReceiptData {
  header?: string[];
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  footer?: string[];
}

// ESC/POS Commands
export enum ESCPOSCommand {
  INITIALIZE = '\x1B\x40',
  PRINT_AND_FEED = '\x1B\x64',
  CUT_PAPER = '\x1B\x69',
  OPEN_DRAWER = '\x1B\x70\x00\x19\xFA',
  ALIGN_LEFT = '\x1B\x61\x00',
  ALIGN_CENTER = '\x1B\x61\x01',
  ALIGN_RIGHT = '\x1B\x61\x02',
  BOLD_ON = '\x1B\x45\x01',
  BOLD_OFF = '\x1B\x45\x00',
  UNDERLINE_ON = '\x1B\x2D\x01',
  UNDERLINE_OFF = '\x1B\x2D\x00',
  DOUBLE_HEIGHT_ON = '\x1B\x21\x10',
  DOUBLE_WIDTH_ON = '\x1B\x21\x20',
  NORMAL_SIZE = '\x1B\x21\x00',
}

// Barcode formats
export enum BarcodeFormat {
  UPC_A = 'UPC_A',
  UPC_E = 'UPC_E',
  EAN_13 = 'EAN_13',
  EAN_8 = 'EAN_8',
  CODE_39 = 'CODE_39',
  CODE_128 = 'CODE_128',
  QR_CODE = 'QR_CODE',
  PDF_417 = 'PDF_417',
}

// Scan result
export interface ScanResult {
  data: string;
  format: BarcodeFormat;
  timestamp: number;
}

// Customer display message
export interface DisplayMessage {
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
}

// Hardware error
export interface HardwareError {
  code: string;
  message: string;
  device: string;
  timestamp: number;
}

// Device capabilities
export interface DeviceCapabilities {
  autoCut?: boolean;
  drawerKick?: boolean;
  barcode?: boolean;
  qrCode?: boolean;
  graphics?: boolean;
}
