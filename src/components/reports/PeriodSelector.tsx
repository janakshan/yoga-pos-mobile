/**
 * Period Selector Component
 * Component for selecting report time periods
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {colors} from '@/constants/colors';
import type {ReportPeriod} from '@/types/api.types';

interface PeriodSelectorProps {
  selectedPeriod: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  showCustom?: boolean;
}

const periods: Array<{value: ReportPeriod; label: string}> = [
  {value: 'today', label: 'Today'},
  {value: 'yesterday', label: 'Yesterday'},
  {value: 'this_week', label: 'This Week'},
  {value: 'last_week', label: 'Last Week'},
  {value: 'this_month', label: 'This Month'},
  {value: 'last_month', label: 'Last Month'},
  {value: 'this_quarter', label: 'This Quarter'},
  {value: 'last_quarter', label: 'Last Quarter'},
  {value: 'this_year', label: 'This Year'},
  {value: 'last_year', label: 'Last Year'},
  {value: 'custom', label: 'Custom'},
];

export function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  showCustom = true,
}: PeriodSelectorProps) {
  const filteredPeriods = showCustom ? periods : periods.filter((p) => p.value !== 'custom');

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filteredPeriods.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[styles.periodButton, selectedPeriod === period.value && styles.selectedButton]}
            onPress={() => onPeriodChange(period.value)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period.value && styles.selectedText,
              ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedText: {
    color: colors.white,
    fontWeight: '600',
  },
});
