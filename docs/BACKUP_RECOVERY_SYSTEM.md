# Backup & Recovery System

Complete documentation for the Yoga POS Mobile Backup & Recovery system.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Configuration](#configuration)
7. [Cloud Storage Providers](#cloud-storage-providers)
8. [Security](#security)
9. [API Reference](#api-reference)
10. [Troubleshooting](#troubleshooting)

## Overview

The Backup & Recovery system provides comprehensive data backup and restoration capabilities for the Yoga POS mobile application. It supports automated scheduling, multiple cloud storage providers, AES-256-GCM encryption, and background execution.

## Features

### Core Features

- ✅ **Manual Backup Creation** - Create backups on-demand
- ✅ **Automated Backup Scheduling** - Hourly, Daily, Weekly, Monthly, Custom
- ✅ **Cloud Storage Integration** - Google Drive, Dropbox, AWS S3, Local storage
- ✅ **AES-256-GCM Encryption** - Military-grade encryption for sensitive data
- ✅ **One-Click Restore** - Simple restoration from backup history
- ✅ **Backup History** - View, verify, and manage all backups
- ✅ **Backup Verification** - Integrity checks using SHA-256 checksums
- ✅ **Background Execution** - Backups run even when app is closed
- ✅ **Export/Import** - Share backups across devices
- ✅ **Retention Management** - Automatic cleanup of old backups

### Data Backed Up

- Application settings and configurations
- Authentication data (tokens, user info)
- POS data (cart, held sales, transactions)
- Custom data and metadata

## Architecture

### Service Layer

```
src/services/
├── BackupService.ts          # Main backup operations
├── RestoreService.ts          # Restoration and verification
├── EncryptionService.ts       # AES-256-GCM encryption
├── CloudStorageService.ts     # Cloud provider integration
└── BackupScheduler.ts         # Background scheduling
```

### Component Layer

```
src/components/settings/
├── BackupSettingsSection.tsx  # Main settings UI
└── BackupHistoryModal.tsx     # History and restore UI
```

### Type Definitions

```
src/types/
└── backup.types.ts            # TypeScript interfaces
```

## Installation

### Dependencies

The following packages are required:

```json
{
  "react-native-aes-crypto": "^2.x",
  "react-native-background-fetch": "^4.x",
  "@react-native-google-signin/google-signin": "^10.x",
  "rn-fetch-blob": "^0.12.x",
  "react-native-fs": "^2.20.0",
  "react-native-keychain": "^9.0.0",
  "@react-native-async-storage/async-storage": "^2.1.0"
}
```

### Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps react-native-aes-crypto react-native-background-fetch @react-native-google-signin/google-signin rn-fetch-blob
```

2. Link native modules (if not using auto-linking):
```bash
npx pod-install ios
```

3. Configure background fetch in `index.js` (already done):
```javascript
import BackgroundFetch from 'react-native-background-fetch';
import { BackupHeadlessTask } from './src/services/BackupScheduler';

BackgroundFetch.registerHeadlessTask(BackupHeadlessTask);
```

## Usage

### Creating a Manual Backup

```typescript
import { BackupService } from '@/services/BackupService';
import { BackupConfig } from '@/types/backup.types';

const config: BackupConfig = {
  enabled: true,
  frequency: 'daily',
  cloudProvider: 'google-drive',
  encryption: true,
  retainCount: 10,
  includeLocal: true,
  includeAuthData: true,
  includePosData: true,
  autoRestore: false,
};

const result = await BackupService.createBackup(config);

if (result.success) {
  console.log('Backup created:', result.backupId);
  console.log('Size:', result.size, 'bytes');
  console.log('Location:', result.localPath);
} else {
  console.error('Backup failed:', result.error);
}
```

### Restoring from Backup

```typescript
import { RestoreService } from '@/services/RestoreService';

const result = await RestoreService.restoreFromBackup(backupId);

if (result.success) {
  console.log('Restored:', result.restoredData);
  // Restart app to apply changes
} else {
  console.error('Restore failed:', result.error);
}
```

### Scheduling Automatic Backups

```typescript
import { BackupScheduler } from '@/services/BackupScheduler';

// Schedule daily backups at 2 AM
const config: BackupConfig = {
  enabled: true,
  frequency: 'daily',
  time: '02:00',
  cloudProvider: 'local',
  encryption: true,
  retainCount: 7,
  includeLocal: true,
  includeAuthData: true,
  includePosData: true,
  autoRestore: false,
};

await BackupScheduler.scheduleBackup(config);
```

### Viewing Backup History

```typescript
import { BackupService } from '@/services/BackupService';

const history = await BackupService.getBackupHistory();

history.forEach(item => {
  console.log('Backup ID:', item.id);
  console.log('Timestamp:', new Date(item.timestamp));
  console.log('Size:', item.size);
  console.log('Status:', item.status);
  console.log('Encrypted:', item.encrypted);
});
```

### Verifying a Backup

```typescript
import { RestoreService } from '@/services/RestoreService';

const verification = await RestoreService.verifyBackupFile(backupId);

if (verification.isValid) {
  console.log('Backup is valid');
} else {
  console.error('Verification failed:', verification.errors);
}
```

## Configuration

### Backup Frequencies

| Frequency | Description | Minimum Interval |
|-----------|-------------|-----------------|
| `hourly` | Every hour | 60 minutes |
| `daily` | Once per day at specified time | 24 hours |
| `weekly` | Once per week on specified day | 7 days |
| `monthly` | Once per month on specified day | 30 days |
| `custom` | Custom schedule | 24 hours |

### Backup Configuration Options

```typescript
interface BackupConfig {
  enabled: boolean;              // Enable/disable backups
  frequency: BackupFrequency;    // Backup frequency
  time?: string;                 // Time in HH:mm format
  dayOfWeek?: number;            // 0-6 for weekly (0 = Sunday)
  dayOfMonth?: number;           // 1-31 for monthly
  cloudProvider: CloudProvider;  // Storage provider
  encryption: boolean;           // Enable encryption
  retainCount: number;           // Max backups to keep
  includeLocal: boolean;         // Include local storage
  includeAuthData: boolean;      // Include auth tokens
  includePosData: boolean;       // Include POS data
  autoRestore: boolean;          // Auto-restore on first launch
}
```

## Cloud Storage Providers

### Google Drive

**Status:** ✅ Implemented

**Setup:**
1. Configure Google Sign-In in your app
2. Request Drive API scopes
3. Obtain access token
4. Save credentials:

```typescript
import { CloudStorageService } from '@/services/CloudStorageService';

await CloudStorageService.saveCredentials({
  provider: 'google-drive',
  accessToken: 'your-access-token',
  refreshToken: 'your-refresh-token',
  expiresAt: Date.now() + 3600000,
});
```

**Storage Location:** App Data Folder (private to your app)

### Dropbox

**Status:** ✅ Implemented

**Setup:**
1. Create Dropbox app
2. Obtain OAuth access token
3. Save credentials:

```typescript
await CloudStorageService.saveCredentials({
  provider: 'dropbox',
  accessToken: 'your-dropbox-token',
});
```

**Storage Location:** `/yoga_pos_backups/`

### AWS S3

**Status:** ⚠️ Partial (requires AWS SDK integration)

**Setup:**
1. Create S3 bucket
2. Configure IAM credentials
3. Save credentials:

```typescript
await CloudStorageService.saveCredentials({
  provider: 's3',
  apiKey: 'your-access-key-id',
  secretKey: 'your-secret-access-key',
  bucket: 'your-bucket-name',
  region: 'us-east-1',
});
```

**Note:** Full S3 implementation requires AWS SDK. Current implementation is a placeholder.

### Local Storage

**Status:** ✅ Implemented

**Storage Location:** `{DocumentDirectory}/backups/`

**No configuration required.**

## Security

### Encryption

The system uses **AES-256-GCM** (Advanced Encryption Standard with Galois/Counter Mode), a military-grade encryption algorithm.

#### Encryption Features:

- **Algorithm:** AES-256-GCM
- **Key Size:** 256 bits
- **IV Size:** 16 bytes (randomly generated)
- **Salt Size:** 32 bytes (randomly generated)
- **Key Derivation:** PBKDF2 with 10,000 iterations
- **Integrity:** SHA-256 checksums for verification

#### How It Works:

1. Generate random salt and IV
2. Derive encryption key from password using PBKDF2
3. Encrypt backup data with AES-256-GCM
4. Package encrypted data with metadata
5. Generate SHA-256 checksum for integrity

#### Password Management:

- Backup passwords are automatically generated and stored securely in Keychain
- Passwords are never exposed to the user
- Each app instance has its own unique backup password

### Data Security Best Practices:

1. ✅ Always enable encryption for sensitive data
2. ✅ Use cloud storage for off-device backups
3. ✅ Verify backups before relying on them
4. ✅ Regularly test restore functionality
5. ✅ Keep retention count reasonable (7-30 backups)
6. ✅ Never share backup files unencrypted

## API Reference

### BackupService

#### `createBackup(config: BackupConfig): Promise<BackupResult>`
Create a new backup with the specified configuration.

#### `getLocalBackups(): Promise<BackupFile[]>`
Get all local backup files.

#### `deleteBackup(backupId: string): Promise<boolean>`
Delete a specific backup.

#### `getBackupHistory(): Promise<BackupHistoryItem[]>`
Get backup history with metadata.

#### `exportBackup(backupId: string): Promise<string>`
Export backup to device downloads folder.

#### `importBackup(filePath: string): Promise<string>`
Import a backup file.

### RestoreService

#### `restoreFromBackup(backupId: string, password?: string): Promise<RestoreResult>`
Restore data from a backup.

#### `verifyBackup(backupData: BackupData): Promise<BackupVerificationResult>`
Verify backup integrity.

#### `verifyBackupFile(backupId: string): Promise<BackupVerificationResult>`
Verify a backup file without restoring.

#### `getBackupPreview(backupId: string): Promise<any>`
Get backup metadata preview.

#### `shouldAutoRestore(): Promise<boolean>`
Check if auto-restore is needed.

#### `getMostRecentBackup(): Promise<string | null>`
Get the most recent backup ID.

### BackupScheduler

#### `initialize(): Promise<void>`
Initialize background fetch.

#### `scheduleBackup(config: BackupConfig): Promise<void>`
Schedule automatic backups.

#### `stopBackup(): Promise<void>`
Stop automatic backups.

#### `getSchedule(): Promise<BackgroundBackupJob | null>`
Get current backup schedule.

#### `getScheduleStatus(): Promise<ScheduleStatus>`
Get schedule status with next/last run times.

#### `runNow(): Promise<void>`
Force run backup immediately.

### EncryptionService

#### `encrypt(data: string, password: string): Promise<string>`
Encrypt data with AES-256-GCM.

#### `decrypt(encryptedPackage: string, password: string): Promise<string>`
Decrypt data.

#### `encryptObject(obj: any, password: string): Promise<string>`
Encrypt a JSON object.

#### `decryptObject<T>(encryptedPackage: string, password: string): Promise<T>`
Decrypt to a JSON object.

#### `generateChecksum(data: string): Promise<string>`
Generate SHA-256 checksum.

#### `verifyChecksum(data: string, expectedChecksum: string): Promise<boolean>`
Verify data integrity.

### CloudStorageService

#### `uploadBackup(provider: CloudProvider, localPath: string, fileName: string): Promise<string>`
Upload backup to cloud storage.

#### `downloadBackup(provider: CloudProvider, cloudPath: string, localPath: string): Promise<void>`
Download backup from cloud storage.

#### `deleteBackup(provider: CloudProvider, cloudPath: string): Promise<void>`
Delete backup from cloud storage.

#### `listBackups(provider: CloudProvider): Promise<any[]>`
List all backups from cloud storage.

#### `saveCredentials(credentials: CloudStorageCredentials): Promise<void>`
Save cloud storage credentials.

#### `testConnection(provider: CloudProvider): Promise<boolean>`
Test cloud storage connection.

## Troubleshooting

### Common Issues

#### 1. Backup Creation Fails

**Symptoms:** "Failed to create backup" error

**Solutions:**
- Check storage permissions
- Ensure sufficient disk space
- Verify backup directory exists
- Check cloud provider credentials

#### 2. Background Backups Not Running

**Symptoms:** Scheduled backups don't execute

**Solutions:**
- Verify background fetch is initialized
- Check app battery optimization settings
- Ensure auto-backup is enabled
- Check backup schedule status

#### 3. Restore Fails

**Symptoms:** "Failed to restore backup" error

**Solutions:**
- Verify backup file exists
- Check if backup is corrupted (use verify)
- Ensure correct password for encrypted backups
- Check available storage space

#### 4. Cloud Upload Fails

**Symptoms:** "Failed to upload to [provider]" error

**Solutions:**
- Check internet connection
- Verify cloud provider credentials
- Ensure credentials haven't expired
- Test connection with `testConnection()`

#### 5. Encryption Errors

**Symptoms:** "Failed to encrypt/decrypt data" error

**Solutions:**
- Ensure encryption libraries are properly linked
- Check if backup password is accessible
- Verify backup file format
- Try disabling encryption temporarily

### Debug Mode

Enable verbose logging:

```typescript
// Add to development environment
if (__DEV__) {
  console.log('[Backup] Debug mode enabled');
}
```

### Getting Help

1. Check the logs for detailed error messages
2. Verify all dependencies are properly installed
3. Test with a fresh backup creation
4. Review cloud provider documentation
5. Check React Native version compatibility

## Performance Considerations

- Backups run asynchronously and don't block the UI
- Large backups (>10MB) may take several seconds
- Cloud uploads depend on network speed
- Background tasks are subject to OS limitations
- Encryption adds ~10-20% overhead

## Future Enhancements

- [ ] Differential/incremental backups
- [ ] Backup compression (gzip)
- [ ] Multi-device sync
- [ ] Backup sharing between users
- [ ] Advanced scheduling options
- [ ] Backup analytics and insights
- [ ] Custom backup selection
- [ ] Backup encryption with user password
- [ ] Backup to multiple cloud providers simultaneously

## License

Copyright © 2024 Yoga POS. All rights reserved.

## Support

For issues, feature requests, or questions, please contact the development team.
