/**
 * Backup History Modal
 * Displays backup history with restore and delete options
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { BackupService } from '../../services/BackupService';
import { RestoreService } from '../../services/RestoreService';
import { BackupHistoryItem } from '../../types/backup.types';

interface BackupHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onRestore?: () => void;
}

export const BackupHistoryModal: React.FC<BackupHistoryModalProps> = ({
  visible,
  onClose,
  onRestore,
}) => {
  const [history, setHistory] = useState<BackupHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadHistory();
    }
  }, [visible]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const backupHistory = await BackupService.getBackupHistory();
      setHistory(backupHistory);
    } catch (error) {
      console.error('Error loading backup history:', error);
      Alert.alert('Error', 'Failed to load backup history');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    Alert.alert(
      'Restore Backup',
      'Are you sure you want to restore this backup? This will replace your current settings and data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setRestoring(backupId);
            try {
              const result = await RestoreService.restoreFromBackup(backupId);

              if (result.success) {
                Alert.alert(
                  'Success',
                  'Backup restored successfully. The app will restart to apply changes.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        onRestore?.();
                        onClose();
                      },
                    },
                  ]
                );
              } else {
                Alert.alert('Error', result.error || 'Failed to restore backup');
              }
            } catch (error) {
              console.error('Restore error:', error);
              Alert.alert('Error', 'An error occurred while restoring the backup');
            } finally {
              setRestoring(null);
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (backupId: string) => {
    Alert.alert(
      'Delete Backup',
      'Are you sure you want to delete this backup? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await BackupService.deleteBackup(backupId);
              if (success) {
                Alert.alert('Success', 'Backup deleted successfully');
                loadHistory();
              } else {
                Alert.alert('Error', 'Failed to delete backup');
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'An error occurred while deleting the backup');
            }
          },
        },
      ]
    );
  };

  const handleVerify = async (backupId: string) => {
    try {
      const result = await RestoreService.verifyBackupFile(backupId);

      if (result.isValid) {
        Alert.alert('Verification Success', 'Backup is valid and can be restored.');
      } else {
        Alert.alert(
          'Verification Failed',
          `Backup verification failed:\n${result.errors.join('\n')}`
        );
      }
    } catch (error) {
      console.error('Verify error:', error);
      Alert.alert('Error', 'Failed to verify backup');
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'failed':
        return '#F44336';
      case 'in_progress':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const renderItem = ({ item }: { item: BackupHistoryItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.itemHeaderLeft}>
          <Text style={styles.itemDate}>{formatDate(item.timestamp)}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.type}</Text>
            </View>
            {item.encrypted && (
              <View style={[styles.badge, styles.encryptedBadge]}>
                <Text style={styles.badgeText}>🔒 Encrypted</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.itemSize}>{formatSize(item.size)}</Text>
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemProvider}>Provider: {item.cloudProvider}</Text>
        {item.error && <Text style={styles.itemError}>Error: {item.error}</Text>}
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.restoreButton]}
          onPress={() => handleRestore(item.id)}
          disabled={item.status !== 'completed' || restoring === item.id}
        >
          {restoring === item.id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>Restore</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.verifyButton]}
          onPress={() => handleVerify(item.id)}
          disabled={item.status !== 'completed'}
        >
          <Text style={styles.actionButtonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Backup History</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading backup history...</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No backups found</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemHeaderLeft: {
    flex: 1,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  encryptedBadge: {
    backgroundColor: '#FFD700',
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  itemSize: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  itemDetails: {
    marginBottom: 12,
  },
  itemProvider: {
    fontSize: 14,
    color: '#666',
  },
  itemError: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreButton: {
    backgroundColor: '#4CAF50',
  },
  verifyButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
