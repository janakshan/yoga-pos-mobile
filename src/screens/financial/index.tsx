/**
 * Financial Screens Index
 * Exports all financial management screens
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Export the main dashboard
export { FinancialDashboardScreen } from './FinancialDashboardScreen';

// Placeholder Screen Component
const PlaceholderScreen: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderIcon}>🚧</Text>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderDescription}>{description}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// Invoice Screens
export const InvoiceListScreen = () => (
  <ScrollView style={styles.container}>
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderIcon}>📄</Text>
      <Text style={styles.placeholderTitle}>Invoice List</Text>
      <Text style={styles.placeholderDescription}>
        View and manage all invoices. This screen will display:
        {'\n\n'}• List of all invoices with filters
        {'\n'}• Search by invoice number or customer
        {'\n'}• Filter by status (draft, sent, paid, overdue)
        {'\n'}• Quick actions (send, mark paid, view)
        {'\n'}• Create new invoice button
      </Text>
    </View>
  </ScrollView>
);

export const InvoiceDetailsScreen = () => (
  <PlaceholderScreen
    title="Invoice Details"
    description="View detailed invoice information, items, payment history, and actions to send, edit, or mark as paid."
  />
);

export const InvoiceFormScreen = () => (
  <PlaceholderScreen
    title="Invoice Form"
    description="Create or edit invoices with customer selection, line items, taxes, discounts, and payment terms."
  />
);

export const InvoicePreviewScreen = () => (
  <PlaceholderScreen
    title="Invoice Preview"
    description="Preview invoice before sending with option to download PDF or send via email."
  />
);

export const InvoiceTemplatesScreen = () => (
  <PlaceholderScreen
    title="Invoice Templates"
    description="Manage invoice templates with custom layouts, colors, and branding options."
  />
);

export const InvoiceTemplateFormScreen = () => (
  <PlaceholderScreen
    title="Invoice Template Form"
    description="Create or edit invoice templates."
  />
);

// Payment Screens
export const PaymentListScreen = () => (
  <ScrollView style={styles.container}>
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderIcon}>💳</Text>
      <Text style={styles.placeholderTitle}>Payment List</Text>
      <Text style={styles.placeholderDescription}>
        View and manage all payments. This screen will display:
        {'\n\n'}• List of all payments with filters
        {'\n'}• Filter by payment method and status
        {'\n'}• Search by reference or customer
        {'\n'}• View payment details
        {'\n'}• Record new payment button
      </Text>
    </View>
  </ScrollView>
);

export const PaymentDetailsScreen = () => (
  <PlaceholderScreen
    title="Payment Details"
    description="View payment information including method, amount, status, and related invoices."
  />
);

export const PaymentFormScreen = () => (
  <PlaceholderScreen
    title="Record Payment"
    description="Record a new payment with payment method selection, amount, and invoice linking."
  />
);

export const PaymentHistoryScreen = () => (
  <PlaceholderScreen
    title="Payment History"
    description="View complete payment history for a customer or invoice."
  />
);

export const RefundFormScreen = () => (
  <PlaceholderScreen
    title="Process Refund"
    description="Process refund for a payment with reason and amount selection."
  />
);

export const PaymentReconciliationScreen = () => (
  <PlaceholderScreen
    title="Payment Reconciliation"
    description="Reconcile payments with bank transactions."
  />
);

// Expense Screens
export const ExpenseListScreen = () => (
  <ScrollView style={styles.container}>
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderIcon}>💰</Text>
      <Text style={styles.placeholderTitle}>Expense List</Text>
      <Text style={styles.placeholderDescription}>
        View and manage all expenses. This screen will display:
        {'\n\n'}• List of all expenses with filters
        {'\n'}• Filter by category and status
        {'\n'}• View pending approvals
        {'\n'}• Quick expense entry
        {'\n'}• Receipt camera capture
      </Text>
    </View>
  </ScrollView>
);

export const ExpenseDetailsScreen = () => (
  <PlaceholderScreen
    title="Expense Details"
    description="View expense details including category, amount, receipts, and approval status."
  />
);

export const ExpenseFormScreen = () => (
  <PlaceholderScreen
    title="Expense Form"
    description="Create or edit expenses with category selection, amount, and receipt upload."
  />
);

export const ExpenseApprovalsScreen = () => (
  <PlaceholderScreen
    title="Expense Approvals"
    description="Review and approve/reject pending expense requests."
  />
);

export const ExpenseCameraCaptureScreen = () => (
  <PlaceholderScreen
    title="Capture Receipt"
    description="Use camera to capture and attach receipts to expenses with OCR processing."
  />
);

export const ExpenseCategoriesScreen = () => (
  <PlaceholderScreen
    title="Expense Categories"
    description="Manage expense categories with tax deduction and approval settings."
  />
);

// Bank Account Screens
export const BankAccountListScreen = () => (
  <PlaceholderScreen
    title="Bank Accounts"
    description="View and manage all bank accounts with balances and recent transactions."
  />
);

export const BankAccountDetailsScreen = () => (
  <PlaceholderScreen
    title="Account Details"
    description="View bank account details, balance, and transaction history."
  />
);

export const BankAccountFormScreen = () => (
  <PlaceholderScreen
    title="Bank Account Form"
    description="Create or edit bank account information."
  />
);

// Bank Reconciliation Screens
export const ReconciliationListScreen = () => (
  <PlaceholderScreen
    title="Reconciliations"
    description="View all bank reconciliations with status and date range."
  />
);

export const ReconciliationDetailsScreen = () => (
  <PlaceholderScreen
    title="Reconciliation Details"
    description="View reconciliation details including matched and unmatched transactions."
  />
);

export const ReconciliationStartScreen = () => (
  <PlaceholderScreen
    title="Start Reconciliation"
    description="Start a new bank reconciliation by entering statement balance and date range."
  />
);

export const ReconciliationPerformScreen = () => (
  <PlaceholderScreen
    title="Perform Reconciliation"
    description="Match bank transactions with system records and resolve discrepancies."
  />
);

// Cash Flow Screens
export const CashFlowOverviewScreen = () => (
  <PlaceholderScreen
    title="Cash Flow Overview"
    description="View cash flow summary with inflows, outflows, and projections."
  />
);

export const CashFlowForecastListScreen = () => (
  <PlaceholderScreen
    title="Cash Flow Forecasts"
    description="View and manage cash flow forecasts."
  />
);

export const CashFlowForecastDetailsScreen = () => (
  <PlaceholderScreen
    title="Forecast Details"
    description="View detailed cash flow forecast with actual vs. projected comparison."
  />
);

export const CashFlowForecastFormScreen = () => (
  <PlaceholderScreen
    title="Cash Flow Forecast Form"
    description="Create or edit cash flow forecasts."
  />
);

// Financial Reports Screens
export const FinancialReportsScreen = () => (
  <ScrollView style={styles.container}>
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderIcon}>📊</Text>
      <Text style={styles.placeholderTitle}>Financial Reports</Text>
      <Text style={styles.placeholderDescription}>
        Access all financial reports including:
        {'\n\n'}• Profit & Loss Statement
        {'\n'}• Balance Sheet
        {'\n'}• Cash Flow Report
        {'\n'}• Income Statement
        {'\n'}• Tax Reports
        {'\n'}• Custom Reports
        {'\n\n'}Each report can be generated for custom date ranges and exported as PDF.
      </Text>
    </View>
  </ScrollView>
);

export const ProfitLossReportScreen = () => (
  <PlaceholderScreen
    title="Profit & Loss Report"
    description="View profit and loss statement with revenue, expenses, and net income."
  />
);

export const BalanceSheetReportScreen = () => (
  <PlaceholderScreen
    title="Balance Sheet"
    description="View balance sheet with assets, liabilities, and equity."
  />
);

export const CashFlowReportScreen = () => (
  <PlaceholderScreen
    title="Cash Flow Report"
    description="View cash flow report with operating, investing, and financing activities."
  />
);

export const TaxReportScreen = () => (
  <PlaceholderScreen
    title="Tax Report"
    description="View tax report with taxable income, deductions, and tax calculations."
  />
);

export const ReportPreviewScreen = () => (
  <PlaceholderScreen
    title="Report Preview"
    description="Preview and download financial reports in PDF format."
  />
);

// EOD Reconciliation Screens
export const EODReconciliationListScreen = () => (
  <PlaceholderScreen
    title="End of Day Reconciliations"
    description="View all end of day reconciliations with cash variance and status."
  />
);

export const EODReconciliationDetailsScreen = () => (
  <PlaceholderScreen
    title="EOD Details"
    description="View end of day reconciliation details including sales, payments, and cash movements."
  />
);

export const EODReconciliationPerformScreen = () => (
  <PlaceholderScreen
    title="End of Day Reconciliation"
    description="Perform end of day reconciliation with cash counting and signature capture."
  />
);

// Signature Capture Screen
export const SignatureCaptureScreen = () => (
  <PlaceholderScreen
    title="Signature Capture"
    description="Capture digital signature for payments, receipts, or reconciliations."
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F5F5',
    minHeight: 500,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 400,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
