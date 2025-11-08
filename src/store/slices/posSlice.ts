/**
 * POS Store Slice
 * Zustand store for managing POS cart, transactions, and held sales
 */

import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {
  POSItem,
  POSTransaction,
  Customer,
  Product,
  Discount,
  HeldSale,
  ProductVariant,
} from '@types/api.types';

// POS State Interface
export interface POSState {
  // Cart State
  cartItems: POSItem[];
  selectedCustomer: Customer | null;
  cartDiscount: Discount | null;
  notes: string;

  // Calculated Totals
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  itemCount: number;

  // Held Sales
  heldSales: HeldSale[];

  // UI State
  isProcessing: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;

  // Tax Configuration
  defaultTaxRate: number;
}

// POS Actions Interface
export interface POSActions {
  // Cart Actions
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateItemQuantity: (
    productId: string,
    quantity: number,
    variantId?: string,
  ) => void;
  applyItemDiscount: (
    productId: string,
    discount: Discount,
    variantId?: string,
  ) => void;
  removeItemDiscount: (productId: string, variantId?: string) => void;
  clearCart: () => void;

  // Cart-wide Actions
  applyCartDiscount: (discount: Discount) => void;
  removeCartDiscount: () => void;
  setNotes: (notes: string) => void;

  // Customer Actions
  selectCustomer: (customer: Customer | null) => void;

  // Hold/Retrieve Sales Actions
  holdSale: (name?: string) => void;
  retrieveSale: (saleId: string) => void;
  deleteHeldSale: (saleId: string) => void;
  clearHeldSales: () => void;

  // Calculation Actions
  recalculateTotals: () => void;

  // UI Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setError: (error: string | null) => void;
  setProcessing: (isProcessing: boolean) => void;

  // Tax Actions
  setDefaultTaxRate: (rate: number) => void;

  // Transaction Actions
  createTransaction: () => POSTransaction | null;

  // Reset
  reset: () => void;
}

// Initial State
const initialState: POSState = {
  cartItems: [],
  selectedCustomer: null,
  cartDiscount: null,
  notes: '',
  subtotal: 0,
  discountTotal: 0,
  taxTotal: 0,
  total: 0,
  itemCount: 0,
  heldSales: [],
  isProcessing: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  defaultTaxRate: 0.1, // 10% default tax
};

// Create POS Store
export const usePOSStore = create<POSState & POSActions>()(
  immer((set, get) => ({
    ...initialState,

    // Add Item to Cart
    addItem: (product, quantity = 1, variant) => {
      set(state => {
        const itemKey = variant ? `${product.id}-${variant.id}` : product.id;
        const existingItemIndex = state.cartItems.findIndex(
          item =>
            item.productId === product.id &&
            (variant ? item.variantId === variant.id : !item.variantId),
        );

        const price = variant?.price || product.price;
        const taxRate = product.taxRate || state.defaultTaxRate;

        if (existingItemIndex !== -1) {
          // Update existing item quantity
          state.cartItems[existingItemIndex].quantity += quantity;
          state.cartItems[existingItemIndex].subtotal =
            state.cartItems[existingItemIndex].quantity * price;
          state.cartItems[existingItemIndex].total =
            state.cartItems[existingItemIndex].subtotal;
        } else {
          // Add new item
          const newItem: POSItem = {
            id: itemKey,
            productId: product.id,
            productName: product.name,
            productSku: product.sku,
            variantId: variant?.id,
            variant,
            quantity,
            unitPrice: price,
            price,
            subtotal: price * quantity,
            taxRate,
            tax: price * quantity * taxRate,
            total: price * quantity * (1 + taxRate),
          };
          state.cartItems.push(newItem);
        }
      });
      get().recalculateTotals();
    },

    // Remove Item from Cart
    removeItem: (productId, variantId) => {
      set(state => {
        state.cartItems = state.cartItems.filter(
          item =>
            !(
              item.productId === productId &&
              (variantId ? item.variantId === variantId : !item.variantId)
            ),
        );
      });
      get().recalculateTotals();
    },

    // Update Item Quantity
    updateItemQuantity: (productId, quantity, variantId) => {
      if (quantity <= 0) {
        get().removeItem(productId, variantId);
        return;
      }

      set(state => {
        const item = state.cartItems.find(
          item =>
            item.productId === productId &&
            (variantId ? item.variantId === variantId : !item.variantId),
        );

        if (item) {
          item.quantity = quantity;
          item.subtotal = item.unitPrice * quantity;

          // Recalculate with discount if exists
          if (item.discount) {
            const discountAmount =
              item.discount.type === 'percentage'
                ? item.subtotal * (item.discount.value / 100)
                : item.discount.value * quantity;
            item.discountAmount = discountAmount;
            item.total = (item.subtotal - discountAmount) * (1 + (item.taxRate || 0));
          } else {
            item.total = item.subtotal * (1 + (item.taxRate || 0));
          }
          item.tax = item.total - item.subtotal + (item.discountAmount || 0);
        }
      });
      get().recalculateTotals();
    },

    // Apply Discount to Item
    applyItemDiscount: (productId, discount, variantId) => {
      set(state => {
        const item = state.cartItems.find(
          item =>
            item.productId === productId &&
            (variantId ? item.variantId === variantId : !item.variantId),
        );

        if (item) {
          item.discount = discount;
          const discountAmount =
            discount.type === 'percentage'
              ? item.subtotal * (discount.value / 100)
              : discount.value * item.quantity;
          item.discountAmount = discountAmount;
          discount.amount = discountAmount;
          item.total = (item.subtotal - discountAmount) * (1 + (item.taxRate || 0));
          item.tax = item.total - item.subtotal + discountAmount;
        }
      });
      get().recalculateTotals();
    },

    // Remove Item Discount
    removeItemDiscount: (productId, variantId) => {
      set(state => {
        const item = state.cartItems.find(
          item =>
            item.productId === productId &&
            (variantId ? item.variantId === variantId : !item.variantId),
        );

        if (item) {
          item.discount = undefined;
          item.discountAmount = 0;
          item.total = item.subtotal * (1 + (item.taxRate || 0));
          item.tax = item.total - item.subtotal;
        }
      });
      get().recalculateTotals();
    },

    // Clear Cart
    clearCart: () => {
      set(state => {
        state.cartItems = [];
        state.selectedCustomer = null;
        state.cartDiscount = null;
        state.notes = '';
        state.subtotal = 0;
        state.discountTotal = 0;
        state.taxTotal = 0;
        state.total = 0;
        state.itemCount = 0;
        state.error = null;
      });
    },

    // Apply Cart-wide Discount
    applyCartDiscount: discount => {
      set(state => {
        state.cartDiscount = discount;
      });
      get().recalculateTotals();
    },

    // Remove Cart Discount
    removeCartDiscount: () => {
      set(state => {
        state.cartDiscount = null;
      });
      get().recalculateTotals();
    },

    // Set Notes
    setNotes: notes => {
      set(state => {
        state.notes = notes;
      });
    },

    // Select Customer
    selectCustomer: customer => {
      set(state => {
        state.selectedCustomer = customer;
      });
    },

    // Hold Sale
    holdSale: name => {
      const state = get();
      if (state.cartItems.length === 0) {
        set({error: 'Cannot hold an empty cart'});
        return;
      }

      const heldSale: HeldSale = {
        id: Date.now().toString(),
        name: name || `Sale ${state.heldSales.length + 1}`,
        transaction: {
          items: state.cartItems,
          customerId: state.selectedCustomer?.id,
          customer: state.selectedCustomer || undefined,
          cartDiscount: state.cartDiscount || undefined,
          notes: state.notes,
          subtotal: state.subtotal,
          discountTotal: state.discountTotal,
          taxTotal: state.taxTotal,
          total: state.total,
          status: 'on_hold' as const,
        },
        heldBy: 'current_user', // TODO: Get from auth store
        heldAt: new Date().toISOString(),
      };

      set(state => {
        state.heldSales.push(heldSale);
      });

      get().clearCart();
    },

    // Retrieve Sale
    retrieveSale: saleId => {
      const state = get();
      const heldSale = state.heldSales.find(sale => sale.id === saleId);

      if (!heldSale) {
        set({error: 'Held sale not found'});
        return;
      }

      set(state => {
        state.cartItems = heldSale.transaction.items || [];
        state.selectedCustomer = heldSale.transaction.customer || null;
        state.cartDiscount = heldSale.transaction.cartDiscount || null;
        state.notes = heldSale.transaction.notes || '';
        state.heldSales = state.heldSales.filter(sale => sale.id !== saleId);
      });

      get().recalculateTotals();
    },

    // Delete Held Sale
    deleteHeldSale: saleId => {
      set(state => {
        state.heldSales = state.heldSales.filter(sale => sale.id !== saleId);
      });
    },

    // Clear All Held Sales
    clearHeldSales: () => {
      set(state => {
        state.heldSales = [];
      });
    },

    // Recalculate Totals
    recalculateTotals: () => {
      set(state => {
        // Calculate subtotal and item count
        let subtotal = 0;
        let itemCount = 0;
        let itemDiscountTotal = 0;
        let taxTotal = 0;

        state.cartItems.forEach(item => {
          subtotal += item.subtotal;
          itemCount += item.quantity;
          itemDiscountTotal += item.discountAmount || 0;
        });

        state.subtotal = subtotal;
        state.itemCount = itemCount;

        // Calculate cart-wide discount
        let cartDiscountAmount = 0;
        if (state.cartDiscount) {
          cartDiscountAmount =
            state.cartDiscount.type === 'percentage'
              ? subtotal * (state.cartDiscount.value / 100)
              : state.cartDiscount.value;
          state.cartDiscount.amount = cartDiscountAmount;
        }

        // Total discount
        state.discountTotal = itemDiscountTotal + cartDiscountAmount;

        // Calculate tax on discounted subtotal
        const discountedSubtotal = subtotal - state.discountTotal;

        state.cartItems.forEach(item => {
          const itemDiscountedSubtotal = item.subtotal - (item.discountAmount || 0);
          const itemTax = itemDiscountedSubtotal * (item.taxRate || 0);
          taxTotal += itemTax;
        });

        state.taxTotal = taxTotal;

        // Calculate total
        state.total = discountedSubtotal + taxTotal;
      });
    },

    // Set Search Query
    setSearchQuery: query => {
      set(state => {
        state.searchQuery = query;
      });
    },

    // Set Selected Category
    setSelectedCategory: categoryId => {
      set(state => {
        state.selectedCategory = categoryId;
      });
    },

    // Set Error
    setError: error => {
      set(state => {
        state.error = error;
      });
    },

    // Set Processing
    setProcessing: isProcessing => {
      set(state => {
        state.isProcessing = isProcessing;
      });
    },

    // Set Default Tax Rate
    setDefaultTaxRate: rate => {
      set(state => {
        state.defaultTaxRate = rate;
      });
    },

    // Create Transaction Object
    createTransaction: () => {
      const state = get();

      if (state.cartItems.length === 0) {
        set({error: 'Cannot create transaction with empty cart'});
        return null;
      }

      const transaction: POSTransaction = {
        customerId: state.selectedCustomer?.id,
        customer: state.selectedCustomer || undefined,
        branchId: 'default', // TODO: Get from settings or user
        cashierId: 'current_user', // TODO: Get from auth store
        items: state.cartItems,
        subtotal: state.subtotal,
        discountTotal: state.discountTotal,
        cartDiscount: state.cartDiscount || undefined,
        taxTotal: state.taxTotal,
        total: state.total,
        payments: [],
        notes: state.notes,
        status: 'pending',
        source: 'pos',
      };

      return transaction;
    },

    // Reset Store
    reset: () => {
      set(initialState);
    },
  })),
);
