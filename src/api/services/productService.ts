/**
 * Product Service
 * API service for product catalog management
 */

import apiClient from '../client';
import {
  Product,
  ProductVariant,
  ProductBundle,
  Category,
  PaginatedResponse,
  PaginationParams,
} from '@types/api.types';

export const productService = {
  /**
   * Get all products with optional pagination and filters
   */
  async getProducts(
    params?: PaginationParams & {
      category?: string;
      status?: string;
      search?: string;
      inStock?: boolean;
    },
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
      params,
    });
    return response.data!;
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data!;
  },

  /**
   * Get product by barcode
   */
  async getProductByBarcode(barcode: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/barcode/${barcode}`);
    return response.data!;
  },

  /**
   * Get product by SKU
   */
  async getProductBySKU(sku: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/sku/${sku}`);
    return response.data!;
  },

  /**
   * Create a new product
   */
  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    return response.data!;
  },

  /**
   * Update a product
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data!;
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Get product variants
   */
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const response = await apiClient.get<ProductVariant[]>(
      `/products/${productId}/variants`,
    );
    return response.data!;
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data!;
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categoryId: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/categories/${categoryId}/products`,
      {params},
    );
    return response.data!;
  },

  /**
   * Get product bundles
   */
  async getBundles(params?: {status?: string}): Promise<ProductBundle[]> {
    const response = await apiClient.get<ProductBundle[]>('/products/bundles', {params});
    return response.data!;
  },

  /**
   * Get a single bundle
   */
  async getBundle(id: string): Promise<ProductBundle> {
    const response = await apiClient.get<ProductBundle>(`/products/bundles/${id}`);
    return response.data!;
  },
};
