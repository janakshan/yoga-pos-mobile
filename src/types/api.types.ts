/**
 * API Types
 * Type definitions for API requests and responses
 */

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  details?: any;
}

// Error Response
export interface ApiError {
  success: false;
  message: string;
  code: string;
  details?: any;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PinLoginRequest {
  username: string;
  pin: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// User Roles
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
  KITCHEN_STAFF = 'kitchen_staff',
  WAITER = 'waiter',
  WAITRESS = 'waitress',
  INVENTORY_MANAGER = 'inventory_manager',
}

// Permissions
export enum Permission {
  // POS Permissions
  POS_ACCESS = 'pos.access',
  POS_VOID_TRANSACTION = 'pos.void_transaction',
  POS_APPLY_DISCOUNT = 'pos.apply_discount',
  POS_REFUND = 'pos.refund',
  POS_VIEW_REPORTS = 'pos.view_reports',

  // Product Permissions
  PRODUCT_VIEW = 'product.view',
  PRODUCT_CREATE = 'product.create',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_DELETE = 'product.delete',

  // Inventory Permissions
  INVENTORY_VIEW = 'inventory.view',
  INVENTORY_MANAGE = 'inventory.manage',
  INVENTORY_ADJUST = 'inventory.adjust',

  // Customer Permissions
  CUSTOMER_VIEW = 'customer.view',
  CUSTOMER_CREATE = 'customer.create',
  CUSTOMER_UPDATE = 'customer.update',
  CUSTOMER_DELETE = 'customer.delete',

  // User Management
  USER_VIEW = 'user.view',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',

  // Settings
  SETTINGS_VIEW = 'settings.view',
  SETTINGS_MANAGE = 'settings.manage',

  // Reports
  REPORTS_VIEW = 'reports.view',
  REPORTS_EXPORT = 'reports.export',
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  roles?: UserRole[];
  avatar?: string;
  phone?: string;
  branchId?: string;
  permissions?: Permission[];
  status?: 'active' | 'inactive' | 'suspended';
  pinEnabled?: boolean;
  biometricEnabled?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

// Token Types
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  permissions?: Permission[];
  iat: number;
  exp: number;
}

// Session Types
export interface Session {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  lastActivity: Date;
  rememberMe: boolean;
}

// PIN Types
export interface PinSetupRequest {
  userId: string;
  newPIN: string;
}

export interface PinDisableRequest {
  userId: string;
}

export interface PinResetAttemptsRequest {
  userId: string;
}

export interface PinData {
  hash: string;
  attempts: number;
  maxAttempts: number;
  lockedUntil?: Date;
}

// Biometric Types
export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometryType?: 'FaceID' | 'TouchID' | 'Fingerprint' | 'Iris';
}

export interface BiometricSettings {
  enabled: boolean;
  biometryType?: string;
  fallbackToPin: boolean;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  managerId?: string;
  managerName?: string;
  isActive: boolean;
  staffCount?: number;
  monthlyRevenue?: number;
  transactionCount?: number;
  settings?: BranchSettings;
  createdAt: string;
  updatedAt: string;
}

export interface BranchSettings {
  timezone: string;
  currency: string;
  taxRate: number;
  operatingHours?: Record<string, {open: string; close: string}>;
}

// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  pricing?: {
    retail: number;
    wholesale?: number;
    member?: number;
  };
  cost: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  unit: string;
  barcode?: string;
  imageUrl?: string;
  imageUrls?: string[];
  status: 'active' | 'inactive' | 'discontinued';
  tags?: string[];
  trackInventory: boolean;
  allowBackorder?: boolean;
  taxRate?: number;
  supplierId?: string;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

// Customer Types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: Address;
  customerType: 'vip' | 'regular' | 'corporate';
  status: 'active' | 'inactive' | 'blocked';
  loyaltyInfo?: LoyaltyInfo;
  creditInfo?: CreditInfo;
  storeCredit?: StoreCredit;
  stats?: CustomerStats;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface LoyaltyInfo {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinedDate: string;
  lastEarnedDate?: string;
  lifetimePoints: number;
}

export interface CreditInfo {
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  creditStatus: 'good' | 'warning' | 'suspended';
}

export interface StoreCredit {
  balance: number;
  expiryDate?: string;
}

export interface CustomerStats {
  totalPurchases: number;
  totalSpent: number;
  lastPurchaseDate?: string;
  averageOrderValue: number;
}

// POS Transaction Types
export interface POSTransaction {
  id?: string;
  transactionNumber?: string;
  customerId?: string;
  customer?: Customer;
  branchId: string;
  cashierId?: string;
  cashier?: User;
  items: POSItem[];
  subtotal: number;
  discountTotal: number;
  cartDiscount?: Discount;
  taxTotal: number;
  total: number;
  payments: POSPayment[];
  amountPaid?: number;
  change?: number;
  loyaltyPointsEarned?: number;
  loyaltyPointsUsed?: number;
  notes?: string;
  status: 'draft' | 'pending' | 'completed' | 'refunded' | 'partially_refunded' | 'cancelled' | 'on_hold';
  isHeld?: boolean;
  heldAt?: string;
  heldBy?: string;
  receiptNumber?: string;
  receiptEmailSent?: boolean;
  printCount?: number;
  source?: 'pos' | 'fast_checkout' | 'online';
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface POSItem {
  id?: string;
  productId: string;
  product?: Product;
  productName: string;
  productSku?: string;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  price: number;
  discount?: Discount;
  discountAmount?: number;
  tax?: number;
  taxRate?: number;
  subtotal: number;
  total: number;
  isBundle?: boolean;
  bundleItems?: POSItem[];
  notes?: string;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  amount?: number;
  reason?: string;
  appliedBy?: string;
}

export interface POSPayment {
  id?: string;
  method: 'card' | 'cash' | 'mobile_payment' | 'bank_transfer' | 'store_credit';
  amount: number;
  reference?: string;
  cardType?: string;
  last4?: string;
  approvalCode?: string;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  processedAt?: string;
}

// Product Variant Types
export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  attributes: Record<string, string>; // e.g., {size: 'M', color: 'Blue'}
  price?: number;
  stockQuantity?: number;
  imageUrl?: string;
  status: 'active' | 'inactive';
}

// Bundle/Package Deal Types
export interface ProductBundle {
  id: string;
  name: string;
  description?: string;
  items: BundleItem[];
  price: number;
  discountAmount?: number;
  discountPercentage?: number;
  imageUrl?: string;
  status: 'active' | 'inactive';
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BundleItem {
  productId: string;
  quantity: number;
  allowSubstitution?: boolean;
}

// Return & Refund Types
export interface ReturnTransaction {
  id?: string;
  returnNumber?: string;
  originalTransactionId: string;
  originalTransaction?: POSTransaction;
  customerId?: string;
  customer?: Customer;
  branchId: string;
  items: ReturnItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  refundMethod: 'original_payment' | 'store_credit' | 'cash';
  refundAmount: number;
  restockingFee?: number;
  reason: string;
  reasonCategory?: 'damaged' | 'wrong_item' | 'not_satisfied' | 'defective' | 'other';
  notes?: string;
  processedBy?: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  images?: string[];
  createdAt?: string;
  completedAt?: string;
}

export interface ReturnItem {
  id?: string;
  transactionItemId?: string;
  productId: string;
  productName: string;
  quantityReturned: number;
  quantityPurchased: number;
  unitPrice: number;
  refundAmount: number;
  condition?: 'new' | 'used' | 'damaged';
  restock: boolean;
}

// Exchange Types
export interface ExchangeTransaction {
  id?: string;
  exchangeNumber?: string;
  returnTransaction: ReturnTransaction;
  newTransaction: POSTransaction;
  balanceDue?: number;
  refundDue?: number;
  status: 'pending' | 'completed';
  createdAt?: string;
  completedAt?: string;
}

// Receipt Types
export interface Receipt {
  transaction: POSTransaction;
  business: BusinessInfo;
  receiptSettings: ReceiptSettings;
  qrCode?: string;
  barcode?: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  logo?: string;
}

export interface ReceiptSettings {
  showLogo: boolean;
  showBarcode: boolean;
  showQrCode: boolean;
  footerMessage?: string;
  headerMessage?: string;
  paperWidth: number; // in mm (58mm or 80mm)
  fontSize: 'small' | 'medium' | 'large';
}

// Held Sale Types
export interface HeldSale {
  id: string;
  name?: string;
  transaction: Partial<POSTransaction>;
  heldBy: string;
  heldAt: string;
  expiresAt?: string;
  notes?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive: boolean;
  productCount?: number;
}

// Cart State Types
export interface CartState {
  items: POSItem[];
  selectedCustomer?: Customer;
  cartDiscount?: Discount;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  notes?: string;
}

// Settings Types
export interface AppSettings {
  general: GeneralSettings;
  branding?: BrandingSettings;
  hardware?: HardwareSettings;
  notifications?: NotificationSettings;
  backup?: BackupSettings;
}

export interface GeneralSettings {
  businessName: string;
  timezone: string;
  currency: string;
  language: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
}

export interface BrandingSettings {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
}

export interface HardwareSettings {
  printer?: {
    enabled: boolean;
    type: string;
    connection: string;
  };
  scanner?: {
    enabled: boolean;
    type: string;
  };
}

export interface NotificationSettings {
  lowStockAlerts: boolean;
  orderNotifications: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
}

export interface BackupSettings {
  autoBackup: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  cloudProvider?: 'google_drive' | 'dropbox' | 's3';
}
