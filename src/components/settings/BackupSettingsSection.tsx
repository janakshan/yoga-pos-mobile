/**
 * Backup Settings Section
 * Auto-backup scheduling, cloud storage integration, encryption, and restore
 */

import React from 'react';
import {View, Alert} from 'react-native';
import {SettingSection} from './SettingSection';
import {SettingItem} from './SettingItem';
import {SettingSwitch} from './SettingSwitch';
import {SettingPicker} from './SettingPicker';
import {Button} from '@components/ui';
import {Typography} from '@components/ui';
import {Spacer} from '@components/layout';
import {useSettingsStore} from '@/store/slices/settingsSlice';
import {
  BACKUP_FREQUENCIES,
  CLOUD_PROVIDERS,
  BackupFrequency,
  CloudProvider,
} from '@/types/settings.types';

export const BackupSettingsSection: React.FC = () => {
  const {settings, updateBackupSettings} = useSettingsStore();
  const backup = settings.backup;

  const handleBackupNow = () => {
    Alert.alert(
      'Create Backup',
      'This will create a backup of all your data.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Backup Now',
          onPress: () => {
            // TODO: Implement actual backup logic
            const now = new Date().toISOString();
            updateBackupSettings({
              lastBackupDate: now,
            });
            Alert.alert('Success', 'Backup created successfully!');
          },
        },
      ]
    );
  };

  const handleRestore = () => {
    Alert.alert(
      'Restore Data',
      'This will restore your data from the last backup. Current data will be overwritten.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Restore',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual restore logic
            Alert.alert(
              'Success',
              'Data restored successfully! Please restart the app.'
            );
          },
        },
      ]
    );
  };

  const handleExport = () => {
    Alert.alert(
      'Export Data',
      'This will export your data to a file.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Export',
          onPress: () => {
            // TODO: Implement actual export logic
            Alert.alert('Success', 'Data exported successfully!');
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <SettingSection
      title="Backup & Restore"
      description="Manage your data backups and recovery">
      <SettingSwitch
        label="Auto-Backup"
        description="Automatically backup your data"
        value={backup.autoBackup}
        onValueChange={(value) =>
          updateBackupSettings({autoBackup: value})
        }
      />

      {backup.autoBackup && (
        <SettingPicker
          label="Backup Frequency"
          description="How often to create backups"
          value={backup.frequency}
          options={BACKUP_FREQUENCIES}
          onValueChange={(value) =>
            updateBackupSettings({frequency: value as BackupFrequency})
          }
        />
      )}

      <SettingPicker
        label="Cloud Storage"
        description="Where to store backups"
        value={backup.cloudProvider}
        options={CLOUD_PROVIDERS}
        onValueChange={(value) =>
          updateBackupSettings({cloudProvider: value as CloudProvider})
        }
      />

      <SettingSwitch
        label="Encryption"
        description="Encrypt backup files for security"
        value={backup.encryption}
        onValueChange={(value) =>
          updateBackupSettings({encryption: value})
        }
      />

      <SettingItem
        label="Last Backup"
        description="When your data was last backed up"
        value={formatDate(backup.lastBackupDate)}
      />

      {backup.autoBackup && backup.nextBackupDate && (
        <SettingItem
          label="Next Scheduled Backup"
          description="When the next automatic backup will occur"
          value={formatDate(backup.nextBackupDate)}
          last
        />
      )}

      {/* Backup Actions */}
      <View style={{padding: 16}}>
        <Button onPress={handleBackupNow} size="md">
          Backup Now
        </Button>
        <Spacer size="sm" />
        <Button
          variant="outline"
          onPress={handleRestore}
          size="md"
          disabled={!backup.lastBackupDate}>
          Restore from Backup
        </Button>
        <Spacer size="sm" />
        <Button variant="outline" onPress={handleExport} size="md">
          Export Data
        </Button>
      </View>
    </SettingSection>
  );
};
