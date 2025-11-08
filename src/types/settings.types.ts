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
export type PrinterConnection = 'bluetooth' | 'usb' | 'wifi' | 'network';

// Barcode scanner types
export type BarcodeScannerType = 'camera' | 'bluetooth' | 'usb';

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
    connection: PrinterConnection;
    deviceName?: string;
    deviceAddress?: string;
    paperWidth: number; // mm
    autoCut: boolean;
  };
  barcodeScanner: {
    enabled: boolean;
    type: BarcodeScannerType;
    deviceName?: string;
    deviceAddress?: string;
  };
  cashDrawer: {
    enabled: boolean;
    autoOpen: boolean;
    connectedToPrinter: boolean;
  };
  customerDisplay: {
    enabled: boolean;
    connection: PrinterConnection;
    deviceName?: string;
    deviceAddress?: string;
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
      connection: 'bluetooth',
      paperWidth: 80,
      autoCut: true,
    },
    barcodeScanner: {
      enabled: false,
      type: 'camera',
    },
    cashDrawer: {
      enabled: false,
      autoOpen: false,
      connectedToPrinter: true,
    },
    customerDisplay: {
      enabled: false,
      connection: 'bluetooth',
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
