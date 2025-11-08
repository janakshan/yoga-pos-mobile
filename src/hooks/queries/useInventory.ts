/**
 * Inventory Query Hooks
 * React Query hooks for inventory data fetching and operations
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {inventoryService} from '@api/services/inventoryService';
import {
  InventoryLocation,
  StockLevel,
  InventoryTransaction,
  StockTransfer,
  StockAdjustment,
  CycleCount,
  PhysicalInventory,
  SerialNumber,
  LowStockAlert,
  WasteLossRecord,
  InventoryFilters,
  BatchStockUpdate,
} from '@types/api.types';

// ============================================================
// QUERY KEYS
// ============================================================

export const inventoryKeys = {
  all: ['inventory'] as const,

  // Locations
  locations: () => [...inventoryKeys.all, 'locations'] as const,
  location: (id: string) => [...inventoryKeys.locations(), id] as const,

  // Stock Levels
  stockLevels: () => [...inventoryKeys.all, 'stock-levels'] as const,
  stockLevel: (productId: string, locationId: string) =>
    [...inventoryKeys.stockLevels(), productId, locationId] as const,
  productStockLevels: (productId: string) =>
    [...inventoryKeys.stockLevels(), 'product', productId] as const,
  lowStockItems: (locationId?: string) =>
    [...inventoryKeys.stockLevels(), 'low-stock', locationId] as const,

  // Transactions
  transactions: () => [...inventoryKeys.all, 'transactions'] as const,
  transactionsList: (filters?: InventoryFilters) =>
    [...inventoryKeys.transactions(), 'list', filters] as const,
  transaction: (id: string) => [...inventoryKeys.transactions(), id] as const,

  // Transfers
  transfers: () => [...inventoryKeys.all, 'transfers'] as const,
  transfersList: (params?: any) => [...inventoryKeys.transfers(), 'list', params] as const,
  transfer: (id: string) => [...inventoryKeys.transfers(), id] as const,

  // Adjustments
  adjustments: () => [...inventoryKeys.all, 'adjustments'] as const,
  adjustmentsList: (params?: any) => [...inventoryKeys.adjustments(), 'list', params] as const,
  adjustment: (id: string) => [...inventoryKeys.adjustments(), id] as const,

  // Cycle Counts
  cycleCounts: () => [...inventoryKeys.all, 'cycle-counts'] as const,
  cycleCountsList: (params?: any) => [...inventoryKeys.cycleCounts(), 'list', params] as const,
  cycleCount: (id: string) => [...inventoryKeys.cycleCounts(), id] as const,

  // Physical Inventories
  physicalInventories: () => [...inventoryKeys.all, 'physical-inventories'] as const,
  physicalInventoriesList: (params?: any) =>
    [...inventoryKeys.physicalInventories(), 'list', params] as const,
  physicalInventory: (id: string) => [...inventoryKeys.physicalInventories(), id] as const,

  // Serial Numbers
  serialNumbers: () => [...inventoryKeys.all, 'serial-numbers'] as const,
  serialNumbersList: (params?: any) => [...inventoryKeys.serialNumbers(), 'list', params] as const,
  serialNumber: (serial: string) => [...inventoryKeys.serialNumbers(), serial] as const,

  // Low Stock Alerts
  lowStockAlerts: () => [...inventoryKeys.all, 'low-stock-alerts'] as const,
  lowStockAlertsList: (params?: any) =>
    [...inventoryKeys.lowStockAlerts(), 'list', params] as const,
  lowStockAlert: (id: string) => [...inventoryKeys.lowStockAlerts(), id] as const,

  // Waste/Loss
  wasteLoss: () => [...inventoryKeys.all, 'waste-loss'] as const,
  wasteLossList: (params?: any) => [...inventoryKeys.wasteLoss(), 'list', params] as const,
  wasteLossRecord: (id: string) => [...inventoryKeys.wasteLoss(), id] as const,

  // Dashboard
  dashboard: (locationId?: string) =>
    [...inventoryKeys.all, 'dashboard', locationId] as const,
};

// ============================================================
// INVENTORY LOCATIONS
// ============================================================

export const useInventoryLocations = (params?: {type?: string; isActive?: boolean}) => {
  return useQuery({
    queryKey: inventoryKeys.locations(),
    queryFn: () => inventoryService.getLocations(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInventoryLocation = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.location(id),
    queryFn: () => inventoryService.getLocation(id),
    enabled: !!id && enabled,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<InventoryLocation, 'id' | 'createdAt' | 'updatedAt'>) =>
      inventoryService.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.locations()});
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<InventoryLocation>}) =>
      inventoryService.updateLocation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.locations()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.location(variables.id)});
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.locations()});
    },
  });
};

// ============================================================
// STOCK LEVELS
// ============================================================

export const useStockLevels = (filters?: InventoryFilters) => {
  return useQuery({
    queryKey: inventoryKeys.stockLevels(),
    queryFn: () => inventoryService.getStockLevels(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useStockLevel = (
  productId: string,
  locationId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: inventoryKeys.stockLevel(productId, locationId),
    queryFn: () => inventoryService.getStockLevel(productId, locationId),
    enabled: !!productId && !!locationId && enabled,
  });
};

export const useProductStockLevels = (productId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.productStockLevels(productId),
    queryFn: () => inventoryService.getProductStockLevels(productId),
    enabled: !!productId && enabled,
  });
};

export const useLowStockItems = (locationId?: string) => {
  return useQuery({
    queryKey: inventoryKeys.lowStockItems(locationId),
    queryFn: () => inventoryService.getLowStockItems(locationId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateStockLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      locationId,
      data,
    }: {
      productId: string;
      locationId: string;
      data: Partial<StockLevel>;
    }) => inventoryService.updateStockLevel(productId, locationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.stockLevel(variables.productId, variables.locationId),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.productStockLevels(variables.productId),
      });
    },
  });
};

// ============================================================
// INVENTORY TRANSACTIONS
// ============================================================

export const useInventoryTransactions = (filters?: InventoryFilters) => {
  return useQuery({
    queryKey: inventoryKeys.transactionsList(filters),
    queryFn: () => inventoryService.getTransactions(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useInventoryTransaction = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.transaction(id),
    queryFn: () => inventoryService.getTransaction(id),
    enabled: !!id && enabled,
  });
};

export const useCreateInventoryTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<InventoryTransaction, 'id' | 'transactionNumber' | 'createdAt'>,
    ) => inventoryService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.transactions()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.dashboard()});
    },
  });
};

export const useApproveTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.approveTransaction(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.transactions()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.transaction(id)});
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
    },
  });
};

export const useRejectTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, reason}: {id: string; reason: string}) =>
      inventoryService.rejectTransaction(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.transactions()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.transaction(variables.id)});
    },
  });
};

// ============================================================
// STOCK TRANSFERS
// ============================================================

export const useStockTransfers = (params?: any) => {
  return useQuery({
    queryKey: inventoryKeys.transfersList(params),
    queryFn: () => inventoryService.getTransfers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useStockTransfer = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.transfer(id),
    queryFn: () => inventoryService.getTransfer(id),
    enabled: !!id && enabled,
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<StockTransfer, 'id' | 'transferNumber' | 'createdAt' | 'updatedAt'>,
    ) => inventoryService.createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfers()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.dashboard()});
    },
  });
};

export const useApproveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.approveTransfer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfers()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfer(id)});
    },
  });
};

export const useSendTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, signature}: {id: string; signature?: string}) =>
      inventoryService.sendTransfer(id, signature),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfers()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfer(variables.id)});
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
    },
  });
};

export const useReceiveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        receivedItems: Array<{itemId: string; quantityReceived: number; condition?: string}>;
        signature?: string;
        notes?: string;
      };
    }) => inventoryService.receiveTransfer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfers()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfer(variables.id)});
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
    },
  });
};

export const useCancelTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, reason}: {id: string; reason: string}) =>
      inventoryService.cancelTransfer(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfers()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.transfer(variables.id)});
    },
  });
};

// ============================================================
// STOCK ADJUSTMENTS
// ============================================================

export const useStockAdjustments = (params?: any) => {
  return useQuery({
    queryKey: inventoryKeys.adjustmentsList(params),
    queryFn: () => inventoryService.getAdjustments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useStockAdjustment = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.adjustment(id),
    queryFn: () => inventoryService.getAdjustment(id),
    enabled: !!id && enabled,
  });
};

export const useCreateAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<StockAdjustment, 'id' | 'adjustmentNumber' | 'createdAt'>) =>
      inventoryService.createAdjustment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.adjustments()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.dashboard()});
    },
  });
};

export const useApproveAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.approveAdjustment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.adjustments()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.adjustment(id)});
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
    },
  });
};

// ============================================================
// CYCLE COUNTS
// ============================================================

export const useCycleCounts = (params?: any) => {
  return useQuery({
    queryKey: inventoryKeys.cycleCountsList(params),
    queryFn: () => inventoryService.getCycleCounts(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCycleCount = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.cycleCount(id),
    queryFn: () => inventoryService.getCycleCount(id),
    enabled: !!id && enabled,
  });
};

export const useCreateCycleCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CycleCount, 'id' | 'countNumber' | 'createdAt' | 'updatedAt'>) =>
      inventoryService.createCycleCount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.cycleCounts()});
    },
  });
};

export const useStartCycleCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.startCycleCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.cycleCounts()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.cycleCount(id)});
    },
  });
};

export const useUpdateCycleCountItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cycleCountId,
      itemId,
      data,
    }: {
      cycleCountId: string;
      itemId: string;
      data: {countedQuantity: number; notes?: string};
    }) => inventoryService.updateCycleCountItem(cycleCountId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.cycleCount(variables.cycleCountId)});
    },
  });
};

export const useCompleteCycleCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.completeCycleCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.cycleCounts()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.cycleCount(id)});
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
    },
  });
};

// ============================================================
// PHYSICAL INVENTORIES
// ============================================================

export const usePhysicalInventories = (params?: any) => {
  return useQuery({
    queryKey: inventoryKeys.physicalInventoriesList(params),
    queryFn: () => inventoryService.getPhysicalInventories(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const usePhysicalInventory = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.physicalInventory(id),
    queryFn: () => inventoryService.getPhysicalInventory(id),
    enabled: !!id && enabled,
  });
};

export const useCreatePhysicalInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<PhysicalInventory, 'id' | 'inventoryNumber' | 'createdAt' | 'updatedAt'>,
    ) => inventoryService.createPhysicalInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.physicalInventories()});
    },
  });
};

export const useStartPhysicalInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.startPhysicalInventory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.physicalInventories()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.physicalInventory(id)});
    },
  });
};

export const useUpdatePhysicalInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inventoryId,
      itemId,
      data,
    }: {
      inventoryId: string;
      itemId: string;
      data: {
        firstCount?: number;
        secondCount?: number;
        thirdCount?: number;
        notes?: string;
        images?: string[];
      };
    }) => inventoryService.updatePhysicalInventoryItem(inventoryId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.physicalInventory(variables.inventoryId),
      });
    },
  });
};

export const useCompletePhysicalInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.completePhysicalInventory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.physicalInventories()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.physicalInventory(id)});
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
    },
  });
};

// ============================================================
// SERIAL NUMBERS
// ============================================================

export const useSerialNumbers = (params?: any) => {
  return useQuery({
    queryKey: inventoryKeys.serialNumbersList(params),
    queryFn: () => inventoryService.getSerialNumbers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSerialNumber = (serialNumber: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.serialNumber(serialNumber),
    queryFn: () => inventoryService.getSerialNumber(serialNumber),
    enabled: !!serialNumber && enabled,
    retry: false,
  });
};

export const useRegisterSerialNumbers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      productId: string;
      variantId?: string;
      locationId: string;
      serialNumbers: string[];
      purchaseOrderId?: string;
      receivedDate?: string;
    }) => inventoryService.registerSerialNumbers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.serialNumbers()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
    },
  });
};

export const useScanSerialNumber = () => {
  return useMutation({
    mutationFn: (imageUri: string) => inventoryService.scanSerialNumber(imageUri),
  });
};

// ============================================================
// LOW STOCK ALERTS
// ============================================================

export const useLowStockAlerts = (params?: any) => {
  return useQuery({
    queryKey: inventoryKeys.lowStockAlertsList(params),
    queryFn: () => inventoryService.getLowStockAlerts(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
  });
};

export const useAcknowledgeLowStockAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, notes}: {id: string; notes?: string}) =>
      inventoryService.acknowledgeLowStockAlert(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.lowStockAlerts()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.dashboard()});
    },
  });
};

// ============================================================
// WASTE/LOSS TRACKING
// ============================================================

export const useWasteLossRecords = (params?: any) => {
  return useQuery({
    queryKey: inventoryKeys.wasteLossList(params),
    queryFn: () => inventoryService.getWasteLossRecords(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useWasteLossRecord = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.wasteLossRecord(id),
    queryFn: () => inventoryService.getWasteLossRecord(id),
    enabled: !!id && enabled,
  });
};

export const useCreateWasteLossRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<WasteLossRecord, 'id' | 'recordNumber' | 'createdAt' | 'updatedAt'>,
    ) => inventoryService.createWasteLossRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.wasteLoss()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.dashboard()});
    },
  });
};

export const useVerifyWasteLossRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.verifyWasteLossRecord(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.wasteLoss()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.wasteLossRecord(id)});
    },
  });
};

// ============================================================
// BARCODE SCANNING
// ============================================================

export const useScanBarcode = () => {
  return useMutation({
    mutationFn: ({code, type}: {code: string; type?: string}) =>
      inventoryService.scanBarcode(code, type),
  });
};

// ============================================================
// BATCH OPERATIONS
// ============================================================

export const useBatchStockUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchStockUpdate) => inventoryService.batchStockUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: inventoryKeys.stockLevels()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.transactions()});
      queryClient.invalidateQueries({queryKey: inventoryKeys.dashboard()});
    },
  });
};

// ============================================================
// DASHBOARD
// ============================================================

export const useInventoryDashboard = (locationId?: string) => {
  return useQuery({
    queryKey: inventoryKeys.dashboard(locationId),
    queryFn: () => inventoryService.getDashboard(locationId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
  });
};

// ============================================================
// OFFLINE SYNC
// ============================================================

export const useSyncOfflineData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any[]) => inventoryService.syncOfflineData(data),
    onSuccess: () => {
      // Invalidate all inventory-related queries after sync
      queryClient.invalidateQueries({queryKey: inventoryKeys.all});
    },
  });
};
