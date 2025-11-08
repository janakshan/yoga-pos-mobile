/**
 * User Form Screen
 * Create and edit user accounts
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

import {useTheme} from '@hooks/useTheme';
import {
  useUser,
  useCreateUser,
  useUpdateUser,
  useUploadProfilePhoto,
} from '@hooks/queries/useUsers';
import {useBranches} from '@hooks/queries/useBranches';
import {UserRole, Permission, CreateUserRequest, UpdateUserRequest} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Spacer} from '@components/layout';
import {RoleSelector, PermissionSelector} from '@components/users';
import {BranchSelector} from '@components/branches';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type UserFormMode = 'create' | 'edit';

type UserFormRouteProp = RouteProp<
  {UserForm: {mode: UserFormMode; userId?: string}},
  'UserForm'
>;

export const UserFormScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<UserFormRouteProp>();
  const {mode, userId} = route.params;

  const isEditMode = mode === 'edit' && userId;

  // Queries
  const {data: user, isLoading: loadingUser} = useUser(userId || '', !!userId);
  const {data: branchesData} = useBranches();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const uploadPhotoMutation = useUploadProfilePhoto();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CASHIER);
  const [branchId, setBranchId] = useState<string>('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isEditMode) {
      setName(user.name || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
      setPhone(user.phone || '');
      setRole(user.role);
      setBranchId(user.branchId || '');
      setPermissions(user.permissions || []);
      setStatus(user.status === 'suspended' ? 'inactive' : (user.status || 'active'));
      setProfileImage(user.avatar || null);
    }
  }, [user, isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!isEditMode) {
      if (!password.trim()) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = () => {
    Alert.alert('Select Photo', 'Choose a photo source', [
      {
        text: 'Camera',
        onPress: () => {
          launchCamera(
            {
              mediaType: 'photo',
              quality: 0.8,
              cameraType: 'front',
            },
            response => {
              if (response.assets && response.assets[0].uri) {
                setProfileImage(response.assets[0].uri);
              }
            },
          );
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          launchImageLibrary(
            {
              mediaType: 'photo',
              quality: 0.8,
            },
            response => {
              if (response.assets && response.assets[0].uri) {
                setProfileImage(response.assets[0].uri);
              }
            },
          );
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      if (isEditMode) {
        const updateData: UpdateUserRequest = {
          name: name.trim(),
          email: email.trim(),
          username: username.trim(),
          phone: phone.trim() || undefined,
          role,
          branchId: branchId || undefined,
          permissions,
          status,
        };

        const updatedUser = await updateUserMutation.mutateAsync({
          id: userId!,
          data: updateData,
        });

        // Upload profile photo if changed
        if (profileImage && profileImage !== user?.avatar) {
          const formData = new FormData();
          formData.append('photo', {
            uri: profileImage,
            type: 'image/jpeg',
            name: 'profile.jpg',
          } as any);
          await uploadPhotoMutation.mutateAsync({
            id: userId!,
            photo: formData,
          });
        }

        Alert.alert('Success', 'User updated successfully', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        const createData: CreateUserRequest = {
          name: name.trim(),
          email: email.trim(),
          username: username.trim(),
          password,
          phone: phone.trim() || undefined,
          role,
          branchId: branchId || undefined,
          permissions,
          status,
        };

        const newUser = await createUserMutation.mutateAsync(createData);

        // Upload profile photo if provided
        if (profileImage) {
          const formData = new FormData();
          formData.append('photo', {
            uri: profileImage,
            type: 'image/jpeg',
            name: 'profile.jpg',
          } as any);
          await uploadPhotoMutation.mutateAsync({
            id: newUser.id,
            photo: formData,
          });
        }

        Alert.alert('Success', 'User created successfully', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save user');
    }
  };

  if (loadingUser && isEditMode) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Spacer size="md" />
          <Typography variant="body" color={theme.colors.text.secondary}>
            Loading user...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.default},
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Card variant="elevated" padding="lg">
          <Typography variant="h5" weight="bold" color={theme.colors.text.primary}>
            {isEditMode ? 'Edit User' : 'Create New User'}
          </Typography>
          <Spacer size="lg" />

          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <Typography
              variant="bodyMedium"
              weight="semibold"
              color={theme.colors.text.primary}
              style={styles.label}>
              Profile Photo
            </Typography>
            <Spacer size="sm" />
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.photoContainer}>
              {profileImage ? (
                <Image source={{uri: profileImage}} style={styles.photoPreview} />
              ) : (
                <View
                  style={[
                    styles.photoPlaceholder,
                    {backgroundColor: theme.colors.primary[100]},
                  ]}>
                  <Icon
                    name="camera-plus"
                    size={32}
                    color={theme.colors.primary[500]}
                  />
                  <Typography
                    variant="bodySmall"
                    color={theme.colors.primary[600]}
                    style={styles.photoText}>
                    Add Photo
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Spacer size="lg" />

          {/* Basic Information */}
          <Input
            label="Full Name *"
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            leftIcon={<Icon name="account" size={20} />}
          />
          <Spacer size="md" />

          <Input
            label="Email *"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<Icon name="email" size={20} />}
          />
          <Spacer size="md" />

          <Input
            label="Username *"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            error={errors.username}
            leftIcon={<Icon name="at" size={20} />}
          />
          <Spacer size="md" />

          <Input
            label="Phone"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Icon name="phone" size={20} />}
          />
          <Spacer size="md" />

          {/* Password fields (only for create mode) */}
          {!isEditMode && (
            <>
              <Input
                label="Password *"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
                leftIcon={<Icon name="lock" size={20} />}
              />
              <Spacer size="md" />

              <Input
                label="Confirm Password *"
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={errors.confirmPassword}
                leftIcon={<Icon name="lock-check" size={20} />}
              />
              <Spacer size="md" />
            </>
          )}

          {/* Branch Selection */}
          <Typography
            variant="bodyMedium"
            weight="semibold"
            color={theme.colors.text.primary}
            style={styles.label}>
            Branch Assignment
          </Typography>
          <Spacer size="sm" />
          <BranchSelector
            selectedBranchId={branchId}
            onBranchChange={setBranchId}
          />
          <Spacer size="lg" />

          {/* Role Selection */}
          <RoleSelector selectedRole={role} onRoleChange={setRole} />
          <Spacer size="lg" />

          {/* Permissions */}
          <TouchableOpacity
            onPress={() => setShowPermissions(!showPermissions)}
            style={styles.permissionsToggle}>
            <Typography
              variant="bodyMedium"
              weight="semibold"
              color={theme.colors.text.primary}>
              Custom Permissions ({permissions.length} selected)
            </Typography>
            <Icon
              name={showPermissions ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>

          {showPermissions && (
            <>
              <Spacer size="md" />
              <PermissionSelector
                selectedPermissions={permissions}
                onPermissionsChange={setPermissions}
              />
            </>
          )}

          <Spacer size="lg" />

          {/* Status */}
          {isEditMode && (
            <>
              <Typography
                variant="bodyMedium"
                weight="semibold"
                color={theme.colors.text.primary}
                style={styles.label}>
                Status
              </Typography>
              <Spacer size="sm" />
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  onPress={() => setStatus('active')}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        status === 'active'
                          ? theme.colors.success[100]
                          : theme.colors.background.secondary,
                      borderColor:
                        status === 'active'
                          ? theme.colors.success[500]
                          : theme.colors.border.light,
                    },
                  ]}>
                  <Icon
                    name="check-circle"
                    size={20}
                    color={
                      status === 'active'
                        ? theme.colors.success[600]
                        : theme.colors.text.secondary
                    }
                  />
                  <Typography
                    variant="bodyMedium"
                    weight="medium"
                    color={
                      status === 'active'
                        ? theme.colors.success[700]
                        : theme.colors.text.secondary
                    }
                    style={styles.statusText}>
                    Active
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setStatus('inactive')}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        status === 'inactive'
                          ? theme.colors.text.secondary + '20'
                          : theme.colors.background.secondary,
                      borderColor:
                        status === 'inactive'
                          ? theme.colors.text.secondary
                          : theme.colors.border.light,
                    },
                  ]}>
                  <Icon
                    name="minus-circle"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                  <Typography
                    variant="bodyMedium"
                    weight="medium"
                    color={theme.colors.text.secondary}
                    style={styles.statusText}>
                    Inactive
                  </Typography>
                </TouchableOpacity>
              </View>
              <Spacer size="lg" />
            </>
          )}

          {/* Form Actions */}
          <View style={styles.actionsContainer}>
            <Button
              variant="outline"
              size="lg"
              onPress={() => navigation.goBack()}
              style={styles.actionButton}>
              Cancel
            </Button>

            <Button
              variant="primary"
              size="lg"
              onPress={handleSubmit}
              loading={
                createUserMutation.isPending || updateUserMutation.isPending
              }
              style={styles.actionButton}>
              {isEditMode ? 'Update User' : 'Create User'}
            </Button>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginBottom: 4,
  },
  photoSection: {
    alignItems: 'center',
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    marginTop: 4,
  },
  permissionsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  statusText: {
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
