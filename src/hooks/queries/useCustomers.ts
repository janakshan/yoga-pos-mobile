/**
 * Customer Query Hooks
 * React Query hooks for customer data fetching
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {customerService} from '@api/services/customerService';
import {Customer, PaginationParams} from '@types/api.types';

// Query Keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: any) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  search: (query: string) => [...customerKeys.all, 'search', query] as const,
  history: (id: string) => [...customerKeys.detail(id), 'history'] as const,
};

/**
 * Hook to fetch customers with pagination and filters
 */
export const useCustomers = (
  params?: PaginationParams & {
    customerType?: string;
    status?: string;
    search?: string;
  },
) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getCustomers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single customer
 */
export const useCustomer = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to search customers
 */
export const useSearchCustomers = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: customerKeys.search(query),
    queryFn: () => customerService.searchCustomers(query),
    enabled: !!query && enabled,
    retry: false,
  });
};

/**
 * Hook to fetch customer purchase history
 */
export const useCustomerPurchaseHistory = (
  customerId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: customerKeys.history(customerId),
    queryFn: () => customerService.getCustomerPurchaseHistory(customerId),
    enabled: !!customerId && enabled,
  });
};

/**
 * Hook to create a customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) =>
      customerService.createCustomer(data),
    onSuccess: newCustomer => {
      queryClient.invalidateQueries({queryKey: customerKeys.lists()});
      queryClient.setQueryData(customerKeys.detail(newCustomer.id), newCustomer);
    },
  });
};

/**
 * Hook to update a customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<Customer>}) =>
      customerService.updateCustomer(id, data),
    onSuccess: (updatedCustomer, variables) => {
      queryClient.invalidateQueries({queryKey: customerKeys.lists()});
      queryClient.setQueryData(customerKeys.detail(variables.id), updatedCustomer);
    },
  });
};

/**
 * Hook to update loyalty points
 */
export const useUpdateLoyaltyPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      points,
      action,
    }: {
      customerId: string;
      points: number;
      action: 'earn' | 'redeem';
    }) => customerService.updateLoyaltyPoints(customerId, points, action),
    onSuccess: (updatedCustomer, variables) => {
      queryClient.invalidateQueries({queryKey: customerKeys.lists()});
      queryClient.setQueryData(
        customerKeys.detail(variables.customerId),
        updatedCustomer,
      );
    },
  });
};
