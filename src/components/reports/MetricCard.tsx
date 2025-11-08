/**
 * Metric Card Component
 * Displays a metric with optional trend indicator
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants/colors';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  color?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  color = colors.primary,
  icon,
  loading = false,
}: MetricCardProps) {
  const isPositiveChange = change !== undefined && change >= 0;
  const changeColor = isPositiveChange ? colors.success : colors.error;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <Text style={[styles.value, {color}]}>{value}</Text>

          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          {change !== undefined && (
            <View style={styles.changeContainer}>
              <View style={[styles.changeBadge, {backgroundColor: changeColor}]}>
                <Text style={styles.changeText}>
                  {isPositiveChange ? '+' : ''}
                  {change.toFixed(1)}%
                </Text>
              </View>
              {changeLabel && <Text style={styles.changeLabel}>{changeLabel}</Text>}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  loadingContainer: {
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
