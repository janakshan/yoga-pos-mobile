/**
 * Customer Service
 * API service for customer management
 */

import apiClient from '../client';
import {Customer, PaginatedResponse, PaginationParams} from '@types/api.types';

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
};
