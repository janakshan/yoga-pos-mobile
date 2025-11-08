/**
 * Financial Dashboard Screen
 * Main dashboard for financial management with key metrics and quick actions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FinancialStackParamList } from '../../navigation/types';
import { useFinancialDashboard } from '../../hooks/queries/useFinancial';
import { theme } from '../../constants/theme';

type NavigationProp = NativeStackNavigationProp<FinancialStackParamList>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cards per row with spacing

export const FinancialDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');

  const { data: dashboard, isLoading, refetch, isRefetching } = useFinancialDashboard({
    period,
  });

  const periods = [
    { label: 'Today', value: 'today' as const },
    { label: 'Week', value: 'week' as const },
    { label: 'Month', value: 'month' as const },
    { label: 'Quarter', value: 'quarter' as const },
    { label: 'Year', value: 'year' as const },
  ];

  const quickActions = [
    {
      title: 'Invoices',
      icon: '📄',
      color: '#4CAF50',
      onPress: () => navigation.navigate('InvoiceList'),
    },
    {
      title: 'Payments',
      icon: '💳',
      color: '#2196F3',
      onPress: () => navigation.navigate('PaymentList'),
    },
    {
      title: 'Expenses',
      icon: '💰',
      color: '#FF9800',
      onPress: () => navigation.navigate('ExpenseList'),
    },
    {
      title: 'Reports',
      icon: '📊',
      color: '#9C27B0',
      onPress: () => navigation.navigate('FinancialReports'),
    },
    {
      title: 'Bank Accounts',
      icon: '🏦',
      color: '#00BCD4',
      onPress: () => navigation.navigate('BankAccountList'),
    },
    {
      title: 'Cash Flow',
      icon: '💵',
      color: '#FFC107',
      onPress: () => navigation.navigate('CashFlowOverview'),
    },
    {
      title: 'EOD',
      icon: '🌙',
      color: '#607D8B',
      onPress: () => navigation.navigate('EODReconciliationList'),
    },
    {
      title: 'Reconciliation',
      icon: '⚖️',
      color: '#795548',
      onPress: () => navigation.navigate('ReconciliationList', {}),
    },
  ];

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: dashboard?.currency || 'USD',
    }).format(amount);
  };

  const formatPercent = (value?: number) => {
    if (value === undefined) return '-';
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading financial data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Management</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Period Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.periodSelector}
        contentContainerStyle={styles.periodSelectorContent}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[styles.periodButton, period === p.value && styles.periodButtonActive]}
            onPress={() => setPeriod(p.value)}>
            <Text
              style={[styles.periodButtonText, period === p.value && styles.periodButtonTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
        {/* Summary Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.summaryCardLabel}>Revenue</Text>
              <Text style={styles.summaryCardValue}>
                {formatCurrency(dashboard?.summary?.totalRevenue)}
              </Text>
              <Text style={styles.summaryCardSubtext}>This {period}</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#F44336' }]}>
              <Text style={styles.summaryCardLabel}>Expenses</Text>
              <Text style={styles.summaryCardValue}>
                {formatCurrency(dashboard?.summary?.totalExpenses)}
              </Text>
              <Text style={styles.summaryCardSubtext}>This {period}</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#2196F3' }]}>
              <Text style={styles.summaryCardLabel}>Net Profit</Text>
              <Text style={styles.summaryCardValue}>
                {formatCurrency(dashboard?.summary?.netProfit)}
              </Text>
              <Text style={styles.summaryCardSubtext}>
                Margin: {formatPercent(dashboard?.summary?.profitMargin)}
              </Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.summaryCardLabel}>Outstanding</Text>
              <Text style={styles.summaryCardValue}>
                {formatCurrency(dashboard?.summary?.totalOutstanding)}
              </Text>
              <Text style={styles.summaryCardSubtext}>Receivables</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.7}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Text style={styles.actionIconText}>{action.icon}</Text>
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cash Position */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cash Position</Text>
          <View style={styles.cashCard}>
            <View style={styles.cashRow}>
              <Text style={styles.cashLabel}>Cash on Hand</Text>
              <Text style={styles.cashValue}>
                {formatCurrency(dashboard?.summary?.cashOnHand)}
              </Text>
            </View>
            <View style={styles.cashRow}>
              <Text style={styles.cashLabel}>Bank Balance</Text>
              <Text style={styles.cashValue}>
                {formatCurrency(dashboard?.summary?.bankBalance)}
              </Text>
            </View>
            <View style={[styles.cashRow, styles.cashRowTotal]}>
              <Text style={styles.cashLabelTotal}>Total Cash</Text>
              <Text style={styles.cashValueTotal}>
                {formatCurrency(
                  (dashboard?.summary?.cashOnHand || 0) + (dashboard?.summary?.bankBalance || 0)
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Invoices</Text>
            <TouchableOpacity onPress={() => navigation.navigate('InvoiceList')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {dashboard?.recentInvoices && dashboard.recentInvoices.length > 0 ? (
            <View style={styles.listContainer}>
              {dashboard.recentInvoices.slice(0, 5).map((invoice) => (
                <TouchableOpacity
                  key={invoice.id}
                  style={styles.listItem}
                  onPress={() => navigation.navigate('InvoiceDetails', { invoiceId: invoice.id })}>
                  <View style={styles.listItemLeft}>
                    <Text style={styles.listItemTitle}>{invoice.invoiceNumber}</Text>
                    <Text style={styles.listItemSubtitle}>
                      {invoice.customer?.firstName} {invoice.customer?.lastName}
                    </Text>
                  </View>
                  <View style={styles.listItemRight}>
                    <Text style={styles.listItemAmount}>{formatCurrency(invoice.total)}</Text>
                    <View style={[styles.statusBadge, getStatusBadgeStyle(invoice.status)]}>
                      <Text style={styles.statusBadgeText}>{invoice.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No recent invoices</Text>
          )}
        </View>

        {/* Alerts */}
        {dashboard?.alerts && dashboard.alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            {dashboard.alerts.slice(0, 3).map((alert) => (
              <View key={alert.id} style={[styles.alertCard, getAlertCardStyle(alert.severity)]}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                {alert.actionRequired && (
                  <Text style={styles.alertAction}>{alert.actionRequired}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const getStatusBadgeStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return { backgroundColor: '#4CAF50' };
    case 'partial':
      return { backgroundColor: '#FF9800' };
    case 'overdue':
      return { backgroundColor: '#F44336' };
    case 'draft':
      return { backgroundColor: '#9E9E9E' };
    default:
      return { backgroundColor: '#2196F3' };
  }
};

const getAlertCardStyle = (severity: string) => {
  switch (severity) {
    case 'critical':
      return { borderLeftColor: '#F44336' };
    case 'high':
      return { borderLeftColor: '#FF9800' };
    case 'medium':
      return { borderLeftColor: '#FFC107' };
    default:
      return { borderLeftColor: '#2196F3' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  periodSelector: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  periodSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  summaryCard: {
    width: CARD_WIDTH,
    margin: 6,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryCardSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionCard: {
    width: CARD_WIDTH,
    margin: 6,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  cashCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  cashRowTotal: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
    paddingTop: 16,
  },
  cashLabel: {
    fontSize: 14,
    color: '#666',
  },
  cashValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  cashLabelTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  cashValueTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  listItemLeft: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  alertMessage: {
    fontSize: 13,
    color: '#212121',
    marginBottom: 4,
  },
  alertAction: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 24,
  },
  bottomPadding: {
    height: 24,
  },
});
