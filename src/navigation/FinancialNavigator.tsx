/**
 * Financial Navigator
 * Stack navigator for financial management screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {FinancialStackParamList} from './types';

// Import Financial Screens
import {
  // Dashboard
  FinancialDashboardScreen,

  // Invoices
  InvoiceListScreen,
  InvoiceDetailsScreen,
  InvoiceFormScreen,
  InvoicePreviewScreen,
  InvoiceTemplatesScreen,

  // Payments
  PaymentListScreen,
  PaymentDetailsScreen,
  PaymentFormScreen,
  PaymentHistoryScreen,
  RefundFormScreen,
  PaymentReconciliationScreen,

  // Expenses
  ExpenseListScreen,
  ExpenseDetailsScreen,
  ExpenseFormScreen,
  ExpenseApprovalsScreen,
  ExpenseCameraCaptureScreen,
  ExpenseCategoriesScreen,

  // Bank Accounts
  BankAccountListScreen,
  BankAccountDetailsScreen,
  BankAccountFormScreen,

  // Bank Reconciliation
  ReconciliationListScreen,
  ReconciliationDetailsScreen,
  ReconciliationStartScreen,
  ReconciliationPerformScreen,

  // Cash Flow
  CashFlowOverviewScreen,
  CashFlowForecastListScreen,
  CashFlowForecastDetailsScreen,

  // Reports
  FinancialReportsScreen,
  ProfitLossReportScreen,
  BalanceSheetReportScreen,
  CashFlowReportScreen,
  TaxReportScreen,
  ReportPreviewScreen,

  // EOD Reconciliation
  EODReconciliationListScreen,
  EODReconciliationDetailsScreen,
  EODReconciliationPerformScreen,

  // Signature Capture
  SignatureCaptureScreen,
} from '@screens/financial';

const Stack = createNativeStackNavigator<FinancialStackParamList>();

export const FinancialNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}>
      {/* Dashboard */}
      <Stack.Screen
        name="FinancialDashboard"
        component={FinancialDashboardScreen}
        options={{
          title: 'Financial',
          headerShown: false,
        }}
      />

      {/* Invoice Screens */}
      <Stack.Screen
        name="InvoiceList"
        component={InvoiceListScreen}
        options={{
          title: 'Invoices',
        }}
      />
      <Stack.Screen
        name="InvoiceDetails"
        component={InvoiceDetailsScreen}
        options={{
          title: 'Invoice Details',
        }}
      />
      <Stack.Screen
        name="InvoiceForm"
        component={InvoiceFormScreen}
        options={{
          title: 'Invoice',
        }}
      />
      <Stack.Screen
        name="InvoicePreview"
        component={InvoicePreviewScreen}
        options={{
          title: 'Invoice Preview',
        }}
      />
      <Stack.Screen
        name="InvoiceTemplates"
        component={InvoiceTemplatesScreen}
        options={{
          title: 'Invoice Templates',
        }}
      />

      {/* Payment Screens */}
      <Stack.Screen
        name="PaymentList"
        component={PaymentListScreen}
        options={{
          title: 'Payments',
        }}
      />
      <Stack.Screen
        name="PaymentDetails"
        component={PaymentDetailsScreen}
        options={{
          title: 'Payment Details',
        }}
      />
      <Stack.Screen
        name="PaymentForm"
        component={PaymentFormScreen}
        options={{
          title: 'Record Payment',
        }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{
          title: 'Payment History',
        }}
      />
      <Stack.Screen
        name="RefundForm"
        component={RefundFormScreen}
        options={{
          title: 'Process Refund',
        }}
      />
      <Stack.Screen
        name="PaymentReconciliation"
        component={PaymentReconciliationScreen}
        options={{
          title: 'Payment Reconciliation',
        }}
      />

      {/* Expense Screens */}
      <Stack.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={{
          title: 'Expenses',
        }}
      />
      <Stack.Screen
        name="ExpenseDetails"
        component={ExpenseDetailsScreen}
        options={{
          title: 'Expense Details',
        }}
      />
      <Stack.Screen
        name="ExpenseForm"
        component={ExpenseFormScreen}
        options={{
          title: 'Expense',
        }}
      />
      <Stack.Screen
        name="ExpenseApprovals"
        component={ExpenseApprovalsScreen}
        options={{
          title: 'Expense Approvals',
        }}
      />
      <Stack.Screen
        name="ExpenseCameraCapture"
        component={ExpenseCameraCaptureScreen}
        options={{
          title: 'Capture Receipt',
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="ExpenseCategories"
        component={ExpenseCategoriesScreen}
        options={{
          title: 'Expense Categories',
        }}
      />

      {/* Bank Account Screens */}
      <Stack.Screen
        name="BankAccountList"
        component={BankAccountListScreen}
        options={{
          title: 'Bank Accounts',
        }}
      />
      <Stack.Screen
        name="BankAccountDetails"
        component={BankAccountDetailsScreen}
        options={{
          title: 'Account Details',
        }}
      />
      <Stack.Screen
        name="BankAccountForm"
        component={BankAccountFormScreen}
        options={{
          title: 'Bank Account',
        }}
      />

      {/* Bank Reconciliation Screens */}
      <Stack.Screen
        name="ReconciliationList"
        component={ReconciliationListScreen}
        options={{
          title: 'Reconciliations',
        }}
      />
      <Stack.Screen
        name="ReconciliationDetails"
        component={ReconciliationDetailsScreen}
        options={{
          title: 'Reconciliation Details',
        }}
      />
      <Stack.Screen
        name="ReconciliationStart"
        component={ReconciliationStartScreen}
        options={{
          title: 'Start Reconciliation',
        }}
      />
      <Stack.Screen
        name="ReconciliationPerform"
        component={ReconciliationPerformScreen}
        options={{
          title: 'Perform Reconciliation',
        }}
      />

      {/* Cash Flow Screens */}
      <Stack.Screen
        name="CashFlowOverview"
        component={CashFlowOverviewScreen}
        options={{
          title: 'Cash Flow',
        }}
      />
      <Stack.Screen
        name="CashFlowForecastList"
        component={CashFlowForecastListScreen}
        options={{
          title: 'Cash Flow Forecasts',
        }}
      />
      <Stack.Screen
        name="CashFlowForecastDetails"
        component={CashFlowForecastDetailsScreen}
        options={{
          title: 'Forecast Details',
        }}
      />

      {/* Financial Reports Screens */}
      <Stack.Screen
        name="FinancialReports"
        component={FinancialReportsScreen}
        options={{
          title: 'Financial Reports',
        }}
      />
      <Stack.Screen
        name="ProfitLossReport"
        component={ProfitLossReportScreen}
        options={{
          title: 'Profit & Loss',
        }}
      />
      <Stack.Screen
        name="BalanceSheetReport"
        component={BalanceSheetReportScreen}
        options={{
          title: 'Balance Sheet',
        }}
      />
      <Stack.Screen
        name="CashFlowReport"
        component={CashFlowReportScreen}
        options={{
          title: 'Cash Flow Report',
        }}
      />
      <Stack.Screen
        name="TaxReport"
        component={TaxReportScreen}
        options={{
          title: 'Tax Report',
        }}
      />
      <Stack.Screen
        name="ReportPreview"
        component={ReportPreviewScreen}
        options={{
          title: 'Report Preview',
        }}
      />

      {/* EOD Reconciliation Screens */}
      <Stack.Screen
        name="EODReconciliationList"
        component={EODReconciliationListScreen}
        options={{
          title: 'End of Day',
        }}
      />
      <Stack.Screen
        name="EODReconciliationDetails"
        component={EODReconciliationDetailsScreen}
        options={{
          title: 'EOD Details',
        }}
      />
      <Stack.Screen
        name="EODReconciliationPerform"
        component={EODReconciliationPerformScreen}
        options={{
          title: 'End of Day Reconciliation',
        }}
      />

      {/* Signature Capture Screen */}
      <Stack.Screen
        name="SignatureCapture"
        component={SignatureCaptureScreen}
        options={{
          title: 'Signature',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default FinancialNavigator;
