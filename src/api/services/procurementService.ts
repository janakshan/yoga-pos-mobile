/**
 * Procurement Service
 * API service for procurement and supplier management
 */

import apiClient from '../client';
import {
  Supplier,
  SupplierFilters,
  PurchaseOrder,
  ProcurementFilters,
  PurchaseOrderStatus,
  POApprovalRequest,
  ReceivingSession,
  ReceivedItem,
  ProcurementDashboard,
  PaginatedResponse,
  OfflinePurchaseOrder,
} from '@types/api.types';

// ============================================================
// SUPPLIER MANAGEMENT
// ============================================================

export const supplierService = {
  /**
   * Get all suppliers with optional pagination and filters
   */
  async getSuppliers(
    params?: SupplierFilters,
  ): Promise<PaginatedResponse<Supplier>> {
    const response = await apiClient.get<PaginatedResponse<Supplier>>(
      '/suppliers',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a single supplier by ID
   */
  async getSupplier(id: string): Promise<Supplier> {
    const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
    return response.data!;
  },

  /**
   * Search suppliers
   */
  async searchSuppliers(query: string): Promise<Supplier[]> {
    const response = await apiClient.get<Supplier[]>('/suppliers/search', {
      params: {q: query},
    });
    return response.data!;
  },

  /**
   * Create a new supplier
   */
  async createSupplier(
    data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Supplier> {
    const response = await apiClient.post<Supplier>('/suppliers', data);
    return response.data!;
  },

  /**
   * Update a supplier
   */
  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    const response = await apiClient.put<Supplier>(`/suppliers/${id}`, data);
    return response.data!;
  },

  /**
   * Delete a supplier
   */
  async deleteSupplier(id: string): Promise<void> {
    await apiClient.delete(`/suppliers/${id}`);
  },

  /**
   * Get supplier products catalog
   */
  async getSupplierProducts(supplierId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(
      `/suppliers/${supplierId}/products`,
    );
    return response.data!;
  },

  /**
   * Get supplier purchase history
   */
  async getSupplierPurchaseHistory(supplierId: string): Promise<PurchaseOrder[]> {
    const response = await apiClient.get<PurchaseOrder[]>(
      `/suppliers/${supplierId}/purchase-orders`,
    );
    return response.data!;
  },

  /**
   * Update supplier performance metrics
   */
  async updateSupplierPerformance(
    supplierId: string,
    data: {
      rating?: number;
      onTimeDeliveryRate?: number;
      qualityRating?: number;
    },
  ): Promise<Supplier> {
    const response = await apiClient.post<Supplier>(
      `/suppliers/${supplierId}/performance`,
      data,
    );
    return response.data!;
  },

  /**
   * Get supplier analytics
   */
  async getSupplierAnalytics(supplierId: string): Promise<any> {
    const response = await apiClient.get<any>(
      `/suppliers/${supplierId}/analytics`,
    );
    return response.data!;
  },
};

// ============================================================
// PURCHASE ORDER MANAGEMENT
// ============================================================

export const purchaseOrderService = {
  /**
   * Get all purchase orders with optional pagination and filters
   */
  async getPurchaseOrders(
    params?: ProcurementFilters,
  ): Promise<PaginatedResponse<PurchaseOrder>> {
    const response = await apiClient.get<PaginatedResponse<PurchaseOrder>>(
      '/purchase-orders',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a single purchase order by ID
   */
  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.get<PurchaseOrder>(
      `/purchase-orders/${id}`,
    );
    return response.data!;
  },

  /**
   * Search purchase orders
   */
  async searchPurchaseOrders(query: string): Promise<PurchaseOrder[]> {
    const response = await apiClient.get<PurchaseOrder[]>(
      '/purchase-orders/search',
      {
        params: {q: query},
      },
    );
    return response.data!;
  },

  /**
   * Create a new purchase order
   */
  async createPurchaseOrder(
    data: Omit<
      PurchaseOrder,
      'id' | 'poNumber' | 'createdAt' | 'updatedAt' | 'status'
    >,
  ): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrder>(
      '/purchase-orders',
      data,
    );
    return response.data!;
  },

  /**
   * Update a purchase order
   */
  async updatePurchaseOrder(
    id: string,
    data: Partial<PurchaseOrder>,
  ): Promise<PurchaseOrder> {
    const response = await apiClient.put<PurchaseOrder>(
      `/purchase-orders/${id}`,
      data,
    );
    return response.data!;
  },

  /**
   * Delete a purchase order (only if draft)
   */
  async deletePurchaseOrder(id: string): Promise<void> {
    await apiClient.delete(`/purchase-orders/${id}`);
  },

  /**
   * Send purchase order to supplier
   */
  async sendPurchaseOrder(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrder>(
      `/purchase-orders/${id}/send`,
    );
    return response.data!;
  },

  /**
   * Cancel purchase order
   */
  async cancelPurchaseOrder(
    id: string,
    reason?: string,
  ): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrder>(
      `/purchase-orders/${id}/cancel`,
      {reason},
    );
    return response.data!;
  },

  /**
   * Close purchase order
   */
  async closePurchaseOrder(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrder>(
      `/purchase-orders/${id}/close`,
    );
    return response.data!;
  },

  /**
   * Clone purchase order
   */
  async clonePurchaseOrder(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrder>(
      `/purchase-orders/${id}/clone`,
    );
    return response.data!;
  },

  /**
   * Get purchase order history
   */
  async getPurchaseOrderHistory(id: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(
      `/purchase-orders/${id}/history`,
    );
    return response.data!;
  },

  /**
   * Upload document to purchase order
   */
  async uploadDocument(
    id: string,
    file: FormData,
    type: string,
  ): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrder>(
      `/purchase-orders/${id}/documents`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {type},
      },
    );
    return response.data!;
  },

  /**
   * Delete document from purchase order
   */
  async deleteDocument(id: string, documentId: string): Promise<void> {
    await apiClient.delete(`/purchase-orders/${id}/documents/${documentId}`);
  },

  /**
   * Generate PO PDF
   */
  async generatePDF(id: string): Promise<Blob> {
    const response = await apiClient.get(`/purchase-orders/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data!;
  },

  /**
   * Email purchase order to supplier
   */
  async emailPurchaseOrder(
    id: string,
    email: string,
    subject?: string,
    message?: string,
  ): Promise<void> {
    await apiClient.post(`/purchase-orders/${id}/email`, {
      email,
      subject,
      message,
    });
  },
};

// ============================================================
// PURCHASE ORDER APPROVAL
// ============================================================

export const approvalService = {
  /**
   * Submit purchase order for approval
   */
  async submitForApproval(
    purchaseOrderId: string,
    requiredApprovers?: string[],
  ): Promise<POApprovalRequest> {
    const response = await apiClient.post<POApprovalRequest>(
      `/purchase-orders/${purchaseOrderId}/submit-for-approval`,
      {requiredApprovers},
    );
    return response.data!;
  },

  /**
   * Get approval request
   */
  async getApprovalRequest(id: string): Promise<POApprovalRequest> {
    const response = await apiClient.get<POApprovalRequest>(
      `/approval-requests/${id}`,
    );
    return response.data!;
  },

  /**
   * Get pending approvals for current user
   */
  async getPendingApprovals(): Promise<POApprovalRequest[]> {
    const response = await apiClient.get<POApprovalRequest[]>(
      '/approval-requests/pending',
    );
    return response.data!;
  },

  /**
   * Approve purchase order
   */
  async approvePurchaseOrder(
    approvalRequestId: string,
    comments?: string,
  ): Promise<POApprovalRequest> {
    const response = await apiClient.post<POApprovalRequest>(
      `/approval-requests/${approvalRequestId}/approve`,
      {comments},
    );
    return response.data!;
  },

  /**
   * Reject purchase order
   */
  async rejectPurchaseOrder(
    approvalRequestId: string,
    comments: string,
  ): Promise<POApprovalRequest> {
    const response = await apiClient.post<POApprovalRequest>(
      `/approval-requests/${approvalRequestId}/reject`,
      {comments},
    );
    return response.data!;
  },

  /**
   * Get approval history
   */
  async getApprovalHistory(purchaseOrderId: string): Promise<POApprovalRequest[]> {
    const response = await apiClient.get<POApprovalRequest[]>(
      `/purchase-orders/${purchaseOrderId}/approvals`,
    );
    return response.data!;
  },
};

// ============================================================
// RECEIVING MANAGEMENT
// ============================================================

export const receivingService = {
  /**
   * Start receiving session
   */
  async startReceivingSession(
    purchaseOrderId: string,
    locationId: string,
  ): Promise<ReceivingSession> {
    const response = await apiClient.post<ReceivingSession>(
      `/purchase-orders/${purchaseOrderId}/receiving/start`,
      {locationId},
    );
    return response.data!;
  },

  /**
   * Get receiving session
   */
  async getReceivingSession(sessionId: string): Promise<ReceivingSession> {
    const response = await apiClient.get<ReceivingSession>(
      `/receiving-sessions/${sessionId}`,
    );
    return response.data!;
  },

  /**
   * Update receiving session item
   */
  async updateReceivingItem(
    sessionId: string,
    itemId: string,
    data: {
      quantityReceived: number;
      quantityAccepted: number;
      quantityRejected: number;
      condition: 'good' | 'damaged' | 'defective' | 'mixed';
      serialNumbers?: string[];
      batchNumber?: string;
      expiryDate?: string;
      notes?: string;
    },
  ): Promise<ReceivingSession> {
    const response = await apiClient.put<ReceivingSession>(
      `/receiving-sessions/${sessionId}/items/${itemId}`,
      data,
    );
    return response.data!;
  },

  /**
   * Scan barcode during receiving
   */
  async scanBarcode(
    sessionId: string,
    barcode: string,
  ): Promise<{
    found: boolean;
    item?: any;
    message: string;
  }> {
    const response = await apiClient.post(
      `/receiving-sessions/${sessionId}/scan`,
      {barcode},
    );
    return response.data!;
  },

  /**
   * Report discrepancy
   */
  async reportDiscrepancy(
    sessionId: string,
    data: {
      type: 'quantity_mismatch' | 'quality_issue' | 'wrong_item' | 'damaged' | 'missing';
      productId: string;
      expectedQuantity?: number;
      receivedQuantity?: number;
      description: string;
      images?: string[];
    },
  ): Promise<ReceivingSession> {
    const response = await apiClient.post<ReceivingSession>(
      `/receiving-sessions/${sessionId}/discrepancies`,
      data,
    );
    return response.data!;
  },

  /**
   * Upload signature
   */
  async uploadSignature(
    sessionId: string,
    signatureType: 'receiver' | 'delivery',
    signatureData: string,
  ): Promise<ReceivingSession> {
    const response = await apiClient.post<ReceivingSession>(
      `/receiving-sessions/${sessionId}/signature`,
      {signatureType, signatureData},
    );
    return response.data!;
  },

  /**
   * Upload receiving images
   */
  async uploadImages(
    sessionId: string,
    images: FormData,
  ): Promise<ReceivingSession> {
    const response = await apiClient.post<ReceivingSession>(
      `/receiving-sessions/${sessionId}/images`,
      images,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data!;
  },

  /**
   * Complete receiving session
   */
  async completeReceivingSession(
    sessionId: string,
    signature?: string,
  ): Promise<ReceivingSession> {
    const response = await apiClient.post<ReceivingSession>(
      `/receiving-sessions/${sessionId}/complete`,
      {signature},
    );
    return response.data!;
  },

  /**
   * Cancel receiving session
   */
  async cancelReceivingSession(sessionId: string): Promise<void> {
    await apiClient.post(`/receiving-sessions/${sessionId}/cancel`);
  },

  /**
   * Receive items (partial or full)
   */
  async receiveItems(
    purchaseOrderId: string,
    items: Array<{
      purchaseOrderItemId: string;
      quantity: number;
      condition: 'good' | 'damaged' | 'defective';
      serialNumbers?: string[];
      batchNumber?: string;
      expiryDate?: string;
      notes?: string;
    }>,
    signature?: string,
  ): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrder>(
      `/purchase-orders/${purchaseOrderId}/receive`,
      {items, signature},
    );
    return response.data!;
  },

  /**
   * Get receiving history for purchase order
   */
  async getReceivingHistory(purchaseOrderId: string): Promise<ReceivedItem[]> {
    const response = await apiClient.get<ReceivedItem[]>(
      `/purchase-orders/${purchaseOrderId}/receiving-history`,
    );
    return response.data!;
  },
};

// ============================================================
// PROCUREMENT DASHBOARD & ANALYTICS
// ============================================================

export const procurementDashboardService = {
  /**
   * Get procurement dashboard data
   */
  async getDashboard(): Promise<ProcurementDashboard> {
    const response = await apiClient.get<ProcurementDashboard>(
      '/procurement/dashboard',
    );
    return response.data!;
  },

  /**
   * Get procurement analytics
   */
  async getAnalytics(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<any> {
    const response = await apiClient.get('/procurement/analytics', {
      params: {dateFrom, dateTo},
    });
    return response.data!;
  },

  /**
   * Get supplier comparison
   */
  async compareSuppliers(supplierIds: string[]): Promise<any> {
    const response = await apiClient.post('/procurement/compare-suppliers', {
      supplierIds,
    });
    return response.data!;
  },

  /**
   * Get purchase order trends
   */
  async getPurchaseOrderTrends(period: 'week' | 'month' | 'quarter' | 'year'): Promise<any> {
    const response = await apiClient.get('/procurement/trends', {
      params: {period},
    });
    return response.data!;
  },
};

// ============================================================
// OFFLINE SYNC
// ============================================================

export const offlineProcurementService = {
  /**
   * Save purchase order offline
   */
  async saveOffline(
    data: Partial<PurchaseOrder>,
  ): Promise<OfflinePurchaseOrder> {
    // This would save to local storage (MMKV or AsyncStorage)
    // and return a local ID for tracking
    const localId = `offline_${Date.now()}`;
    const offlinePO: OfflinePurchaseOrder = {
      id: '',
      localId,
      data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // TODO: Implement local storage save
    // await AsyncStorage.setItem(`offline_po_${localId}`, JSON.stringify(offlinePO));

    return offlinePO;
  },

  /**
   * Get all offline purchase orders
   */
  async getOfflinePurchaseOrders(): Promise<OfflinePurchaseOrder[]> {
    // TODO: Implement local storage retrieval
    // const keys = await AsyncStorage.getAllKeys();
    // const offlineKeys = keys.filter(key => key.startsWith('offline_po_'));
    // const offlinePOs = await AsyncStorage.multiGet(offlineKeys);
    // return offlinePOs.map(([, value]) => JSON.parse(value));
    return [];
  },

  /**
   * Sync offline purchase orders
   */
  async syncOfflinePurchaseOrders(): Promise<{
    synced: number;
    failed: number;
    errors: Array<{localId: string; error: string}>;
  }> {
    const offlinePOs = await this.getOfflinePurchaseOrders();
    let synced = 0;
    let failed = 0;
    const errors: Array<{localId: string; error: string}> = [];

    for (const offlinePO of offlinePOs) {
      try {
        await purchaseOrderService.createPurchaseOrder(
          offlinePO.data as any,
        );
        synced++;
        // TODO: Remove from local storage
        // await AsyncStorage.removeItem(`offline_po_${offlinePO.localId}`);
      } catch (error: any) {
        failed++;
        errors.push({
          localId: offlinePO.localId,
          error: error.message,
        });
      }
    }

    return {synced, failed, errors};
  },

  /**
   * Delete offline purchase order
   */
  async deleteOfflinePurchaseOrder(localId: string): Promise<void> {
    // TODO: Implement local storage delete
    // await AsyncStorage.removeItem(`offline_po_${localId}`);
  },
};

// Export combined service
export const procurementService = {
  ...supplierService,
  ...purchaseOrderService,
  ...approvalService,
  ...receivingService,
  ...procurementDashboardService,
  ...offlineProcurementService,
};

export default procurementService;
