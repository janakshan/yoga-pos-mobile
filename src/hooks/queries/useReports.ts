/**
 * Reports Query Hooks
 * React Query hooks for reporting and analytics
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { reportsService } from '@/api/services/reportsService';
import type {
  ReportFilters,
  DateRangeFilter,
  SalesSummaryReport,
  SalesByProductReport,
  SalesByCategoryReport,
  SalesByStaffReport,
  SalesByPaymentMethodReport,
  SalesByBranchReport,
  SalesTrendReport,
  CustomerAnalyticsReport,
  CustomerSegmentationReport,
  CustomerLifetimeValueReport,
  CustomerPurchasePatternsReport,
  NewVsReturningCustomersReport,
  ProductPerformanceReport,
  BestSellersReport,
  SlowMovingItemsReport,
  ProductProfitabilityReport,
  InventoryValuationReport,
  RevenueReport,
  ExpenseReport,
  ProfitMarginAnalysisReport,
  TaxSummaryReport,
  CashFlowSummaryReport,
  ReportExport,
  ReportsDashboardMetrics,
  SalesChartData,
  CustomerChartData,
  ProductChartData,
  FinancialChartData,
} from '@/types/api.types';

// ============================================================
// QUERY KEYS
// ============================================================

export const reportsKeys = {
  all: ['reports'] as const,
  dashboard: (filters?: Partial<DateRangeFilter>) =>
    [...reportsKeys.all, 'dashboard', filters] as const,

  // Sales report keys
  sales: () => [...reportsKeys.all, 'sales'] as const,
  salesSummary: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.sales(), 'summary', filters] as const,
  salesByProduct: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.sales(), 'by-product', filters] as const,
  salesByCategory: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.sales(), 'by-category', filters] as const,
  salesByStaff: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.sales(), 'by-staff', filters] as const,
  salesByPaymentMethod: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.sales(), 'by-payment-method', filters] as const,
  salesByBranch: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.sales(), 'by-branch', filters] as const,
  salesTrends: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.sales(), 'trends', filters] as const,
  salesChartData: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.sales(), 'chart-data', filters] as const,

  // Customer report keys
  customers: () => [...reportsKeys.all, 'customers'] as const,
  customerAnalytics: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.customers(), 'analytics', filters] as const,
  customerSegmentation: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.customers(), 'segmentation', filters] as const,
  customerLifetimeValue: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.customers(), 'lifetime-value', filters] as const,
  customerPurchasePatterns: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.customers(), 'purchase-patterns', filters] as const,
  newVsReturningCustomers: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.customers(), 'new-vs-returning', filters] as const,
  customerChartData: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.customers(), 'chart-data', filters] as const,

  // Product report keys
  products: () => [...reportsKeys.all, 'products'] as const,
  productPerformance: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.products(), 'performance', filters] as const,
  bestSellers: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.products(), 'best-sellers', filters] as const,
  slowMovingItems: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.products(), 'slow-moving', filters] as const,
  productProfitability: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.products(), 'profitability', filters] as const,
  inventoryValuation: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.products(), 'inventory-valuation', filters] as const,
  productChartData: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.products(), 'chart-data', filters] as const,

  // Financial report keys
  financial: () => [...reportsKeys.all, 'financial'] as const,
  revenueReport: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.financial(), 'revenue', filters] as const,
  expenseReport: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.financial(), 'expenses', filters] as const,
  profitMarginAnalysis: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.financial(), 'profit-margin', filters] as const,
  taxSummary: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.financial(), 'tax-summary', filters] as const,
  cashFlowSummary: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.financial(), 'cash-flow', filters] as const,
  financialChartData: (filters?: Partial<ReportFilters>) =>
    [...reportsKeys.financial(), 'chart-data', filters] as const,

  // Export keys
  exports: () => [...reportsKeys.all, 'exports'] as const,
  export: (exportId: string) => [...reportsKeys.exports(), exportId] as const,
};

// ============================================================
// DASHBOARD HOOKS
// ============================================================

export function useReportsDashboard(
  filters?: Partial<DateRangeFilter>,
  options?: UseQueryOptions<ReportsDashboardMetrics>
) {
  return useQuery({
    queryKey: reportsKeys.dashboard(filters),
    queryFn: async () => {
      const response = await reportsService.getDashboardMetrics(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
}

// ============================================================
// SALES REPORT HOOKS
// ============================================================

export function useSalesSummary(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SalesSummaryReport>
) {
  return useQuery({
    queryKey: reportsKeys.salesSummary(filters),
    queryFn: async () => {
      const response = await reportsService.getSalesSummary(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useSalesByProduct(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SalesByProductReport>
) {
  return useQuery({
    queryKey: reportsKeys.salesByProduct(filters),
    queryFn: async () => {
      const response = await reportsService.getSalesByProduct(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useSalesByCategory(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SalesByCategoryReport>
) {
  return useQuery({
    queryKey: reportsKeys.salesByCategory(filters),
    queryFn: async () => {
      const response = await reportsService.getSalesByCategory(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useSalesByStaff(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SalesByStaffReport>
) {
  return useQuery({
    queryKey: reportsKeys.salesByStaff(filters),
    queryFn: async () => {
      const response = await reportsService.getSalesByStaff(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useSalesByPaymentMethod(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SalesByPaymentMethodReport>
) {
  return useQuery({
    queryKey: reportsKeys.salesByPaymentMethod(filters),
    queryFn: async () => {
      const response = await reportsService.getSalesByPaymentMethod(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useSalesByBranch(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SalesByBranchReport>
) {
  return useQuery({
    queryKey: reportsKeys.salesByBranch(filters),
    queryFn: async () => {
      const response = await reportsService.getSalesByBranch(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useSalesTrends(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SalesTrendReport>
) {
  return useQuery({
    queryKey: reportsKeys.salesTrends(filters),
    queryFn: async () => {
      const response = await reportsService.getSalesTrends(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useSalesChartData(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SalesChartData>
) {
  return useQuery({
    queryKey: reportsKeys.salesChartData(filters),
    queryFn: async () => {
      const response = await reportsService.getSalesChartData(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

// ============================================================
// CUSTOMER REPORT HOOKS
// ============================================================

export function useCustomerAnalytics(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<CustomerAnalyticsReport>
) {
  return useQuery({
    queryKey: reportsKeys.customerAnalytics(filters),
    queryFn: async () => {
      const response = await reportsService.getCustomerAnalytics(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useCustomerSegmentation(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<CustomerSegmentationReport>
) {
  return useQuery({
    queryKey: reportsKeys.customerSegmentation(filters),
    queryFn: async () => {
      const response = await reportsService.getCustomerSegmentation(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useCustomerLifetimeValue(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<CustomerLifetimeValueReport>
) {
  return useQuery({
    queryKey: reportsKeys.customerLifetimeValue(filters),
    queryFn: async () => {
      const response = await reportsService.getCustomerLifetimeValue(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useCustomerPurchasePatterns(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<CustomerPurchasePatternsReport>
) {
  return useQuery({
    queryKey: reportsKeys.customerPurchasePatterns(filters),
    queryFn: async () => {
      const response = await reportsService.getCustomerPurchasePatterns(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useNewVsReturningCustomers(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<NewVsReturningCustomersReport>
) {
  return useQuery({
    queryKey: reportsKeys.newVsReturningCustomers(filters),
    queryFn: async () => {
      const response = await reportsService.getNewVsReturningCustomers(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useCustomerChartData(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<CustomerChartData>
) {
  return useQuery({
    queryKey: reportsKeys.customerChartData(filters),
    queryFn: async () => {
      const response = await reportsService.getCustomerChartData(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

// ============================================================
// PRODUCT REPORT HOOKS
// ============================================================

export function useProductPerformance(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<ProductPerformanceReport>
) {
  return useQuery({
    queryKey: reportsKeys.productPerformance(filters),
    queryFn: async () => {
      const response = await reportsService.getProductPerformance(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useBestSellers(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<BestSellersReport>
) {
  return useQuery({
    queryKey: reportsKeys.bestSellers(filters),
    queryFn: async () => {
      const response = await reportsService.getBestSellers(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useSlowMovingItems(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<SlowMovingItemsReport>
) {
  return useQuery({
    queryKey: reportsKeys.slowMovingItems(filters),
    queryFn: async () => {
      const response = await reportsService.getSlowMovingItems(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useProductProfitability(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<ProductProfitabilityReport>
) {
  return useQuery({
    queryKey: reportsKeys.productProfitability(filters),
    queryFn: async () => {
      const response = await reportsService.getProductProfitability(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useInventoryValuation(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<InventoryValuationReport>
) {
  return useQuery({
    queryKey: reportsKeys.inventoryValuation(filters),
    queryFn: async () => {
      const response = await reportsService.getInventoryValuation(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useProductChartData(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<ProductChartData>
) {
  return useQuery({
    queryKey: reportsKeys.productChartData(filters),
    queryFn: async () => {
      const response = await reportsService.getProductChartData(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

// ============================================================
// FINANCIAL REPORT HOOKS
// ============================================================

export function useRevenueReport(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<RevenueReport>
) {
  return useQuery({
    queryKey: reportsKeys.revenueReport(filters),
    queryFn: async () => {
      const response = await reportsService.getRevenueReport(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useExpenseReport(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<ExpenseReport>
) {
  return useQuery({
    queryKey: reportsKeys.expenseReport(filters),
    queryFn: async () => {
      const response = await reportsService.getExpenseReport(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useProfitMarginAnalysis(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<ProfitMarginAnalysisReport>
) {
  return useQuery({
    queryKey: reportsKeys.profitMarginAnalysis(filters),
    queryFn: async () => {
      const response = await reportsService.getProfitMarginAnalysis(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useTaxSummary(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<TaxSummaryReport>
) {
  return useQuery({
    queryKey: reportsKeys.taxSummary(filters),
    queryFn: async () => {
      const response = await reportsService.getTaxSummary(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useCashFlowSummary(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<CashFlowSummaryReport>
) {
  return useQuery({
    queryKey: reportsKeys.cashFlowSummary(filters),
    queryFn: async () => {
      const response = await reportsService.getCashFlowSummary(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useFinancialChartData(
  filters?: Partial<ReportFilters>,
  options?: UseQueryOptions<FinancialChartData>
) {
  return useQuery({
    queryKey: reportsKeys.financialChartData(filters),
    queryFn: async () => {
      const response = await reportsService.getFinancialChartData(filters);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}

// ============================================================
// EXPORT MUTATION HOOKS
// ============================================================

export function useExportToCSV() {
  return useMutation({
    mutationFn: ({
      reportType,
      reportName,
      filters,
    }: {
      reportType: 'sales' | 'customer' | 'product' | 'financial';
      reportName: string;
      filters?: Partial<ReportFilters>;
    }) => reportsService.exportToCSV(reportType, reportName, filters),
  });
}

export function useExportToPDF() {
  return useMutation({
    mutationFn: ({
      reportType,
      reportName,
      filters,
    }: {
      reportType: 'sales' | 'customer' | 'product' | 'financial';
      reportName: string;
      filters?: Partial<ReportFilters>;
    }) => reportsService.exportToPDF(reportType, reportName, filters),
  });
}

export function useExportToExcel() {
  return useMutation({
    mutationFn: ({
      reportType,
      reportName,
      filters,
    }: {
      reportType: 'sales' | 'customer' | 'product' | 'financial';
      reportName: string;
      filters?: Partial<ReportFilters>;
    }) => reportsService.exportToExcel(reportType, reportName, filters),
  });
}

export function useEmailReport() {
  return useMutation({
    mutationFn: ({
      exportId,
      recipients,
      subject,
      message,
    }: {
      exportId: string;
      recipients: string[];
      subject: string;
      message?: string;
    }) => reportsService.emailReport(exportId, recipients, subject, message),
  });
}

export function useExportStatus(exportId: string, options?: UseQueryOptions<ReportExport>) {
  return useQuery({
    queryKey: reportsKeys.export(exportId),
    queryFn: async () => {
      const response = await reportsService.getExportStatus(exportId);
      return response.data!;
    },
    enabled: !!exportId,
    refetchInterval: (data) => {
      // Poll every 2 seconds if status is 'generating'
      return data?.status === 'generating' ? 2000 : false;
    },
    ...options,
  });
}
