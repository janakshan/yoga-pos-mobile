/**
 * Audit Log Details Screen
 * Displays detailed information about a specific audit log entry
 */

import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';

import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import {Card} from '@components/ui/Card';
import {Row, Column, Spacer} from '@components/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAuditStore} from '../../store/slices/auditSlice';
import {AuditSeverity, AuditStatus} from '../../types/audit.types';

type AuditLogDetailsRouteProp = RouteProp<{params: {logId: string}}, 'params'>;

export const AuditLogDetailsScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<AuditLogDetailsRouteProp>();
  const navigation = useNavigation();
  const {logId} = route.params;

  const {currentLog, isLoading, fetchAuditLog} = useAuditStore();

  useEffect(() => {
    fetchAuditLog(logId);
  }, [logId]);

  const getSeverityColor = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.INFO:
        return theme.colors.info;
      case AuditSeverity.WARNING:
        return theme.colors.warning;
      case AuditSeverity.ERROR:
        return theme.colors.error;
      case AuditSeverity.CRITICAL:
        return theme.colors.destructive;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusColor = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.SUCCESS:
        return theme.colors.success;
      case AuditStatus.FAILURE:
        return theme.colors.error;
      case AuditStatus.PENDING:
        return theme.colors.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading || !currentLog) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Spacer size="md" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            Loading audit log details...
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
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Card */}
        <Card>
          <Row justify="space-between" align="center">
            <Typography variant="h5" weight="bold">
              {currentLog.action}
            </Typography>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(currentLog.status) + '20'},
              ]}>
              <Typography
                variant="caption"
                color={getStatusColor(currentLog.status)}
                weight="semibold">
                {currentLog.status.toUpperCase()}
              </Typography>
            </View>
          </Row>
          <Spacer size="sm" />
          <View
            style={[
              styles.severityBadge,
              {
                backgroundColor: getSeverityColor(currentLog.severity) + '15',
              },
            ]}>
            <Typography
              variant="caption"
              color={getSeverityColor(currentLog.severity)}
              weight="medium">
              {currentLog.severity.toUpperCase()}
            </Typography>
          </View>
        </Card>

        <Spacer size="md" />

        {/* Event Information */}
        <Card>
          <Typography variant="subtitle" weight="semibold">
            Event Information
          </Typography>
          <Spacer size="md" />

          <InfoRow
            icon="tag"
            label="Event Type"
            value={currentLog.eventType}
            theme={theme}
          />
          <InfoRow
            icon="file-document"
            label="Resource Type"
            value={currentLog.resourceType}
            theme={theme}
          />
          {currentLog.resourceId && (
            <InfoRow
              icon="identifier"
              label="Resource ID"
              value={currentLog.resourceId}
              theme={theme}
            />
          )}
          {currentLog.resourceName && (
            <InfoRow
              icon="label"
              label="Resource Name"
              value={currentLog.resourceName}
              theme={theme}
            />
          )}
          <InfoRow
            icon="clock"
            label="Timestamp"
            value={formatDate(currentLog.timestamp)}
            theme={theme}
          />
        </Card>

        <Spacer size="md" />

        {/* User Information */}
        <Card>
          <Typography variant="subtitle" weight="semibold">
            User Information
          </Typography>
          <Spacer size="md" />

          <InfoRow
            icon="account"
            label="User ID"
            value={currentLog.userId}
            theme={theme}
          />
          {currentLog.userName && (
            <InfoRow
              icon="account-circle"
              label="User Name"
              value={currentLog.userName}
              theme={theme}
            />
          )}
          {currentLog.userEmail && (
            <InfoRow
              icon="email"
              label="User Email"
              value={currentLog.userEmail}
              theme={theme}
            />
          )}
        </Card>

        <Spacer size="md" />

        {/* Context Information */}
        <Card>
          <Typography variant="subtitle" weight="semibold">
            Context Information
          </Typography>
          <Spacer size="md" />

          {currentLog.sessionId && (
            <InfoRow
              icon="key"
              label="Session ID"
              value={currentLog.sessionId}
              theme={theme}
            />
          )}
          {currentLog.branchId && (
            <InfoRow
              icon="store"
              label="Branch ID"
              value={currentLog.branchId}
              theme={theme}
            />
          )}
          {currentLog.branchName && (
            <InfoRow
              icon="store-marker"
              label="Branch Name"
              value={currentLog.branchName}
              theme={theme}
            />
          )}
          {currentLog.ipAddress && (
            <InfoRow
              icon="ip"
              label="IP Address"
              value={currentLog.ipAddress}
              theme={theme}
            />
          )}
        </Card>

        <Spacer size="md" />

        {/* Device Information */}
        {currentLog.deviceInfo && (
          <>
            <Card>
              <Typography variant="subtitle" weight="semibold">
                Device Information
              </Typography>
              <Spacer size="md" />

              {currentLog.deviceInfo.deviceName && (
                <InfoRow
                  icon="cellphone"
                  label="Device Name"
                  value={currentLog.deviceInfo.deviceName}
                  theme={theme}
                />
              )}
              <InfoRow
                icon="devices"
                label="Device Type"
                value={currentLog.deviceInfo.deviceType}
                theme={theme}
              />
              <InfoRow
                icon="android"
                label="Platform"
                value={currentLog.deviceInfo.platform}
                theme={theme}
              />
              {currentLog.deviceInfo.platformVersion && (
                <InfoRow
                  icon="information"
                  label="Platform Version"
                  value={currentLog.deviceInfo.platformVersion}
                  theme={theme}
                />
              )}
              <InfoRow
                icon="application"
                label="App Version"
                value={currentLog.deviceInfo.appVersion}
                theme={theme}
              />
              {currentLog.deviceInfo.model && (
                <InfoRow
                  icon="cellphone-information"
                  label="Model"
                  value={currentLog.deviceInfo.model}
                  theme={theme}
                />
              )}
            </Card>
            <Spacer size="md" />
          </>
        )}

        {/* Data Changes */}
        {currentLog.changes && (
          <>
            <Card>
              <Typography variant="subtitle" weight="semibold">
                Data Changes
              </Typography>
              <Spacer size="md" />

              {currentLog.changes.fields?.map((field, index) => (
                <View key={index}>
                  <Typography
                    variant="caption"
                    color={theme.colors.text.tertiary}
                    weight="semibold">
                    {field.field}
                  </Typography>
                  <Spacer size="xs" />
                  <Row spacing="md">
                    <Column flex={1}>
                      <Typography
                        variant="caption"
                        color={theme.colors.text.tertiary}>
                        Before
                      </Typography>
                      <Typography variant="body">
                        {JSON.stringify(field.oldValue)}
                      </Typography>
                    </Column>
                    <Icon
                      name="arrow-right"
                      size={20}
                      color={theme.colors.text.tertiary}
                    />
                    <Column flex={1}>
                      <Typography
                        variant="caption"
                        color={theme.colors.text.tertiary}>
                        After
                      </Typography>
                      <Typography variant="body">
                        {JSON.stringify(field.newValue)}
                      </Typography>
                    </Column>
                  </Row>
                  {index < currentLog.changes!.fields!.length - 1 && (
                    <Spacer size="md" />
                  )}
                </View>
              ))}
            </Card>
            <Spacer size="md" />
          </>
        )}

        {/* Metadata */}
        {currentLog.metadata && Object.keys(currentLog.metadata).length > 0 && (
          <>
            <Card>
              <Typography variant="subtitle" weight="semibold">
                Additional Metadata
              </Typography>
              <Spacer size="md" />
              <View
                style={[
                  styles.metadataContainer,
                  {backgroundColor: theme.colors.background.subtle},
                ]}>
                <Typography
                  variant="caption"
                  color={theme.colors.text.secondary}
                  style={{fontFamily: 'monospace'}}>
                  {JSON.stringify(currentLog.metadata, null, 2)}
                </Typography>
              </View>
            </Card>
            <Spacer size="md" />
          </>
        )}

        {/* Error Information */}
        {currentLog.errorMessage && (
          <>
            <Card>
              <Typography variant="subtitle" weight="semibold">
                Error Information
              </Typography>
              <Spacer size="md" />
              <View
                style={[
                  styles.errorContainer,
                  {
                    backgroundColor: theme.colors.error + '10',
                    borderColor: theme.colors.error,
                  },
                ]}>
                <Typography variant="body" color={theme.colors.error}>
                  {currentLog.errorMessage}
                </Typography>
              </View>
            </Card>
            <Spacer size="md" />
          </>
        )}

        {/* Sync Status */}
        <Card>
          <Row align="center" spacing="sm">
            <Icon
              name={currentLog.synced ? 'check-circle' : 'sync'}
              size={20}
              color={
                currentLog.synced
                  ? theme.colors.success
                  : theme.colors.warning
              }
            />
            <Typography
              variant="caption"
              color={
                currentLog.synced
                  ? theme.colors.success
                  : theme.colors.warning
              }>
              {currentLog.synced
                ? `Synced at ${
                    currentLog.syncedAt ? formatDate(currentLog.syncedAt) : ''
                  }`
                : 'Not synced'}
            </Typography>
          </Row>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

// Info Row Component
const InfoRow = ({
  icon,
  label,
  value,
  theme,
}: {
  icon: string;
  label: string;
  value: string;
  theme: any;
}) => (
  <>
    <Row spacing="sm" align="flex-start">
      <Icon name={icon} size={18} color={theme.colors.text.tertiary} />
      <Column flex={1}>
        <Typography variant="caption" color={theme.colors.text.tertiary}>
          {label}
        </Typography>
        <Typography variant="body">{value}</Typography>
      </Column>
    </Row>
    <Spacer size="sm" />
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metadataContainer: {
    padding: 12,
    borderRadius: 8,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default AuditLogDetailsScreen;
