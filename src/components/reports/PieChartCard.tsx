/**
 * Pie Chart Card Component
 * Reusable pie chart component with legend
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {colors} from '@/constants/colors';

interface PieDataPoint {
  value: number;
  color?: string;
  text?: string;
  focused?: boolean;
}

interface LegendItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface PieChartCardProps {
  title: string;
  data: PieDataPoint[];
  labels?: string[];
  radius?: number;
  innerRadius?: number;
  donut?: boolean;
  showLegend?: boolean;
  centerLabelComponent?: () => JSX.Element;
  showValuesOnChart?: boolean;
}

const defaultColors = [
  colors.primary,
  colors.secondary,
  colors.success,
  colors.warning,
  colors.error,
  '#9C27B0',
  '#FF6F00',
  '#00897B',
  '#5E35B1',
  '#C62828',
];

export function PieChartCard({
  title,
  data,
  labels = [],
  radius = 100,
  innerRadius = 60,
  donut = true,
  showLegend = true,
  centerLabelComponent,
  showValuesOnChart = false,
}: PieChartCardProps) {
  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Prepare chart data with colors
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length],
  }));

  // Prepare legend data
  const legendData: LegendItem[] = chartData.map((item, index) => ({
    label: labels[index] || `Item ${index + 1}`,
    value: item.value,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
    color: item.color || defaultColors[index % defaultColors.length],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          radius={radius}
          innerRadius={donut ? innerRadius : 0}
          donut={donut}
          showText={showValuesOnChart}
          textColor={colors.white}
          textSize={12}
          showTextBackground={false}
          focusOnPress
          isAnimated
          animationDuration={1000}
          centerLabelComponent={centerLabelComponent}
        />
      </View>
      {showLegend && (
        <ScrollView style={styles.legendContainer} horizontal showsHorizontalScrollIndicator={false}>
          {legendData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: item.color}]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>
                  {item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  legendContainer: {
    marginTop: 16,
    maxHeight: 120,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendTextContainer: {
    flexDirection: 'column',
  },
  legendLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
