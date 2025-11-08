/**
 * Inventory Service
 * API service for inventory management operations
 */

import apiClient from '../client';
import {
  InventoryLocation,
  StockLevel,
  InventoryTransaction,
  InventoryTransactionType,
  StockTransfer,
  StockAdjustment,
  CycleCount,
  PhysicalInventory,
  SerialNumber,
  LowStockAlert,
  WasteLossRecord,
  InventoryDashboard,
  InventoryFilters,
  PaginatedResponse,
  BatchStockUpdate,
  BarcodeScanResult,
  OfflineInventorySync,
  InventoryReport,
  StockLevelReport,
  InventoryMovementReport,
} from '@types/api.types';

export const inventoryService = {
  // ============================================================
  // INVENTORY LOCATIONS
  // ============================================================

  /**
   * Get all inventory locations
   */
  async getLocations(params?: {
    type?: string;
    isActive?: boolean;
  }): Promise<InventoryLocation[]> {
    const response = await apiClient.get<InventoryLocation[]>('/inventory/locations', {
      params,
    });
    return response.data!;
  },

  /**
   * Get a single location by ID
   */
  async getLocation(id: string): Promise<InventoryLocation> {
    const response = await apiClient.get<InventoryLocation>(`/inventory/locations/${id}`);
    return response.data!;
  },

  /**
   * Create a new location
   */
  async createLocation(
    data: Omit<InventoryLocation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<InventoryLocation> {
    const response = await apiClient.post<InventoryLocation>('/inventory/locations', data);
    return response.data!;
  },

  /**
   * Update a location
   */
  async updateLocation(id: string, data: Partial<InventoryLocation>): Promise<InventoryLocation> {
    const response = await apiClient.put<InventoryLocation>(
      `/inventory/locations/${id}`,
      data,
    );
    return response.data!;
  },

  /**
   * Delete a location
   */
  async deleteLocation(id: string): Promise<void> {
    await apiClient.delete(`/inventory/locations/${id}`);
  },

  // ============================================================
  // STOCK LEVELS
  // ============================================================

  /**
   * Get stock levels with filters
   */
  async getStockLevels(filters?: InventoryFilters): Promise<PaginatedResponse<StockLevel>> {
    const response = await apiClient.get<PaginatedResponse<StockLevel>>('/inventory/stock-levels', {
      params: filters,
    });
    return response.data!;
  },

  /**
   * Get stock level for a specific product at a location
   */
  async getStockLevel(productId: string, locationId: string): Promise<StockLevel> {
    const response = await apiClient.get<StockLevel>(
      `/inventory/stock-levels/${productId}/${locationId}`,
    );
    return response.data!;
  },

  /**
   * Get all stock levels for a product across all locations
   */
  async getProductStockLevels(productId: string): Promise<StockLevel[]> {
    const response = await apiClient.get<StockLevel[]>(
      `/inventory/stock-levels/product/${productId}`,
    );
    return response.data!;
  },

  /**
   * Get low stock items
   */
  async getLowStockItems(locationId?: string): Promise<StockLevel[]> {
    const response = await apiClient.get<StockLevel[]>('/inventory/stock-levels/low-stock', {
      params: {locationId},
    });
    return response.data!;
  },

  /**
   * Update stock level
   */
  async updateStockLevel(
    productId: string,
    locationId: string,
    data: Partial<StockLevel>,
  ): Promise<StockLevel> {
    const response = await apiClient.put<StockLevel>(
      `/inventory/stock-levels/${productId}/${locationId}`,
      data,
    );
    return response.data!;
  },

  // ============================================================
  // INVENTORY TRANSACTIONS
  // ============================================================

  /**
   * Get inventory transactions with filters
   */
  async getTransactions(filters?: InventoryFilters): Promise<PaginatedResponse<InventoryTransaction>> {
    const response = await apiClient.get<PaginatedResponse<InventoryTransaction>>(
      '/inventory/transactions',
      {params: filters},
    );
    return response.data!;
  },

  /**
   * Get a single transaction by ID
   */
  async getTransaction(id: string): Promise<InventoryTransaction> {
    const response = await apiClient.get<InventoryTransaction>(`/inventory/transactions/${id}`);
    return response.data!;
  },

  /**
   * Create a new inventory transaction
   */
  async createTransaction(
    data: Omit<InventoryTransaction, 'id' | 'transactionNumber' | 'createdAt'>,
  ): Promise<InventoryTransaction> {
    const response = await apiClient.post<InventoryTransaction>(
      '/inventory/transactions',
      data,
    );
    return response.data!;
  },

  /**
   * Approve a transaction
   */
  async approveTransaction(id: string): Promise<InventoryTransaction> {
    const response = await apiClient.post<InventoryTransaction>(
      `/inventory/transactions/${id}/approve`,
    );
    return response.data!;
  },

  /**
   * Reject a transaction
   */
  async rejectTransaction(id: string, reason: string): Promise<InventoryTransaction> {
    const response = await apiClient.post<InventoryTransaction>(
      `/inventory/transactions/${id}/reject`,
      {reason},
    );
    return response.data!;
  },

  /**
   * Cancel a transaction
   */
  async cancelTransaction(id: string, reason: string): Promise<InventoryTransaction> {
    const response = await apiClient.post<InventoryTransaction>(
      `/inventory/transactions/${id}/cancel`,
      {reason},
    );
    return response.data!;
  },

  // ============================================================
  // STOCK TRANSFERS
  // ============================================================

  /**
   * Get stock transfers with filters
   */
  async getTransfers(params?: {
    status?: string;
    fromLocationId?: string;
    toLocationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<StockTransfer>> {
    const response = await apiClient.get<PaginatedResponse<StockTransfer>>(
      '/inventory/transfers',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a single transfer by ID
   */
  async getTransfer(id: string): Promise<StockTransfer> {
    const response = await apiClient.get<StockTransfer>(`/inventory/transfers/${id}`);
    return response.data!;
  },

  /**
   * Create a new stock transfer
   */
  async createTransfer(
    data: Omit<StockTransfer, 'id' | 'transferNumber' | 'createdAt' | 'updatedAt'>,
  ): Promise<StockTransfer> {
    const response = await apiClient.post<StockTransfer>('/inventory/transfers', data);
    return response.data!;
  },

  /**
   * Update a transfer (only for draft status)
   */
  async updateTransfer(id: string, data: Partial<StockTransfer>): Promise<StockTransfer> {
    const response = await apiClient.put<StockTransfer>(`/inventory/transfers/${id}`, data);
    return response.data!;
  },

  /**
   * Approve a transfer
   */
  async approveTransfer(id: string): Promise<StockTransfer> {
    const response = await apiClient.post<StockTransfer>(`/inventory/transfers/${id}/approve`);
    return response.data!;
  },

  /**
   * Mark transfer as sent
   */
  async sendTransfer(id: string, signature?: string): Promise<StockTransfer> {
    const response = await apiClient.post<StockTransfer>(`/inventory/transfers/${id}/send`, {
      signature,
    });
    return response.data!;
  },

  /**
   * Receive a transfer
   */
  async receiveTransfer(
    id: string,
    data: {
      receivedItems: Array<{itemId: string; quantityReceived: number; condition?: string}>;
      signature?: string;
      notes?: string;
    },
  ): Promise<StockTransfer> {
    const response = await apiClient.post<StockTransfer>(
      `/inventory/transfers/${id}/receive`,
      data,
    );
    return response.data!;
  },

  /**
   * Cancel a transfer
   */
  async cancelTransfer(id: string, reason: string): Promise<StockTransfer> {
    const response = await apiClient.post<StockTransfer>(`/inventory/transfers/${id}/cancel`, {
      reason,
    });
    return response.data!;
  },

  // ============================================================
  // STOCK ADJUSTMENTS
  // ============================================================

  /**
   * Get stock adjustments with filters
   */
  async getAdjustments(params?: {
    status?: string;
    locationId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<StockAdjustment>> {
    const response = await apiClient.get<PaginatedResponse<StockAdjustment>>(
      '/inventory/adjustments',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a single adjustment by ID
   */
  async getAdjustment(id: string): Promise<StockAdjustment> {
    const response = await apiClient.get<StockAdjustment>(`/inventory/adjustments/${id}`);
    return response.data!;
  },

  /**
   * Create a new stock adjustment
   */
  async createAdjustment(
    data: Omit<StockAdjustment, 'id' | 'adjustmentNumber' | 'createdAt'>,
  ): Promise<StockAdjustment> {
    const response = await apiClient.post<StockAdjustment>('/inventory/adjustments', data);
    return response.data!;
  },

  /**
   * Approve an adjustment
   */
  async approveAdjustment(id: string): Promise<StockAdjustment> {
    const response = await apiClient.post<StockAdjustment>(
      `/inventory/adjustments/${id}/approve`,
    );
    return response.data!;
  },

  /**
   * Reject an adjustment
   */
  async rejectAdjustment(id: string, reason: string): Promise<StockAdjustment> {
    const response = await apiClient.post<StockAdjustment>(
      `/inventory/adjustments/${id}/reject`,
      {reason},
    );
    return response.data!;
  },

  // ============================================================
  // CYCLE COUNTS
  // ============================================================

  /**
   * Get cycle counts with filters
   */
  async getCycleCounts(params?: {
    status?: string;
    locationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<CycleCount>> {
    const response = await apiClient.get<PaginatedResponse<CycleCount>>(
      '/inventory/cycle-counts',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a single cycle count by ID
   */
  async getCycleCount(id: string): Promise<CycleCount> {
    const response = await apiClient.get<CycleCount>(`/inventory/cycle-counts/${id}`);
    return response.data!;
  },

  /**
   * Create a new cycle count
   */
  async createCycleCount(
    data: Omit<CycleCount, 'id' | 'countNumber' | 'createdAt' | 'updatedAt'>,
  ): Promise<CycleCount> {
    const response = await apiClient.post<CycleCount>('/inventory/cycle-counts', data);
    return response.data!;
  },

  /**
   * Start a cycle count
   */
  async startCycleCount(id: string): Promise<CycleCount> {
    const response = await apiClient.post<CycleCount>(`/inventory/cycle-counts/${id}/start`);
    return response.data!;
  },

  /**
   * Update cycle count item
   */
  async updateCycleCountItem(
    cycleCountId: string,
    itemId: string,
    data: {countedQuantity: number; notes?: string},
  ): Promise<CycleCount> {
    const response = await apiClient.put<CycleCount>(
      `/inventory/cycle-counts/${cycleCountId}/items/${itemId}`,
      data,
    );
    return response.data!;
  },

  /**
   * Complete a cycle count
   */
  async completeCycleCount(id: string): Promise<CycleCount> {
    const response = await apiClient.post<CycleCount>(`/inventory/cycle-counts/${id}/complete`);
    return response.data!;
  },

  /**
   * Cancel a cycle count
   */
  async cancelCycleCount(id: string, reason: string): Promise<CycleCount> {
    const response = await apiClient.post<CycleCount>(`/inventory/cycle-counts/${id}/cancel`, {
      reason,
    });
    return response.data!;
  },

  // ============================================================
  // PHYSICAL INVENTORY
  // ============================================================

  /**
   * Get physical inventories with filters
   */
  async getPhysicalInventories(params?: {
    status?: string;
    locationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<PhysicalInventory>> {
    const response = await apiClient.get<PaginatedResponse<PhysicalInventory>>(
      '/inventory/physical-inventories',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a single physical inventory by ID
   */
  async getPhysicalInventory(id: string): Promise<PhysicalInventory> {
    const response = await apiClient.get<PhysicalInventory>(
      `/inventory/physical-inventories/${id}`,
    );
    return response.data!;
  },

  /**
   * Create a new physical inventory
   */
  async createPhysicalInventory(
    data: Omit<PhysicalInventory, 'id' | 'inventoryNumber' | 'createdAt' | 'updatedAt'>,
  ): Promise<PhysicalInventory> {
    const response = await apiClient.post<PhysicalInventory>(
      '/inventory/physical-inventories',
      data,
    );
    return response.data!;
  },

  /**
   * Start a physical inventory
   */
  async startPhysicalInventory(id: string): Promise<PhysicalInventory> {
    const response = await apiClient.post<PhysicalInventory>(
      `/inventory/physical-inventories/${id}/start`,
    );
    return response.data!;
  },

  /**
   * Update physical inventory item count
   */
  async updatePhysicalInventoryItem(
    inventoryId: string,
    itemId: string,
    data: {
      firstCount?: number;
      secondCount?: number;
      thirdCount?: number;
      notes?: string;
      images?: string[];
    },
  ): Promise<PhysicalInventory> {
    const response = await apiClient.put<PhysicalInventory>(
      `/inventory/physical-inventories/${inventoryId}/items/${itemId}`,
      data,
    );
    return response.data!;
  },

  /**
   * Complete a physical inventory
   */
  async completePhysicalInventory(id: string): Promise<PhysicalInventory> {
    const response = await apiClient.post<PhysicalInventory>(
      `/inventory/physical-inventories/${id}/complete`,
    );
    return response.data!;
  },

  // ============================================================
  // SERIAL NUMBERS
  // ============================================================

  /**
   * Get serial numbers with filters
   */
  async getSerialNumbers(params?: {
    productId?: string;
    locationId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<SerialNumber>> {
    const response = await apiClient.get<PaginatedResponse<SerialNumber>>(
      '/inventory/serial-numbers',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a serial number by serial
   */
  async getSerialNumber(serialNumber: string): Promise<SerialNumber> {
    const response = await apiClient.get<SerialNumber>(
      `/inventory/serial-numbers/${serialNumber}`,
    );
    return response.data!;
  },

  /**
   * Register new serial numbers
   */
  async registerSerialNumbers(data: {
    productId: string;
    variantId?: string;
    locationId: string;
    serialNumbers: string[];
    purchaseOrderId?: string;
    receivedDate?: string;
  }): Promise<SerialNumber[]> {
    const response = await apiClient.post<SerialNumber[]>('/inventory/serial-numbers', data);
    return response.data!;
  },

  /**
   * Update serial number status
   */
  async updateSerialNumber(serialNumber: string, data: Partial<SerialNumber>): Promise<SerialNumber> {
    const response = await apiClient.put<SerialNumber>(
      `/inventory/serial-numbers/${serialNumber}`,
      data,
    );
    return response.data!;
  },

  /**
   * Scan serial number with camera
   */
  async scanSerialNumber(imageUri: string): Promise<BarcodeScanResult> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'serial-scan.jpg',
    } as any);

    const response = await apiClient.post<BarcodeScanResult>(
      '/inventory/serial-numbers/scan',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data!;
  },

  // ============================================================
  // LOW STOCK ALERTS
  // ============================================================

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(params?: {
    status?: string;
    locationId?: string;
    severity?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<LowStockAlert>> {
    const response = await apiClient.get<PaginatedResponse<LowStockAlert>>(
      '/inventory/low-stock-alerts',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a single low stock alert
   */
  async getLowStockAlert(id: string): Promise<LowStockAlert> {
    const response = await apiClient.get<LowStockAlert>(`/inventory/low-stock-alerts/${id}`);
    return response.data!;
  },

  /**
   * Acknowledge a low stock alert
   */
  async acknowledgeLowStockAlert(id: string, notes?: string): Promise<LowStockAlert> {
    const response = await apiClient.post<LowStockAlert>(
      `/inventory/low-stock-alerts/${id}/acknowledge`,
      {notes},
    );
    return response.data!;
  },

  /**
   * Resolve a low stock alert
   */
  async resolveLowStockAlert(id: string): Promise<LowStockAlert> {
    const response = await apiClient.post<LowStockAlert>(
      `/inventory/low-stock-alerts/${id}/resolve`,
    );
    return response.data!;
  },

  /**
   * Ignore a low stock alert
   */
  async ignoreLowStockAlert(id: string, notes?: string): Promise<LowStockAlert> {
    const response = await apiClient.post<LowStockAlert>(
      `/inventory/low-stock-alerts/${id}/ignore`,
      {notes},
    );
    return response.data!;
  },

  // ============================================================
  // WASTE/LOSS TRACKING
  // ============================================================

  /**
   * Get waste/loss records
   */
  async getWasteLossRecords(params?: {
    type?: string;
    status?: string;
    locationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<WasteLossRecord>> {
    const response = await apiClient.get<PaginatedResponse<WasteLossRecord>>(
      '/inventory/waste-loss',
      {params},
    );
    return response.data!;
  },

  /**
   * Get a single waste/loss record
   */
  async getWasteLossRecord(id: string): Promise<WasteLossRecord> {
    const response = await apiClient.get<WasteLossRecord>(`/inventory/waste-loss/${id}`);
    return response.data!;
  },

  /**
   * Create a new waste/loss record
   */
  async createWasteLossRecord(
    data: Omit<WasteLossRecord, 'id' | 'recordNumber' | 'createdAt' | 'updatedAt'>,
  ): Promise<WasteLossRecord> {
    const response = await apiClient.post<WasteLossRecord>('/inventory/waste-loss', data);
    return response.data!;
  },

  /**
   * Update a waste/loss record
   */
  async updateWasteLossRecord(id: string, data: Partial<WasteLossRecord>): Promise<WasteLossRecord> {
    const response = await apiClient.put<WasteLossRecord>(`/inventory/waste-loss/${id}`, data);
    return response.data!;
  },

  /**
   * Verify a waste/loss record
   */
  async verifyWasteLossRecord(id: string): Promise<WasteLossRecord> {
    const response = await apiClient.post<WasteLossRecord>(`/inventory/waste-loss/${id}/verify`);
    return response.data!;
  },

  /**
   * Close a waste/loss record
   */
  async closeWasteLossRecord(id: string, notes?: string): Promise<WasteLossRecord> {
    const response = await apiClient.post<WasteLossRecord>(`/inventory/waste-loss/${id}/close`, {
      notes,
    });
    return response.data!;
  },

  // ============================================================
  // BARCODE SCANNING
  // ============================================================

  /**
   * Scan barcode/QR code
   */
  async scanBarcode(code: string, type?: string): Promise<BarcodeScanResult> {
    const response = await apiClient.post<BarcodeScanResult>('/inventory/scan', {
      code,
      type,
    });
    return response.data!;
  },

  // ============================================================
  // BATCH OPERATIONS
  // ============================================================

  /**
   * Batch stock update
   */
  async batchStockUpdate(data: BatchStockUpdate): Promise<{success: boolean; updated: number}> {
    const response = await apiClient.post<{success: boolean; updated: number}>(
      '/inventory/batch/stock-update',
      data,
    );
    return response.data!;
  },

  // ============================================================
  // DASHBOARD & REPORTS
  // ============================================================

  /**
   * Get inventory dashboard data
   */
  async getDashboard(locationId?: string): Promise<InventoryDashboard> {
    const response = await apiClient.get<InventoryDashboard>('/inventory/dashboard', {
      params: {locationId},
    });
    return response.data!;
  },

  /**
   * Generate stock level report
   */
  async getStockLevelReport(locationId?: string, categoryId?: string): Promise<StockLevelReport> {
    const response = await apiClient.get<StockLevelReport>('/inventory/reports/stock-level', {
      params: {locationId, categoryId},
    });
    return response.data!;
  },

  /**
   * Generate inventory movement report
   */
  async getInventoryMovementReport(
    dateFrom: string,
    dateTo: string,
    locationId?: string,
  ): Promise<InventoryMovementReport> {
    const response = await apiClient.get<InventoryMovementReport>(
      '/inventory/reports/movement',
      {
        params: {dateFrom, dateTo, locationId},
      },
    );
    return response.data!;
  },

  /**
   * Export inventory report
   */
  async exportReport(
    type: 'stock_level' | 'movement' | 'valuation' | 'turnover',
    params: {
      dateFrom?: string;
      dateTo?: string;
      locationId?: string;
      categoryId?: string;
      format?: 'csv' | 'excel' | 'pdf';
    },
  ): Promise<Blob> {
    const response = await apiClient.get(`/inventory/reports/export/${type}`, {
      params,
      responseType: 'blob',
    });
    return response.data!;
  },

  // ============================================================
  // OFFLINE SYNC
  // ============================================================

  /**
   * Get pending offline syncs
   */
  async getPendingSyncs(): Promise<OfflineInventorySync[]> {
    const response = await apiClient.get<OfflineInventorySync[]>('/inventory/offline-sync/pending');
    return response.data!;
  },

  /**
   * Sync offline data
   */
  async syncOfflineData(data: OfflineInventorySync[]): Promise<{
    synced: number;
    failed: number;
    errors: Array<{id: string; error: string}>;
  }> {
    const response = await apiClient.post<{
      synced: number;
      failed: number;
      errors: Array<{id: string; error: string}>;
    }>('/inventory/offline-sync', data);
    return response.data!;
  },
};
