/**
 * Branch Details Screen
 * Display detailed information about a specific branch
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import type {BranchesStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  useBranch,
  useBranchStaff,
  useBranchInventory,
  useToggleBranchStatus,
} from '@hooks/queries/useBranches';
import {usePermission} from '@hooks/useRBAC';
import {Permission} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type BranchDetailsRouteProp = RouteProp<BranchesStackParamList, 'BranchDetails'>;

export const BranchDetailsScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<BranchDetailsRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<BranchesStackParamList>>();

  const {branchId} = route.params;

  const canManage = usePermission(Permission.SETTINGS_MANAGE);

  const {data: branch, isLoading} = useBranch(branchId);
  const {data: staff} = useBranchStaff(branchId);
  const {data: inventory} = useBranchInventory(branchId);
  const toggleStatusMutation = useToggleBranchStatus();

  const handleEdit = () => {
    navigation.navigate('BranchForm', {mode: 'edit', branchId});
  };

  const handleViewDashboard = () => {
    navigation.navigate('BranchDashboard', {branchId});
  };

  const handleToggleStatus = async () => {
    if (!branch) return;

    Alert.alert(
      `${branch.isActive ? 'Deactivate' : 'Activate'} Branch`,
      `Are you sure you want to ${branch.isActive ? 'deactivate' : 'activate'} this branch?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: branch.isActive ? 'Deactivate' : 'Activate',
          style: branch.isActive ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await toggleStatusMutation.mutateAsync({
                branchId,
                isActive: !branch.isActive,
              });
              Alert.alert('Success', 'Branch status updated successfully');
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'Failed to update branch status',
              );
            }
          },
        },
      ],
    );
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleNavigate = () => {
    if (branch?.latitude && branch?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
      Linking.openURL(url);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  if (!branch) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <View style={styles.errorContainer}>
          <Typography variant="h4" color="secondary">
            Branch not found
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

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <ScrollView>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Column spacing="md">
            <Row justify="space-between" align="center">
              <Typography variant="h2">{branch.name}</Typography>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: branch.isActive
                      ? theme.colors.success + '20'
                      : theme.colors.error + '20',
                  },
                ]}>
                <Typography
                  variant="body"
                  style={{
                    color: branch.isActive
                      ? theme.colors.success
                      : theme.colors.error,
                    fontWeight: '600',
                  }}>
                  {branch.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </View>
            </Row>

            <Row align="center" spacing="xs">
              <Icon
                name="identifier"
                size={18}
                color={theme.colors.text.secondary}
              />
              <Typography variant="body" color="secondary">
                {branch.code}
              </Typography>
            </Row>

            {branch.description && (
              <Typography variant="body" color="secondary">
                {branch.description}
              </Typography>
            )}

            {canManage && (
              <Row spacing="sm" style={styles.headerActions}>
                <Button
                  variant="primary"
                  size="md"
                  onPress={handleViewDashboard}
                  leftIcon={
                    <Icon name="chart-line" size={20} color={theme.colors.white} />
                  }
                  style={styles.actionButton}>
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onPress={handleEdit}
                  leftIcon={
                    <Icon name="pencil" size={20} color={theme.colors.primary[500]} />
                  }
                  style={styles.actionButton}>
                  Edit
                </Button>
                <Button
                  variant={branch.isActive ? 'outline' : 'primary'}
                  size="md"
                  onPress={handleToggleStatus}
                  leftIcon={
                    <Icon
                      name={branch.isActive ? 'pause' : 'play'}
                      size={20}
                      color={
                        branch.isActive
                          ? theme.colors.warning
                          : theme.colors.white
                      }
                    />
                  }
                  style={styles.actionButton}>
                  {branch.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </Row>
            )}
          </Column>
        </Card>

        {/* Contact Information */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Contact Information
          </Typography>
          <Column spacing="md">
            <TouchableOpacity onPress={() => handleCall(branch.phone)}>
              <Row align="center" spacing="sm">
                <Icon name="phone" size={20} color={theme.colors.primary[500]} />
                <Typography variant="body">{branch.phone}</Typography>
              </Row>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleEmail(branch.email)}>
              <Row align="center" spacing="sm">
                <Icon name="email" size={20} color={theme.colors.primary[500]} />
                <Typography variant="body">{branch.email}</Typography>
              </Row>
            </TouchableOpacity>

            {branch.fax && (
              <Row align="center" spacing="sm">
                <Icon name="fax" size={20} color={theme.colors.text.secondary} />
                <Typography variant="body">{branch.fax}</Typography>
              </Row>
            )}

            {branch.website && (
              <TouchableOpacity onPress={() => Linking.openURL(branch.website!)}>
                <Row align="center" spacing="sm">
                  <Icon
                    name="web"
                    size={20}
                    color={theme.colors.primary[500]}
                  />
                  <Typography variant="body" style={{color: theme.colors.primary[500]}}>
                    {branch.website}
                  </Typography>
                </Row>
              </TouchableOpacity>
            )}
          </Column>
        </Card>

        {/* Location */}
        <Card style={styles.section}>
          <Row justify="space-between" align="center">
            <Typography variant="h3">Location</Typography>
            {branch.latitude && branch.longitude && (
              <Button
                variant="outline"
                size="sm"
                onPress={handleNavigate}
                leftIcon={
                  <Icon name="navigation" size={16} color={theme.colors.primary[500]} />
                }>
                Navigate
              </Button>
            )}
          </Row>
          <Column spacing="xs" style={styles.locationContent}>
            <Typography variant="body">{branch.address}</Typography>
            <Typography variant="body">
              {branch.city}, {branch.state} {branch.zipCode}
            </Typography>
            <Typography variant="body">{branch.country}</Typography>
          </Column>
        </Card>

        {/* Performance Stats */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Performance Overview
          </Typography>
          <Row spacing="md">
            <View style={styles.statBox}>
              <Icon
                name="account-group"
                size={24}
                color={theme.colors.primary[500]}
              />
              <Typography variant="caption" color="secondary" style={styles.statLabel}>
                Staff
              </Typography>
              <Typography variant="h3">{branch.staffCount || 0}</Typography>
            </View>
            <View style={styles.statBox}>
              <Icon
                name="cash-multiple"
                size={24}
                color={theme.colors.success}
              />
              <Typography variant="caption" color="secondary" style={styles.statLabel}>
                Monthly Revenue
              </Typography>
              <Typography variant="h3">
                {formatCurrency(branch.monthlyRevenue)}
              </Typography>
            </View>
            <View style={styles.statBox}>
              <Icon
                name="receipt"
                size={24}
                color={theme.colors.secondary[500]}
              />
              <Typography variant="caption" color="secondary" style={styles.statLabel}>
                Transactions
              </Typography>
              <Typography variant="h3">{branch.transactionCount || 0}</Typography>
            </View>
          </Row>
        </Card>

        {/* Manager */}
        {branch.managerName && (
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Branch Manager
            </Typography>
            <Row align="center" spacing="sm">
              <Icon
                name="account-tie"
                size={24}
                color={theme.colors.primary[500]}
              />
              <Typography variant="body">{branch.managerName}</Typography>
            </Row>
          </Card>
        )}

        {/* Staff */}
        {staff && staff.length > 0 && (
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Staff Members ({staff.length})
            </Typography>
            <Column spacing="sm">
              {staff.slice(0, 5).map(member => (
                <Row key={member.id} align="center" spacing="sm">
                  <Icon
                    name="account"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                  <Column>
                    <Typography variant="body">{member.name}</Typography>
                    <Typography variant="caption" color="secondary">
                      {member.role}
                    </Typography>
                  </Column>
                </Row>
              ))}
              {staff.length > 5 && (
                <Typography variant="caption" color="secondary">
                  + {staff.length - 5} more
                </Typography>
              )}
            </Column>
          </Card>
        )}

        {/* Inventory Summary */}
        {inventory && (
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Inventory Summary
            </Typography>
            <Row spacing="md">
              <View style={styles.inventoryItem}>
                <Typography variant="caption" color="secondary">
                  Total Items
                </Typography>
                <Typography variant="h4">{inventory.totalItems}</Typography>
              </View>
              <View style={styles.inventoryItem}>
                <Typography variant="caption" color="secondary">
                  Value
                </Typography>
                <Typography variant="h4">
                  {formatCurrency(inventory.totalValue)}
                </Typography>
              </View>
              <View style={styles.inventoryItem}>
                <Typography variant="caption" color="secondary">
                  Low Stock
                </Typography>
                <Typography
                  variant="h4"
                  style={{
                    color:
                      inventory.lowStockItems > 0
                        ? theme.colors.warning
                        : theme.colors.success,
                  }}>
                  {inventory.lowStockItems}
                </Typography>
              </View>
            </Row>
          </Card>
        )}

        {/* Operating Hours */}
        {branch.settings?.operatingHours && (
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Operating Hours
            </Typography>
            <Column spacing="sm">
              {Object.entries(branch.settings.operatingHours).map(
                ([day, hours]) => {
                  if (day === 'holidays') return null;
                  const dayHours = hours as any;
                  return (
                    <Row key={day} justify="space-between">
                      <Typography variant="body" style={styles.dayName}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Typography>
                      <Typography variant="body" color="secondary">
                        {dayHours.isClosed
                          ? 'Closed'
                          : `${dayHours.open} - ${dayHours.close}`}
                      </Typography>
                    </Row>
                  );
                },
              )}
            </Column>
          </Card>
        )}
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
  },
  headerCard: {
    margin: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  headerActions: {
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  locationContent: {
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  statLabel: {
    marginTop: 4,
    marginBottom: 4,
  },
  inventoryItem: {
    flex: 1,
    alignItems: 'center',
  },
  dayName: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
