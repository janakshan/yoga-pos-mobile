/**
 * Customer List Screen
 * Main customer management screen with search, filters, and CRUD operations
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
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {CustomersStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  useCustomers,
  useDeleteCustomer,
  useCustomerSegments,
} from '@hooks/queries/useCustomers';
import {usePermission} from '@hooks/useRBAC';
import {Permission, Customer} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

export const CustomerListScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<CustomersStackParamList>>();

  // Permissions
  const canView = usePermission(Permission.CUSTOMER_VIEW);
  const canCreate = usePermission(Permission.CUSTOMER_CREATE);
  const canUpdate = usePermission(Permission.CUSTOMER_UPDATE);
  const canDelete = usePermission(Permission.CUSTOMER_DELETE);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {
    data: customersData,
    isLoading,
    refetch,
  } = useCustomers({
    search: searchQuery || undefined,
    customerType: selectedType || undefined,
    status: selectedStatus || undefined,
  });

  const {data: segments} = useCustomerSegments();
  const deleteCustomerMutation = useDeleteCustomer();

  const customers = customersData?.data || [];

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreate = () => {
    navigation.navigate('CustomerForm', {mode: 'create'});
  };

  const handleViewDetails = (customerId: string) => {
    navigation.navigate('CustomerDetails', {customerId});
  };

  const handleEdit = (customerId: string) => {
    navigation.navigate('CustomerForm', {mode: 'edit', customerId});
  };

  const handleDelete = (customer: Customer) => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete "${customer.firstName} ${customer.lastName}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomerMutation.mutateAsync(customer.id);
              Alert.alert('Success', 'Customer deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete customer');
            }
          },
        },
      ],
    );
  };

  const handleScanQR = () => {
    navigation.navigate('CustomerQRScan');
  };

  // Permission check
  if (!canView) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.errorContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            You don't have permission to view customers
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const renderCustomerCard = ({item}: {item: Customer}) => (
    <Card style={styles.customerCard}>
      <TouchableOpacity
        onPress={() => handleViewDetails(item.id)}
        activeOpacity={0.7}>
        <Column spacing="sm">
          {/* Customer Name and Type Badge */}
          <Row justify="space-between" align="center">
            <Typography variant="h4" style={styles.customerName}>
              {item.firstName} {item.lastName}
            </Typography>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.customerType === 'vip'
                      ? theme.warning + '20'
                      : item.customerType === 'corporate'
                      ? theme.primary + '20'
                      : theme.textSecondary + '20',
                },
              ]}>
              <Typography
                variant="caption"
                style={[
                  styles.badgeText,
                  {
                    color:
                      item.customerType === 'vip'
                        ? theme.warning
                        : item.customerType === 'corporate'
                        ? theme.primary
                        : theme.textSecondary,
                  },
                ]}>
                {item.customerType.toUpperCase()}
              </Typography>
            </View>
          </Row>

          {/* Contact Info */}
          <Typography variant="body" color={theme.textSecondary}>
            {item.email}
          </Typography>
          <Typography variant="body" color={theme.textSecondary}>
            {item.phone}
          </Typography>

          {/* Stats */}
          {item.stats && (
            <Row justify="space-between" style={styles.statsRow}>
              <Column spacing="xs">
                <Typography variant="caption" color={theme.textSecondary}>
                  Total Purchases
                </Typography>
                <Typography variant="h4" color={theme.primary}>
                  {item.stats.totalPurchases || 0}
                </Typography>
              </Column>
              <Column spacing="xs">
                <Typography variant="caption" color={theme.textSecondary}>
                  Total Spent
                </Typography>
                <Typography variant="h4" color={theme.success}>
                  ${item.stats.totalSpent?.toFixed(2) || '0.00'}
                </Typography>
              </Column>
              {item.loyaltyInfo && (
                <Column spacing="xs">
                  <Typography variant="caption" color={theme.textSecondary}>
                    Loyalty Points
                  </Typography>
                  <Typography variant="h4" color={theme.warning}>
                    {item.loyaltyInfo.points || 0}
                  </Typography>
                </Column>
              )}
            </Row>
          )}

          {/* Actions */}
          {(canUpdate || canDelete) && (
            <Row spacing="sm" style={styles.actionRow}>
              {canUpdate && (
                <Button
                  title="Edit"
                  variant="outline"
                  size="sm"
                  onPress={() => handleEdit(item.id)}
                  style={styles.actionButton}
                />
              )}
              {canDelete && (
                <Button
                  title="Delete"
                  variant="danger"
                  size="sm"
                  onPress={() => handleDelete(item)}
                  style={styles.actionButton}
                />
              )}
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
        <Typography variant="h2">Customers</Typography>
        <Row spacing="sm">
          <Button
            title="Scan QR"
            variant="outline"
            size="sm"
            onPress={handleScanQR}
          />
          {canCreate && (
            <Button title="Add Customer" onPress={handleCreate} size="sm" />
          )}
        </Row>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <Row spacing="sm" style={styles.filterRow}>
          {/* Customer Type Filter */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedType === '' ? theme.primary : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedType('')}>
            <Typography
              variant="caption"
              color={selectedType === '' ? '#fff' : theme.text}>
              All
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedType === 'vip' ? theme.primary : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedType('vip')}>
            <Typography
              variant="caption"
              color={selectedType === 'vip' ? '#fff' : theme.text}>
              VIP
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedType === 'regular' ? theme.primary : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedType('regular')}>
            <Typography
              variant="caption"
              color={selectedType === 'regular' ? '#fff' : theme.text}>
              Regular
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedType === 'corporate' ? theme.primary : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedType('corporate')}>
            <Typography
              variant="caption"
              color={selectedType === 'corporate' ? '#fff' : theme.text}>
              Corporate
            </Typography>
          </TouchableOpacity>
        </Row>

        <Row spacing="sm" style={styles.filterRow}>
          {/* Status Filter */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedStatus === 'active' ? theme.success : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedStatus('active')}>
            <Typography
              variant="caption"
              color={selectedStatus === 'active' ? '#fff' : theme.text}>
              Active
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedStatus === 'inactive' ? theme.warning : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedStatus('inactive')}>
            <Typography
              variant="caption"
              color={selectedStatus === 'inactive' ? '#fff' : theme.text}>
              Inactive
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedStatus === 'blocked' ? theme.error : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedStatus('blocked')}>
            <Typography
              variant="caption"
              color={selectedStatus === 'blocked' ? '#fff' : theme.text}>
              Blocked
            </Typography>
          </TouchableOpacity>
        </Row>
      </View>

      {/* Customer List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : customers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            No customers found
          </Typography>
          {canCreate && (
            <Button
              title="Add First Customer"
              onPress={handleCreate}
              style={styles.emptyButton}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={customers}
          renderItem={renderCustomerCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
        />
      )}
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
    paddingTop: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  customerCard: {
    marginBottom: 16,
  },
  customerName: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontWeight: '600',
  },
  statsRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionRow: {
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyButton: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
