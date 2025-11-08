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
  anniversary?: string;
  gender?: string;
  address?: Address;
  customerType: 'vip' | 'regular' | 'corporate';
  status: 'active' | 'inactive' | 'blocked';
  loyaltyInfo?: LoyaltyInfo;
  loyaltyCardNumber?: string;
  creditInfo?: CreditInfo;
  storeCredit?: StoreCredit;
  stats?: CustomerStats;
  tags?: string[];
  segments?: string[];
  notes?: string;
  customFields?: Record<string, any>;
  preferredContactMethod?: 'email' | 'sms' | 'phone' | 'push';
  marketingOptIn?: boolean;
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
  customerLifetimeValue?: number;
  lastVisitDate?: string;
  visitFrequency?: number; // visits per month
}

// Communication History
export interface CommunicationRecord {
  id: string;
  customerId: string;
  type: 'email' | 'sms' | 'phone' | 'in-person' | 'push';
  subject?: string;
  message: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'failed' | 'read';
  createdBy?: string;
  createdAt: string;
}

// Customer Segments
export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  criteria: SegmentCriteria;
  customerCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentCriteria {
  customerType?: ('vip' | 'regular' | 'corporate')[];
  minTotalSpent?: number;
  maxTotalSpent?: number;
  minPurchases?: number;
  maxPurchases?: number;
  loyaltyTier?: ('bronze' | 'silver' | 'gold' | 'platinum')[];
  tags?: string[];
  lastPurchaseDays?: number; // customers who purchased within X days
  inactive?: boolean; // customers who haven't purchased in X days
}

// Birthday & Anniversary
export interface CustomerReminder {
  id: string;
  customerId: string;
  customer?: Customer;
  type: 'birthday' | 'anniversary';
  date: string; // MM-DD format
  notificationDate?: string;
  message?: string;
  status: 'pending' | 'sent' | 'cancelled';
  createdAt: string;
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

// ============================================================
// INVENTORY MANAGEMENT TYPES
// ============================================================

// Inventory Location Types
export interface InventoryLocation {
  id: string;
  name: string;
  type: 'branch' | 'warehouse' | 'storage' | 'transit';
  branchId?: string;
  branch?: Branch;
  address?: Address;
  isActive: boolean;
  managerId?: string;
  managerName?: string;
  capacity?: number;
  currentUtilization?: number;
  createdAt: string;
  updatedAt: string;
}

// Stock Level Types
export interface StockLevel {
  id: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  locationId: string;
  location?: InventoryLocation;
  quantity: number;
  committedQuantity: number; // Reserved for orders
  availableQuantity: number; // quantity - committedQuantity
  lowStockThreshold?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  lastCountedAt?: string;
  lastCountedBy?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  updatedAt: string;
}

// Inventory Transaction Types
export enum InventoryTransactionType {
  STOCK_IN = 'stock_in',
  STOCK_OUT = 'stock_out',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
  RETURN_TO_SUPPLIER = 'return_to_supplier',
  DAMAGE = 'damage',
  LOSS = 'loss',
  WASTE = 'waste',
  CYCLE_COUNT = 'cycle_count',
  PHYSICAL_COUNT = 'physical_count',
  SALE = 'sale',
  PURCHASE = 'purchase',
  PRODUCTION = 'production',
}

export interface InventoryTransaction {
  id: string;
  transactionNumber: string;
  type: InventoryTransactionType;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  fromLocationId?: string;
  fromLocation?: InventoryLocation;
  toLocationId?: string;
  toLocation?: InventoryLocation;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  reason?: string;
  reasonCategory?: 'damaged' | 'expired' | 'lost' | 'stolen' | 'adjustment' | 'transfer' | 'return' | 'other';
  notes?: string;
  referenceType?: 'purchase_order' | 'sales_order' | 'transfer' | 'adjustment' | 'count' | 'manual';
  referenceId?: string;
  serialNumbers?: string[];
  batchNumber?: string;
  expiryDate?: string;
  createdBy: string;
  createdByUser?: User;
  approvedBy?: string;
  approvedByUser?: User;
  status: 'pending' | 'approved' | 'completed' | 'cancelled' | 'rejected';
  images?: string[];
  signature?: string;
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
}

// Stock Transfer Types
export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromLocationId: string;
  fromLocation?: InventoryLocation;
  toLocationId: string;
  toLocation?: InventoryLocation;
  items: StockTransferItem[];
  status: 'draft' | 'pending' | 'in_transit' | 'received' | 'partially_received' | 'cancelled';
  totalItems: number;
  totalQuantity: number;
  estimatedValue: number;
  requestedBy: string;
  requestedByUser?: User;
  approvedBy?: string;
  approvedByUser?: User;
  sentBy?: string;
  sentByUser?: User;
  receivedBy?: string;
  receivedByUser?: User;
  requestedAt: string;
  approvedAt?: string;
  sentAt?: string;
  receivedAt?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  senderSignature?: string;
  receiverSignature?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StockTransferItem {
  id: string;
  transferId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantityRequested: number;
  quantityApproved?: number;
  quantitySent: number;
  quantityReceived: number;
  unitCost?: number;
  serialNumbers?: string[];
  batchNumber?: string;
  condition?: 'good' | 'damaged' | 'defective';
  notes?: string;
}

// Stock Adjustment Types
export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  locationId: string;
  location?: InventoryLocation;
  items: StockAdjustmentItem[];
  type: 'increase' | 'decrease';
  reason: string;
  reasonCategory: 'damage' | 'loss' | 'found' | 'correction' | 'waste' | 'theft' | 'expired' | 'other';
  totalItems: number;
  totalAdjustmentValue: number;
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'rejected';
  createdBy: string;
  createdByUser?: User;
  approvedBy?: string;
  approvedByUser?: User;
  notes?: string;
  images?: string[];
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
}

export interface StockAdjustmentItem {
  id: string;
  adjustmentId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  currentQuantity: number;
  adjustmentQuantity: number;
  newQuantity: number;
  unitCost?: number;
  totalCost?: number;
  reason?: string;
  serialNumbers?: string[];
  batchNumber?: string;
  notes?: string;
}

// Cycle Count Types
export interface CycleCount {
  id: string;
  countNumber: string;
  locationId: string;
  location?: InventoryLocation;
  type: 'full' | 'partial' | 'category' | 'abc_analysis';
  categoryId?: string;
  category?: Category;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  items: CycleCountItem[];
  totalItems: number;
  countedItems: number;
  discrepancies: number;
  totalDiscrepancyValue: number;
  assignedTo?: string;
  assignedToUser?: User;
  countedBy?: string;
  countedByUser?: User;
  reviewedBy?: string;
  reviewedByUser?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CycleCountItem {
  id: string;
  cycleCountId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  systemQuantity: number;
  countedQuantity?: number;
  discrepancy?: number;
  discrepancyValue?: number;
  status: 'pending' | 'counted' | 'verified' | 'adjusted';
  serialNumbers?: string[];
  batchNumber?: string;
  notes?: string;
  countedAt?: string;
  verifiedAt?: string;
}

// Physical Inventory Types
export interface PhysicalInventory {
  id: string;
  inventoryNumber: string;
  locationId: string;
  location?: InventoryLocation;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  items: PhysicalInventoryItem[];
  totalItems: number;
  countedItems: number;
  discrepancies: number;
  totalDiscrepancyValue: number;
  totalInventoryValue: number;
  assignedTeam?: string[];
  assignedUsers?: User[];
  supervisorId?: string;
  supervisor?: User;
  freezeStock: boolean; // Prevent stock movements during count
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhysicalInventoryItem {
  id: string;
  physicalInventoryId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  systemQuantity: number;
  firstCount?: number;
  secondCount?: number;
  thirdCount?: number;
  finalCount?: number;
  discrepancy?: number;
  discrepancyPercentage?: number;
  discrepancyValue?: number;
  unitCost?: number;
  totalValue?: number;
  status: 'pending' | 'first_count' | 'second_count' | 'third_count' | 'verified' | 'adjusted';
  requiresRecount: boolean;
  serialNumbers?: string[];
  batchNumbers?: string[];
  location?: string; // Bin/shelf location
  countedBy?: string[];
  countedByUsers?: User[];
  verifiedBy?: string;
  verifiedByUser?: User;
  notes?: string;
  images?: string[];
  countedAt?: string;
  verifiedAt?: string;
}

// Serial Number Tracking Types
export interface SerialNumber {
  id: string;
  serialNumber: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  locationId?: string;
  location?: InventoryLocation;
  status: 'available' | 'sold' | 'reserved' | 'damaged' | 'returned' | 'in_transit';
  purchaseOrderId?: string;
  receivedDate?: string;
  soldDate?: string;
  soldToCustomerId?: string;
  soldToCustomer?: Customer;
  transactionId?: string;
  transaction?: POSTransaction;
  warrantyExpiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Low Stock Alert Types
export interface LowStockAlert {
  id: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  locationId: string;
  location?: InventoryLocation;
  currentQuantity: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out_of_stock';
  status: 'active' | 'acknowledged' | 'resolved' | 'ignored';
  acknowledgedBy?: string;
  acknowledgedByUser?: User;
  acknowledgedAt?: string;
  resolvedAt?: string;
  reorderSuggested: boolean;
  suggestedReorderQuantity?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Waste/Loss Tracking Types
export interface WasteLossRecord {
  id: string;
  recordNumber: string;
  type: 'waste' | 'loss' | 'damage' | 'theft' | 'expired' | 'shrinkage';
  locationId: string;
  location?: InventoryLocation;
  items: WasteLossItem[];
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  reason: string;
  reasonCategory: 'operational' | 'customer' | 'supplier' | 'theft' | 'natural' | 'other';
  description?: string;
  reportedBy: string;
  reportedByUser?: User;
  verifiedBy?: string;
  verifiedByUser?: User;
  status: 'reported' | 'investigating' | 'verified' | 'closed';
  policeReportNumber?: string;
  insuranceClaimNumber?: string;
  images?: string[];
  notes?: string;
  reportedAt: string;
  verifiedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WasteLossItem {
  id: string;
  wasteLossRecordId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  unitCost: number;
  totalValue: number;
  serialNumbers?: string[];
  batchNumber?: string;
  expiryDate?: string;
  condition?: 'damaged' | 'expired' | 'missing' | 'defective';
  recoverable: boolean;
  notes?: string;
}

// Inventory Report Types
export interface InventoryReport {
  type: 'stock_level' | 'movement' | 'valuation' | 'turnover' | 'aging' | 'variance';
  dateFrom: string;
  dateTo: string;
  locationId?: string;
  categoryId?: string;
  generatedAt: string;
  generatedBy: string;
  data: any; // Specific to report type
}

export interface StockLevelReport {
  locationId: string;
  location?: InventoryLocation;
  categories: {
    category: Category;
    products: Array<{
      product: Product;
      quantity: number;
      value: number;
      status: string;
    }>;
  }[];
  summary: {
    totalProducts: number;
    totalQuantity: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
}

export interface InventoryMovementReport {
  locationId?: string;
  dateFrom: string;
  dateTo: string;
  transactions: InventoryTransaction[];
  summary: {
    totalTransactions: number;
    stockIn: number;
    stockOut: number;
    transfers: number;
    adjustments: number;
    totalValue: number;
  };
}

// Inventory Filter & Search Types
export interface InventoryFilters extends PaginationParams {
  locationId?: string;
  productId?: string;
  categoryId?: string;
  status?: string;
  type?: InventoryTransactionType;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  minQuantity?: number;
  maxQuantity?: number;
  lowStock?: boolean;
  outOfStock?: boolean;
}

// Batch Operations Types
export interface BatchStockUpdate {
  updates: Array<{
    productId: string;
    variantId?: string;
    locationId: string;
    quantity: number;
    operation: 'set' | 'add' | 'subtract';
  }>;
  reason?: string;
  notes?: string;
}

// Inventory Dashboard Types
export interface InventoryDashboard {
  summary: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    pendingTransfers: number;
    pendingAdjustments: number;
    activeAlerts: number;
  };
  recentTransactions: InventoryTransaction[];
  lowStockAlerts: LowStockAlert[];
  pendingTransfers: StockTransfer[];
  topMovingProducts: Array<{
    product: Product;
    quantity: number;
    value: number;
  }>;
  stockByLocation: Array<{
    location: InventoryLocation;
    totalProducts: number;
    totalValue: number;
  }>;
}

// Barcode Scan Result Types
export interface BarcodeScanResult {
  type: 'product' | 'serial_number' | 'batch' | 'location';
  code: string;
  data?: Product | SerialNumber | InventoryLocation;
  scannedAt: string;
}

// Offline Sync Types
export interface OfflineInventorySync {
  id: string;
  type: 'count' | 'adjustment' | 'transfer';
  data: any;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  createdAt: string;
  syncedAt?: string;
  error?: string;
}
