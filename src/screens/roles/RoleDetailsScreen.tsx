/**
 * Role Details Screen
 * View role details, statistics, and manage permissions
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTheme} from '@hooks/useTheme';
import {usePermission} from '@hooks/useRBAC';
import {Permission} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column, Spacer} from '@components/layout';
import {RoleTypeBadge, PermissionCategoryCard} from '@components/roles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import hooks
import {
  useRole,
  useRoleStatistics,
  useUsersByRole,
  useDeleteRole,
  useDuplicateRole,
  usePermissionCategories,
} from '@hooks/queries/useRoles';

type RoleDetailsRouteProp = RouteProp<
  {params: {roleId: string}},
  'params'
>;

export const RoleDetailsScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RoleDetailsRouteProp>();

  const {roleId} = route.params;

  // Permissions
  const canView = usePermission(Permission.USER_VIEW);
  const canUpdate = usePermission(Permission.USER_UPDATE);
  const canDelete = usePermission(Permission.USER_DELETE);

  // State
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {data: role, isLoading, refetch} = useRole(roleId);
  const {data: statistics} = useRoleStatistics(roleId);
  const {data: users = []} = useUsersByRole(roleId);
  const {data: permissionCategories = []} = usePermissionCategories();

  const deleteRoleMutation = useDeleteRole();
  const duplicateRoleMutation = useDuplicateRole();

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEdit = () => {
    navigation.navigate('RoleForm', {mode: 'edit', roleId});
  };

  const handleDuplicate = () => {
    Alert.prompt(
      'Duplicate Role',
      'Enter a name for the new role:',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Create',
          onPress: async (newName) => {
            if (!newName?.trim()) {
              Alert.alert('Error', 'Please enter a valid name');
              return;
            }
            try {
              const duplicated = await duplicateRoleMutation.mutateAsync({
                id: roleId,
                name: newName,
              });
              Alert.alert('Success', 'Role duplicated successfully', [
                {
                  text: 'View',
                  onPress: () => navigation.replace('RoleDetails', {roleId: duplicated.id}),
                },
                {text: 'OK'},
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to duplicate role');
            }
          },
        },
      ],
      'plain-text',
      role?.name ? `${role.name} (Copy)` : '',
    );
  };

  const handleDelete = () => {
    if (!role) return;

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
              await deleteRoleMutation.mutateAsync(roleId);
              Alert.alert('Success', 'Role deleted successfully', [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete role');
            }
          },
        },
      ],
    );
  };

  const handleViewUsers = () => {
    // Navigate to users list filtered by this role
    navigation.navigate('UserManagement', {
      screen: 'UserList',
      params: {roleFilter: roleId},
    });
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
            You don't have permission to view role details
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

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

  if (!role) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.errorContainer}>
          <Icon
            name="shield-alert-outline"
            size={64}
            color={theme.colors.text.tertiary}
          />
          <Spacer size="md" />
          <Typography variant="h5" color={theme.colors.text.secondary}>
            Role Not Found
          </Typography>
          <Spacer size="sm" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            The role you're looking for doesn't exist
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const getRoleColor = () => {
    const colors: Record<number, string> = {
      100: theme.colors.error[500],
      80: theme.colors.primary[500],
      60: theme.colors.info[500],
      40: theme.colors.success[500],
      20: theme.colors.warning[500],
    };
    return colors[role.hierarchy] || theme.colors.text.secondary;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.default},
      ]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }>
        {/* Header Card */}
        <Card variant="elevated" padding="lg">
          <View style={styles.headerContent}>
            <View
              style={[
                styles.roleIcon,
                {backgroundColor: getRoleColor() + '20'},
              ]}>
              <Icon
                name={role.isSystemRole ? 'shield-crown' : 'account-cog'}
                size={32}
                color={getRoleColor()}
              />
            </View>

            <View style={styles.headerText}>
              <View style={styles.titleRow}>
                <Typography variant="h5" weight="bold" style={styles.roleName}>
                  {role.name}
                </Typography>
                <RoleTypeBadge
                  isSystemRole={role.isSystemRole}
                  isCustom={role.isCustom}
                  size="md"
                />
              </View>

              {role.description && (
                <>
                  <Spacer size="sm" />
                  <Typography
                    variant="body"
                    color={theme.colors.text.secondary}>
                    {role.description}
                  </Typography>
                </>
              )}

              <Spacer size="md" />

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Icon
                    name="code-tags"
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                  <Typography
                    variant="bodySmall"
                    color={theme.colors.text.secondary}>
                    {role.code}
                  </Typography>
                </View>

                <View style={styles.metaItem}>
                  <Icon
                    name="signal"
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                  <Typography
                    variant="bodySmall"
                    color={theme.colors.text.secondary}>
                    Level {role.hierarchy}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <Spacer size="md" />

        {/* Statistics */}
        {statistics && (
          <>
            <View style={styles.statsGrid}>
              <Card variant="filled" padding="md" style={styles.statCard}>
                <View style={styles.statContent}>
                  <Icon
                    name="account-group"
                    size={28}
                    color={theme.colors.primary[500]}
                  />
                  <Typography
                    variant="h4"
                    weight="bold"
                    color={theme.colors.text.primary}>
                    {statistics.totalUsers}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.colors.text.secondary}>
                    Total Users
                  </Typography>
                </View>
              </Card>

              <Card variant="filled" padding="md" style={styles.statCard}>
                <View style={styles.statContent}>
                  <Icon
                    name="check-circle"
                    size={28}
                    color={theme.colors.success[500]}
                  />
                  <Typography
                    variant="h4"
                    weight="bold"
                    color={theme.colors.text.primary}>
                    {statistics.activeUsers}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.colors.text.secondary}>
                    Active Users
                  </Typography>
                </View>
              </Card>

              <Card variant="filled" padding="md" style={styles.statCard}>
                <View style={styles.statContent}>
                  <Icon
                    name="lock-check"
                    size={28}
                    color={theme.colors.info[500]}
                  />
                  <Typography
                    variant="h4"
                    weight="bold"
                    color={theme.colors.text.primary}>
                    {role.permissions.length}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.colors.text.secondary}>
                    Permissions
                  </Typography>
                </View>
              </Card>
            </View>

            <Spacer size="md" />
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          {canUpdate && (
            <Button
              variant="primary"
              onPress={handleEdit}
              leftIcon="pencil"
              style={styles.actionButton}
              disabled={role.isSystemRole}>
              Edit
            </Button>
          )}

          <Button
            variant="outline"
            onPress={handleDuplicate}
            leftIcon="content-copy"
            style={styles.actionButton}>
            Duplicate
          </Button>

          {canDelete && (
            <Button
              variant="outline"
              onPress={handleDelete}
              leftIcon="delete"
              style={styles.actionButton}
              disabled={role.isSystemRole || (role.userCount || 0) > 0}>
              Delete
            </Button>
          )}
        </View>

        <Spacer size="lg" />

        {/* Permissions Section */}
        <Typography variant="h6" weight="semibold" style={styles.sectionTitle}>
          Permissions ({role.permissions.length})
        </Typography>

        <Spacer size="md" />

        {permissionCategories.map((category, index) => {
          // Only show categories that have at least one selected permission
          const hasPermissions = category.permissions.some(p =>
            role.permissions.includes(p),
          );

          if (!hasPermissions) return null;

          return (
            <View key={category.id}>
              <PermissionCategoryCard
                category={category}
                selectedPermissions={role.permissions}
                readOnly
                expanded={false}
              />
              {index < permissionCategories.length - 1 && <Spacer size="sm" />}
            </View>
          );
        })}

        <Spacer size="lg" />

        {/* Users Section */}
        {(role.userCount || 0) > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Typography variant="h6" weight="semibold">
                Users ({role.userCount})
              </Typography>
              <TouchableOpacity onPress={handleViewUsers}>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.primary[600]}
                  weight="medium">
                  View All
                </Typography>
              </TouchableOpacity>
            </View>

            <Spacer size="md" />

            <Card variant="outlined" padding="md">
              <Typography
                variant="body"
                color={theme.colors.text.secondary}>
                {role.userCount} user{(role.userCount || 0) > 1 ? 's' : ''}{' '}
                assigned to this role
              </Typography>
            </Card>

            <Spacer size="lg" />
          </>
        )}

        {/* Metadata */}
        <Card variant="outlined" padding="md">
          <Typography variant="bodySmall" color={theme.colors.text.tertiary}>
            Created on {new Date(role.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          {role.updatedAt !== role.createdAt && (
            <>
              <Spacer size="xs" />
              <Typography variant="bodySmall" color={theme.colors.text.tertiary}>
                Last updated {new Date(role.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </>
          )}
        </Card>

        <Spacer size="lg" />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleName: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
