# Authentication & Authorization Module

Complete authentication and authorization system with JWT, RBAC, PIN, and biometric support for Yoga POS Mobile.

## Features

### ✅ Authentication Methods

1. **Email/Password Authentication**
   - Standard login with email and password
   - Remember me functionality
   - Secure token storage

2. **PIN-Based Login**
   - Quick 4-digit PIN login
   - Offline PIN verification (cached hash)
   - PIN attempt tracking and lockout

3. **Biometric Authentication**
   - Face ID (iOS)
   - Touch ID (iOS)
   - Fingerprint (Android)
   - Automatic fallback to PIN

### ✅ Authorization (RBAC)

**Predefined User Roles:**
- `admin` - Full system access
- `manager` - Store management and reporting
- `cashier` - POS operations
- `inventory_manager` - Inventory and product management
- `waiter` / `waitress` - Order taking and POS
- `kitchen_staff` - Limited access

**Permission System:**
- POS operations (access, void, discount, refund, reports)
- Product management (view, create, update, delete)
- Inventory management (view, manage, adjust)
- Customer management (view, create, update, delete)
- User management (view, create, update, delete)
- Settings and reports

### ✅ Security Features

1. **JWT Token Management**
   - Access token + refresh token
   - Automatic token refresh
   - Token expiration validation
   - Secure token storage (iOS Keychain / Android Keystore)

2. **Session Management**
   - Activity tracking
   - Auto-logout after inactivity (configurable, default 15 min)
   - Session timeout warnings
   - Multi-device support

3. **Security Best Practices**
   - Secure credential storage
   - HTTPS-only API communication
   - Token rotation on refresh
   - Biometric key encryption

## API Endpoints

All endpoints are defined in `src/api/services/authService.ts`:

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

## File Structure

```
src/
├── api/
│   ├── client.ts                    # Axios client with interceptors
│   └── services/
│       └── authService.ts           # Auth API endpoints
├── components/
│   └── auth/
│       ├── ProtectedView.tsx        # RBAC component wrapper
│       └── index.ts
├── hooks/
│   ├── useRBAC.ts                   # RBAC hooks
│   └── useInactivityLogout.ts      # Auto-logout hook
├── navigation/
│   ├── AuthNavigator.tsx            # Auth screens navigation
│   └── types.ts                     # Navigation types
├── screens/
│   └── auth/
│       ├── LoginScreen.tsx          # Email/password + biometric
│       ├── PinLoginScreen.tsx       # PIN login
│       ├── PinSetupScreen.tsx       # PIN setup
│       └── UnauthorizedScreen.tsx   # Access denied screen
├── services/
│   └── TokenService.ts              # Secure token storage
├── store/
│   └── slices/
│       └── authSlice.ts             # Auth state (Zustand)
├── types/
│   └── api.types.ts                 # Auth types
└── utils/
    ├── jwt.utils.ts                 # JWT utilities
    ├── biometric.utils.ts           # Biometric auth utilities
    └── rbac.utils.ts                # RBAC utilities
```

## Usage Examples

### 1. Using Email/Password Login

```tsx
import {useAuthStore} from '@store/slices/authSlice';

const MyComponent = () => {
  const {login, isLoading} = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: true,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
};
```

### 2. Using PIN Login

```tsx
import {useAuthStore} from '@store/slices/authSlice';

const MyComponent = () => {
  const {loginWithPin, isLoading} = useAuthStore();

  const handlePinLogin = async () => {
    try {
      await loginWithPin({
        username: 'john_doe',
        pin: '1234',
        rememberMe: true,
      });
    } catch (error) {
      console.error('PIN login failed:', error);
    }
  };
};
```

### 3. Using Biometric Authentication

```tsx
import {useAuthStore} from '@store/slices/authSlice';

const MyComponent = () => {
  const {loginWithBiometric, biometricAvailable} = useAuthStore();

  const handleBiometricLogin = async () => {
    if (!biometricAvailable) {
      alert('Biometric authentication not available');
      return;
    }

    try {
      await loginWithBiometric();
    } catch (error) {
      console.error('Biometric login failed:', error);
    }
  };
};
```

### 4. Checking Permissions (RBAC)

```tsx
import {usePermission, useRole} from '@hooks/useRBAC';
import {Permission, UserRole} from '@types/api.types';

const MyComponent = () => {
  const canAccessPOS = usePermission(Permission.POS_ACCESS);
  const isAdmin = useRole(UserRole.ADMIN);

  return (
    <View>
      {canAccessPOS && <Button title="Open POS" />}
      {isAdmin && <Button title="Admin Panel" />}
    </View>
  );
};
```

### 5. Using Protected View Component

```tsx
import {ProtectedView} from '@components/auth';
import {Permission, UserRole} from '@types/api.types';

const MyComponent = () => {
  return (
    <View>
      {/* Show only to users with permission */}
      <ProtectedView permission={Permission.PRODUCT_CREATE}>
        <Button title="Create Product" />
      </ProtectedView>

      {/* Show only to admins */}
      <ProtectedView role={UserRole.ADMIN} showUnauthorized>
        <AdminPanel />
      </ProtectedView>

      {/* Show to users with any of these roles */}
      <ProtectedView
        anyRole={[UserRole.ADMIN, UserRole.MANAGER]}
        fallback={<Text>Access Denied</Text>}>
        <ManagementSection />
      </ProtectedView>
    </View>
  );
};
```

### 6. Setting Up PIN

```tsx
import {useAuthStore} from '@store/slices/authSlice';

const MyComponent = () => {
  const {setPin} = useAuthStore();

  const handleSetPin = async (pin: string) => {
    try {
      await setPin(pin);
      alert('PIN set successfully');
    } catch (error) {
      console.error('Failed to set PIN:', error);
    }
  };
};
```

### 7. Enabling Biometric Authentication

```tsx
import {useAuthStore} from '@store/slices/authSlice';

const MyComponent = () => {
  const {enableBiometric, biometricAvailable} = useAuthStore();

  const handleEnableBiometric = async () => {
    if (!biometricAvailable) {
      alert('Biometric authentication not available on this device');
      return;
    }

    const success = await enableBiometric();
    if (success) {
      alert('Biometric authentication enabled');
    }
  };
};
```

### 8. Auto-Logout on Inactivity

```tsx
import {useInactivityLogout} from '@hooks/useInactivityLogout';

const MyComponent = () => {
  useInactivityLogout({
    timeout: 15 * 60 * 1000, // 15 minutes
    enabled: true,
    warningTime: 60 * 1000, // 1 minute warning
    onInactivityWarning: (secondsRemaining) => {
      alert(`You will be logged out in ${secondsRemaining} seconds`);
    },
  });

  return <View>{/* Your component */}</View>;
};
```

### 9. Using Complete RBAC Hook

```tsx
import {useRBAC} from '@hooks/useRBAC';
import {Permission, UserRole} from '@types/api.types';

const MyComponent = () => {
  const rbac = useRBAC();

  return (
    <View>
      {rbac.isAdmin && <AdminPanel />}
      {rbac.canAccessPOS && <POSButton />}
      {rbac.hasPermission(Permission.PRODUCT_CREATE) && <CreateProductButton />}
      {rbac.hasAnyRole([UserRole.MANAGER, UserRole.ADMIN]) && <ReportsSection />}
    </View>
  );
};
```

## RBAC Configuration

### Default Role Permissions

Permissions are automatically assigned based on user roles. The permission hierarchy is defined in `src/utils/rbac.utils.ts`:

**Admin**: All permissions

**Manager**:
- All POS operations
- Product management (view, create, update)
- Inventory management
- Customer management
- View users and settings
- Reports and export

**Inventory Manager**:
- Product management (view, create, update)
- Full inventory management
- Reports

**Cashier**:
- POS access
- Apply discounts
- View products and customers
- Create customers

**Waiter/Waitress**:
- POS access
- View products and customers

**Kitchen Staff**:
- View products only

### Custom Permissions

Users can have additional permissions beyond their role:

```typescript
// Example user with custom permissions
const user: User = {
  id: '123',
  role: UserRole.CASHIER,
  permissions: [
    Permission.INVENTORY_VIEW, // Additional permission
    Permission.REPORTS_VIEW,   // Additional permission
  ],
  // ...other fields
};
```

## JWT Token Structure

Access tokens contain the following claims:

```typescript
interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  permissions?: Permission[];
  iat: number;  // Issued at
  exp: number;  // Expiration time
}
```

## Security Best Practices

1. **Token Storage**
   - Access and refresh tokens are stored in iOS Keychain / Android Keystore
   - Never store tokens in AsyncStorage or local storage
   - Tokens are encrypted at rest

2. **Token Refresh**
   - Access tokens expire after a short period (e.g., 15 minutes)
   - Refresh tokens expire after a longer period (e.g., 7 days)
   - Automatic token refresh on 401 responses
   - Request queuing during token refresh

3. **PIN Security**
   - PINs are never stored in plain text
   - Use bcrypt or similar for PIN hashing
   - Implement attempt limiting (default: 5 attempts)
   - Lock account after max attempts
   - Support offline PIN verification

4. **Biometric Security**
   - Biometric data never leaves the device
   - Uses device's secure enclave
   - Requires device PIN/password as fallback
   - Can be disabled by user at any time

## Mobile-Specific Considerations

### iOS

- Uses Keychain for secure storage
- Supports Face ID and Touch ID
- Requires `NSFaceIDUsageDescription` in Info.plist

### Android

- Uses Keystore for secure storage
- Supports fingerprint and face unlock
- Requires biometric permissions in AndroidManifest.xml

### Offline Support

- Cached PIN hashes for offline login
- Local session validation
- Queue API requests when offline
- Sync on reconnection

## Troubleshooting

### Common Issues

1. **Biometric not available**
   - Check device support
   - Ensure biometric is set up in device settings
   - Check app permissions

2. **Token refresh fails**
   - User will be logged out
   - Check network connection
   - Verify API endpoint is accessible

3. **PIN login fails**
   - Check PIN attempts remaining
   - Verify user account is not locked
   - Check network for online verification

## Testing

### Test Accounts

Create test accounts with different roles for testing:

```
admin@test.com / password123 (Admin)
manager@test.com / password123 (Manager)
cashier@test.com / password123 (Cashier)
```

### Testing RBAC

```typescript
// Test permission checking
import {RBACUtility} from '@utils/rbac.utils';
import {Permission, UserRole} from '@types/api.types';

const testUser = {
  role: UserRole.CASHIER,
  permissions: [],
  // ...other fields
};

console.log(RBACUtility.hasPermission(testUser, Permission.POS_ACCESS)); // true
console.log(RBACUtility.hasPermission(testUser, Permission.USER_CREATE)); // false
console.log(RBACUtility.isAdmin(testUser)); // false
```

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Apple)
- [ ] Password reset via email/SMS
- [ ] Biometric for individual transactions
- [ ] Role-based UI theming
- [ ] Audit logging for sensitive operations
- [ ] Multi-tenancy support
- [ ] OAuth 2.0 support

## License

Copyright © 2025 Yoga POS. All rights reserved.
