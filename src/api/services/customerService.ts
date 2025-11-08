/**
 * Customer Service
 * API service for customer management
 */

import apiClient from '../client';
import {
  Customer,
  PaginatedResponse,
  PaginationParams,
  CommunicationRecord,
  CustomerSegment,
  CustomerReminder,
  POSTransaction,
} from '@types/api.types';

export const customerService = {
  /**
   * Get all customers with optional pagination and filters
   */
  async getCustomers(
    params?: PaginationParams & {
      customerType?: string;
      status?: string;
      search?: string;
    },
  ): Promise<PaginatedResponse<Customer>> {
    const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', {
      params,
    });
    return response.data!;
  },

  /**
   * Get a single customer by ID
   */
  async getCustomer(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data!;
  },

  /**
   * Search customers by phone or email
   */
  async searchCustomers(query: string): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>('/customers/search', {
      params: {q: query},
    });
    return response.data!;
  },

  /**
   * Create a new customer
   */
  async createCustomer(
    data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Customer> {
    const response = await apiClient.post<Customer>('/customers', data);
    return response.data!;
  },

  /**
   * Update a customer
   */
  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.put<Customer>(`/customers/${id}`, data);
    return response.data!;
  },

  /**
   * Delete a customer
   */
  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },

  /**
   * Get customer purchase history
   */
  async getCustomerPurchaseHistory(customerId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(
      `/customers/${customerId}/purchase-history`,
    );
    return response.data!;
  },

  /**
   * Update customer loyalty points
   */
  async updateLoyaltyPoints(
    customerId: string,
    points: number,
    action: 'earn' | 'redeem',
  ): Promise<Customer> {
    const response = await apiClient.post<Customer>(
      `/customers/${customerId}/loyalty`,
      {points, action},
    );
    return response.data!;
  },

  /**
   * Get customer by loyalty card number (QR code)
   */
  async getCustomerByLoyaltyCard(loyaltyCardNumber: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(
      `/customers/loyalty-card/${loyaltyCardNumber}`,
    );
    return response.data!;
  },

  /**
   * Update store credit
   */
  async updateStoreCredit(
    customerId: string,
    amount: number,
    action: 'add' | 'deduct',
    expiryDate?: string,
  ): Promise<Customer> {
    const response = await apiClient.post<Customer>(
      `/customers/${customerId}/store-credit`,
      {amount, action, expiryDate},
    );
    return response.data!;
  },

  // Communication History
  /**
   * Get customer communication history
   */
  async getCommunicationHistory(
    customerId: string,
  ): Promise<CommunicationRecord[]> {
    const response = await apiClient.get<CommunicationRecord[]>(
      `/customers/${customerId}/communications`,
    );
    return response.data!;
  },

  /**
   * Add communication record
   */
  async addCommunicationRecord(
    customerId: string,
    data: Omit<CommunicationRecord, 'id' | 'customerId' | 'createdAt'>,
  ): Promise<CommunicationRecord> {
    const response = await apiClient.post<CommunicationRecord>(
      `/customers/${customerId}/communications`,
      data,
    );
    return response.data!;
  },

  /**
   * Send email to customer
   */
  async sendEmail(
    customerId: string,
    subject: string,
    message: string,
  ): Promise<CommunicationRecord> {
    const response = await apiClient.post<CommunicationRecord>(
      `/customers/${customerId}/send-email`,
      {subject, message},
    );
    return response.data!;
  },

  /**
   * Send SMS to customer
   */
  async sendSMS(customerId: string, message: string): Promise<CommunicationRecord> {
    const response = await apiClient.post<CommunicationRecord>(
      `/customers/${customerId}/send-sms`,
      {message},
    );
    return response.data!;
  },

  // Customer Segments
  /**
   * Get all customer segments
   */
  async getSegments(): Promise<CustomerSegment[]> {
    const response = await apiClient.get<CustomerSegment[]>('/customers/segments');
    return response.data!;
  },

  /**
   * Create customer segment
   */
  async createSegment(
    data: Omit<CustomerSegment, 'id' | 'createdAt' | 'updatedAt' | 'customerCount'>,
  ): Promise<CustomerSegment> {
    const response = await apiClient.post<CustomerSegment>(
      '/customers/segments',
      data,
    );
    return response.data!;
  },

  /**
   * Get customers in a segment
   */
  async getCustomersBySegment(segmentId: string): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>(
      `/customers/segments/${segmentId}/customers`,
    );
    return response.data!;
  },

  // Birthday & Anniversary Reminders
  /**
   * Get upcoming birthdays
   */
  async getUpcomingBirthdays(days: number = 7): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>('/customers/upcoming-birthdays', {
      params: {days},
    });
    return response.data!;
  },

  /**
   * Get upcoming anniversaries
   */
  async getUpcomingAnniversaries(days: number = 7): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>(
      '/customers/upcoming-anniversaries',
      {params: {days}},
    );
    return response.data!;
  },

  /**
   * Get customer reminders
   */
  async getReminders(
    params?: PaginationParams & {status?: string},
  ): Promise<PaginatedResponse<CustomerReminder>> {
    const response = await apiClient.get<PaginatedResponse<CustomerReminder>>(
      '/customers/reminders',
      {params},
    );
    return response.data!;
  },

  /**
   * Create reminder
   */
  async createReminder(
    data: Omit<CustomerReminder, 'id' | 'createdAt'>,
  ): Promise<CustomerReminder> {
    const response = await apiClient.post<CustomerReminder>(
      '/customers/reminders',
      data,
    );
    return response.data!;
  },

  // Analytics
  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    vipCustomers: number;
    totalLifetimeValue: number;
    averageLifetimeValue: number;
    newCustomersThisMonth: number;
    churnRate: number;
  }> {
    const response = await apiClient.get('/customers/analytics');
    return response.data!;
  },

  /**
   * Get top customers by spending
   */
  async getTopCustomers(limit: number = 10): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>('/customers/top', {
      params: {limit},
    });
    return response.data!;
  },

  /**
   * Calculate customer lifetime value
   */
  async calculateCLV(customerId: string): Promise<{
    customerId: string;
    lifetimeValue: number;
    predictedValue: number;
    segment: string;
  }> {
    const response = await apiClient.get(`/customers/${customerId}/clv`);
    return response.data!;
  },

  /**
   * Bulk import customers
   */
  async importCustomers(
    data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const response = await apiClient.post('/customers/import', {customers: data});
    return response.data!;
  },

  /**
   * Export customers
   */
  async exportCustomers(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await apiClient.get('/customers/export', {
      params: {format},
      responseType: 'blob',
    });
    return response.data!;
  },
};
