/**
 * Receiving Screen
 * Screen for receiving purchase order items with barcode scanning
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ProcurementStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  usePurchaseOrder,
  useStartReceivingSession,
  useReceivingSession,
  useUpdateReceivingItem,
  useCompleteReceivingSession,
  useScanBarcode,
  useUploadSignature,
} from '@hooks/queries/useProcurement';
import {usePermission} from '@hooks/useRBAC';
import {Permission, ReceivingSessionItem} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

type ReceivingScreenRouteProp = RouteProp<ProcurementStackParamList, 'Receiving'>;

export const ReceivingScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<ReceivingScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ProcurementStackParamList>>();

  const {purchaseOrderId, locationId} = route.params;

  // Permissions
  const canReceive = usePermission(Permission.PROCUREMENT_RECEIVE);

  // State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [receivingItems, setReceivingItems] = useState<
    Record<string, {
      quantityReceived: number;
      quantityAccepted: number;
      quantityRejected: number;
      condition: 'good' | 'damaged' | 'defective' | 'mixed';
      notes?: string;
    }>
  >({});

  // Queries
  const {data: purchaseOrder} = usePurchaseOrder(purchaseOrderId);
  const {data: session, refetch: refetchSession} = useReceivingSession(
    sessionId || '',
    !!sessionId,
  );

  const startSessionMutation = useStartReceivingSession();
  const updateItemMutation = useUpdateReceivingItem();
  const completeSessionMutation = useCompleteReceivingSession();
  const scanBarcodeMutation = useScanBarcode();
  const uploadSignatureMutation = useUploadSignature();

  // Start receiving session on mount
  useEffect(() => {
    if (!sessionId && purchaseOrderId && locationId) {
      startSession();
    }
  }, [purchaseOrderId, locationId]);

  const startSession = async () => {
    try {
      const newSession = await startSessionMutation.mutateAsync({
        purchaseOrderId,
        locationId,
      });
      setSessionId(newSession.id);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start receiving session');
    }
  };

  const handleScanBarcode = async (barcode: string) => {
    if (!sessionId) return;

    try {
      const result = await scanBarcodeMutation.mutateAsync({
        sessionId,
        barcode,
      });

      if (result.found && result.item) {
        Alert.alert('Success', `Found: ${result.item.product?.name || 'Product'}`);
        await refetchSession();
      } else {
        Alert.alert('Not Found', result.message || 'Item not found in this order');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to scan barcode');
    }
  };

  const handleUpdateItem = async (itemId: string) => {
    if (!sessionId) return;

    const itemData = receivingItems[itemId];
    if (!itemData) return;

    try {
      await updateItemMutation.mutateAsync({
        sessionId,
        itemId,
        data: itemData,
      });
      Alert.alert('Success', 'Item updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update item');
    }
  };

  const handleCompleteSession = async (signature?: string) => {
    if (!sessionId) return;

    // Validate all items are received
    const allReceived = session?.items.every(
      item => receivingItems[item.id]?.quantityReceived > 0,
    );

    if (!allReceived) {
      Alert.alert(
        'Incomplete',
        'Please receive all items before completing the session',
      );
      return;
    }

    try {
      await completeSessionMutation.mutateAsync({
        sessionId,
        signature,
      });
      Alert.alert('Success', 'Receiving completed successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete receiving');
    }
  };

  const handleOpenBarcodeScanner = () => {
    setShowBarcodeScanner(true);
  };

  const handleOpenSignaturePad = () => {
    setShowSignaturePad(true);
  };

  const updateReceivingItem = (
    itemId: string,
    field: string,
    value: any,
  ) => {
    setReceivingItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  // Permission check
  if (!canReceive) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.errorContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            You don't have permission to receive purchase orders
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (!session && !startSessionMutation.isPending) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.errorContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            Loading receiving session...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const renderReceivingItem = (item: ReceivingSessionItem) => {
    const itemReceiving = receivingItems[item.id] || {
      quantityReceived: 0,
      quantityAccepted: 0,
      quantityRejected: 0,
      condition: 'good' as const,
    };

    return (
      <Card key={item.id} style={styles.itemCard}>
        <Column spacing="sm">
          {/* Product Info */}
          <Typography variant="h4">{item.product?.name || 'Unknown Product'}</Typography>

          <Row justify="space-between">
            <Typography variant="caption" color={theme.textSecondary}>
              Expected:
            </Typography>
            <Typography variant="body">{item.quantityExpected}</Typography>
          </Row>

          {/* Quantity Inputs */}
          <Row spacing="sm">
            <Column flex={1}>
              <Typography variant="caption" color={theme.textSecondary}>
                Received
              </Typography>
              <Input
                value={itemReceiving.quantityReceived.toString()}
                onChangeText={text =>
                  updateReceivingItem(item.id, 'quantityReceived', parseInt(text) || 0)
                }
                keyboardType="numeric"
                placeholder="0"
              />
            </Column>

            <Column flex={1}>
              <Typography variant="caption" color={theme.textSecondary}>
                Accepted
              </Typography>
              <Input
                value={itemReceiving.quantityAccepted.toString()}
                onChangeText={text =>
                  updateReceivingItem(item.id, 'quantityAccepted', parseInt(text) || 0)
                }
                keyboardType="numeric"
                placeholder="0"
              />
            </Column>

            <Column flex={1}>
              <Typography variant="caption" color={theme.textSecondary}>
                Rejected
              </Typography>
              <Input
                value={itemReceiving.quantityRejected.toString()}
                onChangeText={text =>
                  updateReceivingItem(item.id, 'quantityRejected', parseInt(text) || 0)
                }
                keyboardType="numeric"
                placeholder="0"
              />
            </Column>
          </Row>

          {/* Condition Selector */}
          <Column>
            <Typography variant="caption" color={theme.textSecondary}>
              Condition
            </Typography>
            <Row spacing="xs">
              {(['good', 'damaged', 'defective', 'mixed'] as const).map(condition => (
                <Button
                  key={condition}
                  variant={
                    itemReceiving.condition === condition ? 'primary' : 'secondary'
                  }
                  size="sm"
                  onPress={() => updateReceivingItem(item.id, 'condition', condition)}
                  style={styles.conditionButton}>
                  {condition}
                </Button>
              ))}
            </Row>
          </Column>

          {/* Notes */}
          <Input
            placeholder="Notes (optional)"
            value={itemReceiving.notes || ''}
            onChangeText={text => updateReceivingItem(item.id, 'notes', text)}
            multiline
            numberOfLines={2}
          />

          {/* Update Button */}
          <Button
            variant="secondary"
            size="sm"
            onPress={() => handleUpdateItem(item.id)}
            disabled={updateItemMutation.isPending}>
            {updateItemMutation.isPending ? 'Updating...' : 'Update Item'}
          </Button>
        </Column>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <Column>
          <Typography variant="h2">Receiving</Typography>
          <Typography variant="caption" color={theme.textSecondary}>
            PO: {purchaseOrder?.poNumber || 'Unknown'}
          </Typography>
        </Column>
      </View>

      {/* Barcode Scanner Button */}
      <View style={styles.scannerButtonContainer}>
        <Button
          onPress={handleOpenBarcodeScanner}
          variant="primary"
          icon="📷">
          Scan Barcode
        </Button>
      </View>

      {/* Receiving Items */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {session?.items.map(renderReceivingItem)}

        {/* Signature Button */}
        <Button
          onPress={handleOpenSignaturePad}
          variant="secondary"
          style={styles.signatureButton}>
          Add Signature
        </Button>

        {/* Complete Button */}
        <Button
          onPress={() => handleCompleteSession()}
          variant="primary"
          size="lg"
          style={styles.completeButton}
          disabled={completeSessionMutation.isPending}>
          {completeSessionMutation.isPending
            ? 'Completing...'
            : 'Complete Receiving'}
        </Button>
      </ScrollView>

      {/* Barcode Scanner Modal */}
      <Modal
        visible={showBarcodeScanner}
        animationType="slide"
        onRequestClose={() => setShowBarcodeScanner(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <Typography variant="h3" style={styles.modalTitle}>
            Scan Barcode
          </Typography>
          <Typography variant="caption" color={theme.textSecondary}>
            Point camera at barcode
          </Typography>
          {/* TODO: Integrate react-native-camera for barcode scanning */}
          <Button
            onPress={() => setShowBarcodeScanner(false)}
            variant="secondary"
            style={styles.closeButton}>
            Close
          </Button>
        </SafeAreaView>
      </Modal>

      {/* Signature Pad Modal */}
      <Modal
        visible={showSignaturePad}
        animationType="slide"
        onRequestClose={() => setShowSignaturePad(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <Typography variant="h3" style={styles.modalTitle}>
            Signature
          </Typography>
          {/* TODO: Integrate react-native-signature-canvas */}
          <Button
            onPress={() => setShowSignaturePad(false)}
            variant="secondary"
            style={styles.closeButton}>
            Close
          </Button>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  scannerButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    marginBottom: 12,
    padding: 16,
  },
  conditionButton: {
    flex: 1,
  },
  signatureButton: {
    marginTop: 16,
  },
  completeButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 20,
    minWidth: 200,
  },
});
