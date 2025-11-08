/**
 * Branch List Screen
 * Main branch management screen with search, filters, and CRUD operations
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
import type {BranchesStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  useBranches,
  useDeleteBranch,
  useToggleBranchStatus,
} from '@hooks/queries/useBranches';
import {usePermission} from '@hooks/useRBAC';
import {Permission, Branch} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

export const BranchListScreen = () => {
  const {theme} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<BranchesStackParamList>>();

  // Permissions
  const canView = usePermission(Permission.SETTINGS_VIEW);
  const canManage = usePermission(Permission.SETTINGS_MANAGE);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {
    data: branchesData,
    isLoading,
    refetch,
  } = useBranches({
    search: searchQuery || undefined,
    status: (selectedStatus as any) || undefined,
  });

  const deleteBranchMutation = useDeleteBranch();
  const toggleStatusMutation = useToggleBranchStatus();

  const branches = branchesData?.data || [];

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreate = () => {
    navigation.navigate('BranchForm', {mode: 'create'});
  };

  const handleViewDetails = (branchId: string) => {
    navigation.navigate('BranchDetails', {branchId});
  };

  const handleEdit = (branchId: string) => {
    navigation.navigate('BranchForm', {mode: 'edit', branchId});
  };

  const handleViewDashboard = (branchId: string) => {
    navigation.navigate('BranchDashboard', {branchId});
  };

  const handleToggleStatus = async (branch: Branch) => {
    try {
      await toggleStatusMutation.mutateAsync({
        branchId: branch.id,
        isActive: !branch.isActive,
      });
      Alert.alert(
        'Success',
        `Branch ${branch.isActive ? 'deactivated' : 'activated'} successfully`,
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update branch status');
    }
  };

  const handleDelete = (branch: Branch) => {
    Alert.alert(
      'Delete Branch',
      `Are you sure you want to delete "${branch.name}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBranchMutation.mutateAsync(branch.id);
              Alert.alert('Success', 'Branch deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete branch');
            }
          },
        },
      ],
    );
  };

  const handleCompareBranches = () => {
    navigation.navigate('BranchComparison');
  };

  // Permission check
  if (!canView) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <View style={styles.errorContainer}>
          <Typography variant="body" color="secondary">
            You don't have permission to view branches
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const formatCurrency = (value?: number) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderBranchCard = ({item}: {item: Branch}) => (
    <Card style={styles.branchCard}>
      <TouchableOpacity
        onPress={() => handleViewDetails(item.id)}
        activeOpacity={0.7}>
        <Column spacing="sm">
          {/* Branch Name and Status */}
          <Row justify="space-between" align="center">
            <Typography variant="h4" style={styles.branchName}>
              {item.name}
            </Typography>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: item.isActive
                    ? theme.colors.success + '20'
                    : theme.colors.error + '20',
                },
              ]}>
              <Typography
                variant="caption"
                style={{
                  color: item.isActive
                    ? theme.colors.success
                    : theme.colors.error,
                  fontWeight: '600',
                }}>
                {item.isActive ? 'Active' : 'Inactive'}
              </Typography>
            </View>
          </Row>

          {/* Branch Code */}
          <Row align="center" spacing="xs">
            <Icon
              name="identifier"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Typography variant="caption" color="secondary">
              {item.code}
            </Typography>
          </Row>

          {/* Location */}
          <Row align="center" spacing="xs">
            <Icon
              name="map-marker"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Typography variant="caption" color="secondary" numberOfLines={1}>
              {item.city}, {item.state}
            </Typography>
          </Row>

          {/* Contact */}
          <Row align="center" spacing="xs">
            <Icon name="phone" size={16} color={theme.colors.text.secondary} />
            <Typography variant="caption" color="secondary">
              {item.phone}
            </Typography>
          </Row>

          {/* Manager */}
          {item.managerName && (
            <Row align="center" spacing="xs">
              <Icon
                name="account-tie"
                size={16}
                color={theme.colors.text.secondary}
              />
              <Typography variant="caption" color="secondary">
                {item.managerName}
              </Typography>
            </Row>
          )}

          {/* Stats */}
          <Row spacing="md" style={styles.statsRow}>
            <View style={styles.statItem}>
              <Typography variant="caption" color="secondary">
                Staff
              </Typography>
              <Typography variant="bodyBold">
                {item.staffCount || 0}
              </Typography>
            </View>
            <View style={styles.statItem}>
              <Typography variant="caption" color="secondary">
                Monthly Revenue
              </Typography>
              <Typography variant="bodyBold">
                {formatCurrency(item.monthlyRevenue)}
              </Typography>
            </View>
            <View style={styles.statItem}>
              <Typography variant="caption" color="secondary">
                Transactions
              </Typography>
              <Typography variant="bodyBold">
                {item.transactionCount || 0}
              </Typography>
            </View>
          </Row>

          {/* Actions */}
          {canManage && (
            <Row spacing="sm" style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {backgroundColor: theme.colors.primary[50]},
                ]}
                onPress={() => handleViewDashboard(item.id)}>
                <Icon
                  name="chart-line"
                  size={20}
                  color={theme.colors.primary[500]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {backgroundColor: theme.colors.primary[50]},
                ]}
                onPress={() => handleEdit(item.id)}>
                <Icon
                  name="pencil"
                  size={20}
                  color={theme.colors.primary[500]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: item.isActive
                      ? theme.colors.warning + '20'
                      : theme.colors.success + '20',
                  },
                ]}
                onPress={() => handleToggleStatus(item)}>
                <Icon
                  name={item.isActive ? 'pause' : 'play'}
                  size={20}
                  color={
                    item.isActive
                      ? theme.colors.warning
                      : theme.colors.success
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {backgroundColor: theme.colors.error + '20'},
                ]}
                onPress={() => handleDelete(item)}>
                <Icon name="delete" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </Row>
          )}
        </Column>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2">Branches</Typography>
        {canManage && (
          <Row spacing="sm">
            <Button
              variant="outline"
              size="sm"
              onPress={handleCompareBranches}
              leftIcon={<Icon name="compare" size={20} color={theme.colors.primary[500]} />}>
              Compare
            </Button>
            <Button variant="primary" size="sm" onPress={handleCreate}
              leftIcon={<Icon name="plus" size={20} color={theme.colors.white} />}>
              Add Branch
            </Button>
          </Row>
        )}
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Input
          placeholder="Search branches..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Icon name="magnify" size={20} color={theme.colors.text.tertiary} />}
          style={styles.searchInput}
        />

        {/* Status Filter */}
        <Row spacing="sm" style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedStatus === 'active'
                    ? theme.colors.primary[500]
                    : theme.colors.background.secondary,
              },
            ]}
            onPress={() => setSelectedStatus('active')}>
            <Typography
              variant="caption"
              style={{
                color:
                  selectedStatus === 'active'
                    ? theme.colors.white
                    : theme.colors.text.secondary,
              }}>
              Active
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedStatus === 'inactive'
                    ? theme.colors.primary[500]
                    : theme.colors.background.secondary,
              },
            ]}
            onPress={() => setSelectedStatus('inactive')}>
            <Typography
              variant="caption"
              style={{
                color:
                  selectedStatus === 'inactive'
                    ? theme.colors.white
                    : theme.colors.text.secondary,
              }}>
              Inactive
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedStatus === ''
                    ? theme.colors.primary[500]
                    : theme.colors.background.secondary,
              },
            ]}
            onPress={() => setSelectedStatus('')}>
            <Typography
              variant="caption"
              style={{
                color:
                  selectedStatus === ''
                    ? theme.colors.white
                    : theme.colors.text.secondary,
              }}>
              All
            </Typography>
          </TouchableOpacity>
        </Row>
      </View>

      {/* Branch List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={branches}
          keyExtractor={item => item.id}
          renderItem={renderBranchCard}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary[500]]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon
                name="office-building-off"
                size={64}
                color={theme.colors.text.tertiary}
              />
              <Typography variant="h4" color="secondary">
                No branches found
              </Typography>
              <Typography variant="body" color="secondary" style={styles.emptyText}>
                {canManage
                  ? 'Get started by adding your first branch'
                  : 'No branches match your search criteria'}
              </Typography>
              {canManage && (
                <Button
                  variant="primary"
                  onPress={handleCreate}
                  style={styles.emptyButton}>
                  Add Branch
                </Button>
              )}
            </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    padding: 16,
    paddingTop: 0,
  },
  searchInput: {
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  branchCard: {
    marginBottom: 12,
  },
  branchName: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statsRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
  },
  actionsRow: {
    marginTop: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
  },
});
