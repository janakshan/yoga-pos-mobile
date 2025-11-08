/**
 * Branch Comparison Screen
 * Compare performance metrics across multiple branches
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {useTheme} from '@hooks/useTheme';
import {useActiveBranches, useBranchComparison} from '@hooks/queries/useBranches';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';
import {BarChartCard} from '@components/reports/BarChartCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const BranchComparisonScreen = () => {
  const {theme} = useTheme();
  const {data: branches} = useActiveBranches();

  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const {data: comparison, isLoading} = useBranchComparison(
    selectedBranchIds,
    dateRange,
    selectedBranchIds.length > 0,
  );

  const toggleBranchSelection = (branchId: string) => {
    setSelectedBranchIds(prev => {
      if (prev.includes(branchId)) {
        return prev.filter(id => id !== branchId);
      } else {
        if (prev.length >= 5) {
          Alert.alert('Limit Reached', 'You can compare up to 5 branches at a time');
          return prev;
        }
        return [...prev, branchId];
      }
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getRevenueChartData = () => {
    if (!comparison?.metrics) return [];
    return comparison.metrics.map(m => ({
      label: m.branchName,
      value: m.revenue,
    }));
  };

  const getTransactionsChartData = () => {
    if (!comparison?.metrics) return [];
    return comparison.metrics.map(m => ({
      label: m.branchName,
      value: m.transactions,
    }));
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <ScrollView>
        <View style={styles.content}>
          <Typography variant="h2" style={styles.title}>
            Branch Comparison
          </Typography>

          {/* Branch Selection */}
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Select Branches to Compare (up to 5)
            </Typography>
            <Column spacing="sm">
              {branches?.map(branch => {
                const isSelected = selectedBranchIds.includes(branch.id);
                return (
                  <TouchableOpacity
                    key={branch.id}
                    style={[
                      styles.branchOption,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary[50]
                          : theme.colors.background.secondary,
                        borderColor: isSelected
                          ? theme.colors.primary[500]
                          : theme.colors.border.light,
                      },
                    ]}
                    onPress={() => toggleBranchSelection(branch.id)}>
                    <Row align="center" spacing="sm">
                      <Icon
                        name={
                          isSelected
                            ? 'checkbox-marked'
                            : 'checkbox-blank-outline'
                        }
                        size={24}
                        color={
                          isSelected
                            ? theme.colors.primary[500]
                            : theme.colors.text.tertiary
                        }
                      />
                      <Column style={styles.branchInfo}>
                        <Typography variant="bodyBold">{branch.name}</Typography>
                        <Typography variant="caption" color="secondary">
                          {branch.code} • {branch.city}
                        </Typography>
                      </Column>
                    </Row>
                  </TouchableOpacity>
                );
              })}
            </Column>
          </Card>

          {/* Comparison Results */}
          {selectedBranchIds.length > 0 && comparison && (
            <>
              {/* Revenue Comparison */}
              <BarChartCard
                title="Revenue Comparison"
                data={getRevenueChartData()}
                formatValue={formatCurrency}
                color={theme.colors.success}
              />

              {/* Transactions Comparison */}
              <BarChartCard
                title="Transactions Comparison"
                data={getTransactionsChartData()}
                formatValue={formatNumber}
                color={theme.colors.primary[500]}
              />

              {/* Detailed Metrics Table */}
              <Card style={styles.section}>
                <Typography variant="h3" style={styles.sectionTitle}>
                  Detailed Metrics
                </Typography>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    {/* Header */}
                    <Row style={styles.tableHeader}>
                      <View style={styles.tableCell}>
                        <Typography variant="caption" style={styles.headerText}>
                          Branch
                        </Typography>
                      </View>
                      <View style={styles.tableCell}>
                        <Typography variant="caption" style={styles.headerText}>
                          Revenue
                        </Typography>
                      </View>
                      <View style={styles.tableCell}>
                        <Typography variant="caption" style={styles.headerText}>
                          Transactions
                        </Typography>
                      </View>
                      <View style={styles.tableCell}>
                        <Typography variant="caption" style={styles.headerText}>
                          Customers
                        </Typography>
                      </View>
                      <View style={styles.tableCell}>
                        <Typography variant="caption" style={styles.headerText}>
                          Avg Order
                        </Typography>
                      </View>
                      <View style={styles.tableCell}>
                        <Typography variant="caption" style={styles.headerText}>
                          Staff
                        </Typography>
                      </View>
                    </Row>

                    {/* Rows */}
                    {comparison.metrics.map((metric, index) => (
                      <Row
                        key={metric.branchId}
                        style={[
                          styles.tableRow,
                          {
                            backgroundColor:
                              index % 2 === 0
                                ? theme.colors.background.secondary
                                : theme.colors.background.primary,
                          },
                        ]}>
                        <View style={styles.tableCell}>
                          <Typography variant="caption">
                            {metric.branchName}
                          </Typography>
                        </View>
                        <View style={styles.tableCell}>
                          <Typography variant="caption">
                            {formatCurrency(metric.revenue)}
                          </Typography>
                        </View>
                        <View style={styles.tableCell}>
                          <Typography variant="caption">
                            {formatNumber(metric.transactions)}
                          </Typography>
                        </View>
                        <View style={styles.tableCell}>
                          <Typography variant="caption">
                            {formatNumber(metric.customers)}
                          </Typography>
                        </View>
                        <View style={styles.tableCell}>
                          <Typography variant="caption">
                            {formatCurrency(metric.averageTransactionValue)}
                          </Typography>
                        </View>
                        <View style={styles.tableCell}>
                          <Typography variant="caption">
                            {metric.staffCount}
                          </Typography>
                        </View>
                      </Row>
                    ))}
                  </View>
                </ScrollView>
              </Card>
            </>
          )}

          {selectedBranchIds.length === 0 && (
            <View style={styles.emptyState}>
              <Icon
                name="compare"
                size={64}
                color={theme.colors.text.tertiary}
              />
              <Typography variant="h4" color="secondary" style={styles.emptyText}>
                Select branches to compare
              </Typography>
              <Typography variant="body" color="secondary">
                Choose 2-5 branches to view performance comparison
              </Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  branchOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  branchInfo: {
    flex: 1,
  },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
  },
  tableRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableCell: {
    width: 100,
    paddingHorizontal: 8,
  },
  headerText: {
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
  },
});
