import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Typography} from '@components/ui';
import {Row} from '@components/layout';
import {useTheme} from '@hooks/useTheme';
import {TimePeriod} from '@types/dashboard.types';

interface TimePeriodFilterProps {
  selectedPeriod: TimePeriod;
  onSelectPeriod: (period: TimePeriod) => void;
}

export const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({
  selectedPeriod,
  onSelectPeriod,
}) => {
  const {theme} = useTheme();

  const periods: {value: TimePeriod; label: string}[] = [
    {value: 'today', label: 'Today'},
    {value: 'week', label: 'Week'},
    {value: 'month', label: 'Month'},
  ];

  return (
    <Row gap="sm" style={styles.container}>
      {periods.map(period => {
        const isSelected = selectedPeriod === period.value;

        return (
          <TouchableOpacity
            key={period.value}
            onPress={() => onSelectPeriod(period.value)}
            style={[
              styles.periodButton,
              {
                backgroundColor: isSelected
                  ? theme.colors.primary[500]
                  : theme.colors.background.secondary,
                borderColor: isSelected
                  ? theme.colors.primary[500]
                  : theme.colors.border.light,
              },
            ]}>
            <Typography
              variant="bodySmall"
              color={
                isSelected ? '#FFFFFF' : theme.colors.text.primary
              }
              style={styles.periodText}>
              {period.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  periodText: {
    fontWeight: '600',
  },
});
