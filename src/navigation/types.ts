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
  POSCheckout: {cartItems: any[]};
  POSReceipt: {transactionId: string};
};

// Inventory Stack Navigator
export type InventoryStackParamList = {
  InventoryList: undefined;
  InventoryDetails: {productId: string};
  InventoryAdjustment: {productId: string};
  StockTransfer: undefined;
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
  CustomerCreate: undefined;
  CustomerEdit: {customerId: string};
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
