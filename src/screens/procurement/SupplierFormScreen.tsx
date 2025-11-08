/**
 * Supplier Form Screen
 */

import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {ProcurementStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {useSupplier, useCreateSupplier, useUpdateSupplier} from '@hooks/queries/useProcurement';
import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Column} from '@components/layout';

type SupplierFormScreenRouteProp = RouteProp<ProcurementStackParamList, 'SupplierForm'>;

export const SupplierFormScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<SupplierFormScreenRouteProp>();
  const navigation = useNavigation();

  const {mode, supplierId} = route.params;
  const isEdit = mode === 'edit';

  const {data: supplier} = useSupplier(supplierId || '', isEdit);
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();

  // Form state
  const [formData, setFormData] = useState({
    code: supplier?.code || '',
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    contactPerson: supplier?.contactPerson || '',
    currency: supplier?.currency || 'USD',
    status: supplier?.status || 'active' as const,
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const data: any = {
        ...formData,
        paymentTerms: {termType: 'net_30'},
      };

      if (isEdit && supplierId) {
        await updateMutation.mutateAsync({id: supplierId, data});
        Alert.alert('Success', 'Supplier updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        Alert.alert('Success', 'Supplier created successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save supplier');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Column spacing="md">
            <Typography variant="h2">{isEdit ? 'Edit' : 'Create'} Supplier</Typography>

            <Input
              label="Supplier Code *"
              value={formData.code}
              onChangeText={text => updateField('code', text)}
              placeholder="SUP-001"
            />

            <Input
              label="Supplier Name *"
              value={formData.name}
              onChangeText={text => updateField('name', text)}
              placeholder="Enter supplier name"
            />

            <Input
              label="Email *"
              value={formData.email}
              onChangeText={text => updateField('email', text)}
              placeholder="supplier@example.com"
              keyboardType="email-address"
            />

            <Input
              label="Phone *"
              value={formData.phone}
              onChangeText={text => updateField('phone', text)}
              placeholder="+1234567890"
              keyboardType="phone-pad"
            />

            <Input
              label="Contact Person"
              value={formData.contactPerson}
              onChangeText={text => updateField('contactPerson', text)}
              placeholder="John Doe"
            />

            <Input
              label="Currency"
              value={formData.currency}
              onChangeText={text => updateField('currency', text)}
              placeholder="USD"
            />

            <Button
              onPress={handleSubmit}
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : isEdit
                ? 'Update Supplier'
                : 'Create Supplier'}
            </Button>
          </Column>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
  },
});
