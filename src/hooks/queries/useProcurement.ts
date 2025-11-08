/**
 * Procurement Query Hooks
 * React Query hooks for procurement and supplier data fetching
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  supplierService,
  purchaseOrderService,
  approvalService,
  receivingService,
  procurementDashboardService,
  offlineProcurementService,
} from '@api/services/procurementService';
import {
  Supplier,
  SupplierFilters,
  PurchaseOrder,
  ProcurementFilters,
  POApprovalRequest,
  ReceivingSession,
} from '@types/api.types';

// ============================================================
// QUERY KEYS
// ============================================================

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (params?: any) => [...supplierKeys.lists(), params] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  search: (query: string) => [...supplierKeys.all, 'search', query] as const,
  products: (id: string) => [...supplierKeys.detail(id), 'products'] as const,
  purchaseHistory: (id: string) => [...supplierKeys.detail(id), 'purchase-history'] as const,
  analytics: (id: string) => [...supplierKeys.detail(id), 'analytics'] as const,
};

export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  lists: () => [...purchaseOrderKeys.all, 'list'] as const,
  list: (params?: any) => [...purchaseOrderKeys.lists(), params] as const,
  details: () => [...purchaseOrderKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseOrderKeys.details(), id] as const,
  search: (query: string) => [...purchaseOrderKeys.all, 'search', query] as const,
  history: (id: string) => [...purchaseOrderKeys.detail(id), 'history'] as const,
  receivingHistory: (id: string) => [...purchaseOrderKeys.detail(id), 'receiving-history'] as const,
  approvals: (id: string) => [...purchaseOrderKeys.detail(id), 'approvals'] as const,
};

export const approvalKeys = {
  all: ['approvals'] as const,
  pending: () => [...approvalKeys.all, 'pending'] as const,
  detail: (id: string) => [...approvalKeys.all, id] as const,
};

export const receivingKeys = {
  all: ['receiving'] as const,
  session: (id: string) => [...receivingKeys.all, 'session', id] as const,
};

export const procurementDashboardKeys = {
  all: ['procurement-dashboard'] as const,
  dashboard: () => [...procurementDashboardKeys.all, 'data'] as const,
  analytics: (dateFrom?: string, dateTo?: string) =>
    [...procurementDashboardKeys.all, 'analytics', {dateFrom, dateTo}] as const,
  trends: (period: string) => [...procurementDashboardKeys.all, 'trends', period] as const,
};

// ============================================================
// SUPPLIER HOOKS
// ============================================================

/**
 * Hook to fetch suppliers with pagination and filters
 */
export const useSuppliers = (params?: SupplierFilters) => {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => supplierService.getSuppliers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single supplier
 */
export const useSupplier = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierService.getSupplier(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to search suppliers
 */
export const useSearchSuppliers = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: supplierKeys.search(query),
    queryFn: () => supplierService.searchSuppliers(query),
    enabled: !!query && enabled,
    retry: false,
  });
};

/**
 * Hook to fetch supplier products
 */
export const useSupplierProducts = (supplierId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: supplierKeys.products(supplierId),
    queryFn: () => supplierService.getSupplierProducts(supplierId),
    enabled: !!supplierId && enabled,
  });
};

/**
 * Hook to fetch supplier purchase history
 */
export const useSupplierPurchaseHistory = (supplierId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: supplierKeys.purchaseHistory(supplierId),
    queryFn: () => supplierService.getSupplierPurchaseHistory(supplierId),
    enabled: !!supplierId && enabled,
  });
};

/**
 * Hook to fetch supplier analytics
 */
export const useSupplierAnalytics = (supplierId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: supplierKeys.analytics(supplierId),
    queryFn: () => supplierService.getSupplierAnalytics(supplierId),
    enabled: !!supplierId && enabled,
  });
};

/**
 * Hook to create a supplier
 */
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) =>
      supplierService.createSupplier(data),
    onSuccess: newSupplier => {
      queryClient.invalidateQueries({queryKey: supplierKeys.lists()});
      queryClient.setQueryData(supplierKeys.detail(newSupplier.id), newSupplier);
    },
  });
};

/**
 * Hook to update a supplier
 */
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<Supplier>}) =>
      supplierService.updateSupplier(id, data),
    onSuccess: (updatedSupplier, variables) => {
      queryClient.invalidateQueries({queryKey: supplierKeys.lists()});
      queryClient.setQueryData(supplierKeys.detail(variables.id), updatedSupplier);
    },
  });
};

/**
 * Hook to delete a supplier
 */
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supplierService.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: supplierKeys.lists()});
    },
  });
};

/**
 * Hook to update supplier performance
 */
export const useUpdateSupplierPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      supplierId,
      data,
    }: {
      supplierId: string;
      data: {
        rating?: number;
        onTimeDeliveryRate?: number;
        qualityRating?: number;
      };
    }) => supplierService.updateSupplierPerformance(supplierId, data),
    onSuccess: (updatedSupplier, variables) => {
      queryClient.invalidateQueries({queryKey: supplierKeys.detail(variables.supplierId)});
      queryClient.invalidateQueries({queryKey: supplierKeys.lists()});
    },
  });
};

// ============================================================
// PURCHASE ORDER HOOKS
// ============================================================

/**
 * Hook to fetch purchase orders with pagination and filters
 */
export const usePurchaseOrders = (params?: ProcurementFilters) => {
  return useQuery({
    queryKey: purchaseOrderKeys.list(params),
    queryFn: () => purchaseOrderService.getPurchaseOrders(params),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook to fetch a single purchase order
 */
export const usePurchaseOrder = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: () => purchaseOrderService.getPurchaseOrder(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to search purchase orders
 */
export const useSearchPurchaseOrders = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: purchaseOrderKeys.search(query),
    queryFn: () => purchaseOrderService.searchPurchaseOrders(query),
    enabled: !!query && enabled,
    retry: false,
  });
};

/**
 * Hook to fetch purchase order history
 */
export const usePurchaseOrderHistory = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: purchaseOrderKeys.history(id),
    queryFn: () => purchaseOrderService.getPurchaseOrderHistory(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch purchase order receiving history
 */
export const usePurchaseOrderReceivingHistory = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: purchaseOrderKeys.receivingHistory(id),
    queryFn: () => receivingService.getReceivingHistory(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to create a purchase order
 */
export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<
      PurchaseOrder,
      'id' | 'poNumber' | 'createdAt' | 'updatedAt' | 'status'
    >) => purchaseOrderService.createPurchaseOrder(data),
    onSuccess: newPO => {
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      queryClient.setQueryData(purchaseOrderKeys.detail(newPO.id), newPO);
    },
  });
};

/**
 * Hook to update a purchase order
 */
export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<PurchaseOrder>}) =>
      purchaseOrderService.updatePurchaseOrder(id, data),
    onSuccess: (updatedPO, variables) => {
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      queryClient.setQueryData(purchaseOrderKeys.detail(variables.id), updatedPO);
    },
  });
};

/**
 * Hook to delete a purchase order
 */
export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseOrderService.deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
    },
  });
};

/**
 * Hook to send purchase order to supplier
 */
export const useSendPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseOrderService.sendPurchaseOrder(id),
    onSuccess: (updatedPO, id) => {
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      queryClient.setQueryData(purchaseOrderKeys.detail(id), updatedPO);
    },
  });
};

/**
 * Hook to cancel purchase order
 */
export const useCancelPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, reason}: {id: string; reason?: string}) =>
      purchaseOrderService.cancelPurchaseOrder(id, reason),
    onSuccess: (updatedPO, variables) => {
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      queryClient.setQueryData(purchaseOrderKeys.detail(variables.id), updatedPO);
    },
  });
};

/**
 * Hook to close purchase order
 */
export const useClosePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseOrderService.closePurchaseOrder(id),
    onSuccess: (updatedPO, id) => {
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      queryClient.setQueryData(purchaseOrderKeys.detail(id), updatedPO);
    },
  });
};

/**
 * Hook to clone purchase order
 */
export const useClonePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseOrderService.clonePurchaseOrder(id),
    onSuccess: newPO => {
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      queryClient.setQueryData(purchaseOrderKeys.detail(newPO.id), newPO);
    },
  });
};

/**
 * Hook to upload document to purchase order
 */
export const useUploadPODocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, file, type}: {id: string; file: FormData; type: string}) =>
      purchaseOrderService.uploadDocument(id, file, type),
    onSuccess: (updatedPO, variables) => {
      queryClient.setQueryData(purchaseOrderKeys.detail(variables.id), updatedPO);
    },
  });
};

/**
 * Hook to email purchase order
 */
export const useEmailPurchaseOrder = () => {
  return useMutation({
    mutationFn: ({
      id,
      email,
      subject,
      message,
    }: {
      id: string;
      email: string;
      subject?: string;
      message?: string;
    }) => purchaseOrderService.emailPurchaseOrder(id, email, subject, message),
  });
};

// ============================================================
// APPROVAL HOOKS
// ============================================================

/**
 * Hook to submit purchase order for approval
 */
export const useSubmitForApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      purchaseOrderId,
      requiredApprovers,
    }: {
      purchaseOrderId: string;
      requiredApprovers?: string[];
    }) => approvalService.submitForApproval(purchaseOrderId, requiredApprovers),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.purchaseOrderId),
      });
      queryClient.invalidateQueries({queryKey: approvalKeys.pending()});
    },
  });
};

/**
 * Hook to fetch pending approvals
 */
export const usePendingApprovals = () => {
  return useQuery({
    queryKey: approvalKeys.pending(),
    queryFn: () => approvalService.getPendingApprovals(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to approve purchase order
 */
export const useApprovePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      approvalRequestId,
      comments,
    }: {
      approvalRequestId: string;
      comments?: string;
    }) => approvalService.approvePurchaseOrder(approvalRequestId, comments),
    onSuccess: approval => {
      queryClient.invalidateQueries({queryKey: approvalKeys.pending()});
      if (approval.purchaseOrder?.id) {
        queryClient.invalidateQueries({
          queryKey: purchaseOrderKeys.detail(approval.purchaseOrder.id),
        });
        queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      }
    },
  });
};

/**
 * Hook to reject purchase order
 */
export const useRejectPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      approvalRequestId,
      comments,
    }: {
      approvalRequestId: string;
      comments: string;
    }) => approvalService.rejectPurchaseOrder(approvalRequestId, comments),
    onSuccess: approval => {
      queryClient.invalidateQueries({queryKey: approvalKeys.pending()});
      if (approval.purchaseOrder?.id) {
        queryClient.invalidateQueries({
          queryKey: purchaseOrderKeys.detail(approval.purchaseOrder.id),
        });
        queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      }
    },
  });
};

/**
 * Hook to fetch approval history
 */
export const useApprovalHistory = (purchaseOrderId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: purchaseOrderKeys.approvals(purchaseOrderId),
    queryFn: () => approvalService.getApprovalHistory(purchaseOrderId),
    enabled: !!purchaseOrderId && enabled,
  });
};

// ============================================================
// RECEIVING HOOKS
// ============================================================

/**
 * Hook to start receiving session
 */
export const useStartReceivingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      purchaseOrderId,
      locationId,
    }: {
      purchaseOrderId: string;
      locationId: string;
    }) => receivingService.startReceivingSession(purchaseOrderId, locationId),
    onSuccess: session => {
      queryClient.setQueryData(receivingKeys.session(session.id), session);
    },
  });
};

/**
 * Hook to fetch receiving session
 */
export const useReceivingSession = (sessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: receivingKeys.session(sessionId),
    queryFn: () => receivingService.getReceivingSession(sessionId),
    enabled: !!sessionId && enabled,
    refetchInterval: 5000, // Auto-refresh every 5 seconds during active session
  });
};

/**
 * Hook to update receiving item
 */
export const useUpdateReceivingItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      itemId,
      data,
    }: {
      sessionId: string;
      itemId: string;
      data: any;
    }) => receivingService.updateReceivingItem(sessionId, itemId, data),
    onSuccess: (updatedSession, variables) => {
      queryClient.setQueryData(receivingKeys.session(variables.sessionId), updatedSession);
    },
  });
};

/**
 * Hook to scan barcode during receiving
 */
export const useScanBarcode = () => {
  return useMutation({
    mutationFn: ({sessionId, barcode}: {sessionId: string; barcode: string}) =>
      receivingService.scanBarcode(sessionId, barcode),
  });
};

/**
 * Hook to report discrepancy
 */
export const useReportDiscrepancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({sessionId, data}: {sessionId: string; data: any}) =>
      receivingService.reportDiscrepancy(sessionId, data),
    onSuccess: (updatedSession, variables) => {
      queryClient.setQueryData(receivingKeys.session(variables.sessionId), updatedSession);
    },
  });
};

/**
 * Hook to upload signature
 */
export const useUploadSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      signatureType,
      signatureData,
    }: {
      sessionId: string;
      signatureType: 'receiver' | 'delivery';
      signatureData: string;
    }) => receivingService.uploadSignature(sessionId, signatureType, signatureData),
    onSuccess: (updatedSession, variables) => {
      queryClient.setQueryData(receivingKeys.session(variables.sessionId), updatedSession);
    },
  });
};

/**
 * Hook to complete receiving session
 */
export const useCompleteReceivingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({sessionId, signature}: {sessionId: string; signature?: string}) =>
      receivingService.completeReceivingSession(sessionId, signature),
    onSuccess: session => {
      queryClient.setQueryData(receivingKeys.session(session.id), session);
      if (session.purchaseOrder?.id) {
        queryClient.invalidateQueries({
          queryKey: purchaseOrderKeys.detail(session.purchaseOrder.id),
        });
        queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
      }
    },
  });
};

/**
 * Hook to receive items (quick receive without session)
 */
export const useReceiveItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      purchaseOrderId,
      items,
      signature,
    }: {
      purchaseOrderId: string;
      items: any[];
      signature?: string;
    }) => receivingService.receiveItems(purchaseOrderId, items, signature),
    onSuccess: (updatedPO, variables) => {
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.purchaseOrderId),
      });
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
    },
  });
};

// ============================================================
// DASHBOARD & ANALYTICS HOOKS
// ============================================================

/**
 * Hook to fetch procurement dashboard
 */
export const useProcurementDashboard = () => {
  return useQuery({
    queryKey: procurementDashboardKeys.dashboard(),
    queryFn: () => procurementDashboardService.getDashboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch procurement analytics
 */
export const useProcurementAnalytics = (dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: procurementDashboardKeys.analytics(dateFrom, dateTo),
    queryFn: () => procurementDashboardService.getAnalytics(dateFrom, dateTo),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch purchase order trends
 */
export const usePurchaseOrderTrends = (period: 'week' | 'month' | 'quarter' | 'year') => {
  return useQuery({
    queryKey: procurementDashboardKeys.trends(period),
    queryFn: () => procurementDashboardService.getPurchaseOrderTrends(period),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

// ============================================================
// OFFLINE HOOKS
// ============================================================

/**
 * Hook to save purchase order offline
 */
export const useSaveOfflinePurchaseOrder = () => {
  return useMutation({
    mutationFn: (data: Partial<PurchaseOrder>) =>
      offlineProcurementService.saveOffline(data),
  });
};

/**
 * Hook to sync offline purchase orders
 */
export const useSyncOfflinePurchaseOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => offlineProcurementService.syncOfflinePurchaseOrders(),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: purchaseOrderKeys.lists()});
    },
  });
};
