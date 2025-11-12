import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useAuthStore} from '@store/slices/authSlice';
import {useDashboardStore} from '@store/slices/dashboardSlice';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button} from '@components/ui';
import {Row, Spacer} from '@components/layout';
import {
  MetricCard,
  RevenueChart,
  ClassSchedule,
  RecentTransactions,
  ActivityFeed,
  BranchSelector,
  TimePeriodFilter,
} from '@components/dashboard';
import {TimePeriod} from '@types/dashboard.types';
import {Branch} from '@types/api.types';

/**
 * Dashboard Screen
 * Main dashboard with comprehensive overview, real-time statistics, and quick actions
 * Features:
 * - Multi-branch overview
 * - Real-time statistics
 * - Revenue tracking (daily/weekly/monthly)
 * - Active members count
 * - Today's class schedule
 * - Recent transactions
 * - Quick actions panel
 * - Activity feed
 * - Pull-to-refresh functionality
 * - Swipeable chart views
 */

export const DashboardScreen = () => {
  const {user, logout} = useAuthStore();
  const {theme, toggleTheme, isDark} = useTheme();
  const {
    metrics,
    todayClasses,
    recentTransactions,
    activityFeed,
    filters,
    isRefreshing,
    selectedBranchId,
    fetchDashboardData,
    refreshDashboard,
    setTimePeriod,
    setSelectedBranch,
  } = useDashboardStore();

  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Mock branches data (in production, this would come from an API/store)
  const mockBranches: Branch[] = [
    {
      id: '1',
      name: 'Downtown Yoga Studio',
      code: 'DWN',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      phone: '(415) 555-0100',
      email: 'downtown@yogastudio.com',
      isActive: true,
      staffCount: 12,
      monthlyRevenue: 45000,
      transactionCount: 320,
      createdAt: '2024-01-01',
      updatedAt: '2024-12-01',
    },
    {
      id: '2',
      name: 'Sunset Beach Yoga',
      code: 'SNS',
      address: '456 Ocean Ave',
      city: 'Santa Monica',
      state: 'CA',
      zipCode: '90401',
      country: 'USA',
      phone: '(310) 555-0200',
      email: 'sunset@yogastudio.com',
      isActive: true,
      staffCount: 8,
      monthlyRevenue: 32000,
      transactionCount: 245,
      createdAt: '2024-02-01',
      updatedAt: '2024-12-01',
    },
  ];

  // Load dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleRefresh = async () => {
    await refreshDashboard();
  };

  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  const toggleChartType = () => {
    setChartType(prev => (prev === 'line' ? 'bar' : 'line'));
  };

  // Mock chart data (in production, this would come from metrics)
  const mockChartData = [
    {date: '2024-12-01', value: 1200, label: '1'},
    {date: '2024-12-02', value: 1500, label: '2'},
    {date: '2024-12-03', value: 1300, label: '3'},
    {date: '2024-12-04', value: 1800, label: '4'},
    {date: '2024-12-05', value: 2100, label: '5'},
    {date: '2024-12-06', value: 1900, label: '6'},
    {date: '2024-12-07', value: 2300, label: '7'},
  ];

  // Mock metrics for display (in production, use data from store)
  const displayMetrics = {
    revenue: metrics?.revenue?.today || 12500,
    transactions: metrics?.transactions?.today || 85,
    activeMembers: metrics?.members?.active || 245,
    classesToday: metrics?.classes?.today || 8,
    branchCount: mockBranches.length,
    pendingOrders: metrics?.orders?.pending || 5,
    lowStock: metrics?.inventory?.lowStock || 12,
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.secondary},
      ]}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
            colors={[theme.colors.primary[500]]}
          />
        }>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.background.primary,
              borderBottomColor: theme.colors.border.light,
            },
          ]}>
          <Typography variant="h3" color={theme.colors.text.primary}>
            Dashboard
          </Typography>
          <Spacer size="xs" />
          <Typography variant="body" color={theme.colors.text.secondary}>
            Welcome back, {user?.name}!
          </Typography>
        </View>

        <Spacer size="md" />

        {/* Branch Selector */}
        <View style={styles.section}>
          <BranchSelector
            branches={mockBranches}
            selectedBranchId={selectedBranchId}
            onSelectBranch={setSelectedBranch}
            showAllOption
          />
        </View>

        <Spacer size="md" />

        {/* Time Period Filter */}
        <View style={styles.section}>
          <TimePeriodFilter
            selectedPeriod={filters.timePeriod}
            onSelectPeriod={handleTimePeriodChange}
          />
        </View>

        <Spacer size="md" />

        {/* Key Metrics */}
        <Row
          wrap
          gap="md"
          style={styles.statsContainer}
          justifyContent="space-between">
          <MetricCard
            title="Revenue"
            value={`$${displayMetrics.revenue.toLocaleString()}`}
            subtitle={filters.timePeriod === 'today' ? "Today's Revenue" : `This ${filters.timePeriod}`}
            trend={{value: 12.5, isPositive: true}}
            color={theme.colors.primary[500]}
          />

          <MetricCard
            title="Active Members"
            value={displayMetrics.activeMembers}
            subtitle="Total Active"
            trend={{value: 8.3, isPositive: true}}
            color={theme.colors.success}
          />

          <MetricCard
            title="Classes Today"
            value={displayMetrics.classesToday}
            subtitle={`${displayMetrics.classesToday} Scheduled`}
            color={theme.colors.info}
          />

          <MetricCard
            title="Branches"
            value={displayMetrics.branchCount}
            subtitle="Active Locations"
            color={theme.colors.secondary[500]}
          />

          <MetricCard
            title="Transactions"
            value={displayMetrics.transactions}
            subtitle="Today"
            trend={{value: 5.2, isPositive: true}}
            color={theme.colors.primary[500]}
          />

          <MetricCard
            title="Pending Orders"
            value={displayMetrics.pendingOrders}
            subtitle="Needs Attention"
            color={theme.colors.warning}
          />

          <MetricCard
            title="Low Stock Alerts"
            value={displayMetrics.lowStock}
            subtitle="Items Running Low"
            color={theme.colors.error}
          />
        </Row>

        <Spacer size="lg" />

        {/* Revenue Chart */}
        <View style={styles.section}>
          <Row justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color={theme.colors.text.primary}>
              Revenue Overview
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onPress={toggleChartType}>
              {chartType === 'line' ? '📊 Bar' : '📈 Line'}
            </Button>
          </Row>
          <Spacer size="md" />
          <RevenueChart
            data={mockChartData}
            type={chartType}
            showTitle={false}
          />
        </View>

        <Spacer size="lg" />

        {/* Today's Classes */}
        <View style={styles.section}>
          <ClassSchedule classes={todayClasses} />
        </View>

        <Spacer size="lg" />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Typography variant="h6" color={theme.colors.text.primary}>
            Quick Actions
          </Typography>
          <Spacer size="md" />

          <Row gap="sm" wrap>
            <Button
              variant="primary"
              size="md"
              style={styles.quickActionButton}
              onPress={() => {}}>
              New Sale
            </Button>
            <Button
              variant="outline"
              size="md"
              style={styles.quickActionButton}
              onPress={() => {}}>
              Add Product
            </Button>
            <Button
              variant="outline"
              size="md"
              style={styles.quickActionButton}
              onPress={() => {}}>
              Add Customer
            </Button>
            <Button
              variant="outline"
              size="md"
              style={styles.quickActionButton}
              onPress={() => {}}>
              Schedule Class
            </Button>
          </Row>
        </View>

        <Spacer size="lg" />

        {/* Recent Transactions */}
        <View style={styles.section}>
          <RecentTransactions
            transactions={recentTransactions}
            onViewAll={() => {}}
          />
        </View>

        <Spacer size="lg" />

        {/* Activity Feed */}
        <View style={styles.section}>
          <ActivityFeed activities={activityFeed} maxItems={10} />
        </View>

        <Spacer size="lg" />

        {/* Theme & Logout */}
        <View style={styles.section}>
          <Button
            variant="outline"
            size="md"
            fullWidth
            onPress={toggleTheme}>
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </Button>
        </View>

        <Spacer size="md" />

        <View style={styles.section}>
          <Button variant="danger" size="md" fullWidth onPress={handleLogout}>
            Logout
          </Button>
        </View>

        <Spacer size="lg" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
  },
  section: {
    paddingHorizontal: 24,
  },
  statsContainer: {
    paddingHorizontal: 16,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
  },
});
