import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import {Card} from '@components/ui/Card';
import {Permission, PermissionCategory} from '@types/api.types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PermissionCategoryCardProps {
  category: PermissionCategory;
  selectedPermissions: Permission[];
  onTogglePermission?: (permission: Permission) => void;
  onToggleAll?: (permissions: Permission[], selected: boolean) => void;
  readOnly?: boolean;
  expanded?: boolean;
}

export const PermissionCategoryCard: React.FC<PermissionCategoryCardProps> = ({
  category,
  selectedPermissions,
  onTogglePermission,
  onToggleAll,
  readOnly = false,
  expanded: initialExpanded = false,
}) => {
  const {theme} = useTheme();
  const [expanded, setExpanded] = useState(initialExpanded);

  const isAllSelected = category.permissions.every(p =>
    selectedPermissions.includes(p),
  );
  const isSomeSelected = category.permissions.some(p =>
    selectedPermissions.includes(p),
  );

  const handleToggleAll = () => {
    if (readOnly || !onToggleAll) return;
    onToggleAll(category.permissions, !isAllSelected);
  };

  const handleTogglePermission = (permission: Permission) => {
    if (readOnly || !onTogglePermission) return;
    onTogglePermission(permission);
  };

  const getPermissionLabel = (permission: Permission) => {
    const parts = permission.split('.');
    if (parts.length === 2) {
      return parts[1]
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return permission;
  };

  const selectedCount = category.permissions.filter(p =>
    selectedPermissions.includes(p),
  ).length;

  return (
    <Card variant="outlined" padding="none">
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: theme.colors.primary[100]},
            ]}>
            <Icon
              name={category.icon}
              size={20}
              color={theme.colors.primary[600]}
            />
          </View>
          <View style={styles.headerText}>
            <Typography variant="bodyMedium" weight="semibold">
              {category.name}
            </Typography>
            <Typography
              variant="caption"
              color={theme.colors.text.secondary}>
              {category.description}
            </Typography>
          </View>
        </View>

        <View style={styles.headerRight}>
          {!readOnly && (
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={handleToggleAll}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isAllSelected
                      ? theme.colors.primary[500]
                      : theme.colors.border.default,
                    backgroundColor: isAllSelected
                      ? theme.colors.primary[500]
                      : 'transparent',
                  },
                ]}>
                {isAllSelected && (
                  <Icon name="check" size={14} color={theme.colors.white} />
                )}
                {!isAllSelected && isSomeSelected && (
                  <Icon
                    name="minus"
                    size={14}
                    color={theme.colors.primary[500]}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.badge}>
            <Typography
              variant="caption"
              weight="medium"
              color={
                selectedCount > 0
                  ? theme.colors.primary[700]
                  : theme.colors.text.secondary
              }>
              {selectedCount}/{category.permissions.length}
            </Typography>
          </View>

          <Icon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.text.secondary}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.permissionsList}>
          {category.permissions.map((permission, index) => {
            const isSelected = selectedPermissions.includes(permission);
            return (
              <TouchableOpacity
                key={permission}
                style={[
                  styles.permissionItem,
                  index === category.permissions.length - 1 &&
                    styles.lastPermissionItem,
                ]}
                onPress={() => handleTogglePermission(permission)}
                disabled={readOnly}
                activeOpacity={readOnly ? 1 : 0.7}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected
                        ? theme.colors.primary[500]
                        : theme.colors.border.default,
                      backgroundColor: isSelected
                        ? theme.colors.primary[500]
                        : 'transparent',
                    },
                  ]}>
                  {isSelected && (
                    <Icon name="check" size={14} color={theme.colors.white} />
                  )}
                </View>

                <View style={styles.permissionText}>
                  <Typography variant="bodySmall">
                    {getPermissionLabel(permission)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.colors.text.tertiary}>
                    {permission}
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectAllButton: {
    padding: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 68,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  lastPermissionItem: {
    borderBottomWidth: 0,
  },
  permissionText: {
    flex: 1,
  },
});
