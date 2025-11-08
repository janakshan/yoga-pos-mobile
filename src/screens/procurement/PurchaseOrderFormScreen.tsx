/**
 * Purchase Order Form Screen
 */

import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {ProcurementStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  usePurchaseOrder,
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useSuppliers,
} from '@hooks/queries/useProcurement';
import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Column, Row} from '@components/layout';

type POFormScreenRouteProp = RouteProp<ProcurementStackParamList, 'PurchaseOrderForm'>;

export const PurchaseOrderFormScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<POFormScreenRouteProp>();
  const navigation = useNavigation();

  const {mode, purchaseOrderId} = route.params;
  const isEdit = mode === 'edit';

  const {data: po} = usePurchaseOrder(purchaseOrderId || '', isEdit);
  const {data: suppliersData} = useSuppliers();
  const createMutation = useCreatePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder();

  // Form state
  const [formData, setFormData] = useState({
    supplierId: po?.supplierId || '',
    locationId: po?.locationId || '',
    expectedDeliveryDate: po?.expectedDeliveryDate || '',
    currency: po?.currency || 'USD',
    notes: po?.notes || '',
  });

  const [items, setItems] = useState(po?.items || []);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = async () => {
    if (!formData.supplierId || !formData.locationId) {
      Alert.alert('Error', 'Please select supplier and location');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    try {
      const data: any = {
        ...formData,
        items,
        subtotal: items.reduce((sum, item) => sum + (item.total || 0), 0),
        taxAmount: 0,
        total: items.reduce((sum, item) => sum + (item.total || 0), 0),
        createdBy: 'current-user-id', // TODO: Get from auth
      };

      if (isEdit && purchaseOrderId) {
        await updateMutation.mutateAsync({id: purchaseOrderId, data});
        Alert.alert('Success', 'Purchase order updated');
      } else {
        await createMutation.mutateAsync(data);
        Alert.alert('Success', 'Purchase order created');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save purchase order');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Column spacing="md">
            <Typography variant="h2">{isEdit ? 'Edit' : 'Create'} Purchase Order</Typography>

            <Input
              label="Supplier ID *"
              value={formData.supplierId}
              onChangeText={text => updateField('supplierId', text)}
              placeholder="Select supplier"
            />

            <Input
              label="Location ID *"
              value={formData.locationId}
              onChangeText={text => updateField('locationId', text)}
              placeholder="Select location"
            />

            <Input
              label="Expected Delivery Date"
              value={formData.expectedDeliveryDate}
              onChangeText={text => updateField('expectedDeliveryDate', text)}
              placeholder="YYYY-MM-DD"
            />

            <Input
              label="Notes"
              value={formData.notes}
              onChangeText={text => updateField('notes', text)}
              placeholder="Add notes"
              multiline
              numberOfLines={3}
            />

            <Typography variant="h4">Items</Typography>
            {items.length === 0 && (
              <Typography variant="body" color={theme.textSecondary}>
                No items added yet
              </Typography>
            )}

            <Button
              onPress={handleSubmit}
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : isEdit
                ? 'Update Purchase Order'
                : 'Create Purchase Order'}
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
