/**
 * Line Chart Card Component
 * Reusable line chart component with interactive features
 */

import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {colors} from '@/constants/colors';

const screenWidth = Dimensions.get('window').width;

interface DataPoint {
  value: number;
  label?: string;
  labelTextStyle?: any;
  dataPointText?: string;
}

interface LineChartCardProps {
  title: string;
  data: DataPoint[];
  color?: string;
  height?: number;
  showDataPoints?: boolean;
  curved?: boolean;
  yAxisSuffix?: string;
  yAxisPrefix?: string;
  hideRules?: boolean;
  hideYAxisText?: boolean;
}

export function LineChartCard({
  title,
  data,
  color = colors.primary,
  height = 200,
  showDataPoints = true,
  curved = true,
  yAxisSuffix = '',
  yAxisPrefix = '',
  hideRules = false,
  hideYAxisText = false,
}: LineChartCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth - 80}
          height={height}
          color={color}
          thickness={3}
          startFillColor={color}
          endFillColor={color}
          startOpacity={0.4}
          endOpacity={0.1}
          spacing={data.length > 1 ? (screenWidth - 120) / (data.length - 1) : screenWidth - 120}
          backgroundColor="transparent"
          rulesColor={colors.border}
          rulesType="solid"
          hideRules={hideRules}
          xAxisColor={colors.border}
          yAxisColor={colors.border}
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisText}
          hideYAxisText={hideYAxisText}
          curved={curved}
          dataPointsColor={color}
          dataPointsRadius={showDataPoints ? 4 : 0}
          textColor1={colors.text}
          textFontSize={12}
          yAxisLabelSuffix={yAxisSuffix}
          yAxisLabelPrefix={yAxisPrefix}
          animateOnDataChange
          animationDuration={1000}
          onDataChangeAnimationDuration={300}
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
