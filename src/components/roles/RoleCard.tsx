import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import {Card} from '@components/ui/Card';
import {Role} from '@types/api.types';
import {RoleTypeBadge} from './RoleTypeBadge';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RoleCardProps {
  role: Role;
  onPress?: () => void;
  showUserCount?: boolean;
  showPermissionCount?: boolean;
  showDescription?: boolean;
  compact?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  onPress,
  showUserCount = true,
  showPermissionCount = true,
  showDescription = true,
  compact = false,
}) => {
  const {theme} = useTheme();

  const getRoleIcon = () => {
    if (role.isSystemRole) {
      return 'shield-crown';
    }
    return 'account-cog';
  };

  const getRoleColor = () => {
    const colors: Record<number, string> = {
      100: theme.colors.error[500], // Admin level
      80: theme.colors.primary[500], // Manager level
      60: theme.colors.info[500], // Inventory Manager level
      40: theme.colors.success[500], // Cashier level
      20: theme.colors.warning[500], // Staff level
    };
    return colors[role.hierarchy] || theme.colors.text.secondary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="elevated" padding="md" onPress={onPress}>
      <View style={styles.container}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: getRoleColor() + '20'},
          ]}>
          <Icon name={getRoleIcon()} size={24} color={getRoleColor()} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Typography
              variant={compact ? 'bodyMedium' : 'h6'}
              weight="semibold"
              color={theme.colors.text.primary}
              style={styles.roleName}>
              {role.name}
            </Typography>
            <RoleTypeBadge
              isSystemRole={role.isSystemRole}
              isCustom={role.isCustom}
              size="sm"
            />
          </View>

          {showDescription && role.description && !compact && (
            <Typography
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={styles.description}
              numberOfLines={2}>
              {role.description}
            </Typography>
          )}

          <View style={styles.statsContainer}>
            {showPermissionCount && (
              <View style={styles.statItem}>
                <Icon
                  name="lock-check"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}
                  style={styles.statText}>
                  {role.permissions.length} permissions
                </Typography>
              </View>
            )}

            {showUserCount && (
              <View style={styles.statItem}>
                <Icon
                  name="account-group"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}
                  style={styles.statText}>
                  {role.userCount || 0} users
                </Typography>
              </View>
            )}

            <View style={styles.statItem}>
              <Icon
                name="signal"
                size={14}
                color={theme.colors.text.secondary}
              />
              <Typography
                variant="bodySmall"
                color={theme.colors.text.secondary}
                style={styles.statText}>
                Level {role.hierarchy}
              </Typography>
            </View>
          </View>

          {!compact && (
            <View style={styles.footer}>
              <Typography variant="caption" color={theme.colors.text.tertiary}>
                Created {formatDate(role.createdAt)}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  roleName: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    marginTop: 4,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
