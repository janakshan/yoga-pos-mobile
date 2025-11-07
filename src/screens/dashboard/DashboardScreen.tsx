import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useAuthStore} from '@store/slices/authSlice';
import {Theme} from '@constants/theme';

/**
 * Dashboard Screen
 * Main dashboard with overview and quick actions
 */

export const DashboardScreen = () => {
  const {user, logout} = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$12,500</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>85</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Customers</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>New Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add Customer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.secondary,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border.light,
  },
  title: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  welcome: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Theme.colors.white,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.sm,
  },
  statValue: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: Theme.colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.secondary,
  },
  section: {
    padding: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  actionButton: {
    backgroundColor: Theme.colors.white,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.base,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  actionButtonText: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.text.primary,
    fontWeight: '500',
  },
  logoutButton: {
    margin: Theme.spacing.lg,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.error,
    borderRadius: Theme.borderRadius.base,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Theme.colors.white,
    fontSize: Theme.typography.fontSize.base,
    fontWeight: '600',
  },
});
