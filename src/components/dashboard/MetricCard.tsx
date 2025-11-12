import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Typography} from '@components/ui';
import {Spacer} from '@components/layout';
import {useTheme} from '@hooks/useTheme';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  onPress?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color,
  onPress,
}) => {
  const {theme} = useTheme();

  const displayColor = color || theme.colors.primary[500];

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      // Format large numbers with K/M suffixes
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const renderTrend = () => {
    if (!trend) return null;

    const trendColor = trend.isPositive
      ? theme.colors.success
      : theme.colors.error;
    const trendIcon = trend.isPositive ? '↑' : '↓';

    return (
      <View style={styles.trendContainer}>
        <Typography
          variant="caption"
          color={trendColor}
          style={styles.trendText}>
          {trendIcon} {Math.abs(trend.value).toFixed(1)}%
        </Typography>
      </View>
    );
  };

  return (
    <Card
      variant="elevated"
      padding="md"
      style={styles.card}
      onPress={onPress}>
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, {backgroundColor: displayColor}]}>
              {icon}
            </View>
          </View>
        )}
        <View style={styles.textContainer}>
          <Typography variant="bodySmall" color={theme.colors.text.secondary}>
            {title}
          </Typography>
          <Spacer size="xs" />
          <View style={styles.valueRow}>
            <Typography variant="h3" color={displayColor}>
              {formatValue(value)}
            </Typography>
            {renderTrend()}
          </View>
          {subtitle && (
            <>
              <Spacer size="xs" />
              <Typography
                variant="caption"
                color={theme.colors.text.secondary}>
                {subtitle}
              </Typography>
            </>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
  },
  content: {
    flexDirection: 'column',
  },
  iconContainer: {
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.15,
  },
  textContainer: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendContainer: {
    marginLeft: 4,
  },
  trendText: {
    fontWeight: '600',
  },
});
