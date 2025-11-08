/**
 * Customer Reports Screen
 * Customer analytics and insights
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
import {MetricCard, PeriodSelector, LineChartCard, PieChartCard} from '@/components/reports';
import {
  useCustomerAnalytics,
  useNewVsReturningCustomers,
  useCustomerChartData,
} from '@/hooks/queries/useReports';
import type {ReportPeriod} from '@/types/api.types';

export default function CustomerReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('this_month');

  const {data: analytics, isLoading: loadingAnalytics, refetch} = useCustomerAnalytics({
    period: selectedPeriod,
  });

  const {data: newVsReturning, isLoading: loadingNvR} = useNewVsReturningCustomers({
    period: selectedPeriod,
  });

  const {data: chartData, isLoading: loadingChart} = useCustomerChartData({
    period: selectedPeriod,
  });

  const isLoading = loadingAnalytics || loadingNvR || loadingChart;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        <View style={styles.header}>
          <Text style={styles.title}>Customer Reports</Text>
          <Text style={styles.subtitle}>Understand your customer base</Text>
        </View>

        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

        {isLoading && !analytics && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {analytics && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsRow}>
              <MetricCard
                title="Total Customers"
                value={analytics.totalCustomers.toLocaleString()}
                subtitle={`${analytics.activeCustomers} active`}
                color={colors.primary}
              />
              <MetricCard
                title="New Customers"
                value={analytics.newCustomers.toLocaleString()}
                color={colors.success}
              />
              <MetricCard
                title="Retention Rate"
                value={`${analytics.customerRetentionRate.toFixed(1)}%`}
                color={colors.secondary}
              />
              <MetricCard
                title="Avg Customer Value"
                value={`$${analytics.averageCustomerValue.toFixed(2)}`}
                color={colors.warning}
              />
            </ScrollView>

            {chartData && chartData.labels.length > 0 && (
              <LineChartCard
                title="Customer Growth"
                data={chartData.totalCustomers?.map((value, index) => ({
                  value,
                  label: chartData.labels[index],
                })) || []}
                color={colors.secondary}
                height={220}
              />
            )}

            {newVsReturning && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>New vs Returning</Text>
                <View style={styles.comparisonRow}>
                  <View style={styles.comparisonCard}>
                    <Text style={styles.comparisonLabel}>New Customers</Text>
                    <Text style={styles.comparisonValue}>{newVsReturning.newCustomers.count}</Text>
                    <Text style={styles.comparisonSub}>
                      ${newVsReturning.newCustomers.totalSales.toLocaleString()} sales
                    </Text>
                  </View>
                  <View style={styles.comparisonCard}>
                    <Text style={styles.comparisonLabel}>Returning</Text>
                    <Text style={styles.comparisonValue}>
                      {newVsReturning.returningCustomers.count}
                    </Text>
                    <Text style={styles.comparisonSub}>
                      ${newVsReturning.returningCustomers.totalSales.toLocaleString()} sales
                    </Text>
                  </View>
                </View>
              </View>
            )}
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
  section: {marginTop: 16, marginHorizontal: 16},
  sectionTitle: {fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12},
  comparisonRow: {flexDirection: 'row', gap: 12},
  comparisonCard: {flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2},
  comparisonLabel: {fontSize: 12, color: colors.textSecondary, marginBottom: 8},
  comparisonValue: {fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 4},
  comparisonSub: {fontSize: 11, color: colors.textSecondary},
});
