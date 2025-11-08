/**
 * User List Screen
 * Main user management screen with search, filters, and CRUD operations
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
import {
  useUsers,
  useDeleteUser,
  useUserAnalytics,
} from '@hooks/queries/useUsers';
import {usePermission} from '@hooks/useRBAC';
import {Permission, User, UserRole} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column, Spacer} from '@components/layout';
import {UserCard} from '@components/users';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

// Define navigation type
type UserManagementNavigationProp = NativeStackNavigationProp<any>;

export const UserListScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<UserManagementNavigationProp>();

  // Permissions
  const canView = usePermission(Permission.USER_VIEW);
  const canCreate = usePermission(Permission.USER_CREATE);
  const canUpdate = usePermission(Permission.USER_UPDATE);
  const canDelete = usePermission(Permission.USER_DELETE);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useUsers({
    search: searchQuery || undefined,
    role: selectedRole ? (selectedRole as UserRole) : undefined,
    status: selectedStatus
      ? (selectedStatus as 'active' | 'inactive' | 'suspended')
      : undefined,
  });

  const {data: analytics} = useUserAnalytics();
  const deleteUserMutation = useDeleteUser();

  const users = usersData?.data || [];

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreate = () => {
    navigation.navigate('UserForm', {mode: 'create'});
  };

  const handleViewDetails = (userId: string) => {
    navigation.navigate('UserDetails', {userId});
  };

  const handleEdit = (userId: string) => {
    navigation.navigate('UserForm', {mode: 'edit', userId});
  };

  const handleDelete = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserMutation.mutateAsync(user.id);
              Alert.alert('Success', 'User deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete user');
            }
          },
        },
      ],
    );
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
            You don't have permission to view users
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
                name="account-group"
                size={32}
                color={theme.colors.primary[500]}
              />
              <View style={styles.analyticsText}>
                <Typography
                  variant="h3"
                  weight="bold"
                  color={theme.colors.text.primary}>
                  {analytics.totalUsers}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}>
                  Total Users
                </Typography>
              </View>
            </View>
          </Card>

          <Card variant="filled" padding="md" style={styles.analyticsCard}>
            <View style={styles.analyticsContent}>
              <Icon
                name="check-circle"
                size={32}
                color={theme.colors.success[500]}
              />
              <View style={styles.analyticsText}>
                <Typography
                  variant="h3"
                  weight="bold"
                  color={theme.colors.text.primary}>
                  {analytics.activeUsers}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}>
                  Active Users
                </Typography>
              </View>
            </View>
          </Card>

          <Card variant="filled" padding="md" style={styles.analyticsCard}>
            <View style={styles.analyticsContent}>
              <Icon
                name="account-plus"
                size={32}
                color={theme.colors.info[500]}
              />
              <View style={styles.analyticsText}>
                <Typography
                  variant="h3"
                  weight="bold"
                  color={theme.colors.text.primary}>
                  {analytics.newUsersThisMonth}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}>
                  New This Month
                </Typography>
              </View>
            </View>
          </Card>
        </View>
      )}

      <Spacer size="md" />

      {/* Search and Filters */}
      <Input
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Icon name="magnify" size={20} />}
        rightIcon={
          searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon
                name="close-circle"
                size={20}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <Spacer size="sm" />

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <Typography
          variant="bodySmall"
          color={theme.colors.text.secondary}
          style={styles.filterLabel}>
          Status:
        </Typography>
        <View style={styles.chipContainer}>
          {['all', 'active', 'inactive', 'suspended'].map(status => (
            <TouchableOpacity
              key={status}
              onPress={() =>
                setSelectedStatus(status === 'all' ? '' : status)
              }
              style={[
                styles.chip,
                {
                  backgroundColor:
                    selectedStatus === status || (status === 'all' && !selectedStatus)
                      ? theme.colors.primary[500]
                      : theme.colors.background.secondary,
                  borderColor:
                    selectedStatus === status || (status === 'all' && !selectedStatus)
                      ? theme.colors.primary[500]
                      : theme.colors.border.light,
                },
              ]}>
              <Typography
                variant="bodySmall"
                weight="medium"
                color={
                  selectedStatus === status || (status === 'all' && !selectedStatus)
                    ? '#fff'
                    : theme.colors.text.secondary
                }>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Spacer size="sm" />

      <View style={styles.filtersContainer}>
        <Typography
          variant="bodySmall"
          color={theme.colors.text.secondary}
          style={styles.filterLabel}>
          Role:
        </Typography>
        <View style={styles.chipContainer}>
          {['all', 'admin', 'manager', 'cashier', 'waiter'].map(role => (
            <TouchableOpacity
              key={role}
              onPress={() => setSelectedRole(role === 'all' ? '' : role)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    selectedRole === role || (role === 'all' && !selectedRole)
                      ? theme.colors.primary[500]
                      : theme.colors.background.secondary,
                  borderColor:
                    selectedRole === role || (role === 'all' && !selectedRole)
                      ? theme.colors.primary[500]
                      : theme.colors.border.light,
                },
              ]}>
              <Typography
                variant="bodySmall"
                weight="medium"
                color={
                  selectedRole === role || (role === 'all' && !selectedRole)
                    ? '#fff'
                    : theme.colors.text.secondary
                }>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Spacer size="md" />

      {/* Results Count */}
      <Row justify="space-between" align="center">
        <Typography variant="bodyMedium" color={theme.colors.text.secondary}>
          {users.length} {users.length === 1 ? 'user' : 'users'} found
        </Typography>

        {canCreate && (
          <Button
            variant="primary"
            size="md"
            onPress={handleCreate}
            leftIcon={<Icon name="account-plus" size={20} color="#fff" />}>
            Add User
          </Button>
        )}
      </Row>

      <Spacer size="md" />
    </View>
  );

  const renderUserItem = ({item}: {item: User}) => (
    <View style={styles.userItem}>
      <UserCard
        user={item}
        onPress={() => handleViewDetails(item.id)}
        showBranch
        showRole
        showStatus
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="account-search"
        size={80}
        color={theme.colors.text.tertiary}
      />
      <Spacer size="md" />
      <Typography variant="h5" color={theme.colors.text.secondary}>
        No Users Found
      </Typography>
      <Spacer size="sm" />
      <Typography
        variant="body"
        color={theme.colors.text.tertiary}
        style={styles.emptyText}>
        {searchQuery
          ? 'Try adjusting your search or filters'
          : 'Get started by creating your first user'}
      </Typography>
      <Spacer size="lg" />
      {canCreate && !searchQuery && (
        <Button
          variant="primary"
          size="lg"
          onPress={handleCreate}
          leftIcon={<Icon name="account-plus" size={20} color="#fff" />}>
          Create User
        </Button>
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
          <ActivityIndicator
            size="large"
            color={theme.colors.primary[500]}
          />
          <Spacer size="md" />
          <Typography variant="body" color={theme.colors.text.secondary}>
            Loading users...
          </Typography>
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
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
          />
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  analyticsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
  },
  analyticsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analyticsText: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: 8,
    minWidth: 50,
  },
  chipContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  userItem: {
    paddingHorizontal: 16,
    marginBottom: 12,
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
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyText: {
    textAlign: 'center',
  },
});
