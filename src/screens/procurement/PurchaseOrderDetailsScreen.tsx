/**
 * Purchase Order Details Screen
 */

import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ProcurementStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  usePurchaseOrder,
  useSendPurchaseOrder,
  useCancelPurchaseOrder,
} from '@hooks/queries/useProcurement';
import {PurchaseOrderStatus} from '@types/api.types';
import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

type PODetailsScreenRouteProp = RouteProp<ProcurementStackParamList, 'PurchaseOrderDetails'>;

export const PurchaseOrderDetailsScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<PODetailsScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ProcurementStackParamList>>();

  const {purchaseOrderId} = route.params;
  const {data: po, isLoading} = usePurchaseOrder(purchaseOrderId);

  const sendMutation = useSendPurchaseOrder();
  const cancelMutation = useCancelPurchaseOrder();

  const handleSend = async () => {
    try {
      await sendMutation.mutateAsync(purchaseOrderId);
      Alert.alert('Success', 'Purchase order sent to supplier');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send purchase order');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Purchase Order',
      'Are you sure you want to cancel this purchase order?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelMutation.mutateAsync({id: purchaseOrderId});
              Alert.alert('Success', 'Purchase order cancelled');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel');
            }
          },
        },
      ],
    );
  };

  const handleReceive = () => {
    navigation.navigate('Receiving', {
      purchaseOrderId,
      locationId: po?.locationId || '',
    });
  };

  if (isLoading || !po) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            Loading purchase order...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Column spacing="md">
            <Row justify="space-between" align="center">
              <Typography variant="h2">{po.poNumber}</Typography>
              <View style={[styles.badge, {backgroundColor: theme.primary + '20'}]}>
                <Typography variant="caption" color={theme.primary}>
                  {po.status.toUpperCase()}
                </Typography>
              </View>
            </Row>

            {/* Supplier */}
            <Column spacing="sm">
              <Typography variant="h4">Supplier</Typography>
              <Typography variant="body">{po.supplier?.name || 'Unknown'}</Typography>
            </Column>

            {/* Location */}
            <Column spacing="sm">
              <Typography variant="h4">Delivery Location</Typography>
              <Typography variant="body">{po.location?.name || 'Unknown'}</Typography>
            </Column>

            {/* Dates */}
            <Column spacing="sm">
              <Typography variant="h4">Dates</Typography>
              <Typography variant="body">
                Created: {new Date(po.createdAt).toLocaleDateString()}
              </Typography>
              {po.expectedDeliveryDate && (
                <Typography variant="body">
                  Expected Delivery: {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                </Typography>
              )}
            </Column>

            {/* Items */}
            <Column spacing="sm">
              <Typography variant="h4">Items ({po.items?.length || 0})</Typography>
              {po.items?.map((item, index) => (
                <Card key={index} style={styles.itemCard}>
                  <Column spacing="xs">
                    <Typography variant="body">{item.name}</Typography>
                    <Row justify="space-between">
                      <Typography variant="caption" color={theme.textSecondary}>
                        Qty: {item.quantityOrdered}
                      </Typography>
                      <Typography variant="caption" color={theme.textSecondary}>
                        Price: {po.currency} {item.unitPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="caption">
                        Total: {po.currency} {item.total.toFixed(2)}
                      </Typography>
                    </Row>
                  </Column>
                </Card>
              ))}
            </Column>

            {/* Totals */}
            <Column spacing="sm">
              <Typography variant="h4">Total</Typography>
              <Row justify="space-between">
                <Typography variant="body">Subtotal:</Typography>
                <Typography variant="body">
                  {po.currency} {po.subtotal.toFixed(2)}
                </Typography>
              </Row>
              <Row justify="space-between">
                <Typography variant="body">Tax:</Typography>
                <Typography variant="body">
                  {po.currency} {po.taxAmount.toFixed(2)}
                </Typography>
              </Row>
              <Row justify="space-between">
                <Typography variant="h3">Total:</Typography>
                <Typography variant="h3" color={theme.primary}>
                  {po.currency} {po.total.toFixed(2)}
                </Typography>
              </Row>
            </Column>

            {/* Actions */}
            <Column spacing="sm">
              {po.status === PurchaseOrderStatus.DRAFT && (
                <>
                  <Button onPress={handleSend} variant="primary">
                    Send to Supplier
                  </Button>
                  <Button
                    onPress={() =>
                      navigation.navigate('PurchaseOrderForm', {
                        mode: 'edit',
                        purchaseOrderId,
                      })
                    }
                    variant="secondary">
                    Edit
                  </Button>
                </>
              )}
              {(po.status === PurchaseOrderStatus.SENT ||
                po.status === PurchaseOrderStatus.CONFIRMED ||
                po.status === PurchaseOrderStatus.PARTIALLY_RECEIVED) && (
                <Button onPress={handleReceive} variant="primary">
                  Receive Items
                </Button>
              )}
              {po.status !== PurchaseOrderStatus.CANCELLED &&
                po.status !== PurchaseOrderStatus.RECEIVED && (
                  <Button onPress={handleCancel} variant="danger">
                    Cancel Order
                  </Button>
                )}
            </Column>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemCard: {
    padding: 12,
    marginTop: 8,
  },
});
