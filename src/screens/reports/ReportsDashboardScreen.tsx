/**
 * Reports Dashboard Screen
 * Main dashboard for accessing all report types
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ReportsStackParamList} from '@/navigation/types';
import {colors} from '@/constants/colors';
import {MetricCard, PeriodSelector, ReportCard} from '@/components/reports';
import {useReportsDashboard} from '@/hooks/queries/useReports';
import type {ReportPeriod} from '@/types/api.types';

type NavigationProp = NativeStackNavigationProp<ReportsStackParamList>;

export default function ReportsDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('this_month');

  const {data: dashboard, isLoading, refetch} = useReportsDashboard({period: selectedPeriod});

  const handlePeriodChange = (period: ReportPeriod) => {
    setSelectedPeriod(period);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reports & Analytics</Text>
          <Text style={styles.subtitle}>View insights and export reports</Text>
        </View>

        {/* Period Selector */}
        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />

        {/* Loading State */}
        {isLoading && !dashboard && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        )}

        {/* Metrics Grid */}
        {dashboard && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsRow}>
              <MetricCard
                title="Total Sales"
                value={`$${dashboard.sales.total.toLocaleString()}`}
                change={dashboard.sales.changePercentage}
                changeLabel="vs previous period"
                color={colors.primary}
              />
              <MetricCard
                title="Revenue"
                value={`$${dashboard.revenue.total.toLocaleString()}`}
                change={dashboard.revenue.changePercentage}
                changeLabel="vs previous period"
                color={colors.success}
              />
              <MetricCard
                title="Net Profit"
                value={`$${dashboard.profit.total.toLocaleString()}`}
                subtitle={`${dashboard.profit.margin.toFixed(1)}% margin`}
                change={dashboard.profit.changePercentage}
                changeLabel="vs previous period"
                color={colors.warning}
              />
              <MetricCard
                title="Customers"
                value={dashboard.customers.total.toLocaleString()}
                subtitle={`${dashboard.customers.new} new, ${dashboard.customers.returning} returning`}
                change={dashboard.customers.changePercentage}
                color={colors.secondary}
              />
            </ScrollView>

            {/* Quick Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Stats</Text>
              <View style={styles.quickStatsGrid}>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatLabel}>Avg Transaction</Text>
                  <Text style={styles.quickStatValue}>
                    ${dashboard.quickStats.avgTransactionValue.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatLabel}>Avg Items/Order</Text>
                  <Text style={styles.quickStatValue}>
                    {dashboard.quickStats.avgItemsPerTransaction.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatLabel}>Retention Rate</Text>
                  <Text style={styles.quickStatValue}>
                    {dashboard.quickStats.customerRetentionRate.toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatLabel}>Inventory Turnover</Text>
                  <Text style={styles.quickStatValue}>
                    {dashboard.quickStats.inventoryTurnover.toFixed(1)}x
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Report Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Categories</Text>

          <ReportCard
            title="Sales Reports"
            description="View sales by product, category, staff, and payment method"
            color={colors.primary}
            onPress={() => navigation.navigate('SalesReports', {})}
          />

          <ReportCard
            title="Customer Reports"
            description="Analyze customer behavior, segmentation, and lifetime value"
            color={colors.secondary}
            onPress={() => navigation.navigate('CustomerReports', {})}
          />

          <ReportCard
            title="Product Reports"
            description="Track product performance, best sellers, and slow-moving items"
            color={colors.success}
            onPress={() => navigation.navigate('ProductReports', {})}
          />

          <ReportCard
            title="Financial Reports"
            description="Review revenue, expenses, profit margins, and cash flow"
            color={colors.warning}
            onPress={() => navigation.navigate('FinancialReportsOverview', {})}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  metricsRow: {
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  quickStatItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
});
