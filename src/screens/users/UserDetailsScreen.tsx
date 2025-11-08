/**
 * User Details Screen
 * Displays user profile, statistics, and activity log
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTheme} from '@hooks/useTheme';
import {
  useUser,
  useUserStatistics,
  useUserActivityLog,
  useUpdateUserStatus,
  useResetPassword,
} from '@hooks/queries/useUsers';
import {usePermission} from '@hooks/useRBAC';
import {Permission, UserActivityLog} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column, Spacer} from '@components/layout';
import {UserStatusBadge} from '@components/users';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type UserDetailsRouteProp = RouteProp<{UserDetails: {userId: string}}, 'UserDetails'>;

export const UserDetailsScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<UserDetailsRouteProp>();
  const {userId} = route.params;

  const [activeTab, setActiveTab] = useState<'info' | 'activity'>('info');
  const [refreshing, setRefreshing] = useState(false);

  // Permissions
  const canUpdate = usePermission(Permission.USER_UPDATE);
  const canDelete = usePermission(Permission.USER_DELETE);

  // Queries
  const {data: user, isLoading, refetch} = useUser(userId);
  const {data: statistics} = useUserStatistics(userId);
  const {data: activityData} = useUserActivityLog(userId, {limit: 20});

  const updateStatusMutation = useUpdateUserStatus();
  const resetPasswordMutation = useResetPassword();

  const activities = activityData?.data || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEdit = () => {
    navigation.navigate('UserForm', {mode: 'edit', userId});
  };

  const handleChangeStatus = (status: 'active' | 'inactive' | 'suspended') => {
    Alert.alert(
      'Change Status',
      `Are you sure you want to change the user status to ${status}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateStatusMutation.mutateAsync({
                id: userId,
                data: {status},
              });
              Alert.alert('Success', 'User status updated successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update status');
            }
          },
        },
      ],
    );
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password',
      'A temporary password will be generated and sent to the user. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await resetPasswordMutation.mutateAsync(userId);
              Alert.alert(
                'Password Reset',
                `Temporary password: ${result.temporaryPassword}\n\nMake sure to share this securely with the user.`,
              );
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to reset password');
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleIcon = (role: string) => {
    const roleIcons: Record<string, string> = {
      admin: 'shield-crown',
      manager: 'briefcase',
      inventory_manager: 'package-variant',
      cashier: 'cash-register',
      waiter: 'food-fork-drink',
      waitress: 'food-fork-drink',
      kitchen_staff: 'chef-hat',
    };
    return roleIcons[role.toLowerCase()] || 'account';
  };

  if (isLoading || !user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Spacer size="md" />
          <Typography variant="body" color={theme.colors.text.secondary}>
            Loading user details...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const renderProfileSection = () => (
    <Card variant="elevated" padding="lg">
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{uri: user.avatar}} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                {backgroundColor: theme.colors.primary[100]},
              ]}>
              <Icon
                name="account"
                size={48}
                color={theme.colors.primary[500]}
              />
            </View>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Typography variant="h4" weight="bold" color={theme.colors.text.primary}>
            {user.name}
          </Typography>
          <Spacer size="xs" />
          <UserStatusBadge status={user.status || 'active'} size="md" />
        </View>
      </View>

      <Spacer size="lg" />

      {/* Contact Information */}
      <View style={styles.infoSection}>
        <Typography
          variant="bodyMedium"
          weight="semibold"
          color={theme.colors.text.primary}
          style={styles.sectionTitle}>
          Contact Information
        </Typography>
        <Spacer size="sm" />

        <View style={styles.infoRow}>
          <Icon name="email" size={20} color={theme.colors.text.secondary} />
          <Typography variant="body" color={theme.colors.text.primary} style={styles.infoText}>
            {user.email}
          </Typography>
        </View>

        {user.phone && (
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color={theme.colors.text.secondary} />
            <Typography variant="body" color={theme.colors.text.primary} style={styles.infoText}>
              {user.phone}
            </Typography>
          </View>
        )}

        <View style={styles.infoRow}>
          <Icon name="at" size={20} color={theme.colors.text.secondary} />
          <Typography variant="body" color={theme.colors.text.primary} style={styles.infoText}>
            @{user.username}
          </Typography>
        </View>
      </View>

      <Spacer size="lg" />

      {/* Role & Branch */}
      <View style={styles.infoSection}>
        <Typography
          variant="bodyMedium"
          weight="semibold"
          color={theme.colors.text.primary}
          style={styles.sectionTitle}>
          Role & Assignment
        </Typography>
        <Spacer size="sm" />

        <View style={styles.infoRow}>
          <Icon name={getRoleIcon(user.role)} size={20} color={theme.colors.primary[500]} />
          <Typography variant="body" color={theme.colors.text.primary} style={styles.infoText}>
            {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Typography>
        </View>

        {user.branch && (
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color={theme.colors.text.secondary} />
            <Typography variant="body" color={theme.colors.text.primary} style={styles.infoText}>
              {user.branch.name}
            </Typography>
          </View>
        )}
      </View>

      <Spacer size="lg" />

      {/* Security */}
      <View style={styles.infoSection}>
        <Typography
          variant="bodyMedium"
          weight="semibold"
          color={theme.colors.text.primary}
          style={styles.sectionTitle}>
          Security
        </Typography>
        <Spacer size="sm" />

        <View style={styles.securityBadges}>
          <View
            style={[
              styles.securityBadge,
              {
                backgroundColor: user.pinEnabled
                  ? theme.colors.success[100]
                  : theme.colors.text.tertiary + '20',
              },
            ]}>
            <Icon
              name="numeric"
              size={16}
              color={user.pinEnabled ? theme.colors.success[700] : theme.colors.text.tertiary}
            />
            <Typography
              variant="bodySmall"
              color={user.pinEnabled ? theme.colors.success[700] : theme.colors.text.tertiary}
              style={styles.badgeText}>
              PIN {user.pinEnabled ? 'Enabled' : 'Disabled'}
            </Typography>
          </View>

          <View
            style={[
              styles.securityBadge,
              {
                backgroundColor: user.biometricEnabled
                  ? theme.colors.success[100]
                  : theme.colors.text.tertiary + '20',
              },
            ]}>
            <Icon
              name="fingerprint"
              size={16}
              color={user.biometricEnabled ? theme.colors.success[700] : theme.colors.text.tertiary}
            />
            <Typography
              variant="bodySmall"
              color={user.biometricEnabled ? theme.colors.success[700] : theme.colors.text.tertiary}
              style={styles.badgeText}>
              Biometric {user.biometricEnabled ? 'Enabled' : 'Disabled'}
            </Typography>
          </View>
        </View>
      </View>

      <Spacer size="lg" />

      {/* Metadata */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Icon name="calendar" size={20} color={theme.colors.text.secondary} />
          <Typography variant="bodySmall" color={theme.colors.text.secondary} style={styles.infoText}>
            Created: {formatDate(user.createdAt)}
          </Typography>
        </View>

        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color={theme.colors.text.secondary} />
          <Typography variant="bodySmall" color={theme.colors.text.secondary} style={styles.infoText}>
            Last Login: {formatDate(user.lastLogin)}
          </Typography>
        </View>
      </View>
    </Card>
  );

  const renderStatisticsSection = () => {
    if (!statistics) return null;

    return (
      <Card variant="elevated" padding="md">
        <Typography
          variant="h6"
          weight="semibold"
          color={theme.colors.text.primary}
          style={styles.cardTitle}>
          Performance Statistics
        </Typography>
        <Spacer size="md" />

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Typography variant="h4" weight="bold" color={theme.colors.primary[500]}>
              {statistics.totalTransactions}
            </Typography>
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Transactions
            </Typography>
          </View>

          <View style={styles.statItem}>
            <Typography variant="h4" weight="bold" color={theme.colors.success[500]}>
              ${statistics.totalSales.toLocaleString()}
            </Typography>
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Total Sales
            </Typography>
          </View>

          <View style={styles.statItem}>
            <Typography variant="h4" weight="bold" color={theme.colors.info[500]}>
              ${statistics.averageTransactionValue.toFixed(2)}
            </Typography>
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Avg. Transaction
            </Typography>
          </View>

          <View style={styles.statItem}>
            <Typography variant="h4" weight="bold" color={theme.colors.warning[500]}>
              {statistics.loginCount}
            </Typography>
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Total Logins
            </Typography>
          </View>
        </View>
      </Card>
    );
  };

  const renderActivityLog = () => (
    <Card variant="elevated" padding="md">
      <Typography
        variant="h6"
        weight="semibold"
        color={theme.colors.text.primary}
        style={styles.cardTitle}>
        Recent Activity
      </Typography>
      <Spacer size="md" />

      {activities.length === 0 ? (
        <View style={styles.emptyActivity}>
          <Icon name="history" size={48} color={theme.colors.text.tertiary} />
          <Spacer size="sm" />
          <Typography variant="body" color={theme.colors.text.secondary}>
            No recent activity
          </Typography>
        </View>
      ) : (
        <View>
          {activities.map((activity: UserActivityLog) => (
            <View
              key={activity.id}
              style={[
                styles.activityItem,
                {borderBottomColor: theme.colors.border.light},
              ]}>
              <View style={styles.activityContent}>
                <Typography variant="bodyMedium" color={theme.colors.text.primary}>
                  {activity.description}
                </Typography>
                <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                  {formatDateTime(activity.timestamp)}
                </Typography>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );

  const renderActions = () => {
    if (!canUpdate) return null;

    return (
      <Card variant="elevated" padding="md">
        <Typography
          variant="h6"
          weight="semibold"
          color={theme.colors.text.primary}
          style={styles.cardTitle}>
          Actions
        </Typography>
        <Spacer size="md" />

        <View style={styles.actionsGrid}>
          <Button
            variant="outline"
            size="md"
            onPress={handleEdit}
            leftIcon={<Icon name="pencil" size={20} />}
            style={styles.actionButton}>
            Edit Profile
          </Button>

          <Button
            variant="outline"
            size="md"
            onPress={handleResetPassword}
            leftIcon={<Icon name="lock-reset" size={20} />}
            style={styles.actionButton}>
            Reset Password
          </Button>

          {user.status === 'active' && (
            <Button
              variant="outline"
              size="md"
              onPress={() => handleChangeStatus('inactive')}
              leftIcon={<Icon name="account-off" size={20} />}
              style={styles.actionButton}>
              Deactivate
            </Button>
          )}

          {user.status === 'inactive' && (
            <Button
              variant="primary"
              size="md"
              onPress={() => handleChangeStatus('active')}
              leftIcon={<Icon name="account-check" size={20} />}
              style={styles.actionButton}>
              Activate
            </Button>
          )}

          {user.status !== 'suspended' && (
            <Button
              variant="danger"
              size="md"
              onPress={() => handleChangeStatus('suspended')}
              leftIcon={<Icon name="account-cancel" size={20} />}
              style={styles.actionButton}>
              Suspend
            </Button>
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.default},
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }>
        {renderProfileSection()}
        <Spacer size="md" />
        {renderStatisticsSection()}
        <Spacer size="md" />
        {renderActivityLog()}
        <Spacer size="md" />
        {renderActions()}
        <Spacer size="lg" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  securityBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  badgeText: {
    marginLeft: 6,
  },
  cardTitle: {
    marginBottom: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityContent: {
    gap: 4,
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
});
