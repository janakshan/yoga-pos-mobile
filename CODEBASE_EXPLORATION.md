# Yoga POS Mobile - Codebase Exploration Summary

## Project Overview
- **Type**: React Native (Expo) mobile application
- **Purpose**: Point of Sale & Business Management System for Mobile
- **Main State Management**: Zustand with Immer middleware
- **API Client**: Axios with interceptors for auth/token refresh
- **Current Branch**: claude/backup-recovery-system

---

## 1. PROJECT STRUCTURE (src/)

### Directory Organization
```
src/
├── api/                    # API client and service endpoints
│   ├── client.ts          # Axios configured instance with interceptors
│   └── services/          # Service modules for different domains
│       ├── authService.ts
│       ├── userService.ts
│       ├── productService.ts
│       ├── customerService.ts
│       ├── inventoryService.ts
│       ├── posService.ts
│       ├── procurementService.ts
│       ├── branchService.ts
│       ├── financialService.ts
│       ├── reportsService.ts
│       └── roleService.ts
│
├── components/            # React components organized by feature
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── settings/         # Settings-specific components
│   ├── hardware/         # Hardware management components
│   ├── auth/
│   ├── roles/
│   ├── users/
│   ├── branches/
│   └── reports/
│
├── config/               # Configuration files
│   └── env.ts           # Environment variables via react-native-config
│
├── constants/            # Application constants
│
├── context/              # React Context (Theme, Branch)
│   ├── ThemeContext.tsx
│   └── BranchContext.tsx
│
├── hooks/                # Custom React hooks
│   ├── useTheme.ts
│   ├── useRBAC.ts
│   ├── useResponsive.ts
│   ├── useHardware.ts
│   ├── useInactivityLogout.ts
│   └── queries/         # React Query hooks
│
├── navigation/           # Navigation configuration
│
├── screens/              # Screen components organized by feature
│   ├── auth/            # Authentication screens
│   ├── pos/             # Point of Sale screens
│   ├── inventory/       # Inventory management screens
│   ├── products/
│   ├── customers/
│   ├── financial/
│   ├── procurement/
│   ├── branches/
│   ├── roles/
│   ├── users/
│   ├── reports/
│   ├── dashboard/
│   └── settings/        # Settings screen
│
├── services/            # Business logic services
│   ├── TokenService.ts  # Secure token storage
│   └── hardware/        # Hardware integration services
│
├── store/               # Zustand stores
│   └── slices/
│       ├── authSlice.ts         # Authentication state
│       ├── posSlice.ts          # POS cart/transaction state
│       └── settingsSlice.ts     # Settings persistence
│
├── types/               # TypeScript interfaces
│   ├── api.types.ts     # API request/response types
│   └── settings.types.ts # Settings interfaces
│
└── utils/               # Utility functions
    ├── jwt.utils.ts
    ├── biometric.utils.ts
    ├── rbac.utils.ts
    ├── roleTemplates.utils.ts
    └── styleHelpers.ts
```

---

## 2. DATA STORAGE & DATABASE IMPLEMENTATION

### Storage Mechanisms Used

#### A. **React Native Keychain** (for sensitive data)
- **Library**: `react-native-keychain`
- **Service**: `TokenService.ts`
- **Stored Data**:
  - Access tokens
  - Refresh tokens
  - User data (encrypted in iOS Keychain / Android Keystore)
- **Storage Keys**:
  - `yoga_pos_access_token`
  - `yoga_pos_refresh_token`
  - `yoga_pos_user_data`

```typescript
// TokenService implementation
- saveTokens(accessToken, refreshToken)
- getAccessToken()
- getRefreshToken()
- saveUser(user)
- getUser()
- clearTokens()
- isAuthenticated()
```

#### B. **AsyncStorage** (for settings/non-sensitive data)
- **Library**: `@react-native-async-storage/async-storage`
- **Service**: `zustand/middleware/persist` with AsyncStorage backend
- **Stored Data**:
  - Application settings (all categories)
  - Last sync timestamp
- **Storage Key**: `yoga-pos-settings`

#### C. **React Native MMKV** (alternative high-performance storage)
- **Library**: `react-native-mmkv`
- **Status**: Available in dependencies but not actively used yet
- **Use Case**: Can be used for fast key-value operations

#### D. **React Native Encrypted Storage** (for encrypted sensitive data)
- **Library**: `react-native-encrypted-storage`
- **Status**: Available in dependencies but not actively used yet
- **Potential Use**: Encrypted backup storage

#### E. **File System** (for backup/export)
- **Library**: `react-native-fs`
- **Used For**: File-based backup and restore operations
- **Available Methods**: Read, write, directory operations

### Zustand Store Architecture

#### Auth Store (`authSlice.ts`)
```typescript
AuthState:
  - user: User | null
  - isAuthenticated: boolean
  - isLoading: boolean
  - error: string | null
  - session: Session | null
  - biometricEnabled: boolean
  - biometricAvailable: boolean
  - pinEnabled: boolean

AuthActions:
  - login(credentials)
  - loginWithPin(credentials)
  - loginWithBiometric()
  - logout()
  - loadUser()
  - updateSession()
  - enableBiometric() / disableBiometric()
  - setPin() / disablePin()
  - hasPermission(permission) / hasRole(role)
```

#### POS Store (`posSlice.ts`)
```typescript
POSState:
  - cartItems: POSItem[]
  - selectedCustomer: Customer | null
  - cartDiscount: Discount | null
  - notes: string
  - heldSales: HeldSale[]
  - subtotal, discountTotal, taxTotal, total: number
  - isProcessing, error, searchQuery: state
  - defaultTaxRate: number

POSActions:
  - addItem() / removeItem() / updateItemQuantity()
  - applyItemDiscount() / removeItemDiscount()
  - applyCartDiscount() / removeCartDiscount()
  - holdSale() / retrieveSale() / deleteHeldSale()
  - recalculateTotals()
  - createTransaction()
```

#### Settings Store (`settingsSlice.ts`)
- **Persistence**: Enabled via Zustand persist middleware with AsyncStorage
- **State**:
  ```typescript
  SettingsState:
    - settings: AppSettings (complete configuration)
    - isLoading: boolean
    - lastSyncedAt?: string
  ```
- **Actions**:
  - updateGeneralSettings()
  - updateLocalizationSettings()
  - updateBrandingSettings()
  - updateHardwareSettings()
  - updateNotificationSettings()
  - updateBackupSettings()
  - resetSettings() / resetCategory()
  - exportSettings() / importSettings()

### No Traditional Database
- **Status**: No backend database driver installed
- **API-Driven**: All persistent data syncs with backend API
- **Offline Support**: Limited (cart/transactions in memory with potential Zustand state persistence)

---

## 3. EXISTING SETTINGS/CONFIGURATION FILES

### Environment Configuration (`.env.example`)
```env
API_BASE_URL=https://api.yourdomain.com/api/v1
API_TIMEOUT=30000
NODE_ENV=development
APP_NAME=Yoga POS
APP_VERSION=1.0.0
ENABLE_BIOMETRIC_AUTH=true
ENABLE_OFFLINE_MODE=true
ENABLE_PUSH_NOTIFICATIONS=true
```

### Settings Types (`settings.types.ts`)
Complete `AppSettings` interface with sections:

1. **GeneralSettings**
   - currency: Currency ('USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'AUD' | 'CAD')
   - dateFormat, timeFormat
   - defaultTaxRate
   - defaultPaymentMethod
   - receiptAutoPrint, soundEffects

2. **LocalizationSettings**
   - language: Language ('en' | 'es' | 'fr')
   - locale: string
   - numberFormat, currencyDisplay

3. **BrandingSettings**
   - primaryColor, secondaryColor, accentColor (hex colors)
   - logoUri, faviconUri
   - customCSS

4. **HardwareSettings**
   - receiptPrinter config (Bluetooth/USB/Network/Serial)
   - barcodeScanner config
   - cashDrawer config
   - customerDisplay config

5. **NotificationSettings**
   - email notifications
   - SMS notifications
   - WhatsApp notifications
   - Push notifications

6. **BackupSettings**
   ```typescript
   {
     autoBackup: boolean
     frequency: 'daily' | 'weekly' | 'monthly' | 'manual'
     cloudProvider: 'google_drive' | 'dropbox' | 'icloud' | 'none'
     encryption: boolean
     lastBackupDate?: string
     nextBackupDate?: string
     localBackupPath?: string
   }
   ```

### React Native Config
- Uses `react-native-config` for environment variables
- File: `config/env.ts`
- Accessed via `ENV` singleton object

---

## 4. AVAILABLE DEPENDENCIES IN package.json

### Core React Native & Navigation
- `react-native: ^0.76.5`
- `react: 18.3.1`
- `expo: ^52.0.47`
- `expo-dev-client: ~5.0.0`
- `@react-navigation/*` (native, native-stack, bottom-tabs, drawer)

### State Management & Data
- `zustand: ^5.0.8`
- `@tanstack/react-query: ^5.90.6`
- `axios: ^1.13.2`
- `immer: ^10.2.0`

### Storage
- `@react-native-async-storage/async-storage: ^2.1.0` ✓ **Used for settings**
- `react-native-keychain: ^9.0.0` ✓ **Used for tokens**
- `react-native-mmkv: ^3.1.0`
- `react-native-encrypted-storage: ^4.0.3`
- `react-native-fs: ^2.20.0` ✓ **Available for file operations**

### Authentication & Security
- `expo-local-authentication: ^17.0.7`
- `react-native-biometrics: ^3.0.1`
- `jwt-decode: ^4.0.0`
- `react-native-config: ^1.5.3`

### Hardware Integration
- `react-native-ble-manager: ^11.5.3`
- `react-native-print: ^0.11.0`

### Device & File Operations
- `react-native-document-picker: ^9.3.1`
- `react-native-image-picker: ^7.1.2`
- `react-native-device-info: ^14.0.1`

### UI & Media
- `react-native-vector-icons: ^10.2.0`
- `react-native-gifted-charts: ^1.4.64`
- `react-native-svg: ^15.8.0`
- `react-native-linear-gradient: ^2.8.3`
- `react-native-toast-message: ^2.2.1`

### Barcode & Camera
- `react-native-qrcode-scanner: ^1.5.5`
- `react-native-camera: ^4.2.1`

### Other
- `i18next: ^25.6.0` (i18n)
- `react-i18next: ^16.2.4`
- `react-native-localize: ^3.2.1`
- `react-native-sound: ^0.11.2`
- `react-native-permissions: ^4.1.5`
- `react-native-gesture-handler: ^2.21.2`
- `react-native-reanimated: ^3.16.4`
- `react-native-safe-area-context: ^4.12.0`
- `react-native-screens: ^4.3.0`

---

## 5. EXISTING BACKUP/STORAGE RELATED CODE

### UI Components
**File**: `src/components/settings/BackupSettingsSection.tsx`
- Component with placeholder implementations
- Current methods (all with TODO comments):
  - `handleBackupNow()` - Updates lastBackupDate setting
  - `handleRestore()` - Shows alert message
  - `handleExport()` - Shows alert message
- UI Elements:
  - Auto-Backup toggle switch
  - Backup Frequency picker
  - Cloud Storage provider picker
  - Encryption toggle
  - Last Backup display
  - Next Scheduled Backup display
  - Action buttons: "Backup Now", "Restore from Backup", "Export Data"

### Settings Integration
**File**: `src/store/slices/settingsSlice.ts`
- Methods: `exportSettings()`, `importSettings()`
- Persistence enabled via AsyncStorage
- Settings updates tracked with `lastSyncedAt` timestamp

### API Client Setup
**File**: `src/api/client.ts`
- Axios instance with request/response interceptors
- Token refresh mechanism for 401 errors
- Failed request queue for retry handling
- Error handling for network failures

### Type Definitions
- `BackupSettings` interface defined
- `BackupFrequency` enum: 'daily' | 'weekly' | 'monthly' | 'manual'
- `CloudProvider` enum: 'google_drive' | 'dropbox' | 'icloud' | 'none'

### Settings Screen Integration
**File**: `src/screens/settings/SettingsScreen.tsx`
- Renders `BackupSettingsSection`
- Includes basic export/import handlers (TODO)
- Reset settings functionality
- Tax rate configuration modal

---

## DATA THAT NEEDS BACKING UP

### 1. **Authentication Data** (Critical)
   - Access tokens
   - Refresh tokens
   - User profile information
   - Session data
   - Status: Stored in Keychain

### 2. **Application Settings** (Important)
   - General settings (currency, date format, tax rate, etc.)
   - Localization preferences
   - Branding configuration
   - Hardware settings
   - Notification preferences
   - Backup settings themselves
   - Status: Stored in AsyncStorage

### 3. **POS Data** (Critical for Business)
   - Cart items
   - Held sales (in-progress transactions)
   - Transaction history (if cached locally)
   - Customer selections
   - Notes
   - Status: Currently stored in Zustand state (in-memory, not persistent)

### 4. **User & Role Data**
   - User information
   - Role assignments
   - Permissions
   - Status: Fetched from API, cached in state

### 5. **Hardware Configuration**
   - Printer settings and pairing
   - Barcode scanner config
   - Cash drawer settings
   - Customer display config
   - Status: Part of settings store

### 6. **Business Data** (Cloud-based but cache locally)
   - Products
   - Inventory
   - Customers
   - Branches
   - Orders/Transactions
   - Financial records
   - Status: Fetched from API via services

---

## API CLIENT ARCHITECTURE

### Base Configuration
- **Base URL**: From `ENV.API_BASE_URL`
- **Timeout**: From `ENV.API_TIMEOUT` (default 30s)
- **Content-Type**: application/json

### Request Interceptor
- Automatically adds `Authorization: Bearer {token}` header
- Retrieves token from `TokenService.getAccessToken()`

### Response Interceptor
- Handles 401 errors with automatic token refresh
- Implements request queue for concurrent requests during refresh
- Clears tokens on failed refresh
- Returns error in standardized format

### Service Modules
All services follow similar pattern with API client:
- `authService.ts` - Login, logout, PIN, user fetch
- `userService.ts` - User CRUD
- `productService.ts` - Product management
- `customerService.ts` - Customer management
- `inventoryService.ts` - Inventory operations
- `posService.ts` - POS operations
- `financialService.ts` - Financial data
- `reportsService.ts` - Report generation
- And more...

---

## KEY OBSERVATIONS FOR BACKUP IMPLEMENTATION

### Current State
1. ✓ UI components exist but are not functional
2. ✓ Type definitions are complete
3. ✓ Settings persistence is working
4. ✓ Token management is secure
5. ✗ No actual backup logic implemented
6. ✗ No cloud integration implemented
7. ✗ No encryption implemented
8. ✗ No scheduled backup mechanism

### Storage Capabilities
- ✓ Keychain available for secure token storage
- ✓ AsyncStorage available for JSON data
- ✓ MMKV available for high-performance storage
- ✓ Encrypted Storage available (unused)
- ✓ File System available for file operations
- ✓ Document Picker available for file selection

### Implementation Considerations
1. **Sensitive Data**: Tokens should be backed up securely (encrypted)
2. **Settings**: Can be JSON-backed up
3. **Cart/Transactions**: Should be persisted via Zustand + AsyncStorage
4. **Cloud Integration**: Google Drive, Dropbox, iCloud SDKs need to be added
5. **Scheduling**: Need background task library (e.g., `react-native-job-scheduler`)
6. **Encryption**: Can use crypto libraries or built-in RN capabilities

---

## RECOMMENDED BACKUP STRATEGY

### Data Categories
1. **Tier 1 - Critical (Daily)**
   - User authentication tokens
   - User profile
   - Current settings

2. **Tier 2 - Important (Weekly)**
   - All settings
   - Held sales
   - Hardware configuration

3. **Tier 3 - Reference (Monthly)**
   - Transaction cache
   - Product cache
   - Customer cache

### Storage Options
1. **Local**: File system with optional encryption
2. **Cloud**: Google Drive, Dropbox, iCloud (via native SDKs)
3. **Hybrid**: Local with cloud sync

### Recovery Options
1. **Full restore**: All data from backup
2. **Selective restore**: Choose what to restore
3. **Differential recovery**: Restore only changes since last backup
