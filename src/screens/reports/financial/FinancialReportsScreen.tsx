/**
 * Financial Reports Screen
 * Financial analytics and reporting
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
import {MetricCard, PeriodSelector, LineChartCard, BarChartCard} from '@/components/reports';
import {
  useRevenueReport,
  useExpenseReport,
  useProfitMarginAnalysis,
  useFinancialChartData,
} from '@/hooks/queries/useReports';
import type {ReportPeriod} from '@/types/api.types';

export default function FinancialReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('this_month');

  const {data: revenue, isLoading: loadingRevenue, refetch} = useRevenueReport({
    period: selectedPeriod,
  });

  const {data: expenses, isLoading: loadingExpenses} = useExpenseReport({
    period: selectedPeriod,
  });

  const {data: profitMargin, isLoading: loadingProfit} = useProfitMarginAnalysis({
    period: selectedPeriod,
  });

  const {data: chartData, isLoading: loadingChart} = useFinancialChartData({
    period: selectedPeriod,
  });

  const isLoading = loadingRevenue || loadingExpenses || loadingProfit || loadingChart;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        <View style={styles.header}>
          <Text style={styles.title}>Financial Reports</Text>
          <Text style={styles.subtitle}>Monitor financial performance</Text>
        </View>

        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

        {isLoading && !revenue && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {revenue && expenses && profitMargin && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsRow}>
              <MetricCard
                title="Total Revenue"
                value={`$${revenue.totalRevenue.toLocaleString()}`}
                change={revenue.comparison?.changePercentage}
                changeLabel="vs previous period"
                color={colors.success}
              />
              <MetricCard
                title="Total Expenses"
                value={`$${expenses.totalExpenses.toLocaleString()}`}
                change={expenses.comparison?.changePercentage}
                changeLabel="vs previous period"
                color={colors.error}
              />
              <MetricCard
                title="Net Profit"
                value={`$${profitMargin.netProfit.toLocaleString()}`}
                subtitle={`${profitMargin.netProfitMargin.toFixed(1)}% margin`}
                color={colors.primary}
              />
              <MetricCard
                title="Gross Profit Margin"
                value={`${profitMargin.grossProfitMargin.toFixed(1)}%`}
                subtitle={`$${profitMargin.grossProfit.toLocaleString()}`}
                color={colors.warning}
              />
            </ScrollView>

            {/* Revenue vs Expenses Chart */}
            {chartData && chartData.labels.length > 0 && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Revenue vs Expenses</Text>
                <LineChartCard
                  title=""
                  data={chartData.revenue.map((value, index) => ({
                    value,
                    label: chartData.labels[index],
                  }))}
                  color={colors.success}
                  yAxisPrefix="$"
                  height={220}
                />
              </View>
            )}

            {/* Expenses by Category */}
            {expenses.expensesByCategory.length > 0 && (
              <BarChartCard
                title="Top Expense Categories"
                data={expenses.expensesByCategory.slice(0, 10).map((cat) => ({
                  value: cat.amount,
                  label: cat.category.name.substring(0, 10),
                }))}
                color={colors.error}
                yAxisPrefix="$"
                height={200}
              />
            )}

            {/* Profit Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profitability Metrics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Gross Profit</Text>
                  <Text style={styles.statValue}>
                    ${profitMargin.grossProfit.toLocaleString()}
                  </Text>
                  <Text style={styles.statSub}>
                    {profitMargin.grossProfitMargin.toFixed(1)}% margin
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Operating Profit</Text>
                  <Text style={styles.statValue}>
                    ${profitMargin.operatingProfit.toLocaleString()}
                  </Text>
                  <Text style={styles.statSub}>
                    {profitMargin.operatingProfitMargin.toFixed(1)}% margin
                  </Text>
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
  container: {flex: 1, backgroundColor: colors.background},
  scrollContent: {paddingBottom: 20},
  header: {padding: 16, paddingTop: 8},
  title: {fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 4},
  subtitle: {fontSize: 14, color: colors.textSecondary},
  loadingContainer: {padding: 40, alignItems: 'center'},
  metricsRow: {marginVertical: 8, paddingHorizontal: 8},
  chartContainer: {marginHorizontal: 16, marginTop: 8},
  chartTitle: {fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8},
  section: {marginTop: 16, marginHorizontal: 16},
  sectionTitle: {fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12},
  statsGrid: {flexDirection: 'row', gap: 12},
  statItem: {flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2},
  statLabel: {fontSize: 12, color: colors.textSecondary, marginBottom: 6},
  statValue: {fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 2},
  statSub: {fontSize: 11, color: colors.textSecondary},
});
