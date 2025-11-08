# Hardware Integration

This directory contains all hardware integration services for the Yoga POS mobile application.

## Supported Hardware

### 1. Receipt Printer
- **Connection types**: USB, Bluetooth, Network, Serial
- **Printer types**: Thermal, Inkjet, Laser
- **Features**:
  - ESC/POS protocol support
  - Auto-cut functionality
  - Cash drawer trigger
  - Custom paper width (58mm, 80mm)
  - Multiple character sets (CP437, UTF-8, etc.)

### 2. Barcode Scanner
- **Connection types**: USB, Bluetooth, Serial, Camera
- **Features**:
  - Auto-submit support
  - Prefix/suffix configuration
  - Multiple barcode format support (UPC-A, EAN-13, CODE-128, QR Code, etc.)

### 3. Cash Drawer
- **Connection types**: Printer, Serial, USB
- **Features**:
  - Configurable pulse width (50-200ms)
  - Auto-open on sale option
  - Manual open trigger

### 4. Customer Display Pole
- **Display types**: Pole, Tablet, Monitor
- **Connection types**: Serial, USB, Network, Bluetooth
- **Features**:
  - Configurable lines (2, 4, etc.)
  - Configurable columns (20, 40, etc.)
  - Text alignment and formatting

## Architecture

```
hardware/
├── types.ts                      # Type definitions
├── BluetoothService.ts          # Bluetooth device management
├── PrinterService.ts            # Receipt printer service
├── BarcodeScannerService.ts     # Barcode scanner service
├── CashDrawerService.ts         # Cash drawer service
├── CustomerDisplayService.ts    # Customer display service
├── HardwareManager.ts           # Coordinating service
└── index.ts                     # Exports
```

## Usage

### Initialize Hardware

```typescript
import {HardwareManager} from '@/services/hardware';
import {useSettingsStore} from '@/store/slices/settingsSlice';

const {settings} = useSettingsStore();

// Initialize all hardware devices
await HardwareManager.initialize(settings.hardware);
```

### Using the Hardware Hook

```typescript
import {useHardware} from '@/hooks/useHardware';

const MyComponent = () => {
  const {hardwareStatus, isInitializing, areDevicesReady} = useHardware();

  // Hardware is automatically initialized based on settings
  // Status is updated every 5 seconds
};
```

### Print Receipt

```typescript
import {HardwareManager} from '@/services/hardware';

const receiptData = {
  header: ['My Store', '123 Main St'],
  items: [
    {name: 'Product 1', quantity: 2, price: 10.0, total: 20.0},
    {name: 'Product 2', quantity: 1, price: 15.5, total: 15.5},
  ],
  subtotal: 35.5,
  tax: 3.55,
  total: 39.05,
  paymentMethod: 'Cash',
  footer: ['Thank you!', 'Visit again'],
};

await HardwareManager.printReceipt(receiptData);
```

### Scan Barcode

```typescript
import {HardwareManager, ScanResult} from '@/services/hardware';

// Set callback for scanned barcodes
HardwareManager.setScanCallback((result: ScanResult) => {
  console.log('Scanned:', result.data);
  console.log('Format:', result.format);
});
```

### Open Cash Drawer

```typescript
import {HardwareManager} from '@/services/hardware';

await HardwareManager.openCashDrawer();
```

### Display on Customer Display

```typescript
import {HardwareManager} from '@/services/hardware';

// Display welcome message
await HardwareManager.displayWelcome();

// Display item
await HardwareManager.displayItem('Product Name', 19.99);

// Display total
await HardwareManager.displayTotal(100.50);

// Display custom message
await HardwareManager.displayMessage({
  line1: 'Line 1 Text',
  line2: 'Line 2 Text',
});
```

### Handle Sale Completion

```typescript
import {HardwareManager} from '@/services/hardware';

// Automatically print receipt, open drawer (if cash), and display thank you
await HardwareManager.handleSaleComplete(receiptData, 'cash');
```

### Bluetooth Device Discovery

```typescript
import {HardwareManager} from '@/services/hardware';

// Scan for devices (10 seconds)
const devices = await HardwareManager.scanForDevices(10);

// Get paired devices
const pairedDevices = await HardwareManager.getPairedDevices();
```

## Configuration

Hardware settings are managed through the Zustand settings store:

```typescript
// src/store/slices/settingsSlice.ts
interface HardwareSettings {
  receiptPrinter: {
    enabled: boolean;
    type: 'thermal' | 'inkjet' | 'laser';
    connectionType: 'bluetooth' | 'usb' | 'network' | 'serial';
    port?: string;
    ipAddress?: string;
    deviceName?: string;
    deviceAddress?: string;
    baudRate?: number;
    paperWidth: number;
    characterSet?: string;
    autoCut: boolean;
    openDrawer: boolean;
  };
  barcodeScanner: {
    enabled: boolean;
    type: 'camera' | 'bluetooth' | 'usb' | 'serial';
    port?: string;
    deviceName?: string;
    deviceAddress?: string;
    prefix?: string;
    suffix?: string;
    autoSubmit: boolean;
  };
  cashDrawer: {
    enabled: boolean;
    connectionType: 'printer' | 'serial' | 'usb';
    port?: string;
    openOnSale: boolean;
    pulseWidth: number;
  };
  customerDisplay: {
    enabled: boolean;
    type: 'pole' | 'tablet' | 'monitor';
    connectionType: 'bluetooth' | 'usb' | 'network' | 'serial';
    port?: string;
    ipAddress?: string;
    deviceName?: string;
    deviceAddress?: string;
    baudRate?: number;
    lines: number;
    columns: number;
  };
}
```

## Components

### DeviceStatusIndicator

Shows the connection status of a single device:

```typescript
import {DeviceStatusIndicator} from '@/components/hardware';

<DeviceStatusIndicator
  deviceName="Receipt Printer"
  status={DeviceStatus.CONNECTED}
/>
```

### HardwareStatusPanel

Shows status of all enabled devices:

```typescript
import {HardwareStatusPanel} from '@/components/hardware';

<HardwareStatusPanel
  onDevicePress={(device) => console.log('Device pressed:', device)}
/>
```

## ESC/POS Commands

The printer service supports standard ESC/POS commands:

- `INITIALIZE` - Initialize printer
- `PRINT_AND_FEED` - Print and feed paper
- `CUT_PAPER` - Cut paper (if auto-cut supported)
- `OPEN_DRAWER` - Open cash drawer
- `ALIGN_LEFT/CENTER/RIGHT` - Text alignment
- `BOLD_ON/OFF` - Bold text
- `UNDERLINE_ON/OFF` - Underline text
- `DOUBLE_HEIGHT/WIDTH_ON` - Double size text

## Error Handling

All hardware operations return a boolean indicating success/failure:

```typescript
const success = await HardwareManager.printReceipt(data);

if (!success) {
  // Handle error
  Alert.alert('Error', 'Failed to print receipt');
}
```

Device status can be checked:

```typescript
const status = HardwareManager.getHardwareStatus();

if (status.printer === DeviceStatus.ERROR) {
  // Handle printer error
}
```

## Testing

Each service provides a test method:

```typescript
// Test printer
await HardwareManager.printTestPage();

// Test scanner
await HardwareManager.testScanner();

// Test cash drawer
await HardwareManager.testCashDrawer();

// Test customer display
await HardwareManager.testDisplay();
```

## Permissions

### Android

Required permissions are automatically requested:
- `BLUETOOTH_SCAN` (Android 12+)
- `BLUETOOTH_CONNECT` (Android 12+)
- `ACCESS_FINE_LOCATION`
- `BLUETOOTH` (Android 11 and below)
- `BLUETOOTH_ADMIN` (Android 11 and below)

### iOS

Add to `Info.plist`:
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>We need Bluetooth to connect to hardware devices</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>We need Bluetooth to connect to hardware devices</string>
```

## Dependencies

- `react-native-ble-manager` - Bluetooth Low Energy
- `react-native-print` - Printing support
- `react-native-qrcode-scanner` - Camera barcode scanning
- `react-native-permissions` - Permission handling

## Future Enhancements

- [ ] Network printer implementation (TCP/IP)
- [ ] USB printer implementation
- [ ] Serial port implementation (RS-232)
- [ ] NFC quick pairing
- [ ] Printer status monitoring (paper out, cover open, etc.)
- [ ] Advanced ESC/POS features (graphics, barcodes on receipt)
- [ ] Multi-language support for receipts
- [ ] Receipt templates
