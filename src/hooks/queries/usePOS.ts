/**
 * POS Query Hooks
 * React Query hooks for POS transactions and operations
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {posService} from '@api/services/posService';
import {
  POSTransaction,
  ReturnTransaction,
  ExchangeTransaction,
  PaginationParams,
} from '@types/api.types';

// Query Keys
export const posKeys = {
  all: ['pos'] as const,
  transactions: () => [...posKeys.all, 'transactions'] as const,
  transaction: (id: string) => [...posKeys.transactions(), id] as const,
  transactionList: (params?: any) => [...posKeys.transactions(), 'list', params] as const,
  receipt: (id: string) => [...posKeys.transaction(id), 'receipt'] as const,
  returns: () => [...posKeys.all, 'returns'] as const,
  return: (id: string) => [...posKeys.returns(), id] as const,
  returnList: (params?: any) => [...posKeys.returns(), 'list', params] as const,
  reports: () => [...posKeys.all, 'reports'] as const,
  dailySales: (date: string) => [...posKeys.reports(), 'daily', date] as const,
  salesSummary: (from: string, to: string) =>
    [...posKeys.reports(), 'summary', from, to] as const,
};

/**
 * Hook to create a transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: Omit<POSTransaction, 'id' | 'createdAt' | 'updatedAt'>) =>
      posService.createTransaction(transaction),
    onSuccess: newTransaction => {
      queryClient.invalidateQueries({queryKey: posKeys.transactions()});
      if (newTransaction.id) {
        queryClient.setQueryData(posKeys.transaction(newTransaction.id), newTransaction);
      }
    },
  });
};

/**
 * Hook to fetch a transaction
 */
export const useTransaction = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: posKeys.transaction(id),
    queryFn: () => posService.getTransaction(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch transactions with pagination
 */
export const useTransactions = (
  params?: PaginationParams & {
    status?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
  },
) => {
  return useQuery({
    queryKey: posKeys.transactionList(params),
    queryFn: () => posService.getTransactions(params),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

/**
 * Hook to void a transaction
 */
export const useVoidTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, reason}: {id: string; reason: string}) =>
      posService.voidTransaction(id, reason),
    onSuccess: (voidedTransaction, variables) => {
      queryClient.invalidateQueries({queryKey: posKeys.transactions()});
      queryClient.setQueryData(
        posKeys.transaction(variables.id),
        voidedTransaction,
      );
    },
  });
};

/**
 * Hook to fetch receipt
 */
export const useReceipt = (transactionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: posKeys.receipt(transactionId),
    queryFn: () => posService.getReceipt(transactionId),
    enabled: !!transactionId && enabled,
  });
};

/**
 * Hook to email receipt
 */
export const useEmailReceipt = () => {
  return useMutation({
    mutationFn: ({transactionId, email}: {transactionId: string; email: string}) =>
      posService.emailReceipt(transactionId, email),
  });
};

/**
 * Hook to create a return
 */
export const useCreateReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      returnData: Omit<ReturnTransaction, 'id' | 'createdAt' | 'completedAt'>,
    ) => posService.createReturn(returnData),
    onSuccess: newReturn => {
      queryClient.invalidateQueries({queryKey: posKeys.returns()});
      queryClient.invalidateQueries({queryKey: posKeys.transactions()});
      if (newReturn.id) {
        queryClient.setQueryData(posKeys.return(newReturn.id), newReturn);
      }
    },
  });
};

/**
 * Hook to fetch returns
 */
export const useReturns = (
  params?: PaginationParams & {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  },
) => {
  return useQuery({
    queryKey: posKeys.returnList(params),
    queryFn: () => posService.getReturns(params),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

/**
 * Hook to create an exchange
 */
export const useCreateExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      exchangeData: Omit<ExchangeTransaction, 'id' | 'createdAt' | 'completedAt'>,
    ) => posService.createExchange(exchangeData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: posKeys.returns()});
      queryClient.invalidateQueries({queryKey: posKeys.transactions()});
    },
  });
};

/**
 * Hook to fetch daily sales report
 */
export const useDailySalesReport = (date: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: posKeys.dailySales(date),
    queryFn: () => posService.getDailySalesReport(date),
    enabled: !!date && enabled,
  });
};

/**
 * Hook to fetch sales summary
 */
export const useSalesSummary = (
  dateFrom: string,
  dateTo: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: posKeys.salesSummary(dateFrom, dateTo),
    queryFn: () => posService.getSalesSummary(dateFrom, dateTo),
    enabled: !!dateFrom && !!dateTo && enabled,
  });
};
