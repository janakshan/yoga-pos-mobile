import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useAuthStore} from '@store/slices/authSlice';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button, Card} from '@components/ui';
import {Row, Column, Spacer} from '@components/layout';

/**
 * Dashboard Screen
 * Main dashboard with overview and quick actions - using new design system
 */

export const DashboardScreen = () => {
  const {user, logout} = useAuthStore();
  const {theme, toggleTheme, isDark} = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.secondary},
      ]}>
      <ScrollView style={styles.content}>
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
            Welcome, {user?.name}!
          </Typography>
        </View>

        <Spacer size="md" />

        <Row
          wrap
          gap="md"
          style={styles.statsContainer}
          justifyContent="space-between">
          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Typography variant="h3" color={theme.colors.primary[500]}>
              $12,500
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Today's Sales
            </Typography>
          </Card>

          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Typography variant="h3" color={theme.colors.primary[500]}>
              85
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Transactions
            </Typography>
          </Card>

          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Typography variant="h3" color={theme.colors.primary[500]}>
              45
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Customers
            </Typography>
          </Card>

          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Typography variant="h3" color={theme.colors.warning}>
              12
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Low Stock
            </Typography>
          </Card>
        </Row>

        <Spacer size="lg" />

        <View style={styles.section}>
          <Typography variant="h5" color={theme.colors.text.primary}>
            Quick Actions
          </Typography>
          <Spacer size="md" />

          <Column gap="sm">
            <Card variant="outlined" padding="md" onPress={() => {}}>
              <Typography variant="body" color={theme.colors.text.primary}>
                New Sale
              </Typography>
            </Card>

            <Card variant="outlined" padding="md" onPress={() => {}}>
              <Typography variant="body" color={theme.colors.text.primary}>
                Add Product
              </Typography>
            </Card>

            <Card variant="outlined" padding="md" onPress={() => {}}>
              <Typography variant="body" color={theme.colors.text.primary}>
                Add Customer
              </Typography>
            </Card>
          </Column>
        </View>

        <Spacer size="lg" />

        <View style={styles.themeSection}>
          <Button
            variant="outline"
            size="md"
            fullWidth
            onPress={toggleTheme}>
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </Button>
        </View>

        <Spacer size="md" />

        <View style={styles.logoutSection}>
          <Button
            variant="danger"
            size="md"
            fullWidth
            onPress={handleLogout}>
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
  statsContainer: {
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  section: {
    paddingHorizontal: 24,
  },
  themeSection: {
    paddingHorizontal: 24,
  },
  logoutSection: {
    paddingHorizontal: 24,
  },
});
