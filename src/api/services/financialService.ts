/**
 * Financial Service
 * API service for financial management operations
 */

import { apiClient } from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  Invoice,
  InvoiceTemplate,
  Payment,
  Refund,
  Expense,
  ExpenseCategory,
  BankAccount,
  BankReconciliation,
  BankTransaction,
  CashFlowEntry,
  CashFlowForecast,
  FinancialReport,
  ProfitLossStatement,
  BalanceSheet,
  CashFlowReport,
  TaxReport,
  EODReconciliation,
  FinancialDashboard,
  FinancialFilters,
  PaymentMethodConfig,
  SignatureCapture,
  FinancialExport,
  InvoiceStatus,
  PaymentStatus,
  ExpenseStatus,
  PaymentMethod,
} from '../../types/api.types';

// ============================================================
// INVOICE OPERATIONS
// ============================================================

export const financialService = {
  // Invoice Management
  async getInvoices(filters?: FinancialFilters): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
    return apiClient.get<PaginatedResponse<Invoice>>('/financial/invoices', { params: filters });
  },

  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    return apiClient.get<Invoice>(`/financial/invoices/${id}`);
  },

  async createInvoice(invoice: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    return apiClient.post<Invoice>('/financial/invoices', invoice);
  },

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    return apiClient.put<Invoice>(`/financial/invoices/${id}`, invoice);
  },

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/financial/invoices/${id}`);
  },

  async sendInvoice(id: string, email?: string): Promise<ApiResponse<Invoice>> {
    return apiClient.post<Invoice>(`/financial/invoices/${id}/send`, { email });
  },

  async duplicateInvoice(id: string): Promise<ApiResponse<Invoice>> {
    return apiClient.post<Invoice>(`/financial/invoices/${id}/duplicate`);
  },

  async markInvoiceAsPaid(id: string, paymentId?: string): Promise<ApiResponse<Invoice>> {
    return apiClient.post<Invoice>(`/financial/invoices/${id}/mark-paid`, { paymentId });
  },

  async markInvoiceAsVoid(id: string, reason?: string): Promise<ApiResponse<Invoice>> {
    return apiClient.post<Invoice>(`/financial/invoices/${id}/void`, { reason });
  },

  async getInvoicePdf(id: string): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(`/financial/invoices/${id}/pdf`, { responseType: 'blob' });
  },

  async getOverdueInvoices(branchId?: string): Promise<ApiResponse<Invoice[]>> {
    return apiClient.get<Invoice[]>('/financial/invoices/overdue', { params: { branchId } });
  },

  // Invoice Templates
  async getInvoiceTemplates(): Promise<ApiResponse<InvoiceTemplate[]>> {
    return apiClient.get<InvoiceTemplate[]>('/financial/invoice-templates');
  },

  async getInvoiceTemplate(id: string): Promise<ApiResponse<InvoiceTemplate>> {
    return apiClient.get<InvoiceTemplate>(`/financial/invoice-templates/${id}`);
  },

  async createInvoiceTemplate(template: Partial<InvoiceTemplate>): Promise<ApiResponse<InvoiceTemplate>> {
    return apiClient.post<InvoiceTemplate>('/financial/invoice-templates', template);
  },

  async updateInvoiceTemplate(id: string, template: Partial<InvoiceTemplate>): Promise<ApiResponse<InvoiceTemplate>> {
    return apiClient.put<InvoiceTemplate>(`/financial/invoice-templates/${id}`, template);
  },

  async deleteInvoiceTemplate(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/financial/invoice-templates/${id}`);
  },

  async setDefaultInvoiceTemplate(id: string): Promise<ApiResponse<InvoiceTemplate>> {
    return apiClient.post<InvoiceTemplate>(`/financial/invoice-templates/${id}/set-default`);
  },

  // ============================================================
  // PAYMENT OPERATIONS
  // ============================================================

  async getPayments(filters?: FinancialFilters): Promise<ApiResponse<PaginatedResponse<Payment>>> {
    return apiClient.get<PaginatedResponse<Payment>>('/financial/payments', { params: filters });
  },

  async getPayment(id: string): Promise<ApiResponse<Payment>> {
    return apiClient.get<Payment>(`/financial/payments/${id}`);
  },

  async createPayment(payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>('/financial/payments', payment);
  },

  async recordPayment(data: {
    invoiceId?: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
  }): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>('/financial/payments/record', data);
  },

  async updatePayment(id: string, payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return apiClient.put<Payment>(`/financial/payments/${id}`, payment);
  },

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/financial/payments/${id}`);
  },

  async processPayment(id: string): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>(`/financial/payments/${id}/process`);
  },

  async reconcilePayment(id: string, bankTransactionId?: string): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>(`/financial/payments/${id}/reconcile`, { bankTransactionId });
  },

  async getPaymentHistory(params?: {
    customerId?: string;
    invoiceId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/financial/payments/history', { params });
  },

  // Refund Operations
  async createRefund(refund: Partial<Refund>): Promise<ApiResponse<Refund>> {
    return apiClient.post<Refund>('/financial/refunds', refund);
  },

  async processRefund(paymentId: string, data: {
    amount: number;
    reason: string;
    reasonCategory?: string;
  }): Promise<ApiResponse<Refund>> {
    return apiClient.post<Refund>(`/financial/payments/${paymentId}/refund`, data);
  },

  async getRefund(id: string): Promise<ApiResponse<Refund>> {
    return apiClient.get<Refund>(`/financial/refunds/${id}`);
  },

  async getRefunds(filters?: FinancialFilters): Promise<ApiResponse<PaginatedResponse<Refund>>> {
    return apiClient.get<PaginatedResponse<Refund>>('/financial/refunds', { params: filters });
  },

  // ============================================================
  // EXPENSE OPERATIONS
  // ============================================================

  async getExpenses(filters?: FinancialFilters): Promise<ApiResponse<PaginatedResponse<Expense>>> {
    return apiClient.get<PaginatedResponse<Expense>>('/financial/expenses', { params: filters });
  },

  async getExpense(id: string): Promise<ApiResponse<Expense>> {
    return apiClient.get<Expense>(`/financial/expenses/${id}`);
  },

  async createExpense(expense: Partial<Expense>): Promise<ApiResponse<Expense>> {
    return apiClient.post<Expense>('/financial/expenses', expense);
  },

  async updateExpense(id: string, expense: Partial<Expense>): Promise<ApiResponse<Expense>> {
    return apiClient.put<Expense>(`/financial/expenses/${id}`, expense);
  },

  async deleteExpense(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/financial/expenses/${id}`);
  },

  async approveExpense(id: string, comments?: string): Promise<ApiResponse<Expense>> {
    return apiClient.post<Expense>(`/financial/expenses/${id}/approve`, { comments });
  },

  async rejectExpense(id: string, reason: string): Promise<ApiResponse<Expense>> {
    return apiClient.post<Expense>(`/financial/expenses/${id}/reject`, { reason });
  },

  async markExpenseAsPaid(id: string, paymentId?: string): Promise<ApiResponse<Expense>> {
    return apiClient.post<Expense>(`/financial/expenses/${id}/mark-paid`, { paymentId });
  },

  async uploadExpenseReceipt(id: string, file: FormData): Promise<ApiResponse<Expense>> {
    return apiClient.post<Expense>(`/financial/expenses/${id}/receipts`, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteExpenseReceipt(expenseId: string, receiptId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/financial/expenses/${expenseId}/receipts/${receiptId}`);
  },

  async getPendingApprovals(branchId?: string): Promise<ApiResponse<Expense[]>> {
    return apiClient.get<Expense[]>('/financial/expenses/pending-approval', { params: { branchId } });
  },

  // Expense Categories
  async getExpenseCategories(): Promise<ApiResponse<ExpenseCategory[]>> {
    return apiClient.get<ExpenseCategory[]>('/financial/expense-categories');
  },

  async getExpenseCategory(id: string): Promise<ApiResponse<ExpenseCategory>> {
    return apiClient.get<ExpenseCategory>(`/financial/expense-categories/${id}`);
  },

  async createExpenseCategory(category: Partial<ExpenseCategory>): Promise<ApiResponse<ExpenseCategory>> {
    return apiClient.post<ExpenseCategory>('/financial/expense-categories', category);
  },

  async updateExpenseCategory(id: string, category: Partial<ExpenseCategory>): Promise<ApiResponse<ExpenseCategory>> {
    return apiClient.put<ExpenseCategory>(`/financial/expense-categories/${id}`, category);
  },

  async deleteExpenseCategory(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/financial/expense-categories/${id}`);
  },

  // ============================================================
  // BANK ACCOUNT OPERATIONS
  // ============================================================

  async getBankAccounts(branchId?: string): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get<BankAccount[]>('/financial/bank-accounts', { params: { branchId } });
  },

  async getBankAccount(id: string): Promise<ApiResponse<BankAccount>> {
    return apiClient.get<BankAccount>(`/financial/bank-accounts/${id}`);
  },

  async createBankAccount(account: Partial<BankAccount>): Promise<ApiResponse<BankAccount>> {
    return apiClient.post<BankAccount>('/financial/bank-accounts', account);
  },

  async updateBankAccount(id: string, account: Partial<BankAccount>): Promise<ApiResponse<BankAccount>> {
    return apiClient.put<BankAccount>(`/financial/bank-accounts/${id}`, account);
  },

  async deleteBankAccount(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/financial/bank-accounts/${id}`);
  },

  async setPrimaryBankAccount(id: string): Promise<ApiResponse<BankAccount>> {
    return apiClient.post<BankAccount>(`/financial/bank-accounts/${id}/set-primary`);
  },

  async updateBankAccountBalance(id: string, balance: number): Promise<ApiResponse<BankAccount>> {
    return apiClient.post<BankAccount>(`/financial/bank-accounts/${id}/update-balance`, { balance });
  },

  // ============================================================
  // BANK RECONCILIATION
  // ============================================================

  async getBankReconciliations(bankAccountId?: string): Promise<ApiResponse<BankReconciliation[]>> {
    return apiClient.get<BankReconciliation[]>('/financial/reconciliations', { params: { bankAccountId } });
  },

  async getBankReconciliation(id: string): Promise<ApiResponse<BankReconciliation>> {
    return apiClient.get<BankReconciliation>(`/financial/reconciliations/${id}`);
  },

  async startReconciliation(data: {
    bankAccountId: string;
    startDate: string;
    endDate: string;
    statementBalance: number;
  }): Promise<ApiResponse<BankReconciliation>> {
    return apiClient.post<BankReconciliation>('/financial/reconciliations/start', data);
  },

  async completeReconciliation(id: string): Promise<ApiResponse<BankReconciliation>> {
    return apiClient.post<BankReconciliation>(`/financial/reconciliations/${id}/complete`);
  },

  async addReconciliationAdjustment(id: string, adjustment: {
    type: 'bank_charge' | 'interest' | 'error_correction' | 'other';
    amount: number;
    description: string;
  }): Promise<ApiResponse<BankReconciliation>> {
    return apiClient.post<BankReconciliation>(`/financial/reconciliations/${id}/adjustments`, adjustment);
  },

  async matchTransaction(reconciliationId: string, data: {
    bankTransactionId: string;
    systemTransactionId: string;
  }): Promise<ApiResponse<BankReconciliation>> {
    return apiClient.post<BankReconciliation>(`/financial/reconciliations/${reconciliationId}/match`, data);
  },

  async importBankTransactions(bankAccountId: string, file: FormData): Promise<ApiResponse<BankTransaction[]>> {
    return apiClient.post<BankTransaction[]>(`/financial/bank-accounts/${bankAccountId}/import-transactions`, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getBankTransactions(bankAccountId: string, params?: {
    startDate?: string;
    endDate?: string;
    isReconciled?: boolean;
  }): Promise<ApiResponse<BankTransaction[]>> {
    return apiClient.get<BankTransaction[]>(`/financial/bank-accounts/${bankAccountId}/transactions`, { params });
  },

  // ============================================================
  // CASH FLOW MANAGEMENT
  // ============================================================

  async getCashFlowEntries(filters?: {
    branchId?: string;
    bankAccountId?: string;
    startDate?: string;
    endDate?: string;
    type?: 'inflow' | 'outflow';
  }): Promise<ApiResponse<CashFlowEntry[]>> {
    return apiClient.get<CashFlowEntry[]>('/financial/cash-flow/entries', { params: filters });
  },

  async createCashFlowEntry(entry: Partial<CashFlowEntry>): Promise<ApiResponse<CashFlowEntry>> {
    return apiClient.post<CashFlowEntry>('/financial/cash-flow/entries', entry);
  },

  async getCashFlowForecasts(branchId?: string): Promise<ApiResponse<CashFlowForecast[]>> {
    return apiClient.get<CashFlowForecast[]>('/financial/cash-flow/forecasts', { params: { branchId } });
  },

  async getCashFlowForecast(id: string): Promise<ApiResponse<CashFlowForecast>> {
    return apiClient.get<CashFlowForecast>(`/financial/cash-flow/forecasts/${id}`);
  },

  async createCashFlowForecast(forecast: Partial<CashFlowForecast>): Promise<ApiResponse<CashFlowForecast>> {
    return apiClient.post<CashFlowForecast>('/financial/cash-flow/forecasts', forecast);
  },

  async updateCashFlowForecast(id: string, forecast: Partial<CashFlowForecast>): Promise<ApiResponse<CashFlowForecast>> {
    return apiClient.put<CashFlowForecast>(`/financial/cash-flow/forecasts/${id}`, forecast);
  },

  async deleteCashFlowForecast(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/financial/cash-flow/forecasts/${id}`);
  },

  // ============================================================
  // FINANCIAL REPORTS
  // ============================================================

  async getFinancialReports(filters?: {
    branchId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<FinancialReport[]>> {
    return apiClient.get<FinancialReport[]>('/financial/reports', { params: filters });
  },

  async generateProfitLossStatement(params: {
    startDate: string;
    endDate: string;
    branchId?: string;
  }): Promise<ApiResponse<ProfitLossStatement>> {
    return apiClient.post<ProfitLossStatement>('/financial/reports/profit-loss', params);
  },

  async generateBalanceSheet(params: {
    asOfDate: string;
    branchId?: string;
  }): Promise<ApiResponse<BalanceSheet>> {
    return apiClient.post<BalanceSheet>('/financial/reports/balance-sheet', params);
  },

  async generateCashFlowReport(params: {
    startDate: string;
    endDate: string;
    branchId?: string;
  }): Promise<ApiResponse<CashFlowReport>> {
    return apiClient.post<CashFlowReport>('/financial/reports/cash-flow', params);
  },

  async generateTaxReport(params: {
    startDate: string;
    endDate: string;
    branchId?: string;
    taxType: 'sales_tax' | 'income_tax' | 'vat' | 'gst' | 'other';
  }): Promise<ApiResponse<TaxReport>> {
    return apiClient.post<TaxReport>('/financial/reports/tax', params);
  },

  async getFinancialReport(id: string): Promise<ApiResponse<FinancialReport>> {
    return apiClient.get<FinancialReport>(`/financial/reports/${id}`);
  },

  async downloadFinancialReport(id: string, format: 'pdf' | 'excel' | 'csv'): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(`/financial/reports/${id}/download`, {
      params: { format },
      responseType: 'blob',
    });
  },

  // ============================================================
  // END OF DAY RECONCILIATION
  // ============================================================

  async getEODReconciliations(branchId?: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<EODReconciliation[]>> {
    return apiClient.get<EODReconciliation[]>('/financial/eod-reconciliations', { params: { branchId, ...params } });
  },

  async getEODReconciliation(id: string): Promise<ApiResponse<EODReconciliation>> {
    return apiClient.get<EODReconciliation>(`/financial/eod-reconciliations/${id}`);
  },

  async startEODReconciliation(data: {
    branchId: string;
    date: string;
    openingCash: number;
  }): Promise<ApiResponse<EODReconciliation>> {
    return apiClient.post<EODReconciliation>('/financial/eod-reconciliations/start', data);
  },

  async updateEODReconciliation(id: string, data: Partial<EODReconciliation>): Promise<ApiResponse<EODReconciliation>> {
    return apiClient.put<EODReconciliation>(`/financial/eod-reconciliations/${id}`, data);
  },

  async completeEODReconciliation(id: string, signature?: string): Promise<ApiResponse<EODReconciliation>> {
    return apiClient.post<EODReconciliation>(`/financial/eod-reconciliations/${id}/complete`, { signature });
  },

  async getEODReconciliationForDate(branchId: string, date: string): Promise<ApiResponse<EODReconciliation | null>> {
    return apiClient.get<EODReconciliation | null>('/financial/eod-reconciliations/by-date', {
      params: { branchId, date },
    });
  },

  // ============================================================
  // FINANCIAL DASHBOARD
  // ============================================================

  async getFinancialDashboard(params: {
    branchId?: string;
    period: 'today' | 'week' | 'month' | 'quarter' | 'year';
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<FinancialDashboard>> {
    return apiClient.get<FinancialDashboard>('/financial/dashboard', { params });
  },

  // ============================================================
  // PAYMENT METHOD CONFIGURATION
  // ============================================================

  async getPaymentMethodConfigs(): Promise<ApiResponse<PaymentMethodConfig[]>> {
    return apiClient.get<PaymentMethodConfig[]>('/financial/payment-methods');
  },

  async getPaymentMethodConfig(id: string): Promise<ApiResponse<PaymentMethodConfig>> {
    return apiClient.get<PaymentMethodConfig>(`/financial/payment-methods/${id}`);
  },

  async updatePaymentMethodConfig(id: string, config: Partial<PaymentMethodConfig>): Promise<ApiResponse<PaymentMethodConfig>> {
    return apiClient.put<PaymentMethodConfig>(`/financial/payment-methods/${id}`, config);
  },

  async enablePaymentMethod(id: string): Promise<ApiResponse<PaymentMethodConfig>> {
    return apiClient.post<PaymentMethodConfig>(`/financial/payment-methods/${id}/enable`);
  },

  async disablePaymentMethod(id: string): Promise<ApiResponse<PaymentMethodConfig>> {
    return apiClient.post<PaymentMethodConfig>(`/financial/payment-methods/${id}/disable`);
  },

  // ============================================================
  // SIGNATURE CAPTURE
  // ============================================================

  async saveSignature(signature: Partial<SignatureCapture>): Promise<ApiResponse<SignatureCapture>> {
    return apiClient.post<SignatureCapture>('/financial/signatures', signature);
  },

  async getSignature(id: string): Promise<ApiResponse<SignatureCapture>> {
    return apiClient.get<SignatureCapture>(`/financial/signatures/${id}`);
  },

  async getSignaturesByReference(type: string, referenceId: string): Promise<ApiResponse<SignatureCapture[]>> {
    return apiClient.get<SignatureCapture[]>('/financial/signatures/by-reference', {
      params: { type, referenceId },
    });
  },

  // ============================================================
  // EXPORT OPERATIONS
  // ============================================================

  async exportFinancialData(data: {
    type: 'invoices' | 'payments' | 'expenses' | 'reports';
    format: 'pdf' | 'excel' | 'csv';
    filters?: FinancialFilters;
  }): Promise<ApiResponse<FinancialExport>> {
    return apiClient.post<FinancialExport>('/financial/export', data);
  },

  async getExport(id: string): Promise<ApiResponse<FinancialExport>> {
    return apiClient.get<FinancialExport>(`/financial/exports/${id}`);
  },

  async downloadExport(id: string): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(`/financial/exports/${id}/download`, { responseType: 'blob' });
  },

  // ============================================================
  // STATISTICS & ANALYTICS
  // ============================================================

  async getRevenueTrends(params: {
    branchId?: string;
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<any>> {
    return apiClient.get('/financial/analytics/revenue-trends', { params });
  },

  async getExpenseTrends(params: {
    branchId?: string;
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<any>> {
    return apiClient.get('/financial/analytics/expense-trends', { params });
  },

  async getProfitabilityMetrics(params: {
    branchId?: string;
    startDate: string;
    endDate: string;
  }): Promise<ApiResponse<any>> {
    return apiClient.get('/financial/analytics/profitability', { params });
  },

  async getTopExpenseCategories(params: {
    branchId?: string;
    startDate: string;
    endDate: string;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    return apiClient.get('/financial/analytics/top-expense-categories', { params });
  },
};

export default financialService;
