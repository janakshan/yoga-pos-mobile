/**
 * Backup Settings Section
 * Auto-backup scheduling, cloud storage integration, encryption, and restore
 */

import React, { useState, useEffect } from 'react';
import {View, Alert, ActivityIndicator} from 'react-native';
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
import { BackupService } from '@/services/BackupService';
import { RestoreService } from '@/services/RestoreService';
import { BackupScheduler } from '@/services/BackupScheduler';
import { BackupHistoryModal } from './BackupHistoryModal';
import { BackupConfig } from '@/types/backup.types';

export const BackupSettingsSection: React.FC = () => {
  const {settings, updateBackupSettings} = useSettingsStore();
  const backup = settings.backup;

  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<{
    enabled: boolean;
    nextRun: number | null;
    lastRun: number | null;
  }>({ enabled: false, nextRun: null, lastRun: null });

  useEffect(() => {
    loadScheduleStatus();
  }, [backup.autoBackup]);

  const loadScheduleStatus = async () => {
    try {
      const status = await BackupScheduler.getScheduleStatus();
      setScheduleStatus(status);
    } catch (error) {
      console.error('Error loading schedule status:', error);
    }
  };

  const handleBackupNow = async () => {
    Alert.alert(
      'Create Backup',
      'This will create a backup of all your data.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Backup Now',
          onPress: async () => {
            setLoading(true);
            try {
              // Create backup config from current settings
              const backupConfig: BackupConfig = {
                enabled: backup.autoBackup,
                frequency: backup.frequency as any,
                time: backup.time,
                cloudProvider: backup.cloudProvider as any,
                encryption: backup.encryption,
                retainCount: backup.retainCount || 10,
                includeLocal: backup.includeLocal !== false,
                includeAuthData: true,
                includePosData: true,
                autoRestore: false,
              };

              const result = await BackupService.createBackup(backupConfig);

              if (result.success) {
                const now = new Date().toISOString();
                updateBackupSettings({
                  lastBackupDate: now,
                });

                Alert.alert(
                  'Success',
                  `Backup created successfully!\n\nBackup ID: ${result.backupId}\nSize: ${(result.size! / 1024).toFixed(2)} KB\nDuration: ${result.duration}ms`
                );

                // Update schedule status
                await loadScheduleStatus();
              } else {
                Alert.alert('Error', result.error || 'Failed to create backup');
              }
            } catch (error) {
              console.error('Backup error:', error);
              Alert.alert('Error', 'An error occurred while creating the backup');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRestore = () => {
    setShowHistory(true);
  };

  const handleExport = async () => {
    Alert.alert(
      'Export Data',
      'This will export the most recent backup to your device downloads.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Export',
          onPress: async () => {
            setLoading(true);
            try {
              const backups = await BackupService.getLocalBackups();
              if (backups.length === 0) {
                Alert.alert('No Backups', 'No backups available to export');
                return;
              }

              const mostRecent = backups[0];
              const exportPath = await BackupService.exportBackup(mostRecent.metadata.id);

              Alert.alert(
                'Success',
                `Backup exported successfully!\n\nLocation: ${exportPath}`
              );
            } catch (error) {
              console.error('Export error:', error);
              Alert.alert('Error', 'Failed to export backup');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAutoBackupChange = async (value: boolean) => {
    updateBackupSettings({ autoBackup: value });

    if (value) {
      try {
        const backupConfig: BackupConfig = {
          enabled: true,
          frequency: backup.frequency as any,
          time: backup.time,
          cloudProvider: backup.cloudProvider as any,
          encryption: backup.encryption,
          retainCount: backup.retainCount || 10,
          includeLocal: backup.includeLocal !== false,
          includeAuthData: true,
          includePosData: true,
          autoRestore: false,
        };

        await BackupScheduler.scheduleBackup(backupConfig);
        await loadScheduleStatus();

        Alert.alert('Success', 'Automatic backup has been enabled');
      } catch (error) {
        console.error('Error scheduling backup:', error);
        Alert.alert('Error', 'Failed to schedule automatic backup');
      }
    } else {
      try {
        await BackupScheduler.stopBackup();
        await loadScheduleStatus();
        Alert.alert('Success', 'Automatic backup has been disabled');
      } catch (error) {
        console.error('Error stopping backup:', error);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <SettingSection
        title="Backup & Restore"
        description="Manage your data backups and recovery">
        <SettingSwitch
          label="Auto-Backup"
          description="Automatically backup your data"
          value={backup.autoBackup}
          onValueChange={handleAutoBackupChange}
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
          description="Encrypt backup files with AES-256-GCM"
          value={backup.encryption}
          onValueChange={(value) =>
            updateBackupSettings({encryption: value})
          }
        />

        <SettingItem
          label="Last Backup"
          description="When your data was last backed up"
          value={formatDate(backup.lastBackupDate || scheduleStatus.lastRun ? new Date(scheduleStatus.lastRun!).toISOString() : undefined)}
        />

        {backup.autoBackup && scheduleStatus.nextRun && (
          <SettingItem
            label="Next Scheduled Backup"
            description="When the next automatic backup will occur"
            value={formatDate(new Date(scheduleStatus.nextRun).toISOString())}
            last
          />
        )}

        {/* Backup Actions */}
        <View style={{padding: 16}}>
          {loading && (
            <View style={{ marginBottom: 12, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Typography.Paragraph style={{ marginTop: 8, color: '#666' }}>
                Processing...
              </Typography.Paragraph>
            </View>
          )}

          <Button onPress={handleBackupNow} size="md" disabled={loading}>
            Backup Now
          </Button>
          <Spacer size="sm" />
          <Button
            variant="outline"
            onPress={handleRestore}
            size="md"
            disabled={loading}>
            Restore from Backup
          </Button>
          <Spacer size="sm" />
          <Button variant="outline" onPress={handleExport} size="md" disabled={loading}>
            Export Data
          </Button>
          <Spacer size="sm" />
          <Button
            variant="ghost"
            onPress={() => setShowHistory(true)}
            size="md"
            disabled={loading}>
            View Backup History
          </Button>
        </View>
      </SettingSection>

      <BackupHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        onRestore={() => {
          // Reload app or show success message
          Alert.alert(
            'Restore Complete',
            'Your data has been restored successfully. Please restart the app for changes to take effect.'
          );
        }}
      />
    </>
  );
};
