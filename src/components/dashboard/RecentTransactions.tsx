import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Card, Typography} from '@components/ui';
import {Row, Column, Spacer} from '@components/layout';
import {useTheme} from '@hooks/useTheme';
import {RecentTransaction} from '@types/dashboard.types';

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  title?: string;
  emptyMessage?: string;
  onViewAll?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  title = 'Recent Transactions',
  emptyMessage = 'No recent transactions',
  onViewAll,
}) => {
  const {theme} = useTheme();

  const getStatusColor = (
    status: RecentTransaction['status'] = 'completed',
  ) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'refunded':
        return theme.colors.error;
      case 'cancelled':
        return theme.colors.text.secondary;
      default:
        return theme.colors.primary[500];
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card':
        return '💳';
      case 'cash':
        return '💵';
      case 'mobile_payment':
        return '📱';
      case 'bank_transfer':
        return '🏦';
      case 'store_credit':
        return '🎟️';
      default:
        return '💰';
    }
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const renderTransactionItem = ({item}: {item: RecentTransaction}) => {
    const statusColor = getStatusColor(item.status);

    return (
      <Card variant="outlined" padding="md" style={styles.transactionCard}>
        <Row justifyContent="space-between" alignItems="center">
          <Column style={styles.transactionInfo}>
            <Row gap="sm" alignItems="center">
              <Typography variant="h6" color={theme.colors.text.primary}>
                {formatAmount(item.total)}
              </Typography>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: `${statusColor}20`},
                ]}>
                <Typography
                  variant="caption"
                  color={statusColor}
                  style={styles.badgeText}>
                  {item.status || 'Completed'}
                </Typography>
              </View>
            </Row>

            <Spacer size="xs" />

            {item.customerName && (
              <>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}>
                  {item.customerName}
                </Typography>
                <Spacer size="xs" />
              </>
            )}

            <Row gap="md" alignItems="center">
              <Typography variant="caption" color={theme.colors.text.secondary}>
                {getPaymentMethodIcon(item.paymentMethod)}{' '}
                {item.paymentMethod.replace('_', ' ')}
              </Typography>
              <Typography variant="caption" color={theme.colors.text.secondary}>
                • {item.itemCount} items
              </Typography>
            </Row>
          </Column>

          <Column alignItems="flex-end">
            <Typography variant="caption" color={theme.colors.text.secondary}>
              {item.relativeTime}
            </Typography>
          </Column>
        </Row>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Row justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color={theme.colors.text.primary}>
          {title}
        </Typography>
        {onViewAll && (
          <Typography
            variant="bodySmall"
            color={theme.colors.primary[500]}
            onPress={onViewAll}
            style={styles.viewAll}>
            View All
          </Typography>
        )}
      </Row>
      <Spacer size="md" />

      {transactions.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <Typography
            variant="body"
            color={theme.colors.text.secondary}
            style={styles.emptyText}>
            {emptyMessage}
          </Typography>
        </Card>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id || Math.random().toString()}
          ItemSeparatorComponent={() => <Spacer size="sm" />}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  transactionCard: {
    // Additional styles if needed
  },
  transactionInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  viewAll: {
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
  },
});
