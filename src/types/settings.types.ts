/**
 * Settings Types
 * Types and interfaces for application settings
 */

// Currency options
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'AUD' | 'CAD';

export const CURRENCIES: {value: Currency; label: string; symbol: string}[] = [
  {value: 'USD', label: 'US Dollar', symbol: '$'},
  {value: 'EUR', label: 'Euro', symbol: '€'},
  {value: 'GBP', label: 'British Pound', symbol: '£'},
  {value: 'JPY', label: 'Japanese Yen', symbol: '¥'},
  {value: 'CNY', label: 'Chinese Yuan', symbol: '¥'},
  {value: 'INR', label: 'Indian Rupee', symbol: '₹'},
  {value: 'AUD', label: 'Australian Dollar', symbol: 'A$'},
  {value: 'CAD', label: 'Canadian Dollar', symbol: 'C$'},
];

// Date and time format options
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';

export const DATE_FORMATS: {value: DateFormat; label: string}[] = [
  {value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)'},
  {value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK)'},
  {value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)'},
];

export const TIME_FORMATS: {value: TimeFormat; label: string}[] = [
  {value: '12h', label: '12-hour (AM/PM)'},
  {value: '24h', label: '24-hour'},
];

// Payment method options
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'upi' | 'bank_transfer';

export const PAYMENT_METHODS: {value: PaymentMethod; label: string}[] = [
  {value: 'cash', label: 'Cash'},
  {value: 'card', label: 'Card'},
  {value: 'mobile', label: 'Mobile Payment'},
  {value: 'upi', label: 'UPI'},
  {value: 'bank_transfer', label: 'Bank Transfer'},
];

// Language options
export type Language = 'en' | 'es' | 'fr';

export const LANGUAGES: {value: Language; label: string; nativeName: string}[] = [
  {value: 'en', label: 'English', nativeName: 'English'},
  {value: 'es', label: 'Spanish', nativeName: 'Español'},
  {value: 'fr', label: 'French', nativeName: 'Français'},
];

// Number format options
export type NumberFormat = 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR';

export const NUMBER_FORMATS: {value: NumberFormat; label: string; example: string}[] = [
  {value: 'en-US', label: 'US (1,234.56)', example: '1,234.56'},
  {value: 'en-GB', label: 'UK (1,234.56)', example: '1,234.56'},
  {value: 'es-ES', label: 'Spanish (1.234,56)', example: '1.234,56'},
  {value: 'fr-FR', label: 'French (1 234,56)', example: '1 234,56'},
];

// Currency display options
export type CurrencyDisplay = 'symbol' | 'code' | 'name';

export const CURRENCY_DISPLAYS: {value: CurrencyDisplay; label: string; example: string}[] = [
  {value: 'symbol', label: 'Symbol ($)', example: '$100'},
  {value: 'code', label: 'Code (USD)', example: 'USD 100'},
  {value: 'name', label: 'Name (Dollar)', example: '100 Dollars'},
];

// Printer connection types
export type PrinterConnection = 'bluetooth' | 'usb' | 'network' | 'serial';

// Printer types
export type PrinterType = 'thermal' | 'inkjet' | 'laser';

// Barcode scanner types
export type BarcodeScannerType = 'camera' | 'bluetooth' | 'usb' | 'serial';

// Cash drawer connection types
export type CashDrawerConnection = 'printer' | 'serial' | 'usb';

// Customer display types
export type CustomerDisplayType = 'pole' | 'tablet' | 'monitor';

// Notification channel types
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push';

// Backup frequency options
export type BackupFrequency = 'daily' | 'weekly' | 'monthly' | 'manual';

export const BACKUP_FREQUENCIES: {value: BackupFrequency; label: string}[] = [
  {value: 'daily', label: 'Daily'},
  {value: 'weekly', label: 'Weekly'},
  {value: 'monthly', label: 'Monthly'},
  {value: 'manual', label: 'Manual only'},
];

// Cloud storage providers
export type CloudProvider = 'google_drive' | 'dropbox' | 'icloud' | 'none';

export const CLOUD_PROVIDERS: {value: CloudProvider; label: string}[] = [
  {value: 'google_drive', label: 'Google Drive'},
  {value: 'dropbox', label: 'Dropbox'},
  {value: 'icloud', label: 'iCloud'},
  {value: 'none', label: 'None (Local only)'},
];

// General Settings
export interface GeneralSettings {
  currency: Currency;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  defaultTaxRate: number; // Percentage (0-100)
  defaultPaymentMethod: PaymentMethod;
  receiptAutoPrint: boolean;
  soundEffects: boolean;
}

// Localization Settings
export interface LocalizationSettings {
  language: Language;
  locale: string;
  numberFormat: NumberFormat;
  currencyDisplay: CurrencyDisplay;
}

// Branding Settings
export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUri?: string;
  faviconUri?: string;
  customCSS?: string;
}

// Hardware Settings
export interface HardwareSettings {
  receiptPrinter: {
    enabled: boolean;
    type: PrinterType;
    connectionType: PrinterConnection;
    port?: string; // COM1, COM2, etc for serial
    ipAddress?: string; // For network connection
    deviceName?: string;
    deviceAddress?: string; // Bluetooth MAC address
    baudRate?: number; // For serial connection (9600, 19200, 38400, 115200)
    paperWidth: number; // mm (58, 80, etc)
    characterSet?: string; // CP437, UTF-8, etc
    autoCut: boolean;
    openDrawer: boolean; // Trigger cash drawer via printer
  };
  barcodeScanner: {
    enabled: boolean;
    type: BarcodeScannerType;
    port?: string; // For serial connection
    deviceName?: string;
    deviceAddress?: string; // Bluetooth MAC address
    prefix?: string; // Prefix before scanned data
    suffix?: string; // Suffix after scanned data
    autoSubmit: boolean; // Auto-submit after scan
  };
  cashDrawer: {
    enabled: boolean;
    connectionType: CashDrawerConnection;
    port?: string; // Serial/USB port
    openOnSale: boolean; // Auto-open on sale completion
    pulseWidth: number; // milliseconds (50-200)
  };
  customerDisplay: {
    enabled: boolean;
    type: CustomerDisplayType;
    connectionType: PrinterConnection;
    port?: string; // For serial connection
    ipAddress?: string; // For network connection
    deviceName?: string;
    deviceAddress?: string; // Bluetooth MAC address
    baudRate?: number; // For serial connection
    lines: number; // Number of display lines (2, 4, etc)
    columns: number; // Characters per line (20, 40, etc)
  };
}

// Notification Settings
export interface NotificationSettings {
  email: {
    enabled: boolean;
    address?: string;
    lowStock: boolean;
    dailySummary: boolean;
    weeklyReport: boolean;
  };
  sms: {
    enabled: boolean;
    phoneNumber?: string;
    lowStock: boolean;
    criticalAlerts: boolean;
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber?: string;
    dailySummary: boolean;
    customerReceipts: boolean;
  };
  push: {
    enabled: boolean;
    lowStock: boolean;
    newOrders: boolean;
    dailySummary: boolean;
  };
}

// Backup Settings
export interface BackupSettings {
  autoBackup: boolean;
  frequency: BackupFrequency;
  cloudProvider: CloudProvider;
  encryption: boolean;
  lastBackupDate?: string;
  nextBackupDate?: string;
  localBackupPath?: string;
}

// Complete Settings Interface
export interface AppSettings {
  general: GeneralSettings;
  localization: LocalizationSettings;
  branding: BrandingSettings;
  hardware: HardwareSettings;
  notifications: NotificationSettings;
  backup: BackupSettings;
}

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    defaultTaxRate: 0,
    defaultPaymentMethod: 'cash',
    receiptAutoPrint: false,
    soundEffects: true,
  },
  localization: {
    language: 'en',
    locale: 'en-US',
    numberFormat: 'en-US',
    currencyDisplay: 'symbol',
  },
  branding: {
    primaryColor: '#6366F1',
    secondaryColor: '#8B5CF6',
    accentColor: '#EC4899',
  },
  hardware: {
    receiptPrinter: {
      enabled: false,
      type: 'thermal',
      connectionType: 'bluetooth',
      port: 'COM1',
      ipAddress: '192.168.1.100',
      baudRate: 9600,
      paperWidth: 80,
      characterSet: 'CP437',
      autoCut: true,
      openDrawer: false,
    },
    barcodeScanner: {
      enabled: false,
      type: 'camera',
      port: 'COM2',
      prefix: '',
      suffix: '',
      autoSubmit: true,
    },
    cashDrawer: {
      enabled: false,
      connectionType: 'printer',
      port: '',
      openOnSale: true,
      pulseWidth: 100,
    },
    customerDisplay: {
      enabled: false,
      type: 'pole',
      connectionType: 'serial',
      port: 'COM3',
      ipAddress: '',
      baudRate: 9600,
      lines: 2,
      columns: 20,
    },
  },
  notifications: {
    email: {
      enabled: false,
      lowStock: true,
      dailySummary: true,
      weeklyReport: true,
    },
    sms: {
      enabled: false,
      lowStock: true,
      criticalAlerts: true,
    },
    whatsapp: {
      enabled: false,
      dailySummary: false,
      customerReceipts: false,
    },
    push: {
      enabled: true,
      lowStock: true,
      newOrders: true,
      dailySummary: true,
    },
  },
  backup: {
    autoBackup: false,
    frequency: 'daily',
    cloudProvider: 'none',
    encryption: true,
  },
};
