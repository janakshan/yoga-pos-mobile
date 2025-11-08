/**
 * Sales Reports Screen
 * Comprehensive sales analytics and reporting
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
import {colors} from '@/constants/colors';
import {
  MetricCard,
  PeriodSelector,
  LineChartCard,
  BarChartCard,
  PieChartCard,
} from '@/components/reports';
import {
  useSalesSummary,
  useSalesByCategory,
  useSalesByPaymentMethod,
  useSalesChartData,
} from '@/hooks/queries/useReports';
import type {ReportPeriod} from '@/types/api.types';

export default function SalesReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('this_month');

  const {data: summary, isLoading: loadingSummary, refetch: refetchSummary} = useSalesSummary({
    period: selectedPeriod,
  });

  const {data: categoryData, isLoading: loadingCategory} = useSalesByCategory({
    period: selectedPeriod,
  });

  const {data: paymentData, isLoading: loadingPayment} = useSalesByPaymentMethod({
    period: selectedPeriod,
  });

  const {data: chartData, isLoading: loadingChart} = useSalesChartData({
    period: selectedPeriod,
  });

  const isLoading = loadingSummary || loadingCategory || loadingPayment || loadingChart;

  const handlePeriodChange = (period: ReportPeriod) => {
    setSelectedPeriod(period);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetchSummary} />}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sales Reports</Text>
          <Text style={styles.subtitle}>Analyze your sales performance</Text>
        </View>

        {/* Period Selector */}
        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />

        {/* Loading State */}
        {isLoading && !summary && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading sales data...</Text>
          </View>
        )}

        {/* Metrics */}
        {summary && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.metricsRow}>
              <MetricCard
                title="Total Sales"
                value={`$${summary.totalSales.toLocaleString()}`}
                change={summary.comparison?.changePercentage}
                changeLabel="vs previous period"
                color={colors.primary}
              />
              <MetricCard
                title="Net Sales"
                value={`$${summary.netSales.toLocaleString()}`}
                subtitle={`After discounts & refunds`}
                color={colors.success}
              />
              <MetricCard
                title="Transactions"
                value={summary.totalTransactions.toLocaleString()}
                subtitle={`${summary.totalItems} items sold`}
                color={colors.secondary}
              />
              <MetricCard
                title="Avg Transaction"
                value={`$${summary.averageTransaction.toFixed(2)}`}
                subtitle={`${summary.averageItemsPerTransaction.toFixed(1)} items/order`}
                color={colors.warning}
              />
            </ScrollView>

            {/* Sales Trend Chart */}
            {chartData && chartData.labels.length > 0 && (
              <LineChartCard
                title="Sales Trend"
                data={chartData.sales.map((value, index) => ({
                  value,
                  label: chartData.labels[index],
                }))}
                color={colors.primary}
                yAxisPrefix="$"
                height={220}
              />
            )}

            {/* Sales by Category Chart */}
            {categoryData && categoryData.categories.length > 0 && (
              <PieChartCard
                title="Sales by Category"
                data={categoryData.categories.map((cat) => ({
                  value: cat.totalSales,
                }))}
                labels={categoryData.categories.map((cat) => cat.category.name)}
                radius={100}
                innerRadius={60}
                donut
                showLegend
              />
            )}

            {/* Sales by Payment Method Chart */}
            {paymentData && paymentData.paymentMethods.length > 0 && (
              <BarChartCard
                title="Sales by Payment Method"
                data={paymentData.paymentMethods.map((pm) => ({
                  value: pm.totalAmount,
                  label: pm.method,
                }))}
                color={colors.secondary}
                yAxisPrefix="$"
                height={200}
              />
            )}

            {/* Additional Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Metrics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Discounts</Text>
                  <Text style={styles.statValue}>${summary.totalDiscounts.toLocaleString()}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Refunds</Text>
                  <Text style={styles.statValue}>${summary.totalRefunds.toLocaleString()}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Tax</Text>
                  <Text style={styles.statValue}>${summary.totalTax.toLocaleString()}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Items Sold</Text>
                  <Text style={styles.statValue}>{summary.totalItems.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </>
        )}
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
    fontSize: 24,
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
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
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
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
});
