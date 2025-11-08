/**
 * POS Service
 * API service for POS transactions, returns, and receipts
 */

import apiClient from '../client';
import {
  POSTransaction,
  ReturnTransaction,
  ExchangeTransaction,
  Receipt,
  PaginatedResponse,
  PaginationParams,
} from '@types/api.types';

export const posService = {
  /**
   * Submit a new POS transaction
   */
  async createTransaction(
    transaction: Omit<POSTransaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<POSTransaction> {
    const response = await apiClient.post<POSTransaction>(
      '/pos/transactions',
      transaction,
    );
    return response.data!;
  },

  /**
   * Get a transaction by ID
   */
  async getTransaction(id: string): Promise<POSTransaction> {
    const response = await apiClient.get<POSTransaction>(`/pos/transactions/${id}`);
    return response.data!;
  },

  /**
   * Get all transactions with pagination
   */
  async getTransactions(
    params?: PaginationParams & {
      status?: string;
      customerId?: string;
      dateFrom?: string;
      dateTo?: string;
    },
  ): Promise<PaginatedResponse<POSTransaction>> {
    const response = await apiClient.get<PaginatedResponse<POSTransaction>>(
      '/pos/transactions',
      {params},
    );
    return response.data!;
  },

  /**
   * Void a transaction
   */
  async voidTransaction(id: string, reason: string): Promise<POSTransaction> {
    const response = await apiClient.post<POSTransaction>(
      `/pos/transactions/${id}/void`,
      {reason},
    );
    return response.data!;
  },

  /**
   * Get receipt for a transaction
   */
  async getReceipt(transactionId: string): Promise<Receipt> {
    const response = await apiClient.get<Receipt>(
      `/pos/transactions/${transactionId}/receipt`,
    );
    return response.data!;
  },

  /**
   * Email receipt to customer
   */
  async emailReceipt(transactionId: string, email: string): Promise<void> {
    await apiClient.post(`/pos/transactions/${transactionId}/email-receipt`, {
      email,
    });
  },

  /**
   * Process a return/refund
   */
  async createReturn(
    returnData: Omit<ReturnTransaction, 'id' | 'createdAt' | 'completedAt'>,
  ): Promise<ReturnTransaction> {
    const response = await apiClient.post<ReturnTransaction>(
      '/pos/returns',
      returnData,
    );
    return response.data!;
  },

  /**
   * Get a return by ID
   */
  async getReturn(id: string): Promise<ReturnTransaction> {
    const response = await apiClient.get<ReturnTransaction>(`/pos/returns/${id}`);
    return response.data!;
  },

  /**
   * Get all returns
   */
  async getReturns(
    params?: PaginationParams & {
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    },
  ): Promise<PaginatedResponse<ReturnTransaction>> {
    const response = await apiClient.get<PaginatedResponse<ReturnTransaction>>(
      '/pos/returns',
      {params},
    );
    return response.data!;
  },

  /**
   * Process an exchange
   */
  async createExchange(
    exchangeData: Omit<ExchangeTransaction, 'id' | 'createdAt' | 'completedAt'>,
  ): Promise<ExchangeTransaction> {
    const response = await apiClient.post<ExchangeTransaction>(
      '/pos/exchanges',
      exchangeData,
    );
    return response.data!;
  },

  /**
   * Get daily sales report
   */
  async getDailySalesReport(date: string): Promise<any> {
    const response = await apiClient.get(`/pos/reports/daily-sales`, {
      params: {date},
    });
    return response.data!;
  },

  /**
   * Get sales summary
   */
  async getSalesSummary(dateFrom: string, dateTo: string): Promise<any> {
    const response = await apiClient.get(`/pos/reports/sales-summary`, {
      params: {dateFrom, dateTo},
    });
    return response.data!;
  },
};
