/**
 * Customer Form Screen
 * Form for creating and editing customers
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
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import type {CustomersStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from '@hooks/queries/useCustomers';
import {usePermission} from '@hooks/useRBAC';
import {Permission, Customer} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Column} from '@components/layout';

export const CustomerFormScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<CustomersStackParamList>>();
  const route = useRoute<RouteProp<CustomersStackParamList, 'CustomerForm'>>();

  const {mode, customerId} = route.params;
  const isEditMode = mode === 'edit';

  // Permissions
  const canCreate = usePermission(Permission.CUSTOMER_CREATE);
  const canUpdate = usePermission(Permission.CUSTOMER_UPDATE);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [anniversary, setAnniversary] = useState('');
  const [gender, setGender] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [customerType, setCustomerType] = useState<'vip' | 'regular' | 'corporate'>(
    'regular',
  );
  const [status, setStatus] = useState<'active' | 'inactive' | 'blocked'>('active');
  const [notes, setNotes] = useState('');
  const [loyaltyCardNumber, setLoyaltyCardNumber] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  // Queries
  const {data: customer, isLoading} = useCustomer(customerId || '', !!customerId);
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  // Load customer data for edit mode
  useEffect(() => {
    if (customer && isEditMode) {
      setFirstName(customer.firstName || '');
      setLastName(customer.lastName || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setAlternatePhone(customer.alternatePhone || '');
      setDateOfBirth(customer.dateOfBirth || '');
      setAnniversary(customer.anniversary || '');
      setGender(customer.gender || '');
      setStreet(customer.address?.street || '');
      setCity(customer.address?.city || '');
      setState(customer.address?.state || '');
      setPostalCode(customer.address?.postalCode || '');
      setCountry(customer.address?.country || '');
      setCustomerType(customer.customerType);
      setStatus(customer.status);
      setNotes(customer.notes || '');
      setLoyaltyCardNumber(customer.loyaltyCardNumber || '');
      setMarketingOptIn(customer.marketingOptIn || false);
    }
  }, [customer, isEditMode]);

  // Permission check
  if (isEditMode && !canUpdate) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.errorContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            You don't have permission to edit customers
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (!isEditMode && !canCreate) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.errorContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            You don't have permission to create customers
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const customerData: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      alternatePhone: alternatePhone.trim() || undefined,
      dateOfBirth: dateOfBirth.trim() || undefined,
      anniversary: anniversary.trim() || undefined,
      gender: gender.trim() || undefined,
      customerType,
      status,
      notes: notes.trim() || undefined,
      loyaltyCardNumber: loyaltyCardNumber.trim() || undefined,
      marketingOptIn,
    };

    // Add address if any field is filled
    if (street || city || state || postalCode || country) {
      customerData.address = {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      };
    }

    try {
      if (isEditMode && customerId) {
        await updateCustomerMutation.mutateAsync({
          id: customerId,
          data: customerData,
        });
        Alert.alert('Success', 'Customer updated successfully');
      } else {
        await createCustomerMutation.mutateAsync(customerData);
        Alert.alert('Success', 'Customer created successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `Failed to ${isEditMode ? 'update' : 'create'} customer`,
      );
    }
  };

  if (isLoading && isEditMode) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <Typography variant="h2">
          {isEditMode ? 'Edit Customer' : 'New Customer'}
        </Typography>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.section}>
          <Column spacing="md">
            <Typography variant="h3">Personal Information</Typography>

            <Input
              label="First Name *"
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Input
              label="Last Name *"
              placeholder="Enter last name"
              value={lastName}
              onChangeText={setLastName}
            />

            <Input
              label="Email *"
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Phone *"
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Input
              label="Alternate Phone"
              placeholder="Enter alternate phone"
              value={alternatePhone}
              onChangeText={setAlternatePhone}
              keyboardType="phone-pad"
            />

            <Input
              label="Date of Birth (YYYY-MM-DD)"
              placeholder="Enter date of birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

            <Input
              label="Anniversary (YYYY-MM-DD)"
              placeholder="Enter anniversary date"
              value={anniversary}
              onChangeText={setAnniversary}
            />

            <Input
              label="Gender"
              placeholder="Enter gender"
              value={gender}
              onChangeText={setGender}
            />
          </Column>
        </Card>

        <Card style={styles.section}>
          <Column spacing="md">
            <Typography variant="h3">Address</Typography>

            <Input
              label="Street"
              placeholder="Enter street address"
              value={street}
              onChangeText={setStreet}
            />

            <Input
              label="City"
              placeholder="Enter city"
              value={city}
              onChangeText={setCity}
            />

            <Input
              label="State"
              placeholder="Enter state"
              value={state}
              onChangeText={setState}
            />

            <Input
              label="Postal Code"
              placeholder="Enter postal code"
              value={postalCode}
              onChangeText={setPostalCode}
            />

            <Input
              label="Country"
              placeholder="Enter country"
              value={country}
              onChangeText={setCountry}
            />
          </Column>
        </Card>

        <Card style={styles.section}>
          <Column spacing="md">
            <Typography variant="h3">Customer Details</Typography>

            <View>
              <Typography variant="body" style={styles.label}>
                Customer Type *
              </Typography>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        customerType === 'regular' ? theme.primary : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setCustomerType('regular')}>
                  <Typography
                    variant="body"
                    color={customerType === 'regular' ? '#fff' : theme.text}>
                    Regular
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        customerType === 'vip' ? theme.primary : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setCustomerType('vip')}>
                  <Typography
                    variant="body"
                    color={customerType === 'vip' ? '#fff' : theme.text}>
                    VIP
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        customerType === 'corporate' ? theme.primary : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setCustomerType('corporate')}>
                  <Typography
                    variant="body"
                    color={customerType === 'corporate' ? '#fff' : theme.text}>
                    Corporate
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Typography variant="body" style={styles.label}>
                Status *
              </Typography>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        status === 'active' ? theme.success : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setStatus('active')}>
                  <Typography
                    variant="body"
                    color={status === 'active' ? '#fff' : theme.text}>
                    Active
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        status === 'inactive' ? theme.warning : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setStatus('inactive')}>
                  <Typography
                    variant="body"
                    color={status === 'inactive' ? '#fff' : theme.text}>
                    Inactive
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        status === 'blocked' ? theme.error : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setStatus('blocked')}>
                  <Typography
                    variant="body"
                    color={status === 'blocked' ? '#fff' : theme.text}>
                    Blocked
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>

            <Input
              label="Loyalty Card Number"
              placeholder="Enter loyalty card number"
              value={loyaltyCardNumber}
              onChangeText={setLoyaltyCardNumber}
            />

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setMarketingOptIn(!marketingOptIn)}>
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: marketingOptIn ? theme.primary : 'transparent',
                    borderColor: theme.border,
                  },
                ]}>
                {marketingOptIn && (
                  <Typography variant="body" color="#fff">
                    ✓
                  </Typography>
                )}
              </View>
              <Typography variant="body">Marketing Opt-in</Typography>
            </TouchableOpacity>
          </Column>
        </Card>

        <Card style={styles.section}>
          <Column spacing="md">
            <Typography variant="h3">Notes</Typography>
            <Input
              placeholder="Enter any additional notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </Column>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.button}
          />
          <Button
            title={isEditMode ? 'Update' : 'Create'}
            onPress={handleSubmit}
            style={styles.button}
            disabled={
              createCustomerMutation.isPending || updateCustomerMutation.isPending
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
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
  },
});
