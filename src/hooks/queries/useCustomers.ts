/**
 * Customer Query Hooks
 * React Query hooks for customer data fetching
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {customerService} from '@api/services/customerService';
import {
  Customer,
  PaginationParams,
  CommunicationRecord,
  CustomerSegment,
  CustomerReminder,
} from '@types/api.types';

// Query Keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: any) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  search: (query: string) => [...customerKeys.all, 'search', query] as const,
  history: (id: string) => [...customerKeys.detail(id), 'history'] as const,
  communications: (id: string) => [...customerKeys.detail(id), 'communications'] as const,
  segments: () => [...customerKeys.all, 'segments'] as const,
  segment: (id: string) => [...customerKeys.segments(), id] as const,
  reminders: () => [...customerKeys.all, 'reminders'] as const,
  analytics: () => [...customerKeys.all, 'analytics'] as const,
  upcomingBirthdays: (days: number) => [...customerKeys.all, 'upcoming-birthdays', days] as const,
  upcomingAnniversaries: (days: number) => [...customerKeys.all, 'upcoming-anniversaries', days] as const,
  topCustomers: (limit: number) => [...customerKeys.all, 'top', limit] as const,
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

/**
 * Hook to delete a customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: customerKeys.all});
    },
  });
};

/**
 * Hook to get customer by loyalty card
 */
export const useCustomerByLoyaltyCard = (loyaltyCardNumber: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...customerKeys.all, 'loyalty-card', loyaltyCardNumber],
    queryFn: () => customerService.getCustomerByLoyaltyCard(loyaltyCardNumber),
    enabled: !!loyaltyCardNumber && enabled,
  });
};

/**
 * Hook to update store credit
 */
export const useUpdateStoreCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      amount,
      action,
      expiryDate,
    }: {
      customerId: string;
      amount: number;
      action: 'add' | 'deduct';
      expiryDate?: string;
    }) => customerService.updateStoreCredit(customerId, amount, action, expiryDate),
    onSuccess: (updatedCustomer, variables) => {
      queryClient.invalidateQueries({queryKey: customerKeys.lists()});
      queryClient.setQueryData(
        customerKeys.detail(variables.customerId),
        updatedCustomer,
      );
    },
  });
};

// Communication History Hooks
/**
 * Hook to fetch customer communication history
 */
export const useCommunicationHistory = (customerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: customerKeys.communications(customerId),
    queryFn: () => customerService.getCommunicationHistory(customerId),
    enabled: !!customerId && enabled,
  });
};

/**
 * Hook to add communication record
 */
export const useAddCommunicationRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: Omit<CommunicationRecord, 'id' | 'customerId' | 'createdAt'>;
    }) => customerService.addCommunicationRecord(customerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.communications(variables.customerId),
      });
    },
  });
};

/**
 * Hook to send email to customer
 */
export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      subject,
      message,
    }: {
      customerId: string;
      subject: string;
      message: string;
    }) => customerService.sendEmail(customerId, subject, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.communications(variables.customerId),
      });
    },
  });
};

/**
 * Hook to send SMS to customer
 */
export const useSendSMS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      message,
    }: {
      customerId: string;
      message: string;
    }) => customerService.sendSMS(customerId, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.communications(variables.customerId),
      });
    },
  });
};

// Segment Hooks
/**
 * Hook to fetch customer segments
 */
export const useCustomerSegments = () => {
  return useQuery({
    queryKey: customerKeys.segments(),
    queryFn: () => customerService.getSegments(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to create segment
 */
export const useCreateSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<CustomerSegment, 'id' | 'createdAt' | 'updatedAt' | 'customerCount'>,
    ) => customerService.createSegment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: customerKeys.segments()});
    },
  });
};

/**
 * Hook to get customers by segment
 */
export const useCustomersBySegment = (segmentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...customerKeys.segment(segmentId), 'customers'],
    queryFn: () => customerService.getCustomersBySegment(segmentId),
    enabled: !!segmentId && enabled,
  });
};

// Birthday & Anniversary Hooks
/**
 * Hook to fetch upcoming birthdays
 */
export const useUpcomingBirthdays = (days: number = 7) => {
  return useQuery({
    queryKey: customerKeys.upcomingBirthdays(days),
    queryFn: () => customerService.getUpcomingBirthdays(days),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch upcoming anniversaries
 */
export const useUpcomingAnniversaries = (days: number = 7) => {
  return useQuery({
    queryKey: customerKeys.upcomingAnniversaries(days),
    queryFn: () => customerService.getUpcomingAnniversaries(days),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch reminders
 */
export const useReminders = (params?: PaginationParams & {status?: string}) => {
  return useQuery({
    queryKey: [...customerKeys.reminders(), params],
    queryFn: () => customerService.getReminders(params),
  });
};

/**
 * Hook to create reminder
 */
export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CustomerReminder, 'id' | 'createdAt'>) =>
      customerService.createReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: customerKeys.reminders()});
    },
  });
};

// Analytics Hooks
/**
 * Hook to fetch customer analytics
 */
export const useCustomerAnalytics = () => {
  return useQuery({
    queryKey: customerKeys.analytics(),
    queryFn: () => customerService.getCustomerAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch top customers
 */
export const useTopCustomers = (limit: number = 10) => {
  return useQuery({
    queryKey: customerKeys.topCustomers(limit),
    queryFn: () => customerService.getTopCustomers(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to calculate CLV
 */
export const useCalculateCLV = (customerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...customerKeys.detail(customerId), 'clv'],
    queryFn: () => customerService.calculateCLV(customerId),
    enabled: !!customerId && enabled,
  });
};

/**
 * Hook to import customers
 */
export const useImportCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[]) =>
      customerService.importCustomers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: customerKeys.all});
    },
  });
};
