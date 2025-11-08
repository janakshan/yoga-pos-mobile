/**
 * Active Sessions Screen
 * Displays active user sessions and concurrent user tracking
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import {useTheme} from '@hooks/useTheme';
import {usePermission} from '@hooks/useRBAC';
import {Permission} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column, Spacer} from '@components/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAuditStore} from '../../store/slices/auditSlice';
import {UserSession} from '../../types/audit.types';

export const ActiveSessionsScreen = () => {
  const {theme} = useTheme();

  // Permissions
  const canView = usePermission(Permission.SETTINGS_VIEW);

  // Audit store
  const {
    activeSessions,
    concurrentUserCount,
    sessionsLoading,
    fetchActiveSessions,
    endSession,
  } = useAuditStore();

  // State
  const [refreshing, setRefreshing] = useState(false);

  // Load sessions on mount
  useEffect(() => {
    fetchActiveSessions();
  }, []);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActiveSessions();
    setRefreshing(false);
  };

  const handleEndSession = (session: UserSession) => {
    Alert.alert(
      'End Session',
      `Are you sure you want to end the session for ${
        session.user?.name || session.userId
      }?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'End Session',
          style: 'destructive',
          onPress: async () => {
            try {
              await endSession(session.id);
              Alert.alert('Success', 'Session ended successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to end session');
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateDuration = (loginTime: string) => {
    const start = new Date(loginTime);
    const now = new Date();
    const durationMs = now.getTime() - start.getTime();

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
        return 'apple';
      case 'android':
        return 'android';
      case 'web':
        return 'web';
      default:
        return 'devices';
    }
  };

  const getDeviceTypeIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return 'cellphone';
      case 'tablet':
        return 'tablet';
      case 'desktop':
        return 'desktop-classic';
      default:
        return 'devices';
    }
  };

  // Render session item
  const renderSessionItem = ({item}: {item: UserSession}) => (
    <Card style={styles.sessionCard}>
      <Row align="flex-start" spacing="md">
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: theme.colors.primary + '20'},
          ]}>
          <Icon
            name={getDeviceTypeIcon(item.deviceInfo.deviceType)}
            size={24}
            color={theme.colors.primary}
          />
        </View>

        {/* Content */}
        <Column flex={1} spacing="xs">
          <Row justify="space-between">
            <Typography variant="subtitle" weight="semibold">
              {item.user?.name || item.userId}
            </Typography>
            {item.isActive && (
              <View
                style={[
                  styles.activeBadge,
                  {backgroundColor: theme.colors.success + '20'},
                ]}>
                <View
                  style={[
                    styles.activeDot,
                    {backgroundColor: theme.colors.success},
                  ]}
                />
                <Typography
                  variant="caption"
                  color={theme.colors.success}
                  weight="medium">
                  Active
                </Typography>
              </View>
            )}
          </Row>

          {item.user?.email && (
            <Row spacing="sm">
              <Icon name="email" size={14} color={theme.colors.text.tertiary} />
              <Typography variant="caption" color={theme.colors.text.tertiary}>
                {item.user.email}
              </Typography>
            </Row>
          )}

          <Row spacing="sm">
            <Icon
              name={getPlatformIcon(item.deviceInfo.platform)}
              size={14}
              color={theme.colors.text.tertiary}
            />
            <Typography variant="caption" color={theme.colors.text.tertiary}>
              {item.deviceInfo.platform.toUpperCase()} •{' '}
              {item.deviceInfo.deviceName || item.deviceInfo.model || 'Unknown'}
            </Typography>
          </Row>

          <Row spacing="sm">
            <Icon
              name="clock-outline"
              size={14}
              color={theme.colors.text.tertiary}
            />
            <Typography variant="caption" color={theme.colors.text.tertiary}>
              Started {formatDate(item.loginTime)} • Duration:{' '}
              {calculateDuration(item.loginTime)}
            </Typography>
          </Row>

          {item.branchName && (
            <Row spacing="sm">
              <Icon
                name="store"
                size={14}
                color={theme.colors.text.tertiary}
              />
              <Typography variant="caption" color={theme.colors.text.tertiary}>
                {item.branchName}
              </Typography>
            </Row>
          )}

          {item.ipAddress && (
            <Row spacing="sm">
              <Icon name="ip" size={14} color={theme.colors.text.tertiary} />
              <Typography variant="caption" color={theme.colors.text.tertiary}>
                {item.ipAddress}
              </Typography>
            </Row>
          )}

          <Spacer size="xs" />
          <Button
            variant="destructive"
            size="sm"
            onPress={() => handleEndSession(item)}
            icon="power">
            End Session
          </Button>
        </Column>
      </Row>
    </Card>
  );

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
            You don't have permission to view active sessions
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
      {/* Header */}
      <View
        style={[
          styles.header,
          {borderBottomColor: theme.colors.border.default},
        ]}>
        <Row justify="space-between" align="center">
          <Column>
            <Typography variant="h4" weight="bold">
              Active Sessions
            </Typography>
            <Typography variant="caption" color={theme.colors.text.tertiary}>
              {activeSessions.length} active sessions •{' '}
              {concurrentUserCount} concurrent users
            </Typography>
          </Column>
        </Row>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Row align="center" spacing="md">
            <View
              style={[
                styles.statIcon,
                {backgroundColor: theme.colors.primary + '20'},
              ]}>
              <Icon name="account-group" size={24} color={theme.colors.primary} />
            </View>
            <Column>
              <Typography variant="h5" weight="bold">
                {concurrentUserCount}
              </Typography>
              <Typography variant="caption" color={theme.colors.text.tertiary}>
                Concurrent Users
              </Typography>
            </Column>
          </Row>
        </Card>

        <Card style={styles.statCard}>
          <Row align="center" spacing="md">
            <View
              style={[
                styles.statIcon,
                {backgroundColor: theme.colors.success + '20'},
              ]}>
              <Icon name="connection" size={24} color={theme.colors.success} />
            </View>
            <Column>
              <Typography variant="h5" weight="bold">
                {activeSessions.length}
              </Typography>
              <Typography variant="caption" color={theme.colors.text.tertiary}>
                Active Sessions
              </Typography>
            </Column>
          </Row>
        </Card>
      </View>

      {/* Content */}
      {sessionsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Spacer size="md" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            Loading active sessions...
          </Typography>
        </View>
      ) : activeSessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="account-off-outline"
            size={64}
            color={theme.colors.text.tertiary}
          />
          <Spacer size="md" />
          <Typography variant="h6" color={theme.colors.text.secondary}>
            No Active Sessions
          </Typography>
          <Spacer size="sm" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            No users are currently logged in
          </Typography>
        </View>
      ) : (
        <FlatList
          data={activeSessions}
          renderItem={renderSessionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
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
    padding: 16,
    borderBottomWidth: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    padding: 16,
  },
  sessionCard: {
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default ActiveSessionsScreen;
