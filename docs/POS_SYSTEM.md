# Point of Sale (POS) System Documentation

## Overview

The POS system is a comprehensive point-of-sale solution built for the Yoga POS Mobile app. It provides a full-featured checkout experience with product catalog browsing, shopping cart management, multiple payment methods, receipt generation, and more.

## Features

### ✅ Implemented Features

#### 1. **Product Selection & Catalog**
- Grid view of products with images, prices, and stock levels
- Category filtering
- Real-time product search
- Responsive layout (2 columns on mobile, 3 on tablet)
- Out-of-stock indication
- Product variants support
- Bundle/package deals support

#### 2. **Shopping Cart**
- Add/remove items with tap
- Quantity adjustment with +/- buttons
- Swipe-to-delete support (mobile gesture)
- Real-time price calculations
- Line item discounts (percentage or fixed amount)
- Cart-wide discounts
- Automatic tax calculation
- Customer selection for loyalty tracking
- Cart summary with subtotal, discount, tax, and total

#### 3. **Customer Management**
- Search and select customers
- Display customer loyalty points
- Store credit integration
- Purchase history tracking
- Quick customer lookup by name, phone, or email

#### 4. **Checkout Process**
- Multiple payment methods:
  - Cash (with change calculation)
  - Credit/Debit Card
  - Mobile Payment (Apple Pay, Google Pay, etc.)
  - Bank Transfer
  - Store Credit
- Split payment support (multiple payment methods per transaction)
- Quick cash denomination buttons
- Payment amount validation
- Transaction summary before completion

#### 5. **Receipt Management**
- Digital receipt display
- Receipt number generation
- Itemized transaction details
- Payment method breakdown
- Email receipt delivery
- Share receipt functionality
- Receipt printing (placeholder for ESC/POS integration)

#### 6. **Hold & Retrieve Sales**
- Hold current sale for later
- Named hold sales for easy identification
- Retrieve held sales
- Delete held sales
- Expiration tracking

#### 7. **Additional Features**
- Barcode scanning (placeholder for camera integration)
- Fast checkout mode
- Permission-based access control (RBAC)
- Offline mode support (via Zustand state)
- Real-time inventory tracking
- Tax rate configuration

### 🚧 Pending Features

1. **Returns & Refunds**
   - Full return processing
   - Partial returns
   - Exchange handling
   - Return reason tracking
   - Restocking options

2. **Bluetooth Printer Integration**
   - ESC/POS protocol support
   - Thermal printer compatibility
   - Receipt formatting for 58mm/80mm paper

3. **Camera Barcode Scanning**
   - Integration with expo-camera or react-native-vision-camera
   - Real-time barcode detection
   - Product lookup by barcode

4. **Offline Sync**
   - Queue transactions when offline
   - Automatic sync when connection restored
   - Conflict resolution

5. **Advanced Reporting**
   - Daily sales reports
   - Product performance analytics
   - Cashier performance tracking

## Architecture

### State Management

The POS system uses **Zustand** for state management with the following structure:

```typescript
// POS Store State
{
  cartItems: POSItem[]           // Current cart items
  selectedCustomer: Customer     // Selected customer
  cartDiscount: Discount         // Cart-wide discount
  notes: string                  // Order notes
  subtotal: number              // Calculated subtotal
  discountTotal: number         // Total discounts
  taxTotal: number              // Total tax
  total: number                 // Final total
  itemCount: number             // Total item count
  heldSales: HeldSale[]         // Held sales
  isProcessing: boolean         // Loading state
  error: string                 // Error messages
  searchQuery: string           // Product search
  selectedCategory: string      // Category filter
  defaultTaxRate: number        // Tax rate (default 10%)
}
```

### Data Flow

1. **Product Selection** → Add to cart → Update cart state → Recalculate totals
2. **Checkout** → Select payment method → Process payment → Create transaction
3. **Transaction Complete** → Generate receipt → Clear cart → Navigate to receipt screen

### API Services

#### Product Service (`src/api/services/productService.ts`)
- `getProducts()` - Fetch products with filters
- `getProductByBarcode()` - Lookup by barcode
- `getProductBySKU()` - Lookup by SKU
- `getCategories()` - Fetch categories
- `getBundles()` - Fetch product bundles

#### Customer Service (`src/api/services/customerService.ts`)
- `getCustomers()` - Fetch customers
- `searchCustomers()` - Search by name/phone/email
- `updateLoyaltyPoints()` - Update customer loyalty points

#### POS Service (`src/api/services/posService.ts`)
- `createTransaction()` - Submit completed transaction
- `getTransaction()` - Fetch transaction details
- `getReceipt()` - Generate receipt data
- `emailReceipt()` - Send receipt via email
- `createReturn()` - Process return/refund
- `voidTransaction()` - Void a transaction

### React Query Hooks

All data fetching uses React Query for caching and optimization:

- `useProducts()` - Products with pagination/filters
- `useCategories()` - Product categories
- `useSearchCustomers()` - Customer search
- `useCreateTransaction()` - Submit transaction
- `useEmailReceipt()` - Email receipt

## Screen Navigation

```
POSNavigator (Stack)
├── POSMain               - Main POS screen (product catalog + cart)
├── POSFastCheckout      - Quick checkout for common items
├── POSCheckout          - Payment processing
├── POSReceipt           - Receipt display
├── POSHeldSales         - Held sales management
├── POSBarcodeScan       - Barcode scanner (modal)
└── POSCustomerSelect    - Customer selection (modal)
```

## Screens

### 1. POSMainScreen (`/pos`)
**Purpose:** Main POS interface with product catalog and shopping cart

**Features:**
- Left side: Product grid with search and category filters
- Right side: Shopping cart with item management
- Customer selection
- Quick actions: Hold sale, Barcode scan, View held sales
- Real-time cart calculations

**Permissions Required:** `POS_ACCESS`

### 2. POSCheckoutScreen (`/pos/checkout`)
**Purpose:** Payment processing and transaction completion

**Features:**
- Order summary with customer info
- Payment method selection (Cash, Card, Mobile, Bank Transfer, Store Credit)
- Cash payment with change calculation
- Split payment support
- Transaction validation

**Permissions Required:** `POS_ACCESS`

### 3. POSReceiptScreen (`/pos/receipt/:transactionId`)
**Purpose:** Display transaction receipt

**Features:**
- Formatted receipt with business info
- Itemized transaction details
- Payment breakdown
- Email receipt
- Print receipt (placeholder)
- Share receipt
- New sale button

### 4. POSHeldSalesScreen (`/pos/held-sales`)
**Purpose:** Manage held sales

**Features:**
- List of all held sales
- Retrieve held sale
- Delete held sale
- View held sale details

### 5. POSBarcodeScanScreen (`/pos/barcode-scan`)
**Purpose:** Scan product barcodes

**Features:**
- Camera view for barcode scanning (requires camera library)
- Manual barcode entry
- Auto-add to cart on successful scan

### 6. POSCustomerSelectScreen (`/pos/customer-select`)
**Purpose:** Search and select customer

**Features:**
- Search customers by name, phone, or email
- Display customer info and loyalty points
- Select or clear customer
- Current customer indicator

### 7. POSFastCheckoutScreen (`/pos/fast-checkout`)
**Purpose:** Quick one-tap checkout

**Features:**
- Coming soon placeholder
- Will support quick sale buttons for common products

## Usage Examples

### Adding a Product to Cart

```typescript
const {addItem} = usePOSStore();
const product = {...}; // Product object

// Add 1 item
addItem(product, 1);

// Add with variant
addItem(product, 2, variant);
```

### Applying Discounts

```typescript
const {applyItemDiscount, applyCartDiscount} = usePOSStore();

// Line item discount (10% off)
applyItemDiscount(productId, {
  type: 'percentage',
  value: 10,
  reason: 'Promotional discount'
});

// Cart-wide discount ($5 off)
applyCartDiscount({
  type: 'fixed',
  value: 5,
  reason: 'Loyalty reward'
});
```

### Processing a Transaction

```typescript
const {createTransaction} = usePOSStore();
const createMutation = useCreateTransaction();

// Create transaction object
const transaction = createTransaction();

// Add payment
transaction.payments = [{
  method: 'cash',
  amount: transaction.total,
  status: 'completed'
}];

// Submit
const result = await createMutation.mutateAsync(transaction);
```

## Permissions

The POS system uses Role-Based Access Control (RBAC):

- `POS_ACCESS` - Access POS system
- `POS_APPLY_DISCOUNT` - Apply discounts
- `POS_VOID_TRANSACTION` - Void transactions
- `POS_REFUND` - Process refunds
- `POS_VIEW_REPORTS` - View POS reports

## Mobile-Specific Features

### Gestures
- **Swipe to delete** - Swipe cart items to remove
- **Tap to adjust** - Tap +/- to adjust quantity
- **Pull to refresh** - Refresh product catalog

### Responsive Design
- Adapts to phone and tablet layouts
- 2-column product grid on phones
- 3-column product grid on tablets
- Side-by-side catalog and cart on tablets

### Offline Support
- Cart state persisted in Zustand
- Held sales saved locally
- Can continue working offline
- Sync when connection restored (coming soon)

## Configuration

### Tax Rate

```typescript
const {setDefaultTaxRate} = usePOSStore();
setDefaultTaxRate(0.1); // 10%
```

### Business Info (for receipts)

Edit in `src/types/api.types.ts`:

```typescript
interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  logo?: string;
}
```

## Future Enhancements

1. **Enhanced Analytics**
   - Real-time sales dashboard
   - Product performance metrics
   - Customer purchase patterns

2. **Advanced Inventory**
   - Low stock alerts
   - Auto-reorder suggestions
   - Stock transfer between locations

3. **Customer Loyalty**
   - Points redemption
   - Tiered membership levels
   - Special promotions

4. **Multi-location Support**
   - Branch-specific inventory
   - Cross-location transfers
   - Consolidated reporting

5. **Integration**
   - Accounting software (QuickBooks, Xero)
   - Payment gateways (Stripe, Square)
   - E-commerce platforms

## Troubleshooting

### Common Issues

**Q: Products not loading**
- Check API connection
- Verify product service endpoint
- Check user permissions

**Q: Cart calculations incorrect**
- Verify tax rate configuration
- Check discount application logic
- Ensure product prices are correct

**Q: Payment processing fails**
- Validate payment amount
- Check transaction object structure
- Verify API endpoint

**Q: Receipt not generating**
- Check transaction ID
- Verify transaction was saved
- Check receipt service endpoint

## Dependencies

### Required
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `axios` - HTTP client
- `@react-navigation/*` - Navigation

### Optional (for full features)
- `expo-camera` or `react-native-vision-camera` - Barcode scanning
- `react-native-bluetooth-escpos-printer` - Receipt printing
- `@react-native-async-storage/async-storage` - Offline storage

## Contributing

When adding new POS features:

1. Update types in `src/types/api.types.ts`
2. Add API methods to appropriate service
3. Create React Query hooks
4. Update Zustand store if needed
5. Implement UI screens
6. Add to navigation
7. Update this documentation

## Support

For issues or questions:
- Check existing documentation
- Review code comments
- Check TypeScript types
- Test with sample data first

## License

Part of the Yoga POS Mobile application.
