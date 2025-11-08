/**
 * Supplier List Screen
 * Main supplier management screen with search, filters, and CRUD operations
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ProcurementStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  useSuppliers,
  useDeleteSupplier,
} from '@hooks/queries/useProcurement';
import {usePermission} from '@hooks/useRBAC';
import {Permission, Supplier} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

export const SupplierListScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ProcurementStackParamList>>();

  // Permissions
  const canView = usePermission(Permission.SUPPLIER_VIEW);
  const canManage = usePermission(Permission.SUPPLIER_MANAGE);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {
    data: suppliersData,
    isLoading,
    refetch,
  } = useSuppliers({
    searchTerm: searchQuery || undefined,
    status: selectedStatus as any,
  });

  const deleteSupplierMutation = useDeleteSupplier();

  const suppliers = suppliersData?.data || [];

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreate = () => {
    navigation.navigate('SupplierForm', {mode: 'create'});
  };

  const handleViewDetails = (supplierId: string) => {
    navigation.navigate('SupplierDetails', {supplierId});
  };

  const handleEdit = (supplierId: string) => {
    navigation.navigate('SupplierForm', {mode: 'edit', supplierId});
  };

  const handleDelete = (supplier: Supplier) => {
    Alert.alert(
      'Delete Supplier',
      `Are you sure you want to delete "${supplier.name}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSupplierMutation.mutateAsync(supplier.id);
              Alert.alert('Success', 'Supplier deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete supplier');
            }
          },
        },
      ],
    );
  };

  // Permission check
  if (!canView) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.errorContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            You don't have permission to view suppliers
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const renderSupplierCard = ({item}: {item: Supplier}) => (
    <Card style={styles.supplierCard}>
      <TouchableOpacity
        onPress={() => handleViewDetails(item.id)}
        activeOpacity={0.7}>
        <Column spacing="sm">
          {/* Supplier Name and Status Badge */}
          <Row justify="space-between" align="center">
            <Typography variant="h4" style={styles.supplierName}>
              {item.name}
            </Typography>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.status === 'active'
                      ? theme.success + '20'
                      : item.status === 'blacklisted'
                      ? theme.error + '20'
                      : theme.textSecondary + '20',
                },
              ]}>
              <Typography
                variant="caption"
                color={
                  item.status === 'active'
                    ? theme.success
                    : item.status === 'blacklisted'
                    ? theme.error
                    : theme.textSecondary
                }>
                {item.status.toUpperCase()}
              </Typography>
            </View>
          </Row>

          {/* Supplier Code */}
          <Row align="center" spacing="xs">
            <Typography variant="caption" color={theme.textSecondary}>
              Code:
            </Typography>
            <Typography variant="body">{item.code}</Typography>
          </Row>

          {/* Contact Info */}
          <Row align="center" spacing="xs">
            <Typography variant="caption" color={theme.textSecondary}>
              Contact:
            </Typography>
            <Typography variant="body">{item.contactPerson || 'N/A'}</Typography>
          </Row>

          <Row align="center" spacing="xs">
            <Typography variant="caption" color={theme.textSecondary}>
              Email:
            </Typography>
            <Typography variant="body">{item.email}</Typography>
          </Row>

          <Row align="center" spacing="xs">
            <Typography variant="caption" color={theme.textSecondary}>
              Phone:
            </Typography>
            <Typography variant="body">{item.phone}</Typography>
          </Row>

          {/* Rating */}
          {item.rating && (
            <Row align="center" spacing="xs">
              <Typography variant="caption" color={theme.textSecondary}>
                Rating:
              </Typography>
              <Typography variant="body">
                {'⭐'.repeat(Math.round(item.rating))} ({item.rating.toFixed(1)})
              </Typography>
            </Row>
          )}

          {/* Performance Metrics */}
          {item.performance && (
            <Row spacing="md" style={styles.metricsRow}>
              <Column align="center" flex={1}>
                <Typography variant="caption" color={theme.textSecondary}>
                  Total Orders
                </Typography>
                <Typography variant="h4" color={theme.primary}>
                  {item.performance.totalOrders}
                </Typography>
              </Column>
              <Column align="center" flex={1}>
                <Typography variant="caption" color={theme.textSecondary}>
                  On-Time Delivery
                </Typography>
                <Typography variant="h4" color={theme.success}>
                  {item.performance.onTimeDeliveryRate}%
                </Typography>
              </Column>
              <Column align="center" flex={1}>
                <Typography variant="caption" color={theme.textSecondary}>
                  Quality
                </Typography>
                <Typography variant="h4" color={theme.warning}>
                  {item.performance.qualityRating}/5
                </Typography>
              </Column>
            </Row>
          )}

          {/* Action Buttons */}
          {canManage && (
            <Row spacing="sm" style={styles.actionsRow}>
              <Button
                variant="secondary"
                size="sm"
                onPress={() => handleEdit(item.id)}
                style={styles.actionButton}>
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onPress={() => handleDelete(item)}
                style={styles.actionButton}>
                Delete
              </Button>
            </Row>
          )}
        </Column>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2">Suppliers</Typography>
        {canManage && (
          <Button onPress={handleCreate} size="sm">
            + Add Supplier
          </Button>
        )}
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Input
          placeholder="Search suppliers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <Row spacing="sm" style={styles.filterButtons}>
          {['active', 'inactive', 'blacklisted', ''].map(status => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setSelectedStatus(status)}
              style={styles.filterButton}>
              {status || 'All'}
            </Button>
          ))}
        </Row>
      </View>

      {/* Suppliers List */}
      <FlatList
        data={suppliers}
        keyExtractor={item => item.id}
        renderItem={renderSupplierCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body" color={theme.textSecondary}>
              {isLoading ? 'Loading suppliers...' : 'No suppliers found'}
            </Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchInput: {
    marginBottom: 8,
  },
  filterButtons: {
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  supplierCard: {
    marginBottom: 12,
    padding: 16,
  },
  supplierName: {
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricsRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
