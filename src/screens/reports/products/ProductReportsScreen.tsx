/**
 * Product Reports Screen
 * Product performance and inventory analytics
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
import {MetricCard, PeriodSelector, BarChartCard, PieChartCard} from '@/components/reports';
import {
  useBestSellers,
  useSlowMovingItems,
  useProductChartData,
} from '@/hooks/queries/useReports';
import type {ReportPeriod} from '@/types/api.types';

export default function ProductReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('this_month');

  const {data: bestSellers, isLoading: loadingBest, refetch} = useBestSellers({
    period: selectedPeriod,
  });

  const {data: slowMoving, isLoading: loadingSlow} = useSlowMovingItems({
    period: selectedPeriod,
  });

  const {data: chartData, isLoading: loadingChart} = useProductChartData({
    period: selectedPeriod,
  });

  const isLoading = loadingBest || loadingSlow || loadingChart;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        <View style={styles.header}>
          <Text style={styles.title}>Product Reports</Text>
          <Text style={styles.subtitle}>Track product performance</Text>
        </View>

        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

        {isLoading && !bestSellers && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {bestSellers && (
          <>
            {/* Best Sellers Chart */}
            {bestSellers.byRevenue.length > 0 && (
              <BarChartCard
                title="Top Products by Revenue"
                data={bestSellers.byRevenue.slice(0, 10).map((item) => ({
                  value: item.revenue,
                  label: item.product.name.substring(0, 10),
                }))}
                color={colors.success}
                yAxisPrefix="$"
                height={220}
              />
            )}

            {/* Products by Quantity */}
            {bestSellers.byQuantity.length > 0 && (
              <PieChartCard
                title="Top Products by Quantity Sold"
                data={bestSellers.byQuantity.slice(0, 8).map((item) => ({
                  value: item.quantitySold,
                }))}
                labels={bestSellers.byQuantity.slice(0, 8).map((item) => item.product.name)}
                donut
                showLegend
              />
            )}

            {/* Slow Moving Items */}
            {slowMoving && slowMoving.products.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Slow Moving Items</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Items</Text>
                    <Text style={styles.statValue}>{slowMoving.products.length}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Stock Value</Text>
                    <Text style={styles.statValue}>
                      ${slowMoving.totalStockValue.toLocaleString()}
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
  section: {marginTop: 16, marginHorizontal: 16},
  sectionTitle: {fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12},
  statsGrid: {flexDirection: 'row', gap: 12},
  statItem: {flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2},
  statLabel: {fontSize: 12, color: colors.textSecondary, marginBottom: 6},
  statValue: {fontSize: 18, fontWeight: 'bold', color: colors.text},
});
