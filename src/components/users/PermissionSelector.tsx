import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import {Permission} from '@types/api.types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PermissionSelectorProps {
  selectedPermissions: Permission[];
  onPermissionsChange: (permissions: Permission[]) => void;
  disabled?: boolean;
}

interface PermissionGroup {
  name: string;
  icon: string;
  permissions: {
    value: Permission;
    label: string;
    description: string;
  }[];
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  selectedPermissions,
  onPermissionsChange,
  disabled = false,
}) => {
  const {theme} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const permissionGroups: PermissionGroup[] = [
    {
      name: 'POS',
      icon: 'cash-register',
      permissions: [
        {
          value: Permission.POS_ACCESS,
          label: 'Access POS',
          description: 'Access point of sale system',
        },
        {
          value: Permission.POS_VOID_TRANSACTION,
          label: 'Void Transaction',
          description: 'Void transactions',
        },
        {
          value: Permission.POS_APPLY_DISCOUNT,
          label: 'Apply Discount',
          description: 'Apply discounts to transactions',
        },
        {
          value: Permission.POS_REFUND,
          label: 'Process Refund',
          description: 'Process refunds',
        },
        {
          value: Permission.POS_VIEW_REPORTS,
          label: 'View POS Reports',
          description: 'View POS reports and analytics',
        },
      ],
    },
    {
      name: 'Products',
      icon: 'package-variant',
      permissions: [
        {
          value: Permission.PRODUCT_VIEW,
          label: 'View Products',
          description: 'View product listings',
        },
        {
          value: Permission.PRODUCT_CREATE,
          label: 'Create Products',
          description: 'Create new products',
        },
        {
          value: Permission.PRODUCT_UPDATE,
          label: 'Update Products',
          description: 'Edit existing products',
        },
        {
          value: Permission.PRODUCT_DELETE,
          label: 'Delete Products',
          description: 'Delete products',
        },
      ],
    },
    {
      name: 'Inventory',
      icon: 'warehouse',
      permissions: [
        {
          value: Permission.INVENTORY_VIEW,
          label: 'View Inventory',
          description: 'View inventory levels',
        },
        {
          value: Permission.INVENTORY_MANAGE,
          label: 'Manage Inventory',
          description: 'Manage inventory',
        },
        {
          value: Permission.INVENTORY_ADJUST,
          label: 'Adjust Inventory',
          description: 'Make inventory adjustments',
        },
      ],
    },
    {
      name: 'Procurement',
      icon: 'truck-delivery',
      permissions: [
        {
          value: Permission.PROCUREMENT_VIEW,
          label: 'View Procurement',
          description: 'View purchase orders',
        },
        {
          value: Permission.PROCUREMENT_CREATE,
          label: 'Create Orders',
          description: 'Create purchase orders',
        },
        {
          value: Permission.PROCUREMENT_APPROVE,
          label: 'Approve Orders',
          description: 'Approve purchase orders',
        },
        {
          value: Permission.PROCUREMENT_RECEIVE,
          label: 'Receive Orders',
          description: 'Receive inventory',
        },
        {
          value: Permission.SUPPLIER_VIEW,
          label: 'View Suppliers',
          description: 'View supplier information',
        },
        {
          value: Permission.SUPPLIER_MANAGE,
          label: 'Manage Suppliers',
          description: 'Manage suppliers',
        },
      ],
    },
    {
      name: 'Customers',
      icon: 'account-group',
      permissions: [
        {
          value: Permission.CUSTOMER_VIEW,
          label: 'View Customers',
          description: 'View customer information',
        },
        {
          value: Permission.CUSTOMER_CREATE,
          label: 'Create Customers',
          description: 'Create new customers',
        },
        {
          value: Permission.CUSTOMER_UPDATE,
          label: 'Update Customers',
          description: 'Edit customer information',
        },
        {
          value: Permission.CUSTOMER_DELETE,
          label: 'Delete Customers',
          description: 'Delete customers',
        },
      ],
    },
    {
      name: 'Branches',
      icon: 'map-marker-multiple',
      permissions: [
        {
          value: Permission.BRANCH_VIEW,
          label: 'View Branches',
          description: 'View branch information',
        },
        {
          value: Permission.BRANCH_CREATE,
          label: 'Create Branches',
          description: 'Create new branches',
        },
        {
          value: Permission.BRANCH_UPDATE,
          label: 'Update Branches',
          description: 'Edit branch information',
        },
        {
          value: Permission.BRANCH_DELETE,
          label: 'Delete Branches',
          description: 'Delete branches',
        },
        {
          value: Permission.BRANCH_MANAGE_STAFF,
          label: 'Manage Staff',
          description: 'Manage branch staff',
        },
        {
          value: Permission.BRANCH_VIEW_PERFORMANCE,
          label: 'View Performance',
          description: 'View branch performance',
        },
        {
          value: Permission.BRANCH_MANAGE_SETTINGS,
          label: 'Manage Settings',
          description: 'Manage branch settings',
        },
      ],
    },
    {
      name: 'User Management',
      icon: 'account-cog',
      permissions: [
        {
          value: Permission.USER_VIEW,
          label: 'View Users',
          description: 'View user information',
        },
        {
          value: Permission.USER_CREATE,
          label: 'Create Users',
          description: 'Create new users',
        },
        {
          value: Permission.USER_UPDATE,
          label: 'Update Users',
          description: 'Edit user information',
        },
        {
          value: Permission.USER_DELETE,
          label: 'Delete Users',
          description: 'Delete users',
        },
      ],
    },
    {
      name: 'Financial',
      icon: 'chart-line',
      permissions: [
        {
          value: Permission.FINANCIAL_VIEW,
          label: 'View Financial',
          description: 'View financial data',
        },
        {
          value: Permission.FINANCIAL_MANAGE,
          label: 'Manage Financial',
          description: 'Manage financial operations',
        },
        {
          value: Permission.INVOICE_CREATE,
          label: 'Create Invoices',
          description: 'Create invoices',
        },
        {
          value: Permission.INVOICE_UPDATE,
          label: 'Update Invoices',
          description: 'Edit invoices',
        },
        {
          value: Permission.INVOICE_DELETE,
          label: 'Delete Invoices',
          description: 'Delete invoices',
        },
        {
          value: Permission.INVOICE_SEND,
          label: 'Send Invoices',
          description: 'Send invoices to customers',
        },
        {
          value: Permission.PAYMENT_CREATE,
          label: 'Create Payments',
          description: 'Record payments',
        },
        {
          value: Permission.PAYMENT_PROCESS,
          label: 'Process Payments',
          description: 'Process payments',
        },
        {
          value: Permission.PAYMENT_REFUND,
          label: 'Refund Payments',
          description: 'Process refunds',
        },
        {
          value: Permission.PAYMENT_RECONCILE,
          label: 'Reconcile Payments',
          description: 'Reconcile payments',
        },
        {
          value: Permission.EXPENSE_CREATE,
          label: 'Create Expenses',
          description: 'Record expenses',
        },
        {
          value: Permission.EXPENSE_UPDATE,
          label: 'Update Expenses',
          description: 'Edit expenses',
        },
        {
          value: Permission.EXPENSE_DELETE,
          label: 'Delete Expenses',
          description: 'Delete expenses',
        },
        {
          value: Permission.EXPENSE_APPROVE,
          label: 'Approve Expenses',
          description: 'Approve expenses',
        },
        {
          value: Permission.BANK_ACCOUNT_VIEW,
          label: 'View Bank Accounts',
          description: 'View bank account information',
        },
        {
          value: Permission.BANK_ACCOUNT_MANAGE,
          label: 'Manage Bank Accounts',
          description: 'Manage bank accounts',
        },
        {
          value: Permission.BANK_RECONCILE,
          label: 'Bank Reconciliation',
          description: 'Reconcile bank statements',
        },
        {
          value: Permission.FINANCIAL_REPORTS,
          label: 'Financial Reports',
          description: 'View financial reports',
        },
      ],
    },
    {
      name: 'Reports',
      icon: 'file-chart',
      permissions: [
        {
          value: Permission.REPORTS_VIEW,
          label: 'View Reports',
          description: 'View reports',
        },
        {
          value: Permission.REPORTS_EXPORT,
          label: 'Export Reports',
          description: 'Export reports',
        },
      ],
    },
    {
      name: 'Settings',
      icon: 'cog',
      permissions: [
        {
          value: Permission.SETTINGS_VIEW,
          label: 'View Settings',
          description: 'View system settings',
        },
        {
          value: Permission.SETTINGS_MANAGE,
          label: 'Manage Settings',
          description: 'Manage system settings',
        },
      ],
    },
  ];

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName],
    );
  };

  const togglePermission = (permission: Permission) => {
    if (disabled) return;

    if (selectedPermissions.includes(permission)) {
      onPermissionsChange(
        selectedPermissions.filter(p => p !== permission),
      );
    } else {
      onPermissionsChange([...selectedPermissions, permission]);
    }
  };

  const toggleAllInGroup = (group: PermissionGroup) => {
    if (disabled) return;

    const groupPermissions = group.permissions.map(p => p.value);
    const allSelected = groupPermissions.every(p =>
      selectedPermissions.includes(p),
    );

    if (allSelected) {
      onPermissionsChange(
        selectedPermissions.filter(p => !groupPermissions.includes(p)),
      );
    } else {
      const newPermissions = [...selectedPermissions];
      groupPermissions.forEach(p => {
        if (!newPermissions.includes(p)) {
          newPermissions.push(p);
        }
      });
      onPermissionsChange(newPermissions);
    }
  };

  const filteredGroups = permissionGroups.map(group => ({
    ...group,
    permissions: group.permissions.filter(
      p =>
        p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter(group => group.permissions.length > 0);

  return (
    <View style={styles.container}>
      <Typography
        variant="bodyMedium"
        weight="semibold"
        color={theme.colors.text.primary}
        style={styles.label}>
        Permissions
      </Typography>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border.light,
          },
        ]}>
        <Icon
          name="magnify"
          size={20}
          color={theme.colors.text.secondary}
        />
        <TextInput
          style={[
            styles.searchInput,
            {color: theme.colors.text.primary},
          ]}
          placeholder="Search permissions..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {filteredGroups.map(group => {
          const isExpanded = expandedGroups.includes(group.name);
          const groupPermissions = group.permissions.map(p => p.value);
          const selectedCount = groupPermissions.filter(p =>
            selectedPermissions.includes(p),
          ).length;
          const allSelected = selectedCount === groupPermissions.length;

          return (
            <View key={group.name} style={styles.groupContainer}>
              <TouchableOpacity
                onPress={() => toggleGroup(group.name)}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.groupHeader,
                    {
                      backgroundColor: theme.colors.background.card,
                      borderColor: theme.colors.border.light,
                    },
                  ]}>
                  <View style={styles.groupHeaderLeft}>
                    <Icon
                      name={group.icon}
                      size={20}
                      color={theme.colors.primary[500]}
                    />
                    <Typography
                      variant="bodyMedium"
                      weight="semibold"
                      color={theme.colors.text.primary}
                      style={styles.groupName}>
                      {group.name}
                    </Typography>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: allSelected
                            ? theme.colors.success[100]
                            : theme.colors.text.secondary + '20',
                        },
                      ]}>
                      <Typography
                        variant="caption"
                        color={
                          allSelected
                            ? theme.colors.success[700]
                            : theme.colors.text.secondary
                        }>
                        {selectedCount}/{groupPermissions.length}
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.groupHeaderRight}>
                    <TouchableOpacity
                      onPress={() => toggleAllInGroup(group)}
                      disabled={disabled}
                      style={styles.selectAllButton}>
                      <Typography
                        variant="bodySmall"
                        color={theme.colors.primary[500]}
                        weight="medium">
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </Typography>
                    </TouchableOpacity>

                    <Icon
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={theme.colors.text.secondary}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.permissionsList}>
                  {group.permissions.map(permission => {
                    const isSelected = selectedPermissions.includes(
                      permission.value,
                    );

                    return (
                      <TouchableOpacity
                        key={permission.value}
                        onPress={() => togglePermission(permission.value)}
                        disabled={disabled}
                        activeOpacity={0.7}>
                        <View
                          style={[
                            styles.permissionItem,
                            {
                              backgroundColor: isSelected
                                ? theme.colors.primary[50]
                                : 'transparent',
                            },
                          ]}>
                          <View
                            style={[
                              styles.checkbox,
                              {
                                backgroundColor: isSelected
                                  ? theme.colors.primary[500]
                                  : 'transparent',
                                borderColor: isSelected
                                  ? theme.colors.primary[500]
                                  : theme.colors.border.medium,
                              },
                            ]}>
                            {isSelected && (
                              <Icon
                                name="check"
                                size={16}
                                color="#fff"
                              />
                            )}
                          </View>

                          <View style={styles.permissionInfo}>
                            <Typography
                              variant="bodyMedium"
                              weight={isSelected ? 'semibold' : 'normal'}
                              color={
                                isSelected
                                  ? theme.colors.primary[700]
                                  : theme.colors.text.primary
                              }>
                              {permission.label}
                            </Typography>
                            <Typography
                              variant="bodySmall"
                              color={theme.colors.text.secondary}>
                              {permission.description}
                            </Typography>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  groupContainer: {
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupName: {
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  groupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllButton: {
    marginRight: 8,
  },
  permissionsList: {
    marginTop: 4,
    paddingLeft: 8,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionInfo: {
    flex: 1,
  },
});
