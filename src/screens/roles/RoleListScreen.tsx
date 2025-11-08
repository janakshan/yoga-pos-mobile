/**
 * Role List Screen
 * Main role management screen with search, filters, and CRUD operations
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

import {useTheme} from '@hooks/useTheme';
import {usePermission} from '@hooks/useRBAC';
import {Permission, Role} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column, Spacer} from '@components/layout';
import {RoleCard} from '@components/roles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import hooks (to be created)
import {useRoles, useDeleteRole, useRoleAnalytics} from '@hooks/queries/useRoles';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

// Define navigation type
type RoleManagementNavigationProp = NativeStackNavigationProp<any>;

export const RoleListScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<RoleManagementNavigationProp>();

  // Permissions - using USER permissions as placeholder (should have ROLE permissions)
  const canView = usePermission(Permission.USER_VIEW);
  const canCreate = usePermission(Permission.USER_CREATE);
  const canDelete = usePermission(Permission.USER_DELETE);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'system' | 'custom'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {
    data: rolesData,
    isLoading,
    refetch,
  } = useRoles({
    search: searchQuery || undefined,
    isSystemRole: filterType === 'system' ? true : filterType === 'custom' ? false : undefined,
    isCustom: filterType === 'custom' ? true : undefined,
  });

  const {data: analytics} = useRoleAnalytics();
  const deleteRoleMutation = useDeleteRole();

  const roles = rolesData?.data || [];

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreate = () => {
    navigation.navigate('RoleForm', {mode: 'create'});
  };

  const handleViewDetails = (roleId: string) => {
    navigation.navigate('RoleDetails', {roleId});
  };

  const handleEdit = (roleId: string) => {
    navigation.navigate('RoleForm', {mode: 'edit', roleId});
  };

  const handleDelete = (role: Role) => {
    if (role.isSystemRole) {
      Alert.alert('Cannot Delete', 'System roles cannot be deleted.');
      return;
    }

    if ((role.userCount || 0) > 0) {
      Alert.alert(
        'Cannot Delete',
        `This role is assigned to ${role.userCount} user(s). Please reassign these users before deleting the role.`,
      );
      return;
    }

    Alert.alert(
      'Delete Role',
      `Are you sure you want to delete "${role.name}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRoleMutation.mutateAsync(role.id);
              Alert.alert('Success', 'Role deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete role');
            }
          },
        },
      ],
    );
  };

  const handleTemplates = () => {
    navigation.navigate('RoleTemplates');
  };

  // Permission check
  if (!canView) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.errorContainer}>
          <Icon
            name="lock-outline"
            size={64}
            color={theme.colors.text.tertiary}
          />
          <Spacer size="md" />
          <Typography variant="h5" color={theme.colors.text.secondary}>
            Access Denied
          </Typography>
          <Spacer size="sm" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            You don't have permission to view roles
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Analytics Cards */}
      {analytics && (
        <View style={styles.analyticsContainer}>
          <Card variant="filled" padding="md" style={styles.analyticsCard}>
            <View style={styles.analyticsContent}>
              <Icon
                name="shield-account"
                size={32}
                color={theme.colors.primary[500]}
              />
              <View style={styles.analyticsText}>
                <Typography
                  variant="h3"
                  weight="bold"
                  color={theme.colors.text.primary}>
                  {analytics.totalRoles}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}>
                  Total Roles
                </Typography>
              </View>
            </View>
          </Card>

          <Card variant="filled" padding="md" style={styles.analyticsCard}>
            <View style={styles.analyticsContent}>
              <Icon
                name="shield-crown"
                size={32}
                color={theme.colors.info[500]}
              />
              <View style={styles.analyticsText}>
                <Typography
                  variant="h3"
                  weight="bold"
                  color={theme.colors.text.primary}>
                  {analytics.systemRoles}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}>
                  System Roles
                </Typography>
              </View>
            </View>
          </Card>

          <Card variant="filled" padding="md" style={styles.analyticsCard}>
            <View style={styles.analyticsContent}>
              <Icon
                name="account-cog"
                size={32}
                color={theme.colors.success[500]}
              />
              <View style={styles.analyticsText}>
                <Typography
                  variant="h3"
                  weight="bold"
                  color={theme.colors.text.primary}>
                  {analytics.customRoles}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}>
                  Custom Roles
                </Typography>
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search roles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="magnify"
          clearable
          onClear={() => setSearchQuery('')}
          containerStyle={styles.searchInput}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filterType === 'all' && {
              backgroundColor: theme.colors.primary[100],
              borderColor: theme.colors.primary[500],
            },
          ]}
          onPress={() => setFilterType('all')}>
          <Typography
            variant="bodySmall"
            weight="medium"
            color={
              filterType === 'all'
                ? theme.colors.primary[700]
                : theme.colors.text.secondary
            }>
            All Roles
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filterType === 'system' && {
              backgroundColor: theme.colors.info[100],
              borderColor: theme.colors.info[500],
            },
          ]}
          onPress={() => setFilterType('system')}>
          <Typography
            variant="bodySmall"
            weight="medium"
            color={
              filterType === 'system'
                ? theme.colors.info[700]
                : theme.colors.text.secondary
            }>
            System
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filterType === 'custom' && {
              backgroundColor: theme.colors.success[100],
              borderColor: theme.colors.success[500],
            },
          ]}
          onPress={() => setFilterType('custom')}>
          <Typography
            variant="bodySmall"
            weight="medium"
            color={
              filterType === 'custom'
                ? theme.colors.success[700]
                : theme.colors.text.secondary
            }>
            Custom
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {canCreate && (
          <Button
            variant="primary"
            onPress={handleCreate}
            leftIcon="plus"
            style={styles.createButton}>
            Create Role
          </Button>
        )}
        <Button
          variant="outline"
          onPress={handleTemplates}
          leftIcon="folder-star"
          style={styles.templatesButton}>
          Templates
        </Button>
      </View>
    </View>
  );

  const renderRoleItem = ({item}: {item: Role}) => (
    <RoleCard
      role={item}
      onPress={() => handleViewDetails(item.id)}
      showUserCount
      showPermissionCount
      showDescription
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="shield-account-outline"
        size={80}
        color={theme.colors.text.tertiary}
      />
      <Spacer size="md" />
      <Typography variant="h5" color={theme.colors.text.secondary}>
        {searchQuery ? 'No Roles Found' : 'No Roles Yet'}
      </Typography>
      <Spacer size="sm" />
      <Typography
        variant="body"
        color={theme.colors.text.tertiary}
        style={styles.emptyText}>
        {searchQuery
          ? 'Try adjusting your search or filters'
          : 'Create your first role to get started'}
      </Typography>
      {!searchQuery && canCreate && (
        <>
          <Spacer size="lg" />
          <Button variant="primary" onPress={handleCreate} leftIcon="plus">
            Create First Role
          </Button>
        </>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.default},
      ]}>
      <FlatList
        data={roles}
        renderItem={renderRoleItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          roles.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  analyticsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  analyticsCard: {
    flex: 1,
  },
  analyticsContent: {
    alignItems: 'center',
    gap: 8,
  },
  analyticsText: {
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  createButton: {
    flex: 1,
  },
  templatesButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: 'center',
  },
});
