/**
 * Financial Query Hooks
 * React Query hooks for financial management operations
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import financialService from '../../api/services/financialService';
import type {
  Invoice,
  InvoiceTemplate,
  Payment,
  Refund,
  Expense,
  ExpenseCategory,
  BankAccount,
  BankReconciliation,
  CashFlowForecast,
  FinancialReport,
  EODReconciliation,
  FinancialDashboard,
  FinancialFilters,
  PaymentMethodConfig,
  ProfitLossStatement,
  BalanceSheet,
  CashFlowReport,
  TaxReport,
} from '../../types/api.types';

// Query keys
export const financialKeys = {
  all: ['financial'] as const,

  // Invoices
  invoices: () => [...financialKeys.all, 'invoices'] as const,
  invoice: (id: string) => [...financialKeys.invoices(), id] as const,
  invoicesList: (filters?: FinancialFilters) => [...financialKeys.invoices(), 'list', filters] as const,
  overdueInvoices: (branchId?: string) => [...financialKeys.invoices(), 'overdue', branchId] as const,

  // Invoice Templates
  invoiceTemplates: () => [...financialKeys.all, 'invoice-templates'] as const,
  invoiceTemplate: (id: string) => [...financialKeys.invoiceTemplates(), id] as const,

  // Payments
  payments: () => [...financialKeys.all, 'payments'] as const,
  payment: (id: string) => [...financialKeys.payments(), id] as const,
  paymentsList: (filters?: FinancialFilters) => [...financialKeys.payments(), 'list', filters] as const,
  paymentHistory: (params?: any) => [...financialKeys.payments(), 'history', params] as const,

  // Refunds
  refunds: () => [...financialKeys.all, 'refunds'] as const,
  refund: (id: string) => [...financialKeys.refunds(), id] as const,
  refundsList: (filters?: FinancialFilters) => [...financialKeys.refunds(), 'list', filters] as const,

  // Expenses
  expenses: () => [...financialKeys.all, 'expenses'] as const,
  expense: (id: string) => [...financialKeys.expenses(), id] as const,
  expensesList: (filters?: FinancialFilters) => [...financialKeys.expenses(), 'list', filters] as const,
  pendingApprovals: (branchId?: string) => [...financialKeys.expenses(), 'pending-approval', branchId] as const,

  // Expense Categories
  expenseCategories: () => [...financialKeys.all, 'expense-categories'] as const,
  expenseCategory: (id: string) => [...financialKeys.expenseCategories(), id] as const,

  // Bank Accounts
  bankAccounts: (branchId?: string) => [...financialKeys.all, 'bank-accounts', branchId] as const,
  bankAccount: (id: string) => [...financialKeys.all, 'bank-account', id] as const,

  // Bank Reconciliations
  reconciliations: (bankAccountId?: string) => [...financialKeys.all, 'reconciliations', bankAccountId] as const,
  reconciliation: (id: string) => [...financialKeys.all, 'reconciliation', id] as const,

  // Cash Flow
  cashFlowForecasts: (branchId?: string) => [...financialKeys.all, 'cash-flow-forecasts', branchId] as const,
  cashFlowForecast: (id: string) => [...financialKeys.all, 'cash-flow-forecast', id] as const,

  // Reports
  reports: (filters?: any) => [...financialKeys.all, 'reports', filters] as const,
  report: (id: string) => [...financialKeys.all, 'report', id] as const,

  // EOD
  eodReconciliations: (branchId?: string, params?: any) => [...financialKeys.all, 'eod-reconciliations', branchId, params] as const,
  eodReconciliation: (id: string) => [...financialKeys.all, 'eod-reconciliation', id] as const,

  // Dashboard
  dashboard: (params: any) => [...financialKeys.all, 'dashboard', params] as const,

  // Payment Methods
  paymentMethods: () => [...financialKeys.all, 'payment-methods'] as const,
};

// ============================================================
// INVOICE HOOKS
// ============================================================

export function useInvoices(filters?: FinancialFilters, options?: UseQueryOptions<any>) {
  return useQuery({
    queryKey: financialKeys.invoicesList(filters),
    queryFn: async () => {
      const response = await financialService.getInvoices(filters);
      return response.data;
    },
    ...options,
  });
}

export function useInvoice(id: string, options?: UseQueryOptions<Invoice>) {
  return useQuery({
    queryKey: financialKeys.invoice(id),
    queryFn: async () => {
      const response = await financialService.getInvoice(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useOverdueInvoices(branchId?: string, options?: UseQueryOptions<Invoice[]>) {
  return useQuery({
    queryKey: financialKeys.overdueInvoices(branchId),
    queryFn: async () => {
      const response = await financialService.getOverdueInvoices(branchId);
      return response.data;
    },
    ...options,
  });
}

export function useCreateInvoice(options?: UseMutationOptions<any, Error, Partial<Invoice>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoice: Partial<Invoice>) => financialService.createInvoice(invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.invoices() });
      queryClient.invalidateQueries({ queryKey: financialKeys.dashboard({}) });
    },
    ...options,
  });
}

export function useUpdateInvoice(options?: UseMutationOptions<any, Error, { id: string; invoice: Partial<Invoice> }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, invoice }) => financialService.updateInvoice(id, invoice),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.invoice(variables.id) });
      queryClient.invalidateQueries({ queryKey: financialKeys.invoices() });
      queryClient.invalidateQueries({ queryKey: financialKeys.dashboard({}) });
    },
    ...options,
  });
}

export function useDeleteInvoice(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => financialService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.invoices() });
      queryClient.invalidateQueries({ queryKey: financialKeys.dashboard({}) });
    },
    ...options,
  });
}

export function useSendInvoice(options?: UseMutationOptions<any, Error, { id: string; email?: string }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, email }) => financialService.sendInvoice(id, email),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.invoice(variables.id) });
      queryClient.invalidateQueries({ queryKey: financialKeys.invoices() });
    },
    ...options,
  });
}

// Invoice Templates
export function useInvoiceTemplates(options?: UseQueryOptions<InvoiceTemplate[]>) {
  return useQuery({
    queryKey: financialKeys.invoiceTemplates(),
    queryFn: async () => {
      const response = await financialService.getInvoiceTemplates();
      return response.data;
    },
    ...options,
  });
}

// ============================================================
// PAYMENT HOOKS
// ============================================================

export function usePayments(filters?: FinancialFilters, options?: UseQueryOptions<any>) {
  return useQuery({
    queryKey: financialKeys.paymentsList(filters),
    queryFn: async () => {
      const response = await financialService.getPayments(filters);
      return response.data;
    },
    ...options,
  });
}

export function usePayment(id: string, options?: UseQueryOptions<Payment>) {
  return useQuery({
    queryKey: financialKeys.payment(id),
    queryFn: async () => {
      const response = await financialService.getPayment(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function usePaymentHistory(params?: any, options?: UseQueryOptions<Payment[]>) {
  return useQuery({
    queryKey: financialKeys.paymentHistory(params),
    queryFn: async () => {
      const response = await financialService.getPaymentHistory(params);
      return response.data;
    },
    ...options,
  });
}

export function useRecordPayment(options?: UseMutationOptions<any, Error, any>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => financialService.recordPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.payments() });
      queryClient.invalidateQueries({ queryKey: financialKeys.invoices() });
      queryClient.invalidateQueries({ queryKey: financialKeys.dashboard({}) });
    },
    ...options,
  });
}

export function useProcessPayment(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => financialService.processPayment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.payment(id) });
      queryClient.invalidateQueries({ queryKey: financialKeys.payments() });
    },
    ...options,
  });
}

export function useProcessRefund(options?: UseMutationOptions<any, Error, { paymentId: string; data: any }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, data }) => financialService.processRefund(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.payments() });
      queryClient.invalidateQueries({ queryKey: financialKeys.refunds() });
    },
    ...options,
  });
}

// ============================================================
// EXPENSE HOOKS
// ============================================================

export function useExpenses(filters?: FinancialFilters, options?: UseQueryOptions<any>) {
  return useQuery({
    queryKey: financialKeys.expensesList(filters),
    queryFn: async () => {
      const response = await financialService.getExpenses(filters);
      return response.data;
    },
    ...options,
  });
}

export function useExpense(id: string, options?: UseQueryOptions<Expense>) {
  return useQuery({
    queryKey: financialKeys.expense(id),
    queryFn: async () => {
      const response = await financialService.getExpense(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function usePendingExpenseApprovals(branchId?: string, options?: UseQueryOptions<Expense[]>) {
  return useQuery({
    queryKey: financialKeys.pendingApprovals(branchId),
    queryFn: async () => {
      const response = await financialService.getPendingApprovals(branchId);
      return response.data;
    },
    ...options,
  });
}

export function useCreateExpense(options?: UseMutationOptions<any, Error, Partial<Expense>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expense: Partial<Expense>) => financialService.createExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: financialKeys.dashboard({}) });
    },
    ...options,
  });
}

export function useUpdateExpense(options?: UseMutationOptions<any, Error, { id: string; expense: Partial<Expense> }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expense }) => financialService.updateExpense(id, expense),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.expense(variables.id) });
      queryClient.invalidateQueries({ queryKey: financialKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: financialKeys.dashboard({}) });
    },
    ...options,
  });
}

export function useApproveExpense(options?: UseMutationOptions<any, Error, { id: string; comments?: string }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comments }) => financialService.approveExpense(id, comments),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.expense(variables.id) });
      queryClient.invalidateQueries({ queryKey: financialKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: financialKeys.pendingApprovals() });
    },
    ...options,
  });
}

export function useRejectExpense(options?: UseMutationOptions<any, Error, { id: string; reason: string }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => financialService.rejectExpense(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.expense(variables.id) });
      queryClient.invalidateQueries({ queryKey: financialKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: financialKeys.pendingApprovals() });
    },
    ...options,
  });
}

// Expense Categories
export function useExpenseCategories(options?: UseQueryOptions<ExpenseCategory[]>) {
  return useQuery({
    queryKey: financialKeys.expenseCategories(),
    queryFn: async () => {
      const response = await financialService.getExpenseCategories();
      return response.data;
    },
    ...options,
  });
}

// ============================================================
// BANK ACCOUNT HOOKS
// ============================================================

export function useBankAccounts(branchId?: string, options?: UseQueryOptions<BankAccount[]>) {
  return useQuery({
    queryKey: financialKeys.bankAccounts(branchId),
    queryFn: async () => {
      const response = await financialService.getBankAccounts(branchId);
      return response.data;
    },
    ...options,
  });
}

export function useBankAccount(id: string, options?: UseQueryOptions<BankAccount>) {
  return useQuery({
    queryKey: financialKeys.bankAccount(id),
    queryFn: async () => {
      const response = await financialService.getBankAccount(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateBankAccount(options?: UseMutationOptions<any, Error, Partial<BankAccount>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (account: Partial<BankAccount>) => financialService.createBankAccount(account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.bankAccounts() });
    },
    ...options,
  });
}

// ============================================================
// BANK RECONCILIATION HOOKS
// ============================================================

export function useBankReconciliations(bankAccountId?: string, options?: UseQueryOptions<BankReconciliation[]>) {
  return useQuery({
    queryKey: financialKeys.reconciliations(bankAccountId),
    queryFn: async () => {
      const response = await financialService.getBankReconciliations(bankAccountId);
      return response.data;
    },
    ...options,
  });
}

export function useBankReconciliation(id: string, options?: UseQueryOptions<BankReconciliation>) {
  return useQuery({
    queryKey: financialKeys.reconciliation(id),
    queryFn: async () => {
      const response = await financialService.getBankReconciliation(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useStartReconciliation(options?: UseMutationOptions<any, Error, any>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => financialService.startReconciliation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.reconciliations() });
    },
    ...options,
  });
}

export function useCompleteReconciliation(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => financialService.completeReconciliation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.reconciliation(id) });
      queryClient.invalidateQueries({ queryKey: financialKeys.reconciliations() });
      queryClient.invalidateQueries({ queryKey: financialKeys.bankAccounts() });
    },
    ...options,
  });
}

// ============================================================
// CASH FLOW HOOKS
// ============================================================

export function useCashFlowForecasts(branchId?: string, options?: UseQueryOptions<CashFlowForecast[]>) {
  return useQuery({
    queryKey: financialKeys.cashFlowForecasts(branchId),
    queryFn: async () => {
      const response = await financialService.getCashFlowForecasts(branchId);
      return response.data;
    },
    ...options,
  });
}

export function useCashFlowForecast(id: string, options?: UseQueryOptions<CashFlowForecast>) {
  return useQuery({
    queryKey: financialKeys.cashFlowForecast(id),
    queryFn: async () => {
      const response = await financialService.getCashFlowForecast(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

// ============================================================
// FINANCIAL REPORTS HOOKS
// ============================================================

export function useFinancialReports(filters?: any, options?: UseQueryOptions<FinancialReport[]>) {
  return useQuery({
    queryKey: financialKeys.reports(filters),
    queryFn: async () => {
      const response = await financialService.getFinancialReports(filters);
      return response.data;
    },
    ...options,
  });
}

export function useGenerateProfitLoss(options?: UseMutationOptions<any, Error, any>) {
  return useMutation({
    mutationFn: (params) => financialService.generateProfitLossStatement(params),
    ...options,
  });
}

export function useGenerateBalanceSheet(options?: UseMutationOptions<any, Error, any>) {
  return useMutation({
    mutationFn: (params) => financialService.generateBalanceSheet(params),
    ...options,
  });
}

export function useGenerateCashFlowReport(options?: UseMutationOptions<any, Error, any>) {
  return useMutation({
    mutationFn: (params) => financialService.generateCashFlowReport(params),
    ...options,
  });
}

export function useGenerateTaxReport(options?: UseMutationOptions<any, Error, any>) {
  return useMutation({
    mutationFn: (params) => financialService.generateTaxReport(params),
    ...options,
  });
}

// ============================================================
// EOD RECONCILIATION HOOKS
// ============================================================

export function useEODReconciliations(branchId?: string, params?: any, options?: UseQueryOptions<EODReconciliation[]>) {
  return useQuery({
    queryKey: financialKeys.eodReconciliations(branchId, params),
    queryFn: async () => {
      const response = await financialService.getEODReconciliations(branchId, params);
      return response.data;
    },
    ...options,
  });
}

export function useEODReconciliation(id: string, options?: UseQueryOptions<EODReconciliation>) {
  return useQuery({
    queryKey: financialKeys.eodReconciliation(id),
    queryFn: async () => {
      const response = await financialService.getEODReconciliation(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useStartEODReconciliation(options?: UseMutationOptions<any, Error, any>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => financialService.startEODReconciliation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.eodReconciliations() });
    },
    ...options,
  });
}

export function useCompleteEODReconciliation(options?: UseMutationOptions<any, Error, { id: string; signature?: string }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, signature }) => financialService.completeEODReconciliation(id, signature),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.eodReconciliation(variables.id) });
      queryClient.invalidateQueries({ queryKey: financialKeys.eodReconciliations() });
    },
    ...options,
  });
}

// ============================================================
// DASHBOARD HOOKS
// ============================================================

export function useFinancialDashboard(params: any, options?: UseQueryOptions<FinancialDashboard>) {
  return useQuery({
    queryKey: financialKeys.dashboard(params),
    queryFn: async () => {
      const response = await financialService.getFinancialDashboard(params);
      return response.data;
    },
    ...options,
  });
}

// ============================================================
// PAYMENT METHODS HOOKS
// ============================================================

export function usePaymentMethodConfigs(options?: UseQueryOptions<PaymentMethodConfig[]>) {
  return useQuery({
    queryKey: financialKeys.paymentMethods(),
    queryFn: async () => {
      const response = await financialService.getPaymentMethodConfigs();
      return response.data;
    },
    ...options,
  });
}

export default {
  // Invoices
  useInvoices,
  useInvoice,
  useOverdueInvoices,
  useCreateInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
  useSendInvoice,
  useInvoiceTemplates,

  // Payments
  usePayments,
  usePayment,
  usePaymentHistory,
  useRecordPayment,
  useProcessPayment,
  useProcessRefund,

  // Expenses
  useExpenses,
  useExpense,
  usePendingExpenseApprovals,
  useCreateExpense,
  useUpdateExpense,
  useApproveExpense,
  useRejectExpense,
  useExpenseCategories,

  // Bank Accounts
  useBankAccounts,
  useBankAccount,
  useCreateBankAccount,

  // Bank Reconciliation
  useBankReconciliations,
  useBankReconciliation,
  useStartReconciliation,
  useCompleteReconciliation,

  // Cash Flow
  useCashFlowForecasts,
  useCashFlowForecast,

  // Reports
  useFinancialReports,
  useGenerateProfitLoss,
  useGenerateBalanceSheet,
  useGenerateCashFlowReport,
  useGenerateTaxReport,

  // EOD
  useEODReconciliations,
  useEODReconciliation,
  useStartEODReconciliation,
  useCompleteEODReconciliation,

  // Dashboard
  useFinancialDashboard,

  // Payment Methods
  usePaymentMethodConfigs,
};
