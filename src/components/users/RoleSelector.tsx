import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import {UserRole} from '@types/api.types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  disabled = false,
}) => {
  const {theme} = useTheme();

  const roles = [
    {
      value: UserRole.ADMIN,
      label: 'Admin',
      icon: 'shield-crown',
      description: 'Full system access and control',
      color: theme.colors.error[500],
    },
    {
      value: UserRole.MANAGER,
      label: 'Manager',
      icon: 'briefcase',
      description: 'Manage staff and operations',
      color: theme.colors.primary[500],
    },
    {
      value: UserRole.INVENTORY_MANAGER,
      label: 'Inventory Manager',
      icon: 'package-variant',
      description: 'Manage inventory and stock',
      color: theme.colors.info[500],
    },
    {
      value: UserRole.CASHIER,
      label: 'Cashier',
      icon: 'cash-register',
      description: 'Process transactions',
      color: theme.colors.success[500],
    },
    {
      value: UserRole.WAITER,
      label: 'Waiter',
      icon: 'food-fork-drink',
      description: 'Take orders and serve',
      color: theme.colors.warning[500],
    },
    {
      value: UserRole.WAITRESS,
      label: 'Waitress',
      icon: 'food-fork-drink',
      description: 'Take orders and serve',
      color: theme.colors.warning[500],
    },
    {
      value: UserRole.KITCHEN_STAFF,
      label: 'Kitchen Staff',
      icon: 'chef-hat',
      description: 'Prepare orders',
      color: theme.colors.secondary[500],
    },
  ];

  return (
    <View style={styles.container}>
      <Typography
        variant="bodyMedium"
        weight="semibold"
        color={theme.colors.text.primary}
        style={styles.label}>
        User Role
      </Typography>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {roles.map(role => {
          const isSelected = selectedRole === role.value;

          return (
            <TouchableOpacity
              key={role.value}
              onPress={() => onRoleChange(role.value)}
              disabled={disabled}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: isSelected
                      ? role.color + '15'
                      : theme.colors.background.card,
                    borderColor: isSelected
                      ? role.color
                      : theme.colors.border.light,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}>
                <View style={styles.roleContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: isSelected
                          ? role.color
                          : role.color + '20',
                      },
                    ]}>
                    <Icon
                      name={role.icon}
                      size={24}
                      color={isSelected ? '#fff' : role.color}
                    />
                  </View>

                  <View style={styles.roleInfo}>
                    <Typography
                      variant="bodyMedium"
                      weight="semibold"
                      color={
                        isSelected ? role.color : theme.colors.text.primary
                      }>
                      {role.label}
                    </Typography>
                    <Typography
                      variant="bodySmall"
                      color={theme.colors.text.secondary}>
                      {role.description}
                    </Typography>
                  </View>

                  {isSelected && (
                    <Icon
                      name="check-circle"
                      size={20}
                      color={role.color}
                      style={styles.checkIcon}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  roleCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  checkIcon: {
    marginLeft: 8,
  },
});
