/**
 * Role Form Screen
 * Create or edit role with permission management
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTheme} from '@hooks/useTheme';
import {usePermission} from '@hooks/useRBAC';
import {Permission, CreateRoleRequest, UpdateRoleRequest} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Spacer} from '@components/layout';
import {PermissionCategoryCard} from '@components/roles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import hooks
import {
  useRole,
  useCreateRole,
  useUpdateRole,
  usePermissionCategories,
} from '@hooks/queries/useRoles';

type RoleFormRouteProp = RouteProp<
  {params: {mode: 'create' | 'edit'; roleId?: string}},
  'params'
>;

export const RoleFormScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RoleFormRouteProp>();

  const {mode, roleId} = route.params;
  const isEditMode = mode === 'edit';

  // Permissions
  const canCreate = usePermission(Permission.USER_CREATE);
  const canUpdate = usePermission(Permission.USER_UPDATE);

  // Queries
  const {data: role, isLoading: loadingRole} = useRole(
    roleId || '',
    isEditMode && !!roleId,
  );
  const {data: permissionCategories = []} = usePermissionCategories();

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [hierarchy, setHierarchy] = useState('50');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing role data for edit mode
  useEffect(() => {
    if (isEditMode && role) {
      setName(role.name);
      setCode(role.code);
      setDescription(role.description || '');
      setHierarchy(role.hierarchy.toString());
      setSelectedPermissions(role.permissions);
    }
  }, [isEditMode, role]);

  // Auto-generate code from name
  useEffect(() => {
    if (!isEditMode && name && !code) {
      const generatedCode = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_');
      setCode(generatedCode);
    }
  }, [name, code, isEditMode]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Role name is required';
    }

    if (!code.trim()) {
      newErrors.code = 'Role code is required';
    } else if (!/^[a-z0-9_]+$/.test(code)) {
      newErrors.code = 'Code must contain only lowercase letters, numbers, and underscores';
    }

    const hierarchyNum = parseInt(hierarchy);
    if (isNaN(hierarchyNum) || hierarchyNum < 0 || hierarchyNum > 100) {
      newErrors.hierarchy = 'Hierarchy must be between 0 and 100';
    }

    if (selectedPermissions.length === 0) {
      newErrors.permissions = 'At least one permission is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleTogglePermission = (permission: Permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
    // Clear permission error when user selects at least one
    if (errors.permissions) {
      setErrors(prev => ({...prev, permissions: ''}));
    }
  };

  const handleToggleAllCategory = (permissions: Permission[], selected: boolean) => {
    if (selected) {
      // Add all permissions from this category
      setSelectedPermissions(prev => {
        const newPermissions = [...prev];
        permissions.forEach(p => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p);
          }
        });
        return newPermissions;
      });
    } else {
      // Remove all permissions from this category
      setSelectedPermissions(prev =>
        prev.filter(p => !permissions.includes(p)),
      );
    }
    // Clear permission error
    if (errors.permissions) {
      setErrors(prev => ({...prev, permissions: ''}));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    try {
      if (isEditMode && roleId) {
        // Update role
        const updateData: UpdateRoleRequest = {
          name,
          code,
          description: description.trim() || undefined,
          hierarchy: parseInt(hierarchy),
          permissions: selectedPermissions,
        };

        await updateRoleMutation.mutateAsync({id: roleId, data: updateData});
        Alert.alert('Success', 'Role updated successfully', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        // Create role
        const createData: CreateRoleRequest = {
          name,
          code,
          description: description.trim() || undefined,
          hierarchy: parseInt(hierarchy),
          permissions: selectedPermissions,
        };

        await createRoleMutation.mutateAsync(createData);
        Alert.alert('Success', 'Role created successfully', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || `Failed to ${isEditMode ? 'update' : 'create'} role`);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Permission check
  if ((isEditMode && !canUpdate) || (!isEditMode && !canCreate)) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.errorContainer}>
          <Icon
            name="lock-outline"
            size={64}
            color={theme.colors.text.tertiary}
          />
          <Spacer size="md" />
          <Typography variant="h5" color={theme.colors.text.secondary}>
            Access Denied
          </Typography>
          <Spacer size="sm" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            You don't have permission to {isEditMode ? 'edit' : 'create'} roles
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (isEditMode && loadingRole) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  // Check if role is system role
  const isSystemRole = isEditMode && role?.isSystemRole;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.default},
      ]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h4" weight="bold">
              {isEditMode ? 'Edit Role' : 'Create New Role'}
            </Typography>
            {isSystemRole && (
              <>
                <Spacer size="sm" />
                <Card variant="outlined" padding="sm">
                  <View style={styles.warningContainer}>
                    <Icon
                      name="information"
                      size={20}
                      color={theme.colors.info[600]}
                    />
                    <Typography
                      variant="bodySmall"
                      color={theme.colors.info[700]}
                      style={styles.warningText}>
                      This is a system role. Some fields cannot be edited.
                    </Typography>
                  </View>
                </Card>
              </>
            )}
          </View>

          <Spacer size="lg" />

          {/* Basic Information */}
          <Card variant="elevated" padding="lg">
            <Typography variant="h6" weight="semibold" style={styles.sectionTitle}>
              Basic Information
            </Typography>

            <Spacer size="md" />

            <Input
              label="Role Name"
              placeholder="e.g., Store Manager"
              value={name}
              onChangeText={setName}
              error={errors.name}
              disabled={isSystemRole}
              required
            />

            <Spacer size="md" />

            <Input
              label="Role Code"
              placeholder="e.g., store_manager"
              value={code}
              onChangeText={setCode}
              error={errors.code}
              disabled={isSystemRole}
              required
              autoCapitalize="none"
            />

            <Spacer size="md" />

            <Input
              label="Description"
              placeholder="Describe the role's responsibilities..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Spacer size="md" />

            <Input
              label="Hierarchy Level"
              placeholder="0-100"
              value={hierarchy}
              onChangeText={setHierarchy}
              error={errors.hierarchy}
              keyboardType="number-pad"
              required
            />
            <Typography
              variant="caption"
              color={theme.colors.text.secondary}
              style={styles.helpText}>
              Higher values have more authority (Admin=100, Staff=20)
            </Typography>
          </Card>

          <Spacer size="lg" />

          {/* Permissions */}
          <View>
            <View style={styles.permissionHeader}>
              <Typography variant="h6" weight="semibold">
                Permissions
              </Typography>
              <Typography variant="caption" color={theme.colors.text.secondary}>
                {selectedPermissions.length} selected
              </Typography>
            </View>

            {errors.permissions && (
              <>
                <Spacer size="sm" />
                <Typography variant="bodySmall" color={theme.colors.error[600]}>
                  {errors.permissions}
                </Typography>
              </>
            )}

            <Spacer size="md" />

            {permissionCategories.map((category, index) => (
              <View key={category.id}>
                <PermissionCategoryCard
                  category={category}
                  selectedPermissions={selectedPermissions}
                  onTogglePermission={handleTogglePermission}
                  onToggleAll={handleToggleAllCategory}
                  readOnly={isSystemRole}
                />
                {index < permissionCategories.length - 1 && <Spacer size="sm" />}
              </View>
            ))}
          </View>

          <Spacer size="xl" />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              variant="outline"
              onPress={handleCancel}
              style={styles.cancelButton}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit}
              loading={createRoleMutation.isPending || updateRoleMutation.isPending}
              disabled={isSystemRole}
              style={styles.submitButton}>
              {isEditMode ? 'Update Role' : 'Create Role'}
            </Button>
          </View>

          <Spacer size="lg" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  helpText: {
    marginTop: 4,
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});
