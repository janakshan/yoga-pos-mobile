/**
 * Audit Logs Screen
 * Comprehensive audit logging screen with search, filters, and export
 */

import React, {useState, useEffect} from 'react';
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
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTheme} from '@hooks/useTheme';
import {usePermission} from '@hooks/useRBAC';
import {Permission} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column, Spacer} from '@components/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAuditStore} from '../../store/slices/auditSlice';
import {
  AuditLog,
  AuditEventType,
  ResourceType,
  AuditSeverity,
  AuditStatus,
} from '../../types/audit.types';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

type AuditNavigationProp = NativeStackNavigationProp<any>;

export const AuditLogsScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<AuditNavigationProp>();

  // Permissions
  const canView = usePermission(Permission.SETTINGS_VIEW);

  // Audit store
  const {
    logs,
    isLoading,
    filters,
    setFilters,
    fetchAuditLogs,
    searchAuditLogs,
    exportLogs,
    syncLocalLogs,
    unsyncedCount,
    getUnsyncedCount,
  } = useAuditStore();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load audit logs on mount
  useEffect(() => {
    fetchAuditLogs();
    getUnsyncedCount();
  }, []);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAuditLogs();
    await getUnsyncedCount();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchAuditLogs(searchQuery);
    } else {
      fetchAuditLogs();
    }
  };

  const handleApplyFilters = () => {
    const newFilters: any = {
      page: 1,
    };

    if (selectedEventType) {
      newFilters.eventType = selectedEventType as AuditEventType;
    }
    if (selectedResourceType) {
      newFilters.resourceType = selectedResourceType as ResourceType;
    }
    if (selectedSeverity) {
      newFilters.severity = selectedSeverity as AuditSeverity;
    }
    if (selectedStatus) {
      newFilters.status = selectedStatus as AuditStatus;
    }
    if (startDate) {
      newFilters.startDate = startDate;
    }
    if (endDate) {
      newFilters.endDate = endDate;
    }

    setFilters(newFilters);
    fetchAuditLogs(newFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSelectedEventType('');
    setSelectedResourceType('');
    setSelectedSeverity('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
    setFilters({page: 1, limit: 50});
    fetchAuditLogs();
  };

  const handleExport = async (format: 'csv' | 'json' | 'excel' | 'pdf') => {
    try {
      await exportLogs({
        filters,
        format,
        includeMetadata: true,
        includeChanges: true,
      });
      Alert.alert('Success', `Export started. You'll be notified when it's ready.`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to export audit logs');
    }
  };

  const handleSync = async () => {
    try {
      await syncLocalLogs();
      Alert.alert('Success', 'Audit logs synced successfully');
      await fetchAuditLogs();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sync audit logs');
    }
  };

  const handleViewDetails = (log: AuditLog) => {
    navigation.navigate('AuditLogDetails', {logId: log.id});
  };

  // Get severity color
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

  // Get status color
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

  // Get event icon
  const getEventIcon = (eventType: AuditEventType) => {
    if (eventType.includes('auth')) return 'shield-account';
    if (eventType.includes('user')) return 'account';
    if (eventType.includes('pos')) return 'cash-register';
    if (eventType.includes('inventory')) return 'package-variant';
    if (eventType.includes('financial')) return 'currency-usd';
    if (eventType.includes('product')) return 'tag';
    if (eventType.includes('customer')) return 'account-group';
    if (eventType.includes('report')) return 'chart-box';
    if (eventType.includes('settings')) return 'cog';
    if (eventType.includes('system')) return 'server';
    return 'file-document';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Render audit log item
  const renderAuditLogItem = ({item}: {item: AuditLog}) => (
    <TouchableOpacity onPress={() => handleViewDetails(item)}>
      <Card style={styles.logCard}>
        <Row align="flex-start" spacing="md">
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: getSeverityColor(item.severity) + '20'},
            ]}>
            <Icon
              name={getEventIcon(item.eventType)}
              size={24}
              color={getSeverityColor(item.severity)}
            />
          </View>

          {/* Content */}
          <Column flex={1} spacing="xs">
            <Row justify="space-between">
              <Typography variant="subtitle" style={{flex: 1}}>
                {item.action}
              </Typography>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: getStatusColor(item.status) + '20'},
                ]}>
                <Typography
                  variant="caption"
                  color={getStatusColor(item.status)}
                  weight="semibold">
                  {item.status.toUpperCase()}
                </Typography>
              </View>
            </Row>

            <Row spacing="sm">
              <Icon
                name="account"
                size={14}
                color={theme.colors.text.tertiary}
              />
              <Typography variant="caption" color={theme.colors.text.tertiary}>
                {item.userName || item.userId || 'System'}
              </Typography>
            </Row>

            {item.resourceName && (
              <Row spacing="sm">
                <Icon
                  name="file-document-outline"
                  size={14}
                  color={theme.colors.text.tertiary}
                />
                <Typography
                  variant="caption"
                  color={theme.colors.text.tertiary}>
                  {item.resourceType}: {item.resourceName}
                </Typography>
              </Row>
            )}

            <Row spacing="sm">
              <Icon
                name="clock-outline"
                size={14}
                color={theme.colors.text.tertiary}
              />
              <Typography variant="caption" color={theme.colors.text.tertiary}>
                {formatDate(item.timestamp)}
              </Typography>
            </Row>

            {/* Severity badge */}
            <View
              style={[
                styles.severityBadge,
                {backgroundColor: getSeverityColor(item.severity) + '15'},
              ]}>
              <Typography
                variant="caption"
                color={getSeverityColor(item.severity)}
                weight="medium">
                {item.severity.toUpperCase()}
              </Typography>
            </View>
          </Column>

          {/* Arrow */}
          <Icon
            name="chevron-right"
            size={24}
            color={theme.colors.text.tertiary}
          />
        </Row>
      </Card>
    </TouchableOpacity>
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
            You don't have permission to view audit logs
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
              Audit Logs
            </Typography>
            <Typography variant="caption" color={theme.colors.text.tertiary}>
              {logs.length} events • {unsyncedCount} unsynced
            </Typography>
          </Column>
          <Row spacing="sm">
            {unsyncedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onPress={handleSync}
                icon="sync">
                Sync
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onPress={() => setShowFilters(!showFilters)}
              icon={showFilters ? 'filter-off' : 'filter'}>
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={() =>
                Alert.alert('Export', 'Choose export format:', [
                  {text: 'CSV', onPress: () => handleExport('csv')},
                  {text: 'JSON', onPress: () => handleExport('json')},
                  {text: 'Excel', onPress: () => handleExport('excel')},
                  {text: 'PDF', onPress: () => handleExport('pdf')},
                  {text: 'Cancel', style: 'cancel'},
                ])
              }
              icon="download">
              Export
            </Button>
          </Row>
        </Row>

        <Spacer size="md" />

        {/* Search */}
        <Row spacing="sm">
          <View style={{flex: 1}}>
            <Input
              placeholder="Search audit logs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon="magnify"
              onSubmitEditing={handleSearch}
            />
          </View>
          <Button onPress={handleSearch} icon="magnify">
            Search
          </Button>
        </Row>

        {/* Filters Panel */}
        {showFilters && (
          <View style={styles.filtersPanel}>
            <Spacer size="md" />
            <Typography variant="subtitle" weight="semibold">
              Filters
            </Typography>
            <Spacer size="sm" />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersList}>
              {/* Event Type Filter */}
              <Card style={styles.filterCard}>
                <Typography variant="caption" color={theme.colors.text.tertiary}>
                  Event Type
                </Typography>
                <Spacer size="xs" />
                <Input
                  placeholder="All Events"
                  value={selectedEventType}
                  onChangeText={setSelectedEventType}
                />
              </Card>

              {/* Resource Type Filter */}
              <Card style={styles.filterCard}>
                <Typography variant="caption" color={theme.colors.text.tertiary}>
                  Resource
                </Typography>
                <Spacer size="xs" />
                <Input
                  placeholder="All Resources"
                  value={selectedResourceType}
                  onChangeText={setSelectedResourceType}
                />
              </Card>

              {/* Severity Filter */}
              <Card style={styles.filterCard}>
                <Typography variant="caption" color={theme.colors.text.tertiary}>
                  Severity
                </Typography>
                <Spacer size="xs" />
                <Input
                  placeholder="All Severities"
                  value={selectedSeverity}
                  onChangeText={setSelectedSeverity}
                />
              </Card>

              {/* Status Filter */}
              <Card style={styles.filterCard}>
                <Typography variant="caption" color={theme.colors.text.tertiary}>
                  Status
                </Typography>
                <Spacer size="xs" />
                <Input
                  placeholder="All Statuses"
                  value={selectedStatus}
                  onChangeText={setSelectedStatus}
                />
              </Card>
            </ScrollView>

            <Spacer size="md" />
            <Row spacing="sm" justify="flex-end">
              <Button variant="ghost" size="sm" onPress={handleClearFilters}>
                Clear
              </Button>
              <Button size="sm" onPress={handleApplyFilters}>
                Apply Filters
              </Button>
            </Row>
          </View>
        )}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Spacer size="md" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            Loading audit logs...
          </Typography>
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="file-document-outline"
            size={64}
            color={theme.colors.text.tertiary}
          />
          <Spacer size="md" />
          <Typography variant="h6" color={theme.colors.text.secondary}>
            No Audit Logs Found
          </Typography>
          <Spacer size="sm" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Audit events will appear here'}
          </Typography>
        </View>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderAuditLogItem}
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
  logCard: {
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  filtersPanel: {
    marginTop: 8,
  },
  filtersList: {
    gap: 12,
  },
  filterCard: {
    minWidth: 150,
    padding: 12,
  },
});

export default AuditLogsScreen;
