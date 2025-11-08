import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import {Card} from '@components/ui/Card';
import {User} from '@types/api.types';
import {UserStatusBadge} from './UserStatusBadge';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface UserCardProps {
  user: User;
  onPress?: () => void;
  showBranch?: boolean;
  showRole?: boolean;
  showStatus?: boolean;
  compact?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  showBranch = true,
  showRole = true,
  showStatus = true,
  compact = false,
}) => {
  const {theme} = useTheme();

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: theme.colors.error[500],
      manager: theme.colors.primary[500],
      inventory_manager: theme.colors.info[500],
      cashier: theme.colors.success[500],
      waiter: theme.colors.warning[500],
      waitress: theme.colors.warning[500],
      kitchen_staff: theme.colors.secondary[500],
    };
    return roleColors[role.toLowerCase()] || theme.colors.text.secondary;
  };

  const getRoleIcon = (role: string) => {
    const roleIcons: Record<string, string> = {
      admin: 'shield-crown',
      manager: 'briefcase',
      inventory_manager: 'package-variant',
      cashier: 'cash-register',
      waiter: 'food-fork-drink',
      waitress: 'food-fork-drink',
      kitchen_staff: 'chef-hat',
    };
    return roleIcons[role.toLowerCase()] || 'account';
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';

    const date = new Date(lastLogin);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card variant="elevated" padding="md" onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{uri: user.avatar}} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                {backgroundColor: theme.colors.primary[100]},
              ]}>
              <Icon
                name="account"
                size={compact ? 24 : 32}
                color={theme.colors.primary[500]}
              />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.nameContainer}>
              <Typography
                variant={compact ? 'bodyMedium' : 'h6'}
                weight="semibold"
                color={theme.colors.text.primary}>
                {user.name}
              </Typography>
              {showStatus && user.status && (
                <UserStatusBadge status={user.status} size="sm" />
              )}
            </View>
          </View>

          <View style={styles.detailsContainer}>
            {user.email && (
              <View style={styles.detailRow}>
                <Icon
                  name="email-outline"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}
                  style={styles.detailText}>
                  {user.email}
                </Typography>
              </View>
            )}

            {user.phone && (
              <View style={styles.detailRow}>
                <Icon
                  name="phone-outline"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}
                  style={styles.detailText}>
                  {user.phone}
                </Typography>
              </View>
            )}

            {showRole && (
              <View style={styles.detailRow}>
                <Icon
                  name={getRoleIcon(user.role)}
                  size={14}
                  color={getRoleColor(user.role)}
                />
                <Typography
                  variant="bodySmall"
                  color={getRoleColor(user.role)}
                  weight="medium"
                  style={styles.detailText}>
                  {user.role
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
              </View>
            )}

            {showBranch && user.branch && (
              <View style={styles.detailRow}>
                <Icon
                  name="map-marker-outline"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.secondary}
                  style={styles.detailText}>
                  {user.branch.name}
                </Typography>
              </View>
            )}
          </View>

          {!compact && (
            <View style={styles.footer}>
              <View style={styles.metadataRow}>
                <Typography
                  variant="caption"
                  color={theme.colors.text.tertiary}>
                  Last login: {formatLastLogin(user.lastLogin)}
                </Typography>

                {(user.pinEnabled || user.biometricEnabled) && (
                  <View style={styles.authBadges}>
                    {user.pinEnabled && (
                      <View
                        style={[
                          styles.authBadge,
                          {backgroundColor: theme.colors.info[100]},
                        ]}>
                        <Icon
                          name="numeric"
                          size={12}
                          color={theme.colors.info[700]}
                        />
                      </View>
                    )}
                    {user.biometricEnabled && (
                      <View
                        style={[
                          styles.authBadge,
                          {backgroundColor: theme.colors.success[100]},
                        ]}>
                        <Icon
                          name="fingerprint"
                          size={12}
                          color={theme.colors.success[700]}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
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
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsContainer: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    flex: 1,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  authBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
