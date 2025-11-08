/**
 * Product Query Hooks
 * React Query hooks for product data fetching
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {productService} from '@api/services/productService';
import {Product, PaginationParams, Category, ProductBundle} from '@types/api.types';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: any) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  barcode: (barcode: string) => [...productKeys.all, 'barcode', barcode] as const,
  sku: (sku: string) => [...productKeys.all, 'sku', sku] as const,
  variants: (productId: string) => [...productKeys.detail(productId), 'variants'] as const,
  categories: ['categories'] as const,
  bundles: ['bundles'] as const,
};

/**
 * Hook to fetch products with pagination and filters
 */
export const useProducts = (
  params?: PaginationParams & {
    category?: string;
    status?: string;
    search?: string;
    inStock?: boolean;
  },
) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single product
 */
export const useProduct = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch product by barcode
 */
export const useProductByBarcode = (barcode: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.barcode(barcode),
    queryFn: () => productService.getProductByBarcode(barcode),
    enabled: !!barcode && enabled,
    retry: false,
  });
};

/**
 * Hook to fetch product by SKU
 */
export const useProductBySKU = (sku: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.sku(sku),
    queryFn: () => productService.getProductBySKU(sku),
    enabled: !!sku && enabled,
    retry: false,
  });
};

/**
 * Hook to fetch product variants
 */
export const useProductVariants = (productId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.variants(productId),
    queryFn: () => productService.getProductVariants(productId),
    enabled: !!productId && enabled,
  });
};

/**
 * Hook to fetch categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch product bundles
 */
export const useBundles = (params?: {status?: string}) => {
  return useQuery({
    queryKey: productKeys.bundles,
    queryFn: () => productService.getBundles(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to create a product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
      productService.createProduct(data),
    onSuccess: newProduct => {
      queryClient.invalidateQueries({queryKey: productKeys.lists()});
      queryClient.setQueryData(productKeys.detail(newProduct.id), newProduct);
    },
  });
};

/**
 * Hook to update a product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<Product>}) =>
      productService.updateProduct(id, data),
    onSuccess: (updatedProduct, variables) => {
      queryClient.invalidateQueries({queryKey: productKeys.lists()});
      queryClient.setQueryData(productKeys.detail(variables.id), updatedProduct);
    },
  });
};

/**
 * Hook to delete a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: productKeys.lists()});
      queryClient.removeQueries({queryKey: productKeys.detail(id)});
    },
  });
};
