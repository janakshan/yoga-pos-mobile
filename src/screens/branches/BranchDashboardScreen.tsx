/**
 * Branch Dashboard Screen
 * Display branch-specific performance metrics and analytics
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {BranchesStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  useBranch,
  useBranchPerformance,
  useBranchInventory,
} from '@hooks/queries/useBranches';

import {Typography} from '@components/ui/Typography';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';
import {MetricCard} from '@components/reports/MetricCard';
import {PeriodSelector} from '@components/reports/PeriodSelector';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type BranchDashboardRouteProp = RouteProp<
  BranchesStackParamList,
  'BranchDashboard'
>;

export const BranchDashboardScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<BranchDashboardRouteProp>();
  const {branchId} = route.params;

  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>(
    'month',
  );

  const {data: branch} = useBranch(branchId);
  const {data: performance, isLoading} = useBranchPerformance(branchId);
  const {data: inventory} = useBranchInventory(branchId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getRevenueByPeriod = () => {
    if (!performance) return 0;
    switch (period) {
      case 'today':
        return performance.todayRevenue;
      case 'week':
        return performance.weekRevenue;
      case 'month':
        return performance.monthRevenue;
      case 'year':
        return performance.yearRevenue;
      default:
        return 0;
    }
  };

  const getTransactionsByPeriod = () => {
    if (!performance) return 0;
    switch (period) {
      case 'today':
        return performance.todayTransactions;
      case 'week':
        return performance.weekTransactions;
      case 'month':
        return performance.monthTransactions;
      case 'year':
        return performance.yearTransactions;
      default:
        return 0;
    }
  };

  const getCustomersByPeriod = () => {
    if (!performance) return 0;
    switch (period) {
      case 'today':
        return performance.todayCustomers;
      case 'week':
        return performance.weekCustomers;
      case 'month':
        return performance.monthCustomers;
      default:
        return performance.totalCustomers;
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

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <ScrollView>
        <View style={styles.content}>
          {/* Header */}
          <Card style={styles.headerCard}>
            <Row justify="space-between" align="center">
              <Column>
                <Typography variant="h2">{branch?.name}</Typography>
                <Typography variant="body" color="secondary">
                  Branch Dashboard
                </Typography>
              </Column>
              {performance?.branchRank && (
                <View style={styles.rankBadge}>
                  <Icon
                    name="trophy"
                    size={20}
                    color={theme.colors.warning}
                  />
                  <Typography variant="bodyBold">
                    #{performance.branchRank}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    of {performance.totalBranches}
                  </Typography>
                </View>
              )}
            </Row>
          </Card>

          {/* Period Selector */}
          <PeriodSelector
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            periods={['today', 'week', 'month', 'year']}
          />

          {/* Key Metrics */}
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Revenue"
              value={formatCurrency(getRevenueByPeriod())}
              trend={performance?.revenueGrowth}
              icon="cash-multiple"
              color={theme.colors.success}
            />
            <MetricCard
              title="Transactions"
              value={formatNumber(getTransactionsByPeriod())}
              trend={performance?.transactionGrowth}
              icon="receipt"
              color={theme.colors.primary[500]}
            />
            <MetricCard
              title="Customers"
              value={formatNumber(getCustomersByPeriod())}
              icon="account-group"
              color={theme.colors.secondary[500]}
            />
            <MetricCard
              title="Avg Transaction"
              value={formatCurrency(performance?.averageTransactionValue || 0)}
              icon="calculator"
              color={theme.colors.info}
            />
          </View>

          {/* Performance Indicators */}
          {performance && (
            <Card style={styles.section}>
              <Typography variant="h3" style={styles.sectionTitle}>
                Performance Indicators
              </Typography>
              <Column spacing="md">
                {performance.conversionRate !== undefined && (
                  <Row justify="space-between" align="center">
                    <Typography variant="body">Conversion Rate</Typography>
                    <Typography variant="bodyBold">
                      {performance.conversionRate.toFixed(1)}%
                    </Typography>
                  </Row>
                )}
                {performance.customerSatisfactionScore !== undefined && (
                  <Row justify="space-between" align="center">
                    <Typography variant="body">
                      Customer Satisfaction
                    </Typography>
                    <Row align="center" spacing="xs">
                      <Typography variant="bodyBold">
                        {performance.customerSatisfactionScore.toFixed(1)}
                      </Typography>
                      <Icon
                        name="star"
                        size={16}
                        color={theme.colors.warning}
                      />
                    </Row>
                  </Row>
                )}
                {performance.inventoryTurnoverRate !== undefined && (
                  <Row justify="space-between" align="center">
                    <Typography variant="body">Inventory Turnover</Typography>
                    <Typography variant="bodyBold">
                      {performance.inventoryTurnoverRate.toFixed(2)}x
                    </Typography>
                  </Row>
                )}
                {performance.stockAccuracy !== undefined && (
                  <Row justify="space-between" align="center">
                    <Typography variant="body">Stock Accuracy</Typography>
                    <Typography variant="bodyBold">
                      {performance.stockAccuracy.toFixed(1)}%
                    </Typography>
                  </Row>
                )}
              </Column>
            </Card>
          )}

          {/* Inventory Summary */}
          {inventory && (
            <Card style={styles.section}>
              <Typography variant="h3" style={styles.sectionTitle}>
                Inventory Overview
              </Typography>
              <Column spacing="md">
                <Row justify="space-between" align="center">
                  <Typography variant="body">Total Items</Typography>
                  <Typography variant="bodyBold">
                    {formatNumber(inventory.totalItems)}
                  </Typography>
                </Row>
                <Row justify="space-between" align="center">
                  <Typography variant="body">Inventory Value</Typography>
                  <Typography variant="bodyBold">
                    {formatCurrency(inventory.totalValue)}
                  </Typography>
                </Row>
                <Row justify="space-between" align="center">
                  <Typography variant="body">Low Stock Items</Typography>
                  <Typography
                    variant="bodyBold"
                    style={{
                      color:
                        inventory.lowStockItems > 0
                          ? theme.colors.warning
                          : theme.colors.success,
                    }}>
                    {inventory.lowStockItems}
                  </Typography>
                </Row>
                <Row justify="space-between" align="center">
                  <Typography variant="body">Out of Stock</Typography>
                  <Typography
                    variant="bodyBold"
                    style={{
                      color:
                        inventory.outOfStockItems > 0
                          ? theme.colors.error
                          : theme.colors.success,
                    }}>
                    {inventory.outOfStockItems}
                  </Typography>
                </Row>
              </Column>
            </Card>
          )}

          {/* Category Breakdown */}
          {inventory?.categories && inventory.categories.length > 0 && (
            <Card style={styles.section}>
              <Typography variant="h3" style={styles.sectionTitle}>
                Inventory by Category
              </Typography>
              <Column spacing="sm">
                {inventory.categories.map((cat, index) => (
                  <Row key={index} justify="space-between" align="center">
                    <Column>
                      <Typography variant="body">{cat.category}</Typography>
                      <Typography variant="caption" color="secondary">
                        {cat.itemCount} items
                      </Typography>
                    </Column>
                    <Typography variant="bodyBold">
                      {formatCurrency(cat.value)}
                    </Typography>
                  </Row>
                ))}
              </Column>
            </Card>
          )}
        </View>
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
  content: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  rankBadge: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
});
