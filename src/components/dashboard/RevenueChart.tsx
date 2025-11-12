import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {useTheme} from '@hooks/useTheme';
import {ChartDataPoint} from '@types/dashboard.types';
import {Typography} from '@components/ui';
import {Spacer} from '@components/layout';

interface RevenueChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar';
  height?: number;
  showTitle?: boolean;
  title?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  type = 'line',
  height = 220,
  showTitle = true,
  title = 'Revenue Overview',
}) => {
  const {theme} = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // Transform data for chart-kit format
  const chartData = {
    labels: data.map(item => item.label || item.date.split('-').pop() || ''),
    datasets: [
      {
        data: data.map(item => item.value),
        color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`, // primary color
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.background.primary,
    backgroundGradientFrom: theme.colors.background.primary,
    backgroundGradientTo: theme.colors.background.primary,
    decimalPlaces: 0,
    color: (opacity = 1) =>
      theme.isDark
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) =>
      theme.isDark
        ? `rgba(255, 255, 255, ${opacity * 0.7})`
        : `rgba(0, 0, 0, ${opacity * 0.7})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary[500],
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border.light,
      strokeWidth: 1,
    },
  };

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart
          data={chartData}
          width={screenWidth - 48}
          height={height}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisLabel="$"
          yAxisSuffix=""
          showBarTops={false}
          fromZero
          withInnerLines
        />
      );
    }

    return (
      <LineChart
        data={chartData}
        width={screenWidth - 48}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisLabel="$"
        yAxisSuffix=""
        withInnerLines
        withOuterLines
        withVerticalLines={false}
        withHorizontalLines
        withDots
        withShadow
      />
    );
  };

  return (
    <View style={styles.container}>
      {showTitle && (
        <>
          <Typography variant="h6" color={theme.colors.text.primary}>
            {title}
          </Typography>
          <Spacer size="sm" />
        </>
      )}
      <View
        style={[
          styles.chartContainer,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        {renderChart()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartContainer: {
    borderRadius: 16,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  chart: {
    marginLeft: -16,
    borderRadius: 16,
  },
});
