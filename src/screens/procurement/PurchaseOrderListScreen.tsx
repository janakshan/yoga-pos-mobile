/**
 * Purchase Order List Screen
 * Main PO management screen with search, filters, and CRUD operations
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ProcurementStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  usePurchaseOrders,
  useDeletePurchaseOrder,
} from '@hooks/queries/useProcurement';
import {usePermission} from '@hooks/useRBAC';
import {Permission, PurchaseOrder, PurchaseOrderStatus} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

export const PurchaseOrderListScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ProcurementStackParamList>>();

  // Permissions
  const canView = usePermission(Permission.PROCUREMENT_VIEW);
  const canCreate = usePermission(Permission.PROCUREMENT_CREATE);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PurchaseOrderStatus | ''>('');
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {
    data: purchaseOrdersData,
    isLoading,
    refetch,
  } = usePurchaseOrders({
    searchTerm: searchQuery || undefined,
    status: selectedStatus || undefined,
  });

  const deletePOMutation = useDeletePurchaseOrder();

  const purchaseOrders = purchaseOrdersData?.data || [];

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreate = () => {
    navigation.navigate('PurchaseOrderForm', {mode: 'create'});
  };

  const handleViewDetails = (purchaseOrderId: string) => {
    navigation.navigate('PurchaseOrderDetails', {purchaseOrderId});
  };

  const handleEdit = (purchaseOrderId: string) => {
    navigation.navigate('PurchaseOrderForm', {mode: 'edit', purchaseOrderId});
  };

  const handleDelete = (po: PurchaseOrder) => {
    if (po.status !== PurchaseOrderStatus.DRAFT) {
      Alert.alert('Error', 'Only draft purchase orders can be deleted');
      return;
    }

    Alert.alert(
      'Delete Purchase Order',
      `Are you sure you want to delete PO ${po.poNumber}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePOMutation.mutateAsync(po.id);
              Alert.alert('Success', 'Purchase order deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete purchase order');
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
            You don't have permission to view purchase orders
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.DRAFT:
        return theme.textSecondary;
      case PurchaseOrderStatus.SENT:
        return theme.primary;
      case PurchaseOrderStatus.CONFIRMED:
        return theme.info;
      case PurchaseOrderStatus.PARTIALLY_RECEIVED:
        return theme.warning;
      case PurchaseOrderStatus.RECEIVED:
        return theme.success;
      case PurchaseOrderStatus.CANCELLED:
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const renderPOCard = ({item}: {item: PurchaseOrder}) => (
    <Card style={styles.poCard}>
      <TouchableOpacity
        onPress={() => handleViewDetails(item.id)}
        activeOpacity={0.7}>
        <Column spacing="sm">
          {/* PO Number and Status */}
          <Row justify="space-between" align="center">
            <Typography variant="h4" style={styles.poNumber}>
              {item.poNumber}
            </Typography>
            <View
              style={[
                styles.badge,
                {backgroundColor: getStatusColor(item.status) + '20'},
              ]}>
              <Typography variant="caption" color={getStatusColor(item.status)}>
                {item.status.toUpperCase().replace('_', ' ')}
              </Typography>
            </View>
          </Row>

          {/* Supplier */}
          <Row align="center" spacing="xs">
            <Typography variant="caption" color={theme.textSecondary}>
              Supplier:
            </Typography>
            <Typography variant="body">{item.supplier?.name || 'Unknown'}</Typography>
          </Row>

          {/* Location */}
          <Row align="center" spacing="xs">
            <Typography variant="caption" color={theme.textSecondary}>
              Location:
            </Typography>
            <Typography variant="body">{item.location?.name || 'Unknown'}</Typography>
          </Row>

          {/* Date */}
          <Row align="center" spacing="xs">
            <Typography variant="caption" color={theme.textSecondary}>
              Created:
            </Typography>
            <Typography variant="body">
              {new Date(item.createdAt).toLocaleDateString()}
            </Typography>
          </Row>

          {/* Expected Delivery */}
          {item.expectedDeliveryDate && (
            <Row align="center" spacing="xs">
              <Typography variant="caption" color={theme.textSecondary}>
                Expected Delivery:
              </Typography>
              <Typography variant="body">
                {new Date(item.expectedDeliveryDate).toLocaleDateString()}
              </Typography>
            </Row>
          )}

          {/* Total */}
          <Row justify="space-between" align="center" style={styles.totalRow}>
            <Typography variant="caption" color={theme.textSecondary}>
              Total Amount:
            </Typography>
            <Typography variant="h3" color={theme.primary}>
              {item.currency} {item.total.toFixed(2)}
            </Typography>
          </Row>

          {/* Items Summary */}
          <Row align="center" spacing="xs">
            <Typography variant="caption" color={theme.textSecondary}>
              Items: {item.items?.length || 0}
            </Typography>
            {item.status === PurchaseOrderStatus.PARTIALLY_RECEIVED && (
              <Typography variant="caption" color={theme.warning}>
                • Partially Received
              </Typography>
            )}
          </Row>

          {/* Action Buttons */}
          {canCreate && item.status === PurchaseOrderStatus.DRAFT && (
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
        <Typography variant="h2">Purchase Orders</Typography>
        {canCreate && (
          <Button onPress={handleCreate} size="sm">
            + New PO
          </Button>
        )}
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Input
          placeholder="Search purchase orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <Row spacing="xs" style={styles.filterButtons}>
          {['', PurchaseOrderStatus.DRAFT, PurchaseOrderStatus.SENT, PurchaseOrderStatus.RECEIVED].map(
            status => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setSelectedStatus(status as any)}
                style={styles.filterButton}>
                {status ? status.replace('_', ' ') : 'All'}
              </Button>
            ),
          )}
        </Row>
      </View>

      {/* PO List */}
      <FlatList
        data={purchaseOrders}
        keyExtractor={item => item.id}
        renderItem={renderPOCard}
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
              {isLoading ? 'Loading purchase orders...' : 'No purchase orders found'}
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
  poCard: {
    marginBottom: 12,
    padding: 16,
  },
  poNumber: {
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalRow: {
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
