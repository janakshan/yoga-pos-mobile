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
  Procurement: NavigatorScreenParams<ProcurementStackParamList>;
  Financial: NavigatorScreenParams<FinancialStackParamList>;
  Reports: NavigatorScreenParams<ReportsStackParamList>;
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

// Procurement Stack Navigator
export type ProcurementStackParamList = {
  SupplierList: undefined;
  SupplierDetails: {supplierId: string};
  SupplierForm: {mode: 'create' | 'edit'; supplierId?: string};
  PurchaseOrderList: undefined;
  PurchaseOrderDetails: {purchaseOrderId: string};
  PurchaseOrderForm: {mode: 'create' | 'edit'; purchaseOrderId?: string};
  POApproval: undefined;
  Receiving: {purchaseOrderId: string; locationId: string};
};

// Financial Stack Navigator
export type FinancialStackParamList = {
  // Dashboard
  FinancialDashboard: undefined;

  // Invoices
  InvoiceList: undefined;
  InvoiceDetails: {invoiceId: string};
  InvoiceForm: {mode: 'create' | 'edit'; invoiceId?: string};
  InvoicePreview: {invoiceId: string};
  InvoiceTemplates: undefined;
  InvoiceTemplateForm: {mode: 'create' | 'edit'; templateId?: string};

  // Payments
  PaymentList: undefined;
  PaymentDetails: {paymentId: string};
  PaymentForm: {mode: 'create' | 'record'; invoiceId?: string; paymentId?: string};
  PaymentHistory: {customerId?: string; invoiceId?: string};
  RefundForm: {paymentId: string};
  PaymentReconciliation: undefined;

  // Expenses
  ExpenseList: undefined;
  ExpenseDetails: {expenseId: string};
  ExpenseForm: {mode: 'create' | 'edit'; expenseId?: string};
  ExpenseApprovals: undefined;
  ExpenseCameraCapture: {expenseId?: string; onCapture: (uri: string) => void};
  ExpenseCategories: undefined;

  // Bank Accounts
  BankAccountList: undefined;
  BankAccountDetails: {accountId: string};
  BankAccountForm: {mode: 'create' | 'edit'; accountId?: string};

  // Bank Reconciliation
  ReconciliationList: {bankAccountId?: string};
  ReconciliationDetails: {reconciliationId: string};
  ReconciliationStart: {bankAccountId: string};
  ReconciliationPerform: {reconciliationId: string};

  // Cash Flow
  CashFlowOverview: undefined;
  CashFlowForecastList: undefined;
  CashFlowForecastDetails: {forecastId: string};
  CashFlowForecastForm: {mode: 'create' | 'edit'; forecastId?: string};

  // Reports
  FinancialReports: undefined;
  ProfitLossReport: {startDate?: string; endDate?: string};
  BalanceSheetReport: {asOfDate?: string};
  CashFlowReport: {startDate?: string; endDate?: string};
  TaxReport: {startDate?: string; endDate?: string; taxType?: string};
  ReportPreview: {reportId: string};

  // EOD Reconciliation
  EODReconciliationList: undefined;
  EODReconciliationDetails: {reconciliationId: string};
  EODReconciliationPerform: {date?: string};

  // Signature Capture
  SignatureCapture: {
    type: 'payment' | 'invoice' | 'expense' | 'reconciliation' | 'receipt';
    referenceId: string;
    onSave: (signatureData: string) => void;
  };
};

// Reports Stack Navigator
export type ReportsStackParamList = {
  // Dashboard
  ReportsDashboard: undefined;

  // Sales Reports
  SalesReports: {period?: string; startDate?: string; endDate?: string};
  SalesSummary: {period?: string; startDate?: string; endDate?: string};
  SalesByProduct: {period?: string; startDate?: string; endDate?: string};
  SalesByCategory: {period?: string; startDate?: string; endDate?: string};
  SalesByStaff: {period?: string; startDate?: string; endDate?: string};
  SalesByPaymentMethod: {period?: string; startDate?: string; endDate?: string};
  SalesByBranch: {period?: string; startDate?: string; endDate?: string};
  SalesTrends: {period?: string; startDate?: string; endDate?: string};

  // Customer Reports
  CustomerReports: {period?: string; startDate?: string; endDate?: string};
  CustomerAnalytics: {period?: string; startDate?: string; endDate?: string};
  CustomerSegmentation: {period?: string; startDate?: string; endDate?: string};
  CustomerLifetimeValue: {period?: string; startDate?: string; endDate?: string};
  CustomerPurchasePatterns: {period?: string; startDate?: string; endDate?: string};
  NewVsReturningCustomers: {period?: string; startDate?: string; endDate?: string};

  // Product Reports
  ProductReports: {period?: string; startDate?: string; endDate?: string};
  ProductPerformance: {period?: string; startDate?: string; endDate?: string};
  BestSellers: {period?: string; startDate?: string; endDate?: string};
  SlowMovingItems: {period?: string; startDate?: string; endDate?: string};
  ProductProfitability: {period?: string; startDate?: string; endDate?: string};
  InventoryValuation: {asOfDate?: string};

  // Financial Reports
  FinancialReportsOverview: {period?: string; startDate?: string; endDate?: string};
  RevenueReport: {period?: string; startDate?: string; endDate?: string};
  ExpenseAnalysis: {period?: string; startDate?: string; endDate?: string};
  ProfitMarginReport: {period?: string; startDate?: string; endDate?: string};
  TaxSummaryReport: {period?: string; startDate?: string; endDate?: string};
  CashFlowSummaryReport: {period?: string; startDate?: string; endDate?: string};

  // Export & Share
  ReportExport: {
    reportType: 'sales' | 'customer' | 'product' | 'financial';
    reportName: string;
    filters?: any;
  };
  ReportShare: {
    reportType: 'sales' | 'customer' | 'product' | 'financial';
    reportName: string;
    filters?: any;
  };
};

// More Stack Navigator
export type MoreStackParamList = {
  MoreMenu: undefined;
  Profile: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};

// Navigation prop types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
