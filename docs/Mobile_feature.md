# Yoga POS - Mobile App Feature Documentation

> Comprehensive feature documentation for developing a mobile application based on the Yoga POS Frontend system

## Table of Contents
- [Overview](#overview)
- [Color Theme & Design System](#color-theme--design-system)
- [Core Features](#core-features)
- [API Integration](#api-integration)
- [Settings & Configuration](#settings--configuration)
- [Technology Stack](#technology-stack)

---

## Overview

**Project**: Yoga POS - Point of Sale & Business Management System
**Version**: 0.0.0
**Type**: Multi-location Yoga Studio Management Platform
**Target**: Enterprise-grade POS system with comprehensive business features

### Key Capabilities
- 🏪 Multi-branch management
- 💳 Complete Point of Sale system
- 📦 Inventory & product management
- 👥 Customer relationship management
- 💰 Financial management & reporting
- 📊 Advanced analytics & reporting
- 🖨️ Hardware integration (printers, scanners, cash drawer)
- 🌍 Multi-language & multi-currency support

---

## Color Theme & Design System

### Primary Color Palette (Sky Blue)

```css
/* Primary Colors - Main Brand Identity */
primary-50:  #f0f9ff  /* Lightest - Backgrounds, hover states */
primary-100: #e0f2fe  /* Very light - Secondary backgrounds */
primary-200: #bae6fd  /* Light - Borders, dividers */
primary-300: #7dd3fc  /* Medium light - Disabled states */
primary-400: #38bdf8  /* Medium - Secondary CTAs */
primary-500: #0ea5e9  /* ★ MAIN BRAND COLOR - Primary CTAs, active states */
primary-600: #0284c7  /* Medium dark - Hover states */
primary-700: #0369a1  /* Dark - Active/pressed states */
primary-800: #075985  /* Very dark - Text on light backgrounds */
primary-900: #0c4a6e  /* Darkest - Headers, emphasis */
primary-950: #082f49  /* Extra dark - Deep shadows, overlays */
```

### Secondary Color Palette (Purple)

```css
/* Secondary Colors - Accents & Highlights */
secondary-50:  #faf5ff  /* Lightest - Backgrounds */
secondary-100: #f3e8ff  /* Very light - Secondary backgrounds */
secondary-200: #e9d5ff  /* Light - Borders, dividers */
secondary-300: #d8b4fe  /* Medium light - Disabled states */
secondary-400: #c084fc  /* Medium - Secondary CTAs */
secondary-500: #a855f7  /* ★ ACCENT COLOR - Highlights, badges */
secondary-600: #9333ea  /* Medium dark - Hover states */
secondary-700: #7e22ce  /* Dark - Active/pressed states */
secondary-800: #6b21a8  /* Very dark - Text on light backgrounds */
secondary-900: #581c87  /* Darkest - Headers, emphasis */
secondary-950: #3b0764  /* Extra dark - Deep shadows */
```

### Semantic Colors

```css
/* Status & Feedback Colors */
Success:  #10b981  /* Green - Success states, confirmations */
Warning:  #f59e0b  /* Amber - Warnings, cautions */
Error:    #ef4444  /* Red - Errors, destructive actions */
Info:     #3b82f6  /* Blue - Informational messages */
```

### UI Element Colors

```css
/* Backgrounds */
Background Primary:   #ffffff  /* White - Main backgrounds */
Background Secondary: #f9fafb  /* Very light gray - Section backgrounds */
Background Tertiary:  #f3f4f6  /* Light gray - Card backgrounds */

/* Text Colors */
Text Primary:   #1f2937  /* Dark gray - Main content */
Text Secondary: #6b7280  /* Medium gray - Secondary content */
Text Tertiary:  #9ca3af  /* Light gray - Disabled, placeholder */

/* Borders */
Border Light:   #e5e7eb  /* Light gray - Default borders */
Border Medium:  #d1d5db  /* Medium gray - Dividers */
Border Dark:    #9ca3af  /* Dark gray - Emphasis borders */
```

### Custom Branding Colors (Configurable in Settings)

```javascript
// Default configurable colors in settings
branding: {
  primaryColor: '#3B82F6',   // Default Blue
  secondaryColor: '#10B981', // Default Green
  accentColor: '#F59E0B',    // Default Amber
}
```

### Shadows & Effects

```css
/* Card Shadows */
card:       0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
card-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
```

### Scrollbar Styling

```css
/* Custom Scrollbar */
Track:       #f1f1f1  /* Light gray background */
Thumb:       #888     /* Medium gray thumb */
Thumb Hover: #555     /* Dark gray on hover */
Width:       6px      /* Thin scrollbar */
Border Radius: 3px
```

### Typography

```css
/* Font Configuration */
Font Family: 'Inter', system-ui, sans-serif
Font Weight: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
Line Height: 1.5
Text Rendering: optimizeLegibility, antialiased
```

### Toast Notification Colors

```javascript
// Toast appearance
toastOptions: {
  style: {
    background: '#ffffff',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
  },
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
  },
}
```

### Responsive Breakpoints

```css
/* Tailwind CSS Breakpoints */
sm:  640px   /* Small devices (tablets) */
md:  768px   /* Medium devices (landscape tablets) */
lg:  1024px  /* Large devices (laptops) */
xl:  1280px  /* Extra large devices (desktops) */
2xl: 1536px  /* 2X large devices (large desktops) */
```

---

## Core Features

### 1. Authentication & Authorization

**Routes**: `/login`, `/unauthorized`

**Features**:
- Email/Password authentication
- PIN-based quick login (4-6 digits)
- Remember me functionality
- JWT token management (access + refresh tokens)
- Automatic token refresh
- Role-Based Access Control (RBAC)
- Session management

**Predefined User Roles**:
1. **Admin** - Full system access
2. **Manager** - Branch management, reporting
3. **Staff** - Day-to-day operations
4. **Instructor** - Class and schedule management
5. **Cashier** - POS operations only
6. **Accountant** - Financial access only

**API Endpoints**:
```
POST /auth/login              - Email/password login
POST /auth/login/pin          - PIN-based login
POST /auth/logout             - Logout user
POST /auth/refresh            - Refresh access token
GET  /auth/me                 - Get current user
POST /auth/pin/set            - Set user PIN
POST /auth/pin/disable        - Disable PIN auth
POST /auth/pin/reset-attempts - Reset PIN attempts (admin)
```

**Mobile Implementation Notes**:
- Support biometric authentication (Face ID, Touch ID)
- Implement secure token storage (Keychain/Keystore)
- Auto-logout after inactivity
- Offline PIN verification (cached hash)

---

### 2. Dashboard

**Route**: `/dashboard` (Default landing page)

**Features**:
- Multi-branch overview
- Real-time statistics
- Revenue tracking
- Active members count
- Today's class schedule
- Recent transactions
- Quick actions panel

**Key Metrics Displayed**:
- Total revenue (daily/weekly/monthly)
- Active members
- Classes today
- Branch count
- Pending orders
- Low stock alerts
- Recent activity feed

**Mobile Implementation Notes**:
- Pull-to-refresh functionality
- Card-based layout for metrics
- Swipeable chart views
- Push notifications for alerts

---

### 3. Point of Sale (POS)

**Routes**: `/pos`, `/pos/fast-checkout`

**Features**:

#### Product Selection
- Product catalog browser
- Barcode scanning support
- Quick search functionality
- Category filtering
- Product variants selection
- Bundle/package deals

#### Shopping Cart
- Add/remove items
- Quantity adjustment
- Line item discounts
- Cart-wide discounts (% or fixed)
- Tax calculation
- Customer selection
- Hold/retrieve sales

#### Checkout
- Multiple payment methods:
  - Cash
  - Credit/Debit Card
  - Bank Transfer
  - Mobile Payment
  - Store Credit
- Split payment support
- Change calculation
- Receipt generation
- Email receipt delivery
- Print receipt (ESC/POS protocol)

#### Returns & Refunds
- Full/partial returns
- Refund processing
- Exchange handling
- Return reason tracking

**Mobile Implementation Notes**:
- Camera barcode scanning
- Swipe to delete cart items
- Tap to adjust quantities
- Support mobile payment wallets (Apple Pay, Google Pay)
- Offline mode with sync
- Bluetooth printer support

---

### 4. Product Management

**Route**: `/products`

**Features**:
- Product catalog management
- Product creation/editing
- Category management
- Variant management (size, color, etc.)
- Bundle creation
- Pricing tiers
- Barcode generation
- Product images
- Stock tracking per product
- Product status (active/inactive)

**Product Attributes**:
- Name, SKU, barcode
- Description
- Category
- Price (with tax options)
- Cost price
- Variants
- Images (multiple)
- Stock quantity
- Low stock threshold
- Unit of measure

**Mobile Implementation Notes**:
- Image upload from camera
- Barcode scanning for quick edit
- Bulk update support
- Grid/list view toggle
- Quick filters

---

### 5. Inventory Management

**Route**: `/inventory`

**Features**:
- Multi-location stock tracking
- Stock level monitoring
- Low stock alerts
- Inter-branch transfers
- Cycle counting
- Physical inventory
- Serial number tracking
- Inventory transactions history
- Stock adjustment
- Waste/loss tracking

**Inventory Operations**:
- Stock in
- Stock out
- Transfer between branches
- Adjustment
- Return to supplier
- Damage/loss reporting

**Mobile Implementation Notes**:
- Barcode scanning for stock taking
- Camera for serial number capture
- Offline inventory counts with sync
- Push alerts for low stock
- Signature capture for transfers

---

### 6. Customer Management (CRM)

**Route**: `/customers`

**Features**:
- Customer profiles
- Contact information
- Purchase history
- Loyalty program integration
- Store credit tracking
- Customer segmentation
- Customer lifetime value (CLV)
- Communication history
- Birthday/anniversary tracking
- Custom fields

**Customer Data**:
- Name, email, phone
- Address
- Membership status
- Loyalty points
- Store credit balance
- Total purchases
- Last visit date
- Tags/segments
- Notes

**Mobile Implementation Notes**:
- Quick customer lookup
- SMS/Email integration
- Loyalty card scanning (QR code)
- Birthday reminders
- Push notifications for offers

---

### 7. Purchase & Procurement

**Routes**: `/suppliers`, `/purchase-orders`

**Features**:

#### Supplier Management
- Supplier profiles
- Contact information
- Product catalog
- Payment terms
- Performance tracking

#### Purchase Orders
- PO creation and tracking
- PO approval workflow
- Receiving management
- Partial receiving
- PO status tracking (Draft, Sent, Received, Cancelled)
- PO history

**Mobile Implementation Notes**:
- Camera for PO document capture
- Barcode scanning for receiving
- Signature capture for delivery
- Offline PO creation

---

### 8. Financial Management

**Routes**: `/financial`, `/invoices`, `/payments`, `/expenses`, `/financial-reports`

**Features**:

#### Invoicing
- Invoice generation
- Customizable templates
- Invoice status tracking
- Payment tracking
- Recurring invoices
- Invoice email delivery

#### Payments
- Payment recording
- Multi-payment method support
- Payment reconciliation
- Payment history
- Refund processing

#### Expense Management
- Expense recording
- Expense categories
- Approval workflow
- Tax-deductible marking
- Recurring expenses
- Expense attachments (receipts)

#### Financial Reports
- Profit & Loss statement
- Cash flow report
- Balance sheet
- Income statement
- Tax reports
- End-of-day reconciliation

#### Cash Flow Management
- Cash flow tracking
- Cash flow forecasting
- Bank reconciliation
- Multi-account support

**Payment Methods Supported**:
- Cash
- Credit/Debit Card
- Bank Transfer
- Mobile Payment
- Store Credit

**Mobile Implementation Notes**:
- Camera for receipt capture
- Signature capture for payments
- Quick expense entry
- Dashboard charts for financials
- Export reports as PDF

---

### 9. Reporting & Analytics

**Route**: `/reports`

**Features**:

#### Sales Reports
- Sales summary (daily/weekly/monthly/yearly)
- Sales by product
- Sales by category
- Sales by staff member
- Sales by payment method
- Sales by branch
- Sales trends

#### Customer Reports
- Customer analytics
- Customer segmentation
- Customer lifetime value
- Customer purchase patterns
- New vs. returning customers

#### Product Reports
- Product performance
- Best sellers
- Slow-moving items
- Product profitability
- Inventory valuation

#### Financial Reports
- Revenue reports
- Expense reports
- Profit margin analysis
- Tax reports
- Cash flow reports

#### Export Options
- CSV export
- PDF export
- Excel export
- Email delivery

**Mobile Implementation Notes**:
- Interactive charts (swipe/pinch to zoom)
- Date range picker
- Quick filters
- Share reports via email/messaging
- Offline report caching

---

### 10. Branch Management

**Route**: `/branches`

**Features**:
- Multi-location support
- Branch profiles
- Branch-specific settings
- Staff assignment
- Branch performance tracking
- Inter-branch operations
- Branch inventory management

**Branch Data**:
- Name, code
- Address
- Contact information
- Operating hours
- Manager assignment
- Staff count
- Performance metrics

**Mobile Implementation Notes**:
- Branch selector dropdown
- Branch-specific dashboard
- Branch comparison views
- GPS navigation to branch

---

### 11. User Management

**Route**: `/users`

**Features**:
- User account creation
- Staff profiles
- Role assignment
- Permission management
- User activity tracking
- PIN setup
- User status (active/inactive)
- User statistics

**User Attributes**:
- Name, email, phone
- Username
- Role
- Branch assignment
- PIN (optional)
- Profile photo
- Employment info
- Custom permissions

**Mobile Implementation Notes**:
- Profile photo capture from camera
- Fingerprint/Face ID for sensitive operations
- User activity log
- Quick role switch (for managers)

---

### 12. Role & Permission Management

**Route**: `/roles`

**Features**:
- Predefined roles
- Custom role creation
- Permission assignment
- Role statistics
- Role-based access control

**Permission Categories**:
- Dashboard access
- POS operations
- Product management
- Inventory management
- Customer management
- Financial access
- Report viewing
- Settings management
- User management

**Mobile Implementation Notes**:
- Simplified permission UI
- Role templates
- Quick permission toggle

---

### 13. Settings

**Route**: `/settings`

**Settings Categories**:

#### General Settings
- Currency selection (8+ currencies)
- Date/time format
- Default tax rate
- Default payment method
- Receipt auto-print
- Sound effects toggle

#### Localization
- Language selection (English, Spanish, French)
- Locale settings
- Number format
- Currency display

#### Branding
- Primary color
- Secondary color
- Accent color
- Logo upload
- Favicon upload
- Custom CSS

#### Hardware
- Receipt printer configuration
- Barcode scanner setup
- Cash drawer settings
- Customer display configuration

#### Notifications
- Email notifications
- SMS notifications
- WhatsApp notifications
- Notification preferences

#### Backup
- Auto-backup scheduling
- Cloud storage integration
- Backup encryption
- Restore functionality

**Mobile Implementation Notes**:
- Color picker for branding
- Camera for logo upload
- Test hardware connections
- Backup to device storage

---

### 14. Hardware Integration

**Supported Hardware**:

#### Receipt Printer
- Connection types: USB, Bluetooth, Network, Serial
- Printer types: Thermal, Inkjet, Laser
- ESC/POS protocol support
- Auto-cut support
- Cash drawer trigger

**Configuration**:
```javascript
receiptPrinter: {
  enabled: true,
  type: 'thermal',
  connectionType: 'bluetooth',
  port: 'COM1',
  ipAddress: '192.168.1.100',
  baudRate: 9600,
  paperWidth: 80, // mm
  characterSet: 'CP437',
  autoCut: true,
  openDrawer: false,
}
```

#### Barcode Scanner
- Connection types: USB, Bluetooth, Serial
- Auto-submit support
- Prefix/suffix configuration

**Configuration**:
```javascript
barcodeScanner: {
  enabled: true,
  type: 'bluetooth',
  port: 'COM2',
  prefix: '',
  suffix: '',
  autoSubmit: true,
}
```

#### Cash Drawer
- Connection via printer, serial, or USB
- Configurable pulse width
- Open on sale option

**Configuration**:
```javascript
cashDrawer: {
  enabled: true,
  connectionType: 'printer',
  port: '',
  openOnSale: true,
  pulseWidth: 100, // milliseconds
}
```

#### Customer Display Pole
- Display types: Pole, Tablet, Monitor
- Connection: Serial, USB, Network
- Configurable lines and columns

**Configuration**:
```javascript
customerDisplay: {
  enabled: true,
  type: 'pole',
  connectionType: 'serial',
  port: 'COM3',
  ipAddress: '',
  baudRate: 9600,
  lines: 2,
  columns: 20,
}
```

**Mobile Implementation Notes**:
- Bluetooth device discovery
- NFC for quick pairing
- Test print functionality
- Device status indicators

---

### 15. Backup & Recovery

**Features**:
- Automated backup scheduling
- Manual backup creation
- Cloud storage integration
- Encryption (AES-256-GCM)
- One-click restore
- Backup history
- Backup verification

**Backup Frequency Options**:
- Hourly
- Daily
- Weekly
- Monthly
- Custom schedule

**Cloud Storage Providers**:
- Google Drive
- Dropbox
- AWS S3
- Local storage

**Backup Configuration**:
```javascript
autoBackup: {
  enabled: true,
  frequency: 'daily', // hourly, daily, weekly, monthly
  time: '02:00', // For daily/weekly/monthly
  cloudProvider: 'google-drive', // 'google-drive', 'dropbox', 's3'
  encryption: true,
  retainCount: 10, // Max backups to keep
  includeLocal: true,
}
```

**Mobile Implementation Notes**:
- Backup to device storage
- Cloud sync
- Background backup
- Restore confirmation dialog

---

### 16. Audit Logging

**Features**:
- Comprehensive event logging (40+ event types)
- User action tracking
- Data change audit trails
- Login/logout tracking
- Session management
- Concurrent user tracking

**Logged Events**:
- User login/logout
- Data create/update/delete
- Permission changes
- Settings changes
- Financial transactions
- Inventory movements
- Report generation

**Audit Log Data**:
- Timestamp
- User ID
- Action type
- Resource type
- Resource ID
- IP address
- Device info
- Changes (before/after)

**Mobile Implementation Notes**:
- Searchable audit log
- Filter by user/date/action
- Export audit logs
- Real-time sync

---

### 17. Multi-Language Support

**Supported Languages**:
1. English (en)
2. Spanish (es)
3. French (fr)

**Translation System**:
- i18next library
- 361+ translation keys
- Browser language detection
- Fallback to English
- LocalStorage persistence

**Language Selection**:
```javascript
languages: [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
]
```

**Mobile Implementation Notes**:
- Device language detection
- In-app language switcher
- RTL support (future)
- Translation updates

---

### 18. Multi-Currency Support

**Supported Currencies**:
```javascript
currencies: [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.50 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.12 },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', rate: 17.05 },
]
```

**Features**:
- Base currency configuration
- Exchange rate management
- Multi-currency transactions
- Currency conversion
- Price display in multiple currencies

**Mobile Implementation Notes**:
- Currency converter
- Auto-update exchange rates
- Offline currency cache
- Currency symbol display

---

### 19. Customer Display (for POS)

**Route**: `/customer-display` (Public route)

**Features**:
- Real-time cart display for customers
- Price display
- Total calculation
- Payment status
- Promotional messages
- Thank you screen

**Mobile Implementation Notes**:
- Tablet/phone as customer display
- QR code for order details
- Digital receipt preview

---

### 20. Demo Data

**Route**: `/demo-data`

**Features**:
- Demo data overview
- Sample data generation
- Data reset functionality
- Testing environment setup

**Mobile Implementation Notes**:
- Quick demo mode toggle
- Sample data sync
- Data cleanup

---

## API Integration

### Base Configuration

```javascript
// Environment Variables
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_ENV=development
VITE_API_TIMEOUT=30000 // Optional, in milliseconds
```

### HTTP Client Configuration

```javascript
// Axios Instance
baseURL: process.env.VITE_API_BASE_URL,
timeout: 30000,
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}` // Auto-injected
}
```

### Authentication Flow

```javascript
// Request Interceptor
- Inject Authorization header with Bearer token
- Token from localStorage (key: 'accessToken')

// Response Interceptor
- Auto-refresh token on 401 Unauthorized
- Retry original request with new token
- Redirect to login on refresh failure
- Exclude /auth/login and /auth/refresh from retry
```

### Token Management

```javascript
// Token Storage (localStorage)
{
  accessToken: 'jwt-access-token',
  refreshToken: 'jwt-refresh-token',
  user: { /* user object */ },
  expiresIn: 3600 // seconds
}

// Token Refresh
- Automatic on 401 response
- Manual refresh available
- Clear tokens on logout/refresh failure
```

### API Endpoints Structure

```
Authentication:
POST   /auth/login
POST   /auth/login/pin
POST   /auth/logout
POST   /auth/refresh
GET    /auth/me
POST   /auth/pin/set
POST   /auth/pin/disable
POST   /auth/pin/reset-attempts

Branches:
GET    /branches
GET    /branches/:id
POST   /branches
PUT    /branches/:id
DELETE /branches/:id

Users:
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id

Roles:
GET    /roles
GET    /roles/:id
POST   /roles
PUT    /roles/:id
DELETE /roles/:id

Products:
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id

Inventory:
GET    /inventory
GET    /inventory/:id
POST   /inventory/transaction
PUT    /inventory/:id

Customers:
GET    /customers
GET    /customers/:id
POST   /customers
PUT    /customers/:id
DELETE /customers/:id

POS:
POST   /pos/sale
POST   /pos/return
POST   /pos/hold
GET    /pos/held-sales
POST   /pos/retrieve/:id

Suppliers:
GET    /suppliers
GET    /suppliers/:id
POST   /suppliers
PUT    /suppliers/:id

Purchase Orders:
GET    /purchase-orders
GET    /purchase-orders/:id
POST   /purchase-orders
PUT    /purchase-orders/:id

Invoices:
GET    /invoices
GET    /invoices/:id
POST   /invoices
PUT    /invoices/:id

Payments:
GET    /payments
GET    /payments/:id
POST   /payments
PUT    /payments/:id

Expenses:
GET    /expenses
GET    /expenses/:id
POST   /expenses
PUT    /expenses/:id

Reports:
GET    /reports/sales
GET    /reports/customers
GET    /reports/products
GET    /reports/inventory
GET    /reports/financial
POST   /reports/export

Settings:
GET    /settings
PUT    /settings
```

### Error Handling

```javascript
// Error Response Format
{
  success: false,
  message: 'Error message',
  code: 'ERROR_CODE',
  details: { /* additional error details */ }
}

// Common Error Codes
NETWORK_ERROR
INVALID_CREDENTIALS
USER_NOT_FOUND
PIN_LOCKED
INVALID_TOKEN
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
SERVER_ERROR
```

### Mobile API Implementation Notes

- Implement retry logic for failed requests
- Cache API responses for offline access
- Use optimistic updates for better UX
- Implement request queuing for offline operations
- Support background sync
- Compress request/response data
- Implement request debouncing
- Use pagination for large data sets
- Implement incremental data loading

---

## Settings & Configuration

### General Settings

```javascript
{
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  language: 'en', // en, es, fr
  dateFormat: 'MM/dd/yyyy',
  timeFormat: '12h', // 12h or 24h
  defaultTaxRate: 0, // 0-100
  defaultPaymentMethod: 'cash',
  printReceipt: true,
  soundEnabled: true,
  receiptFooter: '',
  receiptHeader: '',
}
```

### Business Information

```javascript
{
  name: 'Business Name',
  address: 'Business Address',
  phone: 'Contact Phone',
  email: 'Contact Email',
  website: 'Website URL',
  taxId: 'Tax ID Number',
  logo: 'logo-image-url',
}
```

### Date & Time Formats

```javascript
// Supported Date Formats
dateFormats: [
  'MM/dd/yyyy', // US
  'dd/MM/yyyy', // UK/Europe
  'yyyy-MM-dd', // ISO
  'dd-MMM-yyyy', // Text month
]

// Time Formats
timeFormats: ['12h', '24h']
```

### Tax Configuration

```javascript
{
  defaultTaxRate: 0, // Percentage
  taxInclusive: false, // Tax included in price
  taxByProduct: true, // Allow per-product tax
  multipleTaxes: false, // Multiple tax rates
}
```

### Receipt Configuration

```javascript
{
  printReceipt: true,
  receiptHeader: 'Custom header text',
  receiptFooter: 'Thank you for your business!',
  receiptLogo: true,
  receiptBusinessInfo: true,
  receiptTaxInfo: true,
  receiptBarcode: false,
  receiptQRCode: false,
}
```

### Notification Settings

```javascript
{
  email: {
    enabled: true,
    fromAddress: 'noreply@yourdomain.com',
    fromName: 'Yoga POS',
  },
  sms: {
    enabled: false,
    provider: '', // twilio, nexmo, etc.
    apiKey: '',
  },
  whatsapp: {
    enabled: false,
    apiKey: '',
  },
  push: {
    enabled: true,
  }
}
```

### Security Settings

```javascript
{
  sessionTimeout: 3600, // seconds
  maxLoginAttempts: 5,
  pinLoginEnabled: true,
  pinLength: 4, // 4-6 digits
  pinMaxAttempts: 3,
  twoFactorAuth: false,
  ipWhitelist: [],
}
```

---

## Technology Stack

### Frontend Framework
- **React**: 18.3.1 - UI library
- **React Router**: 7.9.5 - Navigation and routing
- **React DOM**: 18.3.1 - DOM rendering

### Build Tools
- **Vite**: 6.0.5 - Build tool and dev server
- **Node.js**: v18+ - Runtime environment
- **ESLint**: Code linting

### Styling
- **Tailwind CSS**: 4.1.16 - Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

### State Management
- **Zustand**: 5.0.8 - State management
  - Zustand Persist: 0.4.0 - State persistence
  - Devtools middleware - Redux DevTools integration
- **Immer**: 10.2.0 - Immutable state updates

### Data Fetching
- **Axios**: 1.13.2 - HTTP client
- **React Query**: 5.90.6 - Async state management and caching

### Internationalization
- **i18next**: 25.6.0 - Internationalization framework
- **react-i18next**: 16.2.4 - React bindings
- **i18next-browser-languagedetector**: 8.2.0 - Language detection
- **i18next-http-backend**: 3.0.2 - Translation loading

### UI Components & Icons
- **Lucide React**: 0.552.0 - Icon library (555+ icons)
- **Heroicons React**: 2.2.0 - Icon library (90+ icons)
- **React Hot Toast**: 2.6.0 - Toast notifications

### Utilities
- **date-fns**: 4.1.0 - Date manipulation
- **clsx**: 2.1.1 - Conditional className utility

---

## Mobile Development Recommendations

### Platform Support
- **iOS**: 13.0+
- **Android**: 6.0+ (API level 23+)

### Recommended Mobile Framework
- **React Native** (for cross-platform)
- **Flutter** (alternative)
- **Native iOS/Android** (for best performance)

### Key Mobile Features to Implement

1. **Offline Support**
   - Local database (SQLite, Realm, or PouchDB)
   - Offline queue for sync
   - Conflict resolution
   - Background sync

2. **Push Notifications**
   - Order updates
   - Low stock alerts
   - Payment confirmations
   - Shift reminders

3. **Camera Integration**
   - Barcode scanning
   - QR code scanning
   - Receipt capture
   - Product photo upload

4. **Biometric Authentication**
   - Face ID (iOS)
   - Touch ID (iOS)
   - Fingerprint (Android)
   - PIN fallback

5. **Hardware Integration**
   - Bluetooth printer
   - Bluetooth scanner
   - NFC reader
   - Cash drawer

6. **Location Services**
   - Branch location
   - GPS navigation
   - Geofencing

7. **Local Storage**
   - Secure token storage
   - Offline data cache
   - User preferences
   - App state persistence

8. **Background Services**
   - Auto-backup
   - Data sync
   - Notification handling

### API Considerations for Mobile

- Implement GraphQL for efficient data fetching
- Use pagination and infinite scroll
- Implement request batching
- Compress API responses
- Use delta sync for updates
- Implement proper cache invalidation
- Support offline mode with sync queue

### Performance Optimization

- Lazy load screens and components
- Implement virtual lists for large data sets
- Optimize images (WebP, lazy loading)
- Minimize bundle size
- Use code splitting
- Implement proper memory management
- Cache static assets

### Security Best Practices

- Use HTTPS for all API calls
- Implement certificate pinning
- Secure token storage (Keychain/Keystore)
- Implement request signing
- Use encryption for sensitive data
- Implement proper session management
- Enable biometric authentication
- Implement jailbreak/root detection

---

## Additional Features to Consider

### Advanced POS Features
- Table management (for yoga studio cafe)
- Appointment booking
- Class scheduling
- Membership management
- Package deals
- Gift cards
- Loyalty rewards

### Advanced Reporting
- Custom report builder
- Scheduled reports
- Dashboard customization
- Real-time analytics
- Predictive analytics
- Trend analysis

### Integration Capabilities
- Payment gateway integration
- Accounting software integration
- Email marketing integration
- CRM integration
- Shipping integration
- SMS gateway integration

### Advanced Inventory
- Automated reordering
- Supplier integration
- Batch/lot tracking
- Expiration date tracking
- Consignment tracking

---

## Appendix

### Navigation Structure

```
/login                    - Login page
/unauthorized             - Access denied page
/customer-display         - Customer display (POS)

Protected Routes:
/dashboard                - Main dashboard
/branches                 - Branch management
/users                    - User management
/roles                    - Role management
/products                 - Product catalog
/inventory                - Inventory management
/suppliers                - Supplier management
/purchase-orders          - Purchase orders
/pos                      - Point of sale
/pos/fast-checkout        - Fast checkout POS
/customers                - Customer management
/reports                  - Reports & analytics
/financial                - Financial dashboard
/invoices                 - Invoice management
/payments                 - Payment tracking
/expenses                 - Expense management
/financial-reports        - Financial reports
/settings                 - Settings & configuration
/demo-data                - Demo data overview
/bookings                 - Bookings (placeholder)
```

### State Management Structure

```javascript
// Zustand Store Slices (23 total)
{
  // Core
  auth: { /* authentication state */ },
  ui: { /* UI state */ },
  settings: { /* app settings */ },

  // Features
  branches: { /* branch data */ },
  users: { /* user data */ },
  roles: { /* role data */ },
  permissions: { /* permission data */ },
  products: { /* product data */ },
  inventory: { /* inventory data */ },
  customers: { /* customer data */ },
  suppliers: { /* supplier data */ },
  purchaseOrders: { /* PO data */ },
  pos: { /* POS data */ },
  cart: { /* shopping cart */ },
  invoices: { /* invoice data */ },
  payments: { /* payment data */ },
  expenses: { /* expense data */ },
  transactions: { /* transaction data */ },
  financial: { /* financial data */ },
  reports: { /* report data */ },
  audit: { /* audit log */ },
  session: { /* session data */ },
  notification: { /* notification state */ },
  backup: { /* backup state */ },
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-07
**Generated for**: Yoga POS Mobile App Development

