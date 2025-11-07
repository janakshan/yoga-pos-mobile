import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Card, Typography} from '@components/ui';
import {Row, Column, Spacer} from '@components/layout';
import {useTheme} from '@hooks/useTheme';
import {ActivityItem, ActivityType} from '@types/dashboard.types';

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  emptyMessage?: string;
  maxItems?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'Recent Activity',
  emptyMessage = 'No recent activity',
  maxItems,
}) => {
  const {theme} = useTheme();

  const displayActivities = maxItems
    ? activities.slice(0, maxItems)
    : activities;

  const getActivityIcon = (type: ActivityType): string => {
    switch (type) {
      case 'sale':
        return '💰';
      case 'refund':
        return '↩️';
      case 'new_member':
        return '👤';
      case 'class_booking':
        return '📅';
      case 'class_cancellation':
        return '❌';
      case 'inventory_alert':
        return '⚠️';
      case 'low_stock':
        return '📦';
      case 'product_added':
        return '➕';
      case 'user_login':
        return '🔐';
      case 'user_logout':
        return '🚪';
      case 'payment_received':
        return '💳';
      case 'order_completed':
        return '✅';
      case 'system':
        return '⚙️';
      default:
        return '📌';
    }
  };

  const getActivityColor = (type: ActivityType): string => {
    switch (type) {
      case 'sale':
      case 'payment_received':
      case 'order_completed':
        return theme.colors.success;
      case 'refund':
      case 'class_cancellation':
        return theme.colors.error;
      case 'new_member':
      case 'class_booking':
      case 'product_added':
        return theme.colors.primary[500];
      case 'inventory_alert':
      case 'low_stock':
        return theme.colors.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const renderActivityItem = ({item, index}: {item: ActivityItem; index: number}) => {
    const iconColor = getActivityColor(item.type);
    const isLast = index === displayActivities.length - 1;

    return (
      <View style={styles.activityItem}>
        <View style={styles.timelineContainer}>
          <View
            style={[styles.iconContainer, {backgroundColor: `${iconColor}20`}]}>
            <Typography variant="body" style={styles.icon}>
              {getActivityIcon(item.type)}
            </Typography>
          </View>
          {!isLast && (
            <View
              style={[
                styles.timelineLine,
                {backgroundColor: theme.colors.border.light},
              ]}
            />
          )}
        </View>

        <View style={styles.activityContent}>
          <Card
            variant="outlined"
            padding="md"
            style={[
              styles.activityCard,
              {borderLeftColor: iconColor, borderLeftWidth: 3},
            ]}>
            <Row justifyContent="space-between" alignItems="flex-start">
              <Column style={styles.textContent}>
                <Typography variant="body" color={theme.colors.text.primary}>
                  {item.title}
                </Typography>
                {item.description && (
                  <>
                    <Spacer size="xs" />
                    <Typography
                      variant="bodySmall"
                      color={theme.colors.text.secondary}>
                      {item.description}
                    </Typography>
                  </>
                )}
                {item.user && (
                  <>
                    <Spacer size="xs" />
                    <Typography
                      variant="caption"
                      color={theme.colors.text.secondary}>
                      by {item.user.name}
                    </Typography>
                  </>
                )}
              </Column>
              <Typography variant="caption" color={theme.colors.text.secondary}>
                {item.relativeTime}
              </Typography>
            </Row>
          </Card>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Typography variant="h6" color={theme.colors.text.primary}>
        {title}
      </Typography>
      <Spacer size="md" />

      {displayActivities.length === 0 ? (
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
          data={displayActivities}
          renderItem={renderActivityItem}
          keyExtractor={item => item.id}
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
  activityItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 40,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  activityContent: {
    flex: 1,
    marginBottom: 12,
  },
  activityCard: {
    borderLeftWidth: 3,
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
});
