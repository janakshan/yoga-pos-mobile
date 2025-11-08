/**
 * Branch Form Screen
 * Create and edit branches
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {BranchesStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  useBranch,
  useCreateBranch,
  useUpdateBranch,
} from '@hooks/queries/useBranches';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Column} from '@components/layout';

type BranchFormRouteProp = RouteProp<BranchesStackParamList, 'BranchForm'>;

export const BranchFormScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<BranchFormRouteProp>();
  const navigation = useNavigation();

  const {mode, branchId} = route.params;
  const isEditMode = mode === 'edit';

  const {data: branch, isLoading: isFetchingBranch} = useBranch(
    branchId || '',
    isEditMode,
  );
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fax, setFax] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Load branch data in edit mode
  useEffect(() => {
    if (isEditMode && branch) {
      setName(branch.name);
      setCode(branch.code);
      setAddress(branch.address);
      setCity(branch.city);
      setState(branch.state);
      setZipCode(branch.zipCode);
      setCountry(branch.country);
      setPhone(branch.phone);
      setEmail(branch.email);
      setFax(branch.fax || '');
      setWebsite(branch.website || '');
      setDescription(branch.description || '');
      setLatitude(branch.latitude?.toString() || '');
      setLongitude(branch.longitude?.toString() || '');
    }
  }, [isEditMode, branch]);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Branch name is required');
      return false;
    }
    if (!code.trim()) {
      Alert.alert('Validation Error', 'Branch code is required');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Validation Error', 'City is required');
      return false;
    }
    if (!state.trim()) {
      Alert.alert('Validation Error', 'State is required');
      return false;
    }
    if (!zipCode.trim()) {
      Alert.alert('Validation Error', 'Zip code is required');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Phone is required');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Invalid email format');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = {
        name: name.trim(),
        code: code.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        country: country.trim(),
        phone: phone.trim(),
        email: email.trim(),
        fax: fax.trim() || undefined,
        website: website.trim() || undefined,
        description: description.trim() || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      };

      if (isEditMode && branchId) {
        await updateMutation.mutateAsync({id: branchId, data: formData});
        Alert.alert('Success', 'Branch updated successfully');
      } else {
        await createMutation.mutateAsync(formData as any);
        Alert.alert('Success', 'Branch created successfully');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `Failed to ${isEditMode ? 'update' : 'create'} branch`,
      );
    }
  };

  if (isEditMode && isFetchingBranch) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <ScrollView>
        <View style={styles.content}>
          <Typography variant="h2" style={styles.title}>
            {isEditMode ? 'Edit Branch' : 'Create Branch'}
          </Typography>

          {/* Basic Information */}
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Basic Information
            </Typography>
            <Column spacing="md">
              <Input
                label="Branch Name"
                placeholder="Enter branch name"
                value={name}
                onChangeText={setName}
                required
              />
              <Input
                label="Branch Code"
                placeholder="e.g., BR001"
                value={code}
                onChangeText={setCode}
                required
              />
              <Input
                label="Description"
                placeholder="Brief description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </Column>
          </Card>

          {/* Location */}
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Location
            </Typography>
            <Column spacing="md">
              <Input
                label="Address"
                placeholder="Street address"
                value={address}
                onChangeText={setAddress}
                required
              />
              <Input
                label="City"
                placeholder="City"
                value={city}
                onChangeText={setCity}
                required
              />
              <Input
                label="State"
                placeholder="State"
                value={state}
                onChangeText={setState}
                required
              />
              <Input
                label="Zip Code"
                placeholder="Zip code"
                value={zipCode}
                onChangeText={setZipCode}
                required
              />
              <Input
                label="Country"
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
                required
              />
              <Input
                label="Latitude (Optional)"
                placeholder="e.g., 37.7749"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="decimal-pad"
              />
              <Input
                label="Longitude (Optional)"
                placeholder="e.g., -122.4194"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="decimal-pad"
              />
            </Column>
          </Card>

          {/* Contact Information */}
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Contact Information
            </Typography>
            <Column spacing="md">
              <Input
                label="Phone"
                placeholder="Phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                required
              />
              <Input
                label="Email"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />
              <Input
                label="Fax (Optional)"
                placeholder="Fax number"
                value={fax}
                onChangeText={setFax}
                keyboardType="phone-pad"
              />
              <Input
                label="Website (Optional)"
                placeholder="https://example.com"
                value={website}
                onChangeText={setWebsite}
                keyboardType="url"
                autoCapitalize="none"
              />
            </Column>
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              variant="outline"
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
              style={styles.actionButton}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.actionButton}>
              {isEditMode ? 'Update' : 'Create'} Branch
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
  },
});
