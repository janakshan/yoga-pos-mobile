import type {NavigatorScreenParams} from '@react-navigation/native';

/**
 * Navigation Types
 * Type definitions for navigation routes and params
 */

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  PinLogin: {username?: string};
  PinSetup: undefined;
  ForgotPassword: undefined;
  Unauthorized: {message?: string};
};

// Main Tab Navigator
export type MainTabParamList = {
  Dashboard: undefined;
  POS: NavigatorScreenParams<POSStackParamList>;
  Inventory: NavigatorScreenParams<InventoryStackParamList>;
  Products: NavigatorScreenParams<ProductsStackParamList>;
  Customers: NavigatorScreenParams<CustomersStackParamList>;
  More: NavigatorScreenParams<MoreStackParamList>;
};

// POS Stack Navigator
export type POSStackParamList = {
  POSMain: undefined;
  POSFastCheckout: undefined;
  POSCheckout: undefined;
  POSReceipt: {transactionId: string};
  POSReturns: undefined;
  POSReturnDetails: {transactionId: string};
  POSHeldSales: undefined;
  POSBarcodeScan: {onScan: (barcode: string) => void};
  POSCustomerSelect: undefined;
};

// Inventory Stack Navigator
export type InventoryStackParamList = {
  InventoryDashboard: undefined;
  StockLevels: {locationId?: string};
  StockLevelDetails: {productId: string; locationId: string};
  StockTransferList: undefined;
  StockTransferDetails: {transferId: string};
  StockTransferCreate: undefined;
  StockTransferReceive: {transferId: string};
  StockAdjustmentList: undefined;
  StockAdjustmentDetails: {adjustmentId: string};
  StockAdjustmentCreate: undefined;
  CycleCountList: undefined;
  CycleCountDetails: {cycleCountId: string};
  CycleCountCreate: undefined;
  CycleCountPerform: {cycleCountId: string};
  PhysicalInventoryList: undefined;
  PhysicalInventoryDetails: {inventoryId: string};
  PhysicalInventoryCreate: undefined;
  PhysicalInventoryPerform: {inventoryId: string};
  WasteLossList: undefined;
  WasteLossDetails: {recordId: string};
  WasteLossCreate: undefined;
  LowStockAlerts: {locationId?: string};
  InventoryTransactions: {filters?: any};
  BarcodeScan: {onScan: (result: any) => void};
  SerialNumberScan: {productId: string; onScan: (serial: string) => void};
};

// Products Stack Navigator
export type ProductsStackParamList = {
  ProductList: undefined;
  ProductDetails: {productId: string};
  ProductCreate: undefined;
  ProductEdit: {productId: string};
};

// Customers Stack Navigator
export type CustomersStackParamList = {
  CustomerList: undefined;
  CustomerDetails: {customerId: string};
  CustomerForm: {mode: 'create' | 'edit'; customerId?: string};
  CustomerQRScan: undefined;
};

// More Stack Navigator
export type MoreStackParamList = {
  MoreMenu: undefined;
  Profile: undefined;
  Settings: undefined;
  Reports: undefined;
  Help: undefined;
  About: undefined;
};

// Navigation prop types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
