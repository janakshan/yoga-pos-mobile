/**
 * Report Card Component
 * Clickable card for navigating to different report types
 */

import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants/colors';

interface ReportCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
  onPress: () => void;
}

export function ReportCard({
  title,
  description,
  icon,
  color = colors.primary,
  onPress,
}: ReportCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, {backgroundColor: `${color}20`}]}>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 28,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});
