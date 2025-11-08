/**
 * Inventory Dashboard Screen
 * Main inventory overview with key metrics and quick actions
 */

import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {InventoryStackParamList} from '@navigation/types';
import {useTheme} from '@hooks/useTheme';
import {useInventoryDashboard, useLowStockAlerts} from '@hooks/queries/useInventory';
import {Typography, Button, Card} from '@components/ui';
import {Row, Column, Spacer} from '@components/layout';
import {Permission} from '@types/api.types';
import {useAuthStore} from '@store/slices/authSlice';

type NavigationProp = NativeStackNavigationProp<InventoryStackParamList>;

export const InventoryDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {theme} = useTheme();
  const {hasPermission} = useAuthStore();

  const {data: dashboard, isLoading} = useInventoryDashboard();
  const {data: alerts} = useLowStockAlerts({status: 'active', limit: 5});

  const canManage = hasPermission(Permission.INVENTORY_MANAGE);
  const canAdjust = hasPermission(Permission.INVENTORY_ADJUST);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={[styles.header, {backgroundColor: theme.colors.background.primary, borderBottomColor: theme.colors.border.light}]}>
          <Typography variant="h3" color={theme.colors.text.primary}>
            Inventory Management
          </Typography>
          <Spacer size="xs" />
          <Typography variant="body" color={theme.colors.text.secondary}>
            Manage stock levels, transfers, and adjustments
          </Typography>
        </View>

        <Spacer size="md" />

        {/* Summary Stats */}
        <Row wrap gap="md" style={styles.statsContainer}>
          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Typography variant="h3" color={theme.colors.primary[500]}>
              {dashboard?.summary?.totalProducts || 0}
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Total Products
            </Typography>
          </Card>

          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Typography variant="h3" color={theme.colors.success}>
              ${(dashboard?.summary?.totalValue || 0).toLocaleString()}
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Total Value
            </Typography>
          </Card>

          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Typography variant="h3" color={theme.colors.warning}>
              {dashboard?.summary?.lowStockItems || 0}
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Low Stock Items
            </Typography>
          </Card>

          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Typography variant="h3" color={theme.colors.error}>
              {dashboard?.summary?.outOfStockItems || 0}
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Out of Stock
            </Typography>
          </Card>
        </Row>

        <Spacer size="lg" />

        {/* Pending Actions */}
        {(dashboard?.summary?.pendingTransfers || dashboard?.summary?.pendingAdjustments) ? (
          <>
            <View style={styles.section}>
              <Typography variant="h5" color={theme.colors.text.primary}>
                Pending Actions
              </Typography>
              <Spacer size="md" />
              <Row gap="sm">
                {dashboard?.summary?.pendingTransfers > 0 && (
                  <Card
                    variant="outlined"
                    padding="md"
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('StockTransferList')}>
                    <Typography variant="h4" color={theme.colors.warning}>
                      {dashboard.summary.pendingTransfers}
                    </Typography>
                    <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                      Pending Transfers
                    </Typography>
                  </Card>
                )}
                {dashboard?.summary?.pendingAdjustments > 0 && (
                  <Card
                    variant="outlined"
                    padding="md"
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('StockAdjustmentList')}>
                    <Typography variant="h4" color={theme.colors.warning}>
                      {dashboard.summary.pendingAdjustments}
                    </Typography>
                    <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                      Pending Adjustments
                    </Typography>
                  </Card>
                )}
              </Row>
            </View>
            <Spacer size="lg" />
          </>
        ) : null}

        {/* Low Stock Alerts */}
        {alerts && alerts.data && alerts.data.length > 0 && (
          <>
            <View style={styles.section}>
              <Row justifyContent="space-between" alignItems="center">
                <Typography variant="h5" color={theme.colors.text.primary}>
                  Low Stock Alerts
                </Typography>
                <TouchableOpacity onPress={() => navigation.navigate('LowStockAlerts', {})}>
                  <Typography variant="bodySmall" color={theme.colors.primary[500]}>
                    View All
                  </Typography>
                </TouchableOpacity>
              </Row>
              <Spacer size="md" />
              <Column gap="sm">
                {alerts.data.slice(0, 5).map((alert) => (
                  <Card key={alert.id} variant="outlined" padding="sm">
                    <Row justifyContent="space-between" alignItems="center">
                      <Column style={{flex: 1}}>
                        <Typography variant="body" color={theme.colors.text.primary}>
                          {alert.product?.name || 'Unknown Product'}
                        </Typography>
                        <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                          Current: {alert.currentQuantity} | Threshold: {alert.threshold}
                        </Typography>
                      </Column>
                      <View style={[styles.severityBadge, {
                        backgroundColor: alert.severity === 'critical' ? theme.colors.error :
                                       alert.severity === 'out_of_stock' ? theme.colors.error :
                                       theme.colors.warning
                      }]}>
                        <Typography variant="caption" color={theme.colors.white}>
                          {alert.severity.toUpperCase()}
                        </Typography>
                      </View>
                    </Row>
                  </Card>
                ))}
              </Column>
            </View>
            <Spacer size="lg" />
          </>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Typography variant="h5" color={theme.colors.text.primary}>
            Quick Actions
          </Typography>
          <Spacer size="md" />

          <Column gap="sm">
            <Card variant="outlined" padding="md" onPress={() => navigation.navigate('StockLevels', {})}>
              <Typography variant="body" color={theme.colors.text.primary}>
                View Stock Levels
              </Typography>
            </Card>

            {canManage && (
              <Card variant="outlined" padding="md" onPress={() => navigation.navigate('StockTransferCreate')}>
                <Typography variant="body" color={theme.colors.text.primary}>
                  Create Stock Transfer
                </Typography>
              </Card>
            )}

            {canAdjust && (
              <Card variant="outlined" padding="md" onPress={() => navigation.navigate('StockAdjustmentCreate')}>
                <Typography variant="body" color={theme.colors.text.primary}>
                  Stock Adjustment
                </Typography>
              </Card>
            )}

            <Card variant="outlined" padding="md" onPress={() => navigation.navigate('CycleCountList')}>
              <Typography variant="body" color={theme.colors.text.primary}>
                Cycle Counts
              </Typography>
            </Card>

            <Card variant="outlined" padding="md" onPress={() => navigation.navigate('PhysicalInventoryList')}>
              <Typography variant="body" color={theme.colors.text.primary}>
                Physical Inventory
              </Typography>
            </Card>

            <Card variant="outlined" padding="md" onPress={() => navigation.navigate('WasteLossList')}>
              <Typography variant="body" color={theme.colors.text.primary}>
                Waste & Loss Tracking
              </Typography>
            </Card>

            <Card variant="outlined" padding="md" onPress={() => navigation.navigate('InventoryTransactions', {})}>
              <Typography variant="body" color={theme.colors.text.primary}>
                Transaction History
              </Typography>
            </Card>
          </Column>
        </View>

        <Spacer size="lg" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  statsContainer: {
    paddingHorizontal: 16,
  },
  statCard: {
    minWidth: 150,
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: 120,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
