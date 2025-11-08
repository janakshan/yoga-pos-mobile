/**
 * Reports Service
 * API service for reporting and analytics
 */

import { apiClient } from '../client';
import type {
  ApiResponse,
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

export const reportsService = {
  // ============================================================
  // DASHBOARD & METRICS
  // ============================================================

  /**
   * Get reports dashboard metrics
   */
  async getDashboardMetrics(
    filters?: Partial<DateRangeFilter>
  ): Promise<ApiResponse<ReportsDashboardMetrics>> {
    return apiClient.get<ReportsDashboardMetrics>('/reports/dashboard', {
      params: filters,
    });
  },

  // ============================================================
  // SALES REPORTS
  // ============================================================

  /**
   * Get sales summary report
   */
  async getSalesSummary(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SalesSummaryReport>> {
    return apiClient.get<SalesSummaryReport>('/reports/sales/summary', {
      params: filters,
    });
  },

  /**
   * Get sales by product report
   */
  async getSalesByProduct(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SalesByProductReport>> {
    return apiClient.get<SalesByProductReport>('/reports/sales/by-product', {
      params: filters,
    });
  },

  /**
   * Get sales by category report
   */
  async getSalesByCategory(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SalesByCategoryReport>> {
    return apiClient.get<SalesByCategoryReport>('/reports/sales/by-category', {
      params: filters,
    });
  },

  /**
   * Get sales by staff report
   */
  async getSalesByStaff(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SalesByStaffReport>> {
    return apiClient.get<SalesByStaffReport>('/reports/sales/by-staff', {
      params: filters,
    });
  },

  /**
   * Get sales by payment method report
   */
  async getSalesByPaymentMethod(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SalesByPaymentMethodReport>> {
    return apiClient.get<SalesByPaymentMethodReport>(
      '/reports/sales/by-payment-method',
      {
        params: filters,
      }
    );
  },

  /**
   * Get sales by branch report
   */
  async getSalesByBranch(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SalesByBranchReport>> {
    return apiClient.get<SalesByBranchReport>('/reports/sales/by-branch', {
      params: filters,
    });
  },

  /**
   * Get sales trends report
   */
  async getSalesTrends(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SalesTrendReport>> {
    return apiClient.get<SalesTrendReport>('/reports/sales/trends', {
      params: filters,
    });
  },

  /**
   * Get sales chart data
   */
  async getSalesChartData(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SalesChartData>> {
    return apiClient.get<SalesChartData>('/reports/sales/chart-data', {
      params: filters,
    });
  },

  // ============================================================
  // CUSTOMER REPORTS
  // ============================================================

  /**
   * Get customer analytics report
   */
  async getCustomerAnalytics(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<CustomerAnalyticsReport>> {
    return apiClient.get<CustomerAnalyticsReport>('/reports/customers/analytics', {
      params: filters,
    });
  },

  /**
   * Get customer segmentation report
   */
  async getCustomerSegmentation(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<CustomerSegmentationReport>> {
    return apiClient.get<CustomerSegmentationReport>(
      '/reports/customers/segmentation',
      {
        params: filters,
      }
    );
  },

  /**
   * Get customer lifetime value report
   */
  async getCustomerLifetimeValue(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<CustomerLifetimeValueReport>> {
    return apiClient.get<CustomerLifetimeValueReport>(
      '/reports/customers/lifetime-value',
      {
        params: filters,
      }
    );
  },

  /**
   * Get customer purchase patterns report
   */
  async getCustomerPurchasePatterns(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<CustomerPurchasePatternsReport>> {
    return apiClient.get<CustomerPurchasePatternsReport>(
      '/reports/customers/purchase-patterns',
      {
        params: filters,
      }
    );
  },

  /**
   * Get new vs returning customers report
   */
  async getNewVsReturningCustomers(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<NewVsReturningCustomersReport>> {
    return apiClient.get<NewVsReturningCustomersReport>(
      '/reports/customers/new-vs-returning',
      {
        params: filters,
      }
    );
  },

  /**
   * Get customer chart data
   */
  async getCustomerChartData(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<CustomerChartData>> {
    return apiClient.get<CustomerChartData>('/reports/customers/chart-data', {
      params: filters,
    });
  },

  // ============================================================
  // PRODUCT REPORTS
  // ============================================================

  /**
   * Get product performance report
   */
  async getProductPerformance(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<ProductPerformanceReport>> {
    return apiClient.get<ProductPerformanceReport>(
      '/reports/products/performance',
      {
        params: filters,
      }
    );
  },

  /**
   * Get best sellers report
   */
  async getBestSellers(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<BestSellersReport>> {
    return apiClient.get<BestSellersReport>('/reports/products/best-sellers', {
      params: filters,
    });
  },

  /**
   * Get slow moving items report
   */
  async getSlowMovingItems(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<SlowMovingItemsReport>> {
    return apiClient.get<SlowMovingItemsReport>(
      '/reports/products/slow-moving',
      {
        params: filters,
      }
    );
  },

  /**
   * Get product profitability report
   */
  async getProductProfitability(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<ProductProfitabilityReport>> {
    return apiClient.get<ProductProfitabilityReport>(
      '/reports/products/profitability',
      {
        params: filters,
      }
    );
  },

  /**
   * Get inventory valuation report
   */
  async getInventoryValuation(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<InventoryValuationReport>> {
    return apiClient.get<InventoryValuationReport>(
      '/reports/products/inventory-valuation',
      {
        params: filters,
      }
    );
  },

  /**
   * Get product chart data
   */
  async getProductChartData(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<ProductChartData>> {
    return apiClient.get<ProductChartData>('/reports/products/chart-data', {
      params: filters,
    });
  },

  // ============================================================
  // FINANCIAL REPORTS
  // ============================================================

  /**
   * Get revenue report
   */
  async getRevenueReport(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<RevenueReport>> {
    return apiClient.get<RevenueReport>('/reports/financial/revenue', {
      params: filters,
    });
  },

  /**
   * Get expense report
   */
  async getExpenseReport(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<ExpenseReport>> {
    return apiClient.get<ExpenseReport>('/reports/financial/expenses', {
      params: filters,
    });
  },

  /**
   * Get profit margin analysis report
   */
  async getProfitMarginAnalysis(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<ProfitMarginAnalysisReport>> {
    return apiClient.get<ProfitMarginAnalysisReport>(
      '/reports/financial/profit-margin',
      {
        params: filters,
      }
    );
  },

  /**
   * Get tax summary report
   */
  async getTaxSummary(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<TaxSummaryReport>> {
    return apiClient.get<TaxSummaryReport>('/reports/financial/tax-summary', {
      params: filters,
    });
  },

  /**
   * Get cash flow summary report
   */
  async getCashFlowSummary(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<CashFlowSummaryReport>> {
    return apiClient.get<CashFlowSummaryReport>(
      '/reports/financial/cash-flow',
      {
        params: filters,
      }
    );
  },

  /**
   * Get financial chart data
   */
  async getFinancialChartData(
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<FinancialChartData>> {
    return apiClient.get<FinancialChartData>('/reports/financial/chart-data', {
      params: filters,
    });
  },

  // ============================================================
  // EXPORT FUNCTIONALITY
  // ============================================================

  /**
   * Export report to CSV
   */
  async exportToCSV(
    reportType: 'sales' | 'customer' | 'product' | 'financial',
    reportName: string,
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<ReportExport>> {
    return apiClient.post<ReportExport>('/reports/export/csv', {
      reportType,
      reportName,
      filters,
    });
  },

  /**
   * Export report to PDF
   */
  async exportToPDF(
    reportType: 'sales' | 'customer' | 'product' | 'financial',
    reportName: string,
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<ReportExport>> {
    return apiClient.post<ReportExport>('/reports/export/pdf', {
      reportType,
      reportName,
      filters,
    });
  },

  /**
   * Export report to Excel
   */
  async exportToExcel(
    reportType: 'sales' | 'customer' | 'product' | 'financial',
    reportName: string,
    filters?: Partial<ReportFilters>
  ): Promise<ApiResponse<ReportExport>> {
    return apiClient.post<ReportExport>('/reports/export/excel', {
      reportType,
      reportName,
      filters,
    });
  },

  /**
   * Email report
   */
  async emailReport(
    exportId: string,
    recipients: string[],
    subject: string,
    message?: string
  ): Promise<ApiResponse<ReportExport>> {
    return apiClient.post<ReportExport>(`/reports/export/${exportId}/email`, {
      recipients,
      subject,
      message,
    });
  },

  /**
   * Get export status
   */
  async getExportStatus(exportId: string): Promise<ApiResponse<ReportExport>> {
    return apiClient.get<ReportExport>(`/reports/export/${exportId}`);
  },

  /**
   * Download exported report
   */
  async downloadExport(exportId: string): Promise<Blob> {
    const response = await apiClient.get(`/reports/export/${exportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
