# Audit Logging System

## Overview

The Yoga POS Mobile app includes a comprehensive audit logging system that tracks all user actions, system events, and data changes. This system provides complete transparency and accountability for all operations performed within the application.

## Features

### ✅ Comprehensive Event Tracking (40+ Event Types)
- **Authentication Events**: Login, logout, token refresh, session timeout, biometric authentication
- **User Management**: User CRUD operations, permission changes, role assignments
- **POS Operations**: Transactions, refunds, voids, discounts, payments
- **Inventory**: Stock adjustments, transfers, counts, barcode scanning
- **Financial**: Invoices, payments, expenses, reconciliation
- **Products**: Product CRUD operations, price changes
- **Customers**: Customer CRUD operations, loyalty redemptions
- **Settings**: Configuration changes, branding updates, hardware setup
- **Reports**: Report generation, viewing, and exports
- **System Events**: Backups, errors, hardware connections

### 📊 Rich Audit Data
Each audit log entry captures:
- **Timestamp**: Exact date and time of the event
- **User Information**: User ID, name, email
- **Event Details**: Event type, action description, status, severity
- **Resource Information**: Resource type, ID, name
- **Device Information**: Device type, platform, model, app version
- **Context**: Session ID, branch ID, IP address
- **Data Changes**: Before/after values for data modifications
- **Metadata**: Additional contextual information

### 🔍 Advanced Filtering & Search
- Filter by date range
- Filter by user
- Filter by event type
- Filter by resource type
- Filter by severity level
- Filter by status
- Full-text search

### 📤 Export Capabilities
Export audit logs in multiple formats:
- CSV
- JSON
- Excel
- PDF

### 🔄 Offline Support & Sync
- Local storage of audit logs for offline access
- Automatic synchronization when connection is restored
- Queued sync for pending logs
- Sync status tracking

### 👥 Concurrent User Tracking
- View active user sessions
- Track concurrent users
- Monitor session duration
- End sessions remotely
- Device and location tracking

## Architecture

### Core Components

#### 1. **AuditService** (`src/services/AuditService.ts`)
The core service responsible for:
- Creating and logging audit events
- Managing local storage
- Device information collection
- Context management
- Offline queue management

#### 2. **Audit API Service** (`src/api/services/auditService.ts`)
Handles all API communication:
- Fetching audit logs
- Creating audit entries
- Batch syncing
- Export requests
- Session management

#### 3. **Audit Store** (`src/store/slices/auditSlice.ts`)
Zustand store for state management:
- Logs state
- Filters state
- Statistics
- Active sessions
- Export status

#### 4. **Audit Types** (`src/types/audit.types.ts`)
TypeScript definitions for:
- 40+ event types
- Resource types
- Severity levels
- Audit log structure
- Filter options

### UI Components

#### 1. **AuditLogsScreen** (`src/screens/audit/AuditLogsScreen.tsx`)
Main audit log viewing screen with:
- Search functionality
- Advanced filters
- Export options
- Sync capabilities
- List view of logs

#### 2. **AuditLogDetailsScreen** (`src/screens/audit/AuditLogDetailsScreen.tsx`)
Detailed view of individual audit logs showing:
- Complete event information
- User and device details
- Data changes comparison
- Metadata
- Error information

#### 3. **ActiveSessionsScreen** (`src/screens/audit/ActiveSessionsScreen.tsx`)
Monitor active user sessions:
- Concurrent user count
- Session details
- Device information
- Session duration
- Remote session termination

## Usage

### Basic Event Logging

```typescript
import AuditService from '@services/AuditService';
import {AuditEventType, AuditStatus} from '@types/audit.types';

// Log a simple event
await AuditService.logEvent({
  eventType: AuditEventType.PRODUCT_CREATE,
  action: 'Product created',
  resourceType: ResourceType.PRODUCT,
  resourceId: product.id,
  resourceName: product.name,
  status: AuditStatus.SUCCESS,
  severity: AuditSeverity.INFO,
});
```

### Authentication Logging

```typescript
// Already integrated in authSlice.ts

// Successful login
await AuditService.logAuth(
  AuditEventType.AUTH_LOGIN,
  user.id,
  AuditStatus.SUCCESS,
  { username: credentials.username }
);

// Failed login
await AuditService.logAuth(
  AuditEventType.AUTH_LOGIN_FAILED,
  credentials.username,
  AuditStatus.FAILURE,
  { errorMessage: error.message }
);
```

### User Management Logging

```typescript
// Log user creation with data changes
await AuditService.logUserEvent(
  AuditEventType.USER_CREATE,
  newUser.id,
  newUser.name,
  {
    after: {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  }
);

// Log user update with before/after
await AuditService.logUserEvent(
  AuditEventType.USER_UPDATE,
  user.id,
  user.name,
  {
    before: { email: oldEmail },
    after: { email: newEmail },
    fields: [{
      field: 'email',
      oldValue: oldEmail,
      newValue: newEmail
    }]
  }
);
```

### POS Transaction Logging

```typescript
// Log transaction creation
await AuditService.logPOSEvent(
  AuditEventType.POS_TRANSACTION_CREATE,
  transaction.id,
  transaction.total,
  {
    items: transaction.items.length,
    paymentMethod: transaction.paymentMethod
  }
);

// Log refund
await AuditService.logPOSEvent(
  AuditEventType.POS_TRANSACTION_REFUND,
  transaction.id,
  refundAmount,
  { reason: refundReason }
);
```

### Inventory Logging

```typescript
// Log stock adjustment
await AuditService.logInventoryEvent(
  AuditEventType.INVENTORY_ADJUST,
  product.id,
  product.name,
  {
    before: { quantity: oldQuantity },
    after: { quantity: newQuantity },
    fields: [{
      field: 'quantity',
      oldValue: oldQuantity,
      newValue: newQuantity
    }]
  },
  { reason: adjustmentReason }
);
```

### Financial Logging

```typescript
// Log invoice creation
await AuditService.logFinancialEvent(
  AuditEventType.FINANCIAL_INVOICE_CREATE,
  invoice.id,
  invoice.amount,
  {
    customer: invoice.customerId,
    dueDate: invoice.dueDate
  }
);
```

### Settings Logging

```typescript
// Log settings change
await AuditService.logSettingsEvent(
  AuditEventType.SETTINGS_UPDATE,
  'Tax Rate',
  {
    before: { taxRate: oldTaxRate },
    after: { taxRate: newTaxRate }
  },
  { section: 'general' }
);
```

### System Event Logging

```typescript
// Log backup creation
await AuditService.logSystemEvent(
  AuditEventType.SYSTEM_BACKUP_CREATE,
  AuditStatus.SUCCESS,
  {
    backupSize: backupSize,
    location: backupLocation
  }
);

// Log error
await AuditService.logError(
  AuditEventType.SYSTEM_ERROR,
  error,
  { component: 'PaymentProcessor' }
);
```

### Context Management

```typescript
// Set audit context when user logs in
AuditService.setContext({
  userId: user.id,
  sessionId: session.token,
  branchId: user.branchId,
  ipAddress: deviceIp
});

// Clear context on logout
AuditService.clearContext();

// Clear specific fields
AuditService.clearContext(['branchId']);
```

### Using the Audit Store

```typescript
import {useAuditStore} from '@store/slices/auditSlice';

function MyComponent() {
  const {
    logs,
    isLoading,
    fetchAuditLogs,
    setFilters,
    exportLogs,
    syncLocalLogs
  } = useAuditStore();

  // Fetch logs with filters
  useEffect(() => {
    fetchAuditLogs({
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      userId: currentUser.id,
      eventType: AuditEventType.POS_TRANSACTION_CREATE
    });
  }, []);

  // Export logs
  const handleExport = async () => {
    await exportLogs({
      filters: { startDate, endDate },
      format: 'csv',
      includeMetadata: true,
      includeChanges: true
    });
  };

  // Sync offline logs
  const handleSync = async () => {
    await syncLocalLogs();
  };
}
```

## Integration Examples

### Example 1: Add Logging to Product Service

```typescript
// In src/api/services/productService.ts

import AuditService from '@services/AuditService';
import {AuditEventType, ResourceType, AuditStatus} from '@types/audit.types';

export const productService = {
  async createProduct(data: CreateProductRequest): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/products', data);
      const product = response.data!;

      // Log product creation
      await AuditService.logEvent({
        eventType: AuditEventType.PRODUCT_CREATE,
        action: 'Product created',
        resourceType: ResourceType.PRODUCT,
        resourceId: product.id,
        resourceName: product.name,
        status: AuditStatus.SUCCESS,
        changes: { after: product }
      });

      return product;
    } catch (error) {
      // Log failed creation
      await AuditService.logError(
        AuditEventType.PRODUCT_CREATE,
        error as Error,
        { productData: data }
      );
      throw error;
    }
  }
};
```

### Example 2: Add Logging to Settings Screen

```typescript
// In settings component

const handleSaveSettings = async (newSettings) => {
  try {
    const oldSettings = settings;
    await saveSettings(newSettings);

    // Log settings change
    await AuditService.logSettingsEvent(
      AuditEventType.SETTINGS_UPDATE,
      'App Settings',
      {
        before: oldSettings,
        after: newSettings,
        fields: getChangedFields(oldSettings, newSettings)
      }
    );

    Alert.alert('Success', 'Settings updated');
  } catch (error) {
    Alert.alert('Error', 'Failed to update settings');
  }
};

function getChangedFields(oldData, newData) {
  const fields = [];
  Object.keys(newData).forEach(key => {
    if (oldData[key] !== newData[key]) {
      fields.push({
        field: key,
        oldValue: oldData[key],
        newValue: newData[key]
      });
    }
  });
  return fields;
}
```

## API Backend Requirements

The audit logging system expects the following API endpoints to be implemented:

### Endpoints

```
GET    /api/v1/audit/logs              - Get audit logs with filters
GET    /api/v1/audit/logs/:id          - Get single audit log
POST   /api/v1/audit/logs              - Create audit log
POST   /api/v1/audit/logs/batch        - Batch create audit logs (for sync)
GET    /api/v1/audit/statistics        - Get audit statistics
POST   /api/v1/audit/export            - Export audit logs
GET    /api/v1/audit/export/:id        - Check export status
GET    /api/v1/audit/sessions/active   - Get active sessions
GET    /api/v1/audit/sessions/user/:id - Get user sessions
POST   /api/v1/audit/sessions/:id/end  - End session
GET    /api/v1/audit/concurrent-users  - Get concurrent user count
GET    /api/v1/audit/logs/search       - Search audit logs
```

### Database Schema

The backend should store audit logs with the following structure:

```sql
CREATE TABLE audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  event_type VARCHAR(100) NOT NULL,
  action TEXT NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(36),
  resource_name VARCHAR(255),
  ip_address VARCHAR(45),
  device_info JSON,
  session_id VARCHAR(255),
  branch_id VARCHAR(36),
  branch_name VARCHAR(255),
  changes JSON,
  status VARCHAR(20) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  metadata JSON,
  error_message TEXT,
  error_stack TEXT,
  synced BOOLEAN DEFAULT FALSE,
  synced_at TIMESTAMP,
  INDEX idx_timestamp (timestamp),
  INDEX idx_user_id (user_id),
  INDEX idx_event_type (event_type),
  INDEX idx_resource_type (resource_type),
  INDEX idx_status (status),
  INDEX idx_severity (severity)
);

CREATE TABLE user_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  device_info JSON,
  ip_address VARCHAR(45),
  location JSON,
  login_time TIMESTAMP NOT NULL,
  last_activity_time TIMESTAMP NOT NULL,
  logout_time TIMESTAMP,
  session_duration INT,
  is_active BOOLEAN DEFAULT TRUE,
  branch_id VARCHAR(36),
  branch_name VARCHAR(255),
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active),
  INDEX idx_login_time (login_time)
);
```

## Best Practices

### 1. **Always Log Critical Operations**
- Authentication (login/logout)
- Data modifications (create/update/delete)
- Permission changes
- Financial transactions
- Settings changes

### 2. **Include Context**
Set audit context at the session level:
```typescript
// On login
AuditService.setContext({ userId, sessionId, branchId });

// On logout
AuditService.clearContext();
```

### 3. **Capture Data Changes**
Always include before/after values for updates:
```typescript
await AuditService.logEvent({
  // ...
  changes: {
    before: oldData,
    after: newData,
    fields: changedFields
  }
});
```

### 4. **Use Appropriate Severity Levels**
- `INFO`: Normal operations
- `WARNING`: Unusual but not critical events
- `ERROR`: Errors that don't crash the app
- `CRITICAL`: Critical errors requiring immediate attention

### 5. **Log Failures Too**
Don't just log successes - log failures with error details:
```typescript
try {
  // operation
  await AuditService.logEvent({
    status: AuditStatus.SUCCESS,
    // ...
  });
} catch (error) {
  await AuditService.logError(eventType, error, metadata);
}
```

### 6. **Periodic Sync**
Implement periodic sync for offline logs:
```typescript
// Sync every 5 minutes
setInterval(async () => {
  await useAuditStore.getState().syncLocalLogs();
}, 5 * 60 * 1000);
```

### 7. **Clean Up Old Logs**
Periodically clean up old synced logs:
```typescript
// Clean up logs older than 30 days
await AuditService.clearOldLogs(30);
```

## Security Considerations

1. **Sensitive Data**: Avoid logging sensitive data (passwords, credit card numbers) in metadata or changes
2. **Access Control**: Implement proper permissions for viewing audit logs
3. **Encryption**: Consider encrypting audit logs at rest
4. **Retention Policy**: Implement a retention policy for audit logs
5. **Integrity**: Use checksums or digital signatures to prevent tampering

## Troubleshooting

### Logs Not Syncing
1. Check network connection
2. Verify API endpoint is accessible
3. Check for authentication issues
4. Look for errors in console logs

### Missing Audit Events
1. Ensure AuditService is initialized
2. Verify context is set correctly
3. Check that event logging is called in the right places
4. Review error logs for failures

### Performance Issues
1. Reduce local log storage limit
2. Implement more aggressive cleanup
3. Use batch syncing instead of real-time
4. Consider async logging for non-critical events

## Future Enhancements

- Real-time audit log streaming via WebSocket
- Advanced analytics and visualization
- Anomaly detection
- Automated alerts for critical events
- Machine learning for pattern detection
- Integration with external SIEM systems
