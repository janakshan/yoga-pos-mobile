/**
 * Bar Chart Card Component
 * Reusable bar chart component with interactive features
 */

import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {colors} from '@/constants/colors';

const screenWidth = Dimensions.get('window').width;

interface BarDataPoint {
  value: number;
  label?: string;
  labelTextStyle?: any;
  frontColor?: string;
  topLabelComponent?: () => JSX.Element;
}

interface BarChartCardProps {
  title: string;
  data: BarDataPoint[];
  color?: string;
  height?: number;
  showYAxisText?: boolean;
  yAxisSuffix?: string;
  yAxisPrefix?: string;
  spacing?: number;
  barWidth?: number;
  roundedTop?: boolean;
  showGradient?: boolean;
}

export function BarChartCard({
  title,
  data,
  color = colors.primary,
  height = 200,
  showYAxisText = true,
  yAxisSuffix = '',
  yAxisPrefix = '',
  spacing = 20,
  barWidth = 30,
  roundedTop = true,
  showGradient = true,
}: BarChartCardProps) {
  // Apply color to all bars if not specified
  const chartData = data.map((item) => ({
    ...item,
    frontColor: item.frontColor || color,
    gradientColor: showGradient ? color : undefined,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={screenWidth - 100}
          height={height}
          barWidth={barWidth}
          spacing={spacing}
          roundedTop={roundedTop}
          roundedBottom={false}
          hideRules={false}
          xAxisThickness={1}
          yAxisThickness={1}
          xAxisColor={colors.border}
          yAxisColor={colors.border}
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisText}
          noOfSections={5}
          maxValue={Math.max(...data.map((d) => d.value)) * 1.1}
          isAnimated
          animationDuration={1000}
          showGradient={showGradient}
          yAxisLabelSuffix={yAxisSuffix}
          yAxisLabelPrefix={yAxisPrefix}
          hideYAxisText={!showYAxisText}
        />
      </View>
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
    paddingLeft: 10,
  },
  yAxisText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  xAxisText: {
    color: colors.textSecondary,
    fontSize: 10,
    width: 60,
    textAlign: 'center',
  },
});
