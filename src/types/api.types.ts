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

  // Procurement Permissions
  PROCUREMENT_VIEW = 'procurement.view',
  PROCUREMENT_CREATE = 'procurement.create',
  PROCUREMENT_APPROVE = 'procurement.approve',
  PROCUREMENT_RECEIVE = 'procurement.receive',
  SUPPLIER_VIEW = 'supplier.view',
  SUPPLIER_MANAGE = 'supplier.manage',

  // Customer Permissions
  CUSTOMER_VIEW = 'customer.view',
  CUSTOMER_CREATE = 'customer.create',
  CUSTOMER_UPDATE = 'customer.update',
  CUSTOMER_DELETE = 'customer.delete',

  // Branch Permissions
  BRANCH_VIEW = 'branch.view',
  BRANCH_CREATE = 'branch.create',
  BRANCH_UPDATE = 'branch.update',
  BRANCH_DELETE = 'branch.delete',
  BRANCH_MANAGE_STAFF = 'branch.manage_staff',
  BRANCH_VIEW_PERFORMANCE = 'branch.view_performance',
  BRANCH_MANAGE_SETTINGS = 'branch.manage_settings',

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

  // Financial Management
  FINANCIAL_VIEW = 'financial.view',
  FINANCIAL_MANAGE = 'financial.manage',
  INVOICE_CREATE = 'invoice.create',
  INVOICE_UPDATE = 'invoice.update',
  INVOICE_DELETE = 'invoice.delete',
  INVOICE_SEND = 'invoice.send',
  PAYMENT_CREATE = 'payment.create',
  PAYMENT_PROCESS = 'payment.process',
  PAYMENT_REFUND = 'payment.refund',
  PAYMENT_RECONCILE = 'payment.reconcile',
  EXPENSE_CREATE = 'expense.create',
  EXPENSE_UPDATE = 'expense.update',
  EXPENSE_DELETE = 'expense.delete',
  EXPENSE_APPROVE = 'expense.approve',
  BANK_ACCOUNT_VIEW = 'bank_account.view',
  BANK_ACCOUNT_MANAGE = 'bank_account.manage',
  BANK_RECONCILE = 'bank.reconcile',
  FINANCIAL_REPORTS = 'financial.reports',
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
  branch?: Branch;
  permissions?: Permission[];
  status?: 'active' | 'inactive' | 'suspended';
  pinEnabled?: boolean;
  biometricEnabled?: boolean;
  employmentInfo?: EmploymentInfo;
  statistics?: UserStatistics;
  createdAt?: string;
  updatedAt?: string;
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

// User Management Types
export interface EmploymentInfo {
  employeeId?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'temporary';
  salary?: number;
  contractEndDate?: string;
  workSchedule?: string;
  reportingTo?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UserActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  deviceInfo?: string;
  branchId?: string;
  timestamp: string;
}

export interface UserStatistics {
  totalTransactions: number;
  totalSales: number;
  averageTransactionValue: number;
  lastActivity?: string;
  loginCount: number;
  activeHours: number;
  performanceScore?: number;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  name: string;
  firstName?: string;
  lastName?: string;
  password: string;
  role: UserRole;
  phone?: string;
  branchId?: string;
  permissions?: Permission[];
  avatar?: string;
  employmentInfo?: EmploymentInfo;
  status?: 'active' | 'inactive';
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  phone?: string;
  branchId?: string;
  permissions?: Permission[];
  avatar?: string;
  employmentInfo?: EmploymentInfo;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UpdateUserPermissionsRequest {
  permissions: Permission[];
}

export interface UpdateUserStatusRequest {
  status: 'active' | 'inactive' | 'suspended';
  reason?: string;
}

export interface ChangeUserPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetUserPasswordRequest {
  email: string;
}

export interface UserFilterParams extends PaginationParams {
  role?: UserRole;
  branchId?: string;
  status?: 'active' | 'inactive' | 'suspended';
  search?: string;
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
  fax?: string;
  website?: string;

  // Location
  latitude?: number;
  longitude?: number;

  // Management
  managerId?: string;
  managerName?: string;
  manager?: User;

  // Status
  isActive: boolean;
  status?: 'active' | 'inactive' | 'under_maintenance';

  // Staff
  staffCount?: number;
  staff?: User[];
  staffIds?: string[];

  // Performance Metrics
  monthlyRevenue?: number;
  transactionCount?: number;
  performanceMetrics?: BranchPerformanceMetrics;

  // Inventory
  inventoryValue?: number;
  lowStockItemCount?: number;

  // Settings
  settings?: BranchSettings;

  // Metadata
  description?: string;
  imageUrl?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchSettings {
  timezone: string;
  currency: string;
  taxRate: number;
  operatingHours?: BranchOperatingHours;
  allowOnlineOrders?: boolean;
  allowReservations?: boolean;
  printerSettings?: BranchPrinterSettings;
  paymentMethods?: string[];
  autoStockTransfer?: boolean;
  notificationSettings?: BranchNotificationSettings;
}

export interface BranchOperatingHours {
  monday?: {open: string; close: string; isClosed?: boolean};
  tuesday?: {open: string; close: string; isClosed?: boolean};
  wednesday?: {open: string; close: string; isClosed?: boolean};
  thursday?: {open: string; close: string; isClosed?: boolean};
  friday?: {open: string; close: string; isClosed?: boolean};
  saturday?: {open: string; close: string; isClosed?: boolean};
  sunday?: {open: string; close: string; isClosed?: boolean};
  holidays?: Array<{date: string; name: string; isClosed: boolean}>;
}

export interface BranchPrinterSettings {
  receiptPrinter?: string;
  labelPrinter?: string;
  kitchenPrinter?: string;
  autoPrintReceipt?: boolean;
}

export interface BranchNotificationSettings {
  lowStockAlerts?: boolean;
  dailySummary?: boolean;
  customerFeedback?: boolean;
  systemAlerts?: boolean;
}

export interface BranchPerformanceMetrics {
  // Revenue
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;

  // Transactions
  todayTransactions: number;
  weekTransactions: number;
  monthTransactions: number;
  yearTransactions: number;

  // Customers
  todayCustomers: number;
  weekCustomers: number;
  monthCustomers: number;
  totalCustomers: number;

  // Performance Indicators
  averageTransactionValue: number;
  conversionRate?: number;
  customerSatisfactionScore?: number;

  // Inventory
  inventoryTurnoverRate?: number;
  stockAccuracy?: number;

  // Comparison
  revenueGrowth?: number; // percentage
  transactionGrowth?: number; // percentage

  // Rankings
  branchRank?: number;
  totalBranches?: number;
}

export interface BranchCreateRequest {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  fax?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  managerId?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  settings?: Partial<BranchSettings>;
}

export interface BranchUpdateRequest {
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  fax?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  managerId?: string;
  isActive?: boolean;
  status?: 'active' | 'inactive' | 'under_maintenance';
  description?: string;
  imageUrl?: string;
  tags?: string[];
  notes?: string;
  settings?: Partial<BranchSettings>;
}

export interface BranchStaffAssignment {
  branchId: string;
  userId: string;
  role?: UserRole;
  isPrimary?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface BranchComparison {
  branches: Branch[];
  metrics: {
    branchId: string;
    branchName: string;
    revenue: number;
    transactions: number;
    customers: number;
    averageTransactionValue: number;
    inventoryValue: number;
    staffCount: number;
    performanceScore?: number;
  }[];
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface BranchInventoryStatus {
  branchId: string;
  branchName: string;
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  excessStockItems: number;
  categories: Array<{
    category: string;
    itemCount: number;
    value: number;
  }>;
}

export interface BranchTransferRequest {
  fromBranchId: string;
  toBranchId: string;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
  }>;
  requestedBy?: string;
  notes?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export interface BranchFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'under_maintenance';
  city?: string;
  state?: string;
  managerId?: string;
  minRevenue?: number;
  maxRevenue?: number;
  sortBy?: 'name' | 'code' | 'revenue' | 'transactions' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
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

// ============================================================
// PURCHASE & PROCUREMENT TYPES
// ============================================================

// Supplier Types
export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  address?: Address;
  taxId?: string;
  bankDetails?: BankDetails;
  paymentTerms: PaymentTerms;
  productCategories?: string[];
  products?: SupplierProduct[];
  currency: string;
  rating?: number; // 1-5 rating
  status: 'active' | 'inactive' | 'blacklisted';
  performance?: SupplierPerformance;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
}

export interface PaymentTerms {
  termType: 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'cod' | 'advance' | 'custom';
  daysUntilDue?: number;
  discountPercentage?: number; // Early payment discount
  discountDays?: number; // Days to qualify for discount
  lateFeePercentage?: number;
  notes?: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  productId: string;
  product?: Product;
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  currency: string;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isPreferred: boolean;
  lastPurchaseDate?: string;
  lastPurchasePrice?: number;
  averagePrice?: number;
  totalPurchased?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPerformance {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalValue: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number; // Percentage
  qualityRating: number; // 1-5 rating
  averageLeadTime: number; // Days
  lastOrderDate?: string;
  returnRate?: number; // Percentage of items returned
  defectRate?: number; // Percentage of defective items
}

// Purchase Order Types
export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  CONFIRMED = 'confirmed',
  PARTIALLY_RECEIVED = 'partially_received',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
  CLOSED = 'closed',
}

export enum PurchaseOrderApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier?: Supplier;
  locationId: string;
  location?: InventoryLocation;
  status: PurchaseOrderStatus;
  approvalStatus?: PurchaseOrderApprovalStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountPercentage?: number;
  taxAmount: number;
  taxRate?: number;
  shippingCost?: number;
  otherCosts?: number;
  total: number;
  currency: string;
  paymentTerms?: PaymentTerms;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  deliveryAddress?: Address;
  createdBy: string;
  createdByUser?: User;
  approvedBy?: string;
  approvedByUser?: User;
  sentBy?: string;
  sentByUser?: User;
  receivedBy?: string;
  receivedByUser?: User;
  notes?: string;
  internalNotes?: string;
  termsAndConditions?: string;
  documents?: PODocument[];
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  approvedAt?: string;
  receivedAt?: string;
  closedAt?: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  sku: string;
  name: string;
  description?: string;
  quantityOrdered: number;
  quantityReceived: number;
  quantityRemaining?: number;
  unitPrice: number;
  discountPercentage?: number;
  discountAmount?: number;
  taxRate?: number;
  taxAmount?: number;
  subtotal: number;
  total: number;
  notes?: string;
  receivedItems?: ReceivedItem[];
}

export interface ReceivedItem {
  id: string;
  purchaseOrderItemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  condition: 'good' | 'damaged' | 'defective';
  serialNumbers?: string[];
  batchNumber?: string;
  expiryDate?: string;
  receivedBy: string;
  receivedByUser?: User;
  receivedAt: string;
  locationId?: string;
  location?: InventoryLocation;
  signature?: string;
  images?: string[];
  notes?: string;
}

export interface PODocument {
  id: string;
  purchaseOrderId: string;
  type: 'quote' | 'invoice' | 'delivery_note' | 'receipt' | 'contract' | 'other';
  name: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy: string;
  uploadedByUser?: User;
  uploadedAt: string;
  notes?: string;
}

// PO Approval Workflow Types
export interface POApprovalRequest {
  id: string;
  purchaseOrderId: string;
  purchaseOrder?: PurchaseOrder;
  requestedBy: string;
  requestedByUser?: User;
  requestedAt: string;
  requiredApprovers?: string[];
  approvals: POApproval[];
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  finalizedAt?: string;
  notes?: string;
}

export interface POApproval {
  id: string;
  approvalRequestId: string;
  approverId: string;
  approver?: User;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: string;
  level?: number; // For multi-level approval
}

// Receiving Management Types
export interface ReceivingSession {
  id: string;
  sessionNumber: string;
  purchaseOrderId: string;
  purchaseOrder?: PurchaseOrder;
  locationId: string;
  location?: InventoryLocation;
  items: ReceivingSessionItem[];
  status: 'in_progress' | 'completed' | 'cancelled';
  receivedBy: string;
  receivedByUser?: User;
  startedAt: string;
  completedAt?: string;
  totalItemsExpected: number;
  totalItemsReceived: number;
  discrepancies?: ReceivingDiscrepancy[];
  signature?: string;
  deliverySignature?: string;
  documents?: string[];
  images?: string[];
  notes?: string;
}

export interface ReceivingSessionItem {
  id: string;
  sessionId: string;
  purchaseOrderItemId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantityExpected: number;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  condition: 'good' | 'damaged' | 'defective' | 'mixed';
  serialNumbers?: string[];
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface ReceivingDiscrepancy {
  id: string;
  sessionId: string;
  type: 'quantity_mismatch' | 'quality_issue' | 'wrong_item' | 'damaged' | 'missing';
  productId: string;
  product?: Product;
  expectedQuantity?: number;
  receivedQuantity?: number;
  description: string;
  resolution?: 'accepted' | 'rejected' | 'partial_acceptance' | 'return_to_supplier';
  images?: string[];
  reportedBy: string;
  reportedByUser?: User;
  reportedAt: string;
}

// Procurement Dashboard Types
export interface ProcurementDashboard {
  summary: {
    totalPurchaseOrders: number;
    totalValue: number;
    pendingApprovals: number;
    pendingReceiving: number;
    activeSuppliers: number;
    averageLeadTime: number;
  };
  recentPurchaseOrders: PurchaseOrder[];
  pendingApprovals: POApprovalRequest[];
  pendingReceiving: PurchaseOrder[];
  topSuppliers: Array<{
    supplier: Supplier;
    totalOrders: number;
    totalValue: number;
  }>;
  lowPerformingSuppliers: Array<{
    supplier: Supplier;
    issues: string[];
  }>;
}

// Procurement Filters & Search Types
export interface ProcurementFilters extends PaginationParams {
  supplierId?: string;
  locationId?: string;
  status?: PurchaseOrderStatus;
  approvalStatus?: PurchaseOrderApprovalStatus;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  minTotal?: number;
  maxTotal?: number;
  createdBy?: string;
}

export interface SupplierFilters extends PaginationParams {
  status?: 'active' | 'inactive' | 'blacklisted';
  category?: string;
  minRating?: number;
  searchTerm?: string;
  tags?: string[];
}

// Offline Procurement Types
export interface OfflinePurchaseOrder {
  id: string;
  localId: string;
  data: Partial<PurchaseOrder>;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  createdAt: string;
  syncedAt?: string;
  error?: string;
}

// ============================================================
// FINANCIAL MANAGEMENT TYPES
// ============================================================

// Invoice Types
export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customer?: Customer;
  branchId: string;
  branch?: Branch;
  type: 'sale' | 'service' | 'rental' | 'subscription' | 'other';
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paymentTerms?: PaymentTerms;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount?: number;
  discountPercentage?: number;
  taxAmount: number;
  taxRate?: number;
  shippingCost?: number;
  adjustments?: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  templateId?: string;
  template?: InvoiceTemplate;
  notes?: string;
  termsAndConditions?: string;
  footerText?: string;
  isRecurring: boolean;
  recurringSchedule?: RecurringSchedule;
  parentInvoiceId?: string;
  payments?: Payment[];
  emailSent?: boolean;
  emailSentAt?: string;
  viewedAt?: string;
  paidAt?: string;
  remindersSent?: number;
  lastReminderAt?: string;
  attachments?: InvoiceAttachment[];
  metadata?: Record<string, any>;
  createdBy: string;
  createdByUser?: User;
  updatedBy?: string;
  updatedByUser?: User;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId?: string;
  productId?: string;
  product?: Product;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  discountPercentage?: number;
  taxRate?: number;
  taxAmount?: number;
  subtotal: number;
  total: number;
  sortOrder?: number;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  layout: 'classic' | 'modern' | 'minimal' | 'professional' | 'custom';
  primaryColor?: string;
  accentColor?: string;
  showLogo: boolean;
  logoUrl?: string;
  showBusinessInfo: boolean;
  showCustomerInfo: boolean;
  showPaymentTerms: boolean;
  showNotes: boolean;
  showSignature: boolean;
  signatureUrl?: string;
  headerText?: string;
  footerText?: string;
  termsAndConditions?: string;
  customCss?: string;
  customFields?: CustomField[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'url';
  showOnInvoice: boolean;
  sortOrder?: number;
}

export interface InvoiceAttachment {
  id: string;
  invoiceId: string;
  name: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface RecurringSchedule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  interval?: number; // e.g., every 2 months
  startDate: string;
  endDate?: string;
  occurrences?: number;
  nextInvoiceDate?: string;
  lastInvoiceDate?: string;
  autoSend: boolean;
  autoCharge?: boolean;
  isActive: boolean;
}

// Payment Types
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_PAYMENT = 'mobile_payment',
  STORE_CREDIT = 'store_credit',
  CHECK = 'check',
  DIGITAL_WALLET = 'digital_wallet',
  OTHER = 'other',
}

export interface Payment {
  id: string;
  paymentNumber: string;
  type: 'invoice_payment' | 'expense_payment' | 'refund' | 'advance' | 'other';
  invoiceId?: string;
  invoice?: Invoice;
  expenseId?: string;
  expense?: Expense;
  customerId?: string;
  customer?: Customer;
  supplierId?: string;
  supplier?: Supplier;
  branchId: string;
  branch?: Branch;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  transactionId?: string;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  last4?: string;
  approvalCode?: string;
  checkNumber?: string;
  bankAccountId?: string;
  bankAccount?: BankAccount;
  paymentDate: string;
  clearedDate?: string;
  isReconciled: boolean;
  reconciledAt?: string;
  reconciledBy?: string;
  reconciledByUser?: User;
  signature?: string;
  attachments?: PaymentAttachment[];
  notes?: string;
  metadata?: Record<string, any>;
  fees?: number;
  netAmount?: number;
  refunds?: Refund[];
  createdBy: string;
  createdByUser?: User;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export interface PaymentAttachment {
  id: string;
  paymentId: string;
  type: 'receipt' | 'proof' | 'authorization' | 'other';
  name: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Refund {
  id: string;
  refundNumber: string;
  originalPaymentId: string;
  originalPayment?: Payment;
  amount: number;
  currency: string;
  reason: string;
  reasonCategory: 'customer_request' | 'duplicate' | 'error' | 'cancellation' | 'other';
  method: PaymentMethod;
  status: PaymentStatus;
  processedBy: string;
  processedByUser?: User;
  processedAt: string;
  notes?: string;
  createdAt: string;
}

// Expense Types
export enum ExpenseStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: ExpenseCategory;
  isTaxDeductible: boolean;
  requiresApproval: boolean;
  approvalThreshold?: number;
  color?: string;
  icon?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  branchId: string;
  branch?: Branch;
  categoryId: string;
  category?: ExpenseCategory;
  supplierId?: string;
  supplier?: Supplier;
  amount: number;
  currency: string;
  taxAmount?: number;
  taxRate?: number;
  total: number;
  expenseDate: string;
  description: string;
  notes?: string;
  status: ExpenseStatus;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  payment?: Payment;
  isPaid: boolean;
  paidAt?: string;
  isTaxDeductible: boolean;
  isRecurring: boolean;
  recurringSchedule?: RecurringSchedule;
  parentExpenseId?: string;
  requiresApproval: boolean;
  approvedBy?: string;
  approvedByUser?: User;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedByUser?: User;
  rejectedAt?: string;
  rejectionReason?: string;
  bankAccountId?: string;
  bankAccount?: BankAccount;
  receipts?: ExpenseReceipt[];
  tags?: string[];
  metadata?: Record<string, any>;
  createdBy: string;
  createdByUser?: User;
  updatedBy?: string;
  updatedByUser?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseReceipt {
  id: string;
  expenseId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  capturedAt?: string;
  uploadedBy: string;
  uploadedByUser?: User;
  uploadedAt: string;
  ocrData?: OCRData;
}

export interface OCRData {
  merchantName?: string;
  date?: string;
  total?: number;
  currency?: string;
  category?: string;
  confidence?: number;
  rawText?: string;
}

// Bank Account Types
export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'credit_card' | 'cash' | 'other';
  bankName?: string;
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  currency: string;
  currentBalance: number;
  availableBalance?: number;
  openingBalance?: number;
  openingDate?: string;
  branchId?: string;
  branch?: Branch;
  isActive: boolean;
  isPrimary: boolean;
  color?: string;
  icon?: string;
  lastReconciledDate?: string;
  lastReconciledBalance?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Cash Flow Types
export interface CashFlowEntry {
  id: string;
  date: string;
  branchId: string;
  branch?: Branch;
  type: 'inflow' | 'outflow';
  category: 'sales' | 'expenses' | 'payroll' | 'loan' | 'investment' | 'other';
  amount: number;
  currency: string;
  bankAccountId?: string;
  bankAccount?: BankAccount;
  description: string;
  reference?: string;
  paymentId?: string;
  payment?: Payment;
  invoiceId?: string;
  invoice?: Invoice;
  expenseId?: string;
  expense?: Expense;
  isReconciled: boolean;
  reconciledAt?: string;
  createdAt: string;
}

export interface CashFlowForecast {
  id: string;
  startDate: string;
  endDate: string;
  branchId?: string;
  branch?: Branch;
  projections: CashFlowProjection[];
  assumptions?: string;
  createdBy: string;
  createdByUser?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CashFlowProjection {
  date: string;
  projectedInflow: number;
  projectedOutflow: number;
  projectedBalance: number;
  actualInflow?: number;
  actualOutflow?: number;
  actualBalance?: number;
  variance?: number;
}

// Bank Reconciliation Types
export interface BankReconciliation {
  id: string;
  reconciliationNumber: string;
  bankAccountId: string;
  bankAccount?: BankAccount;
  startDate: string;
  endDate: string;
  openingBalance: number;
  closingBalance: number;
  statementBalance: number;
  reconciledBalance: number;
  difference: number;
  status: 'in_progress' | 'completed' | 'needs_review';
  transactions: ReconciliationTransaction[];
  unmatchedBankTransactions?: BankTransaction[];
  unmatchedSystemTransactions?: CashFlowEntry[];
  adjustments?: ReconciliationAdjustment[];
  performedBy: string;
  performedByUser?: User;
  reviewedBy?: string;
  reviewedByUser?: User;
  startedAt: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationTransaction {
  id: string;
  reconciliationId: string;
  bankTransactionId?: string;
  systemTransactionId?: string;
  date: string;
  description: string;
  amount: number;
  type: 'matched' | 'bank_only' | 'system_only' | 'adjusted';
  isReconciled: boolean;
  notes?: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  transactionDate: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  balance?: number;
  reference?: string;
  category?: string;
  isReconciled: boolean;
  matchedTransactionId?: string;
  importedFrom?: string;
  importedAt?: string;
  createdAt: string;
}

export interface ReconciliationAdjustment {
  id: string;
  reconciliationId: string;
  type: 'bank_charge' | 'interest' | 'error_correction' | 'other';
  amount: number;
  description: string;
  createdBy: string;
  createdAt: string;
}

// Financial Report Types
export interface FinancialReport {
  id: string;
  type: 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'income_statement' | 'tax_report' | 'eod_reconciliation';
  title: string;
  startDate: string;
  endDate: string;
  branchId?: string;
  branch?: Branch;
  currency: string;
  status: 'generating' | 'completed' | 'failed';
  format?: 'pdf' | 'excel' | 'csv' | 'json';
  fileUrl?: string;
  data?: any;
  generatedBy: string;
  generatedByUser?: User;
  generatedAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

// Profit & Loss Statement
export interface ProfitLossStatement {
  startDate: string;
  endDate: string;
  branchId?: string;
  branch?: Branch;
  currency: string;
  revenue: RevenueBreakdown;
  costOfGoodsSold: number;
  grossProfit: number;
  grossProfitMargin: number;
  operatingExpenses: ExpenseBreakdown;
  totalOperatingExpenses: number;
  operatingIncome: number;
  operatingIncomeMargin: number;
  otherIncome: number;
  otherExpenses: number;
  netIncome: number;
  netProfitMargin: number;
  taxes?: number;
  netIncomeAfterTax?: number;
  generatedAt: string;
}

export interface RevenueBreakdown {
  sales: number;
  services: number;
  other: number;
  total: number;
  byCategory?: Record<string, number>;
  byProduct?: Array<{productId: string; name: string; amount: number}>;
}

export interface ExpenseBreakdown {
  salaries: number;
  rent: number;
  utilities: number;
  marketing: number;
  supplies: number;
  maintenance: number;
  insurance: number;
  depreciation: number;
  other: number;
  total: number;
  byCategory?: Record<string, number>;
}

// Balance Sheet
export interface BalanceSheet {
  asOfDate: string;
  branchId?: string;
  branch?: Branch;
  currency: string;
  assets: Assets;
  liabilities: Liabilities;
  equity: Equity;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  generatedAt: string;
}

export interface Assets {
  currentAssets: CurrentAssets;
  fixedAssets: FixedAssets;
  otherAssets: number;
  total: number;
}

export interface CurrentAssets {
  cash: number;
  bankAccounts: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  other: number;
  total: number;
}

export interface FixedAssets {
  property: number;
  equipment: number;
  vehicles: number;
  accumulatedDepreciation: number;
  total: number;
}

export interface Liabilities {
  currentLiabilities: CurrentLiabilities;
  longTermLiabilities: LongTermLiabilities;
  total: number;
}

export interface CurrentLiabilities {
  accountsPayable: number;
  taxesPayable: number;
  salariesPayable: number;
  shortTermLoans: number;
  other: number;
  total: number;
}

export interface LongTermLiabilities {
  loans: number;
  mortgages: number;
  other: number;
  total: number;
}

export interface Equity {
  ownersEquity: number;
  retainedEarnings: number;
  currentYearEarnings: number;
  total: number;
}

// Cash Flow Report
export interface CashFlowReport {
  startDate: string;
  endDate: string;
  branchId?: string;
  branch?: Branch;
  currency: string;
  openingBalance: number;
  operatingActivities: CashFlowActivities;
  investingActivities: CashFlowActivities;
  financingActivities: CashFlowActivities;
  netCashFlow: number;
  closingBalance: number;
  generatedAt: string;
}

export interface CashFlowActivities {
  inflows: Array<{description: string; amount: number}>;
  outflows: Array<{description: string; amount: number}>;
  totalInflows: number;
  totalOutflows: number;
  netCashFlow: number;
}

// Tax Report
export interface TaxReport {
  startDate: string;
  endDate: string;
  branchId?: string;
  branch?: Branch;
  currency: string;
  taxType: 'sales_tax' | 'income_tax' | 'vat' | 'gst' | 'other';
  taxableIncome: number;
  taxExemptIncome: number;
  totalTaxCollected: number;
  totalTaxPaid: number;
  taxableExpenses: number;
  nonTaxableExpenses: number;
  taxOwed: number;
  taxRefund: number;
  details: TaxReportDetail[];
  generatedAt: string;
}

export interface TaxReportDetail {
  date: string;
  description: string;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  reference?: string;
}

// End of Day Reconciliation
export interface EODReconciliation {
  id: string;
  reconciliationNumber: string;
  date: string;
  branchId: string;
  branch?: Branch;
  openingCash: number;
  closingCash: number;
  expectedCash: number;
  actualCash: number;
  variance: number;
  sales: EODSales;
  payments: EODPayments;
  expenses: EODExpenses;
  cashMovements: EODCashMovement[];
  status: 'in_progress' | 'completed' | 'needs_review';
  performedBy: string;
  performedByUser?: User;
  reviewedBy?: string;
  reviewedByUser?: User;
  notes?: string;
  signature?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EODSales {
  totalTransactions: number;
  totalSales: number;
  totalRefunds: number;
  netSales: number;
  byPaymentMethod: Record<PaymentMethod, number>;
  averageTransaction: number;
}

export interface EODPayments {
  cash: number;
  card: number;
  bankTransfer: number;
  mobilePayment: number;
  storeCredit: number;
  other: number;
  total: number;
}

export interface EODExpenses {
  total: number;
  byCategory: Record<string, number>;
  count: number;
}

export interface EODCashMovement {
  id: string;
  type: 'cash_in' | 'cash_out' | 'bank_deposit' | 'petty_cash';
  amount: number;
  reason: string;
  performedBy: string;
  time: string;
  reference?: string;
  notes?: string;
}

// Financial Dashboard
export interface FinancialDashboard {
  branchId?: string;
  period: 'today' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  currency: string;
  summary: FinancialSummary;
  revenue: RevenueTrend[];
  expenses: ExpenseTrend[];
  profitability: ProfitabilityMetrics;
  cashFlow: CashFlowSummary;
  receivables: ReceivablesSummary;
  payables: PayablesSummary;
  topExpenseCategories: Array<{category: string; amount: number; percentage: number}>;
  recentInvoices: Invoice[];
  recentPayments: Payment[];
  recentExpenses: Expense[];
  alerts: FinancialAlert[];
  generatedAt: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalInvoiced: number;
  totalReceived: number;
  totalOutstanding: number;
  cashOnHand: number;
  bankBalance: number;
}

export interface RevenueTrend {
  date: string;
  amount: number;
  transactions?: number;
}

export interface ExpenseTrend {
  date: string;
  amount: number;
  count?: number;
}

export interface ProfitabilityMetrics {
  grossProfitMargin: number;
  netProfitMargin: number;
  returnOnInvestment?: number;
  breakEvenPoint?: number;
}

export interface CashFlowSummary {
  inflow: number;
  outflow: number;
  netCashFlow: number;
  projectedEndBalance: number;
  daysOfCashRemaining?: number;
}

export interface ReceivablesSummary {
  total: number;
  current: number;
  overdue: number;
  over30Days: number;
  over60Days: number;
  over90Days: number;
  averageDaysToPayment: number;
}

export interface PayablesSummary {
  total: number;
  current: number;
  overdue: number;
  dueThisWeek: number;
  dueThisMonth: number;
}

export interface FinancialAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  category: 'invoice' | 'payment' | 'expense' | 'cash_flow' | 'reconciliation';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionRequired?: string;
  createdAt: string;
}

// Financial Filters & Search
export interface FinancialFilters extends PaginationParams {
  branchId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  customerId?: string;
  supplierId?: string;
  categoryId?: string;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
  isReconciled?: boolean;
  isTaxDeductible?: boolean;
  tags?: string[];
}

// Payment Method Configuration
export interface PaymentMethodConfig {
  id: string;
  method: PaymentMethod;
  name: string;
  isEnabled: boolean;
  isDefault: boolean;
  requiresAuth: boolean;
  allowRefunds: boolean;
  processingFeePercentage?: number;
  processingFeeFixed?: number;
  accountId?: string;
  apiKey?: string;
  merchantId?: string;
  terminalId?: string;
  settings?: Record<string, any>;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

// Signature Capture
export interface SignatureCapture {
  id: string;
  type: 'payment' | 'invoice' | 'expense' | 'reconciliation' | 'receipt';
  referenceId: string;
  signatureData: string; // Base64 image data
  signedBy: string;
  signedByName?: string;
  signedAt: string;
  ipAddress?: string;
  deviceInfo?: string;
}

// Chart Data Types (for dashboard visualizations)
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// Financial Export Types
export interface FinancialExport {
  id: string;
  type: 'invoices' | 'payments' | 'expenses' | 'reports';
  format: 'pdf' | 'excel' | 'csv';
  filters?: FinancialFilters;
  status: 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  generatedBy: string;
  generatedByUser?: User;
  generatedAt: string;
  expiresAt?: string;
  error?: string;
}

// ============================================================
// REPORTING & ANALYTICS TYPES
// ============================================================

// Report Period Types
export type ReportPeriod = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'last_year' | 'custom';

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
  period?: ReportPeriod;
  compareWith?: 'previous_period' | 'previous_year' | 'none';
}

// Base Report Filters
export interface ReportFilters extends DateRangeFilter {
  branchId?: string;
  branchIds?: string[];
  categoryId?: string;
  categoryIds?: string[];
  productId?: string;
  productIds?: string[];
  customerId?: string;
  customerIds?: string[];
  staffId?: string;
  staffIds?: string[];
  paymentMethod?: PaymentMethod;
  paymentMethods?: PaymentMethod[];
}

// Sales Report Types
export interface SalesSummaryReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branchId?: string;
  branch?: Branch;
  totalSales: number;
  totalTransactions: number;
  totalItems: number;
  totalRefunds: number;
  totalDiscounts: number;
  totalTax: number;
  netSales: number;
  averageTransaction: number;
  averageItemsPerTransaction: number;
  averageItemPrice: number;
  transactionsByHour?: Array<{hour: number; count: number; amount: number}>;
  transactionsByDay?: Array<{date: string; count: number; amount: number}>;
  transactionsByWeek?: Array<{week: string; count: number; amount: number}>;
  transactionsByMonth?: Array<{month: string; count: number; amount: number}>;
  comparison?: {
    previousPeriodSales: number;
    changeAmount: number;
    changePercentage: number;
  };
  generatedAt: string;
}

export interface SalesByProductReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  products: Array<{
    product: Product;
    quantitySold: number;
    totalSales: number;
    totalCost: number;
    grossProfit: number;
    profitMargin: number;
    averagePrice: number;
    discountAmount: number;
    refundAmount: number;
    netSales: number;
  }>;
  totalProducts: number;
  topProducts: Array<{product: Product; sales: number}>;
  generatedAt: string;
}

export interface SalesByCategoryReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  categories: Array<{
    category: Category;
    quantitySold: number;
    totalSales: number;
    totalCost: number;
    grossProfit: number;
    profitMargin: number;
    transactionCount: number;
    percentage: number;
  }>;
  generatedAt: string;
}

export interface SalesByStaffReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branchId?: string;
  staff: Array<{
    staff: User;
    transactionCount: number;
    totalSales: number;
    totalItems: number;
    averageTransaction: number;
    totalDiscounts: number;
    totalRefunds: number;
    netSales: number;
    productsSold: number;
  }>;
  generatedAt: string;
}

export interface SalesByPaymentMethodReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branchId?: string;
  paymentMethods: Array<{
    method: PaymentMethod;
    transactionCount: number;
    totalAmount: number;
    averageAmount: number;
    percentage: number;
    refundCount?: number;
    refundAmount?: number;
  }>;
  generatedAt: string;
}

export interface SalesByBranchReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branches: Array<{
    branch: Branch;
    transactionCount: number;
    totalSales: number;
    totalItems: number;
    averageTransaction: number;
    topProducts: Array<{product: Product; sales: number}>;
    staffPerformance: Array<{staff: User; sales: number}>;
  }>;
  generatedAt: string;
}

export interface SalesTrendReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
  dataPoints: Array<{
    date: string;
    sales: number;
    transactions: number;
    averageTransaction: number;
    items: number;
  }>;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  forecast?: Array<{date: string; projected: number; confidence: number}>;
  generatedAt: string;
}

// Customer Analytics Types
export interface CustomerAnalyticsReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  churnedCustomers: number;
  customerRetentionRate: number;
  customerChurnRate: number;
  totalPurchases: number;
  totalRevenue: number;
  averageCustomerValue: number;
  averageOrderValue: number;
  averageOrderFrequency: number;
  customersByType: Array<{type: 'vip' | 'regular' | 'corporate'; count: number; percentage: number}>;
  customersByLoyaltyTier: Array<{tier: string; count: number; percentage: number}>;
  generatedAt: string;
}

export interface CustomerSegmentationReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  segments: Array<{
    segment: CustomerSegment;
    customerCount: number;
    totalSales: number;
    averageValue: number;
    percentage: number;
  }>;
  rfmSegmentation?: {
    champions: number;
    loyalCustomers: number;
    potentialLoyalists: number;
    recentCustomers: number;
    promising: number;
    needsAttention: number;
    aboutToSleep: number;
    atRisk: number;
    cantLoseThem: number;
    hibernating: number;
    lost: number;
  };
  generatedAt: string;
}

export interface CustomerLifetimeValueReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  customers: Array<{
    customer: Customer;
    lifetimeValue: number;
    totalOrders: number;
    averageOrderValue: number;
    firstPurchaseDate: string;
    lastPurchaseDate: string;
    daysSinceLastPurchase: number;
    predictedLifetimeValue?: number;
    customerLifespan?: number; // in days
  }>;
  averageLifetimeValue: number;
  topCustomers: Array<{customer: Customer; lifetimeValue: number}>;
  generatedAt: string;
}

export interface CustomerPurchasePatternsReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  purchaseFrequency: {
    daily: number;
    weekly: number;
    biweekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  peakPurchaseTimes: Array<{
    dayOfWeek: string;
    hour: number;
    transactionCount: number;
  }>;
  popularProducts: Array<{
    product: Product;
    purchaseCount: number;
    customerCount: number;
  }>;
  categoryPreferences: Array<{
    category: Category;
    customerCount: number;
    percentage: number;
  }>;
  averageBasketSize: number;
  crossSellOpportunities?: Array<{
    product1: Product;
    product2: Product;
    coOccurrence: number;
  }>;
  generatedAt: string;
}

export interface NewVsReturningCustomersReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  newCustomers: {
    count: number;
    totalSales: number;
    averageOrderValue: number;
    percentage: number;
  };
  returningCustomers: {
    count: number;
    totalSales: number;
    averageOrderValue: number;
    percentage: number;
    averageVisits: number;
  };
  dataPoints: Array<{
    date: string;
    newCustomers: number;
    returningCustomers: number;
  }>;
  generatedAt: string;
}

// Product Performance Reports
export interface ProductPerformanceReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  products: Array<{
    product: Product;
    quantitySold: number;
    revenue: number;
    cost: number;
    profit: number;
    profitMargin: number;
    returnRate: number;
    stockTurnover: number;
    daysToSell: number;
    rating?: number;
  }>;
  generatedAt: string;
}

export interface BestSellersReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  byRevenue: Array<{
    product: Product;
    quantitySold: number;
    revenue: number;
    profit: number;
    transactionCount: number;
  }>;
  byQuantity: Array<{
    product: Product;
    quantitySold: number;
    revenue: number;
    profit: number;
    transactionCount: number;
  }>;
  byProfit: Array<{
    product: Product;
    quantitySold: number;
    revenue: number;
    profit: number;
    profitMargin: number;
  }>;
  trending: Array<{
    product: Product;
    currentSales: number;
    previousSales: number;
    growthPercentage: number;
  }>;
  generatedAt: string;
}

export interface SlowMovingItemsReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  products: Array<{
    product: Product;
    currentStock: number;
    quantitySold: number;
    daysInStock: number;
    estimatedDaysToSellOut: number;
    stockValue: number;
    potentialLoss: number;
    suggestedAction: 'discount' | 'bundle' | 'clearance' | 'return_to_supplier';
  }>;
  totalStockValue: number;
  totalPotentialLoss: number;
  generatedAt: string;
}

export interface ProductProfitabilityReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  products: Array<{
    product: Product;
    revenue: number;
    cost: number;
    grossProfit: number;
    grossProfitMargin: number;
    operatingCost?: number;
    netProfit: number;
    netProfitMargin: number;
    roi: number;
  }>;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageProfitMargin: number;
  generatedAt: string;
}

export interface InventoryValuationReport {
  asOfDate: string;
  locationId?: string;
  location?: InventoryLocation;
  categories: Array<{
    category: Category;
    products: Array<{
      product: Product;
      quantity: number;
      unitCost: number;
      totalCost: number;
      retailValue: number;
      potentialProfit: number;
    }>;
    totalQuantity: number;
    totalCost: number;
    totalRetailValue: number;
  }>;
  totalQuantity: number;
  totalCost: number;
  totalRetailValue: number;
  potentialProfit: number;
  generatedAt: string;
}

// Financial Analytics Reports
export interface RevenueReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branchId?: string;
  totalRevenue: number;
  revenueBySource: {
    sales: number;
    services: number;
    other: number;
  };
  revenueByCategory: Array<{category: Category; revenue: number; percentage: number}>;
  revenueByBranch?: Array<{branch: Branch; revenue: number; percentage: number}>;
  revenueByPaymentMethod: Array<{method: PaymentMethod; revenue: number; percentage: number}>;
  revenueTrend: Array<{date: string; revenue: number}>;
  comparison?: {
    previousPeriodRevenue: number;
    changeAmount: number;
    changePercentage: number;
  };
  generatedAt: string;
}

export interface ExpenseReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branchId?: string;
  totalExpenses: number;
  expensesByCategory: Array<{category: ExpenseCategory; amount: number; percentage: number}>;
  expensesByBranch?: Array<{branch: Branch; amount: number; percentage: number}>;
  expensesByPaymentMethod: Array<{method: PaymentMethod; amount: number; percentage: number}>;
  expenseTrend: Array<{date: string; amount: number}>;
  topExpenses: Array<{expense: Expense; amount: number}>;
  comparison?: {
    previousPeriodExpenses: number;
    changeAmount: number;
    changePercentage: number;
  };
  generatedAt: string;
}

export interface ProfitMarginAnalysisReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branchId?: string;
  totalRevenue: number;
  totalCost: number;
  totalExpenses: number;
  grossProfit: number;
  grossProfitMargin: number;
  operatingProfit: number;
  operatingProfitMargin: number;
  netProfit: number;
  netProfitMargin: number;
  profitByCategory: Array<{
    category: Category;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
  profitByProduct: Array<{
    product: Product;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
  profitTrend: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
  generatedAt: string;
}

export interface TaxSummaryReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branchId?: string;
  totalTaxCollected: number;
  totalTaxPaid: number;
  netTax: number;
  taxByRate: Array<{
    rate: number;
    taxableAmount: number;
    taxAmount: number;
    transactionCount: number;
  }>;
  taxByCategory: Array<{
    category: Category;
    taxableAmount: number;
    taxAmount: number;
  }>;
  taxExemptSales: number;
  taxTrend: Array<{date: string; taxCollected: number; taxPaid: number}>;
  generatedAt: string;
}

export interface CashFlowSummaryReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  branchId?: string;
  openingBalance: number;
  closingBalance: number;
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  inflowBySource: {
    sales: number;
    receivables: number;
    loans: number;
    investments: number;
    other: number;
  };
  outflowByCategory: {
    expenses: number;
    payables: number;
    payroll: number;
    inventory: number;
    other: number;
  };
  cashFlowTrend: Array<{
    date: string;
    inflow: number;
    outflow: number;
    netFlow: number;
    balance: number;
  }>;
  generatedAt: string;
}

// Report Export Types
export interface ReportExport {
  id: string;
  reportType: 'sales' | 'customer' | 'product' | 'financial';
  reportName: string;
  format: 'pdf' | 'excel' | 'csv';
  filters?: ReportFilters;
  status: 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  emailDelivery?: {
    recipients: string[];
    subject: string;
    message?: string;
    sent: boolean;
    sentAt?: string;
  };
  generatedBy: string;
  generatedByUser?: User;
  generatedAt: string;
  expiresAt?: string;
  error?: string;
}

// Dashboard Metrics Types
export interface ReportsDashboardMetrics {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  sales: {
    total: number;
    change: number;
    changePercentage: number;
  };
  revenue: {
    total: number;
    change: number;
    changePercentage: number;
  };
  profit: {
    total: number;
    margin: number;
    change: number;
    changePercentage: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    change: number;
    changePercentage: number;
  };
  products: {
    bestSeller: Product;
    topPerforming: Product[];
    slowMoving: number;
  };
  quickStats: {
    avgTransactionValue: number;
    avgItemsPerTransaction: number;
    customerRetentionRate: number;
    inventoryTurnover: number;
  };
  generatedAt: string;
}

// Chart Data for Visualizations
export interface SalesChartData {
  labels: string[];
  sales: number[];
  transactions: number[];
  profit?: number[];
}

export interface CustomerChartData {
  labels: string[];
  newCustomers: number[];
  returningCustomers: number[];
  totalCustomers?: number[];
}

export interface ProductChartData {
  labels: string[];
  quantities: number[];
  revenue: number[];
  profit?: number[];
}

export interface FinancialChartData {
  labels: string[];
  revenue: number[];
  expenses: number[];
  profit: number[];
}
