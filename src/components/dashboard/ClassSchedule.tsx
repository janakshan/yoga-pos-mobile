import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Card, Typography} from '@components/ui';
import {Row, Column, Spacer} from '@components/layout';
import {useTheme} from '@hooks/useTheme';
import {YogaClass} from '@types/dashboard.types';
import {format, parseISO} from 'date-fns';

interface ClassScheduleProps {
  classes: YogaClass[];
  title?: string;
  emptyMessage?: string;
}

export const ClassSchedule: React.FC<ClassScheduleProps> = ({
  classes,
  title = "Today's Classes",
  emptyMessage = 'No classes scheduled for today',
}) => {
  const {theme} = useTheme();

  const getStatusColor = (status: YogaClass['status']) => {
    switch (status) {
      case 'in_progress':
        return theme.colors.info;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.primary[500];
    }
  };

  const getStatusLabel = (status: YogaClass['status']) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Scheduled';
    }
  };

  const getLevelBadgeColor = (level: YogaClass['level']) => {
    switch (level) {
      case 'beginner':
        return theme.colors.success;
      case 'intermediate':
        return theme.colors.warning;
      case 'advanced':
        return theme.colors.error;
      default:
        return theme.colors.primary[500];
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch {
      return dateString;
    }
  };

  const renderClassItem = ({item}: {item: YogaClass}) => {
    const statusColor = getStatusColor(item.status);
    const levelColor = getLevelBadgeColor(item.level);
    const availabilityPercent = (item.enrolled / item.capacity) * 100;
    const isNearlyFull = availabilityPercent >= 80;

    return (
      <Card
        variant="outlined"
        padding="md"
        style={[
          styles.classCard,
          {borderLeftColor: statusColor, borderLeftWidth: 4},
        ]}>
        <Row justifyContent="space-between" alignItems="flex-start">
          <Column style={styles.classInfo}>
            <Typography variant="h6" color={theme.colors.text.primary}>
              {item.name}
            </Typography>
            <Spacer size="xs" />
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              {item.instructor.name}
            </Typography>
            <Spacer size="xs" />
            <Row gap="sm" alignItems="center">
              <Typography variant="caption" color={theme.colors.text.secondary}>
                {formatTime(item.startTime)} - {formatTime(item.endTime)}
              </Typography>
              <View
                style={[
                  styles.levelBadge,
                  {backgroundColor: `${levelColor}20`},
                ]}>
                <Typography
                  variant="caption"
                  color={levelColor}
                  style={styles.badgeText}>
                  {item.level}
                </Typography>
              </View>
            </Row>
          </Column>

          <Column alignItems="flex-end">
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: `${statusColor}20`},
              ]}>
              <Typography
                variant="caption"
                color={statusColor}
                style={styles.badgeText}>
                {getStatusLabel(item.status)}
              </Typography>
            </View>
            <Spacer size="sm" />
            <Typography
              variant="caption"
              color={
                isNearlyFull ? theme.colors.warning : theme.colors.text.secondary
              }>
              {item.available}/{item.capacity} spots
            </Typography>
          </Column>
        </Row>

        {item.room && (
          <>
            <Spacer size="xs" />
            <Typography variant="caption" color={theme.colors.text.secondary}>
              Room: {item.room}
            </Typography>
          </>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Typography variant="h6" color={theme.colors.text.primary}>
        {title}
      </Typography>
      <Spacer size="md" />

      {classes.length === 0 ? (
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
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={item => item.id}
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
  classCard: {
    borderLeftWidth: 4,
  },
  classInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
  },
});
