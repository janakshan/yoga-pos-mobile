/**
 * POS Barcode Scan Screen
 * Camera-based barcode scanning for products
 * Note: Requires expo-camera or react-native-vision-camera
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {POSStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {useProductByBarcode} from '@hooks/queries/useProducts';
import {usePOSStore} from '@store/slices/posSlice';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Column} from '@components/layout';

type BarcodeScanRouteProp = RouteProp<POSStackParamList, 'POSBarcodeScan'>;

export const POSBarcodeScanScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<POSStackParamList>>();
  const route = useRoute<BarcodeScanRouteProp>();

  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedBarcode, setScannedBarcode] = useState('');

  const {addItem} = usePOSStore();

  // Query for product by barcode
  const {
    data: product,
    isLoading,
    refetch,
  } = useProductByBarcode(scannedBarcode, !!scannedBarcode);

  // Handle barcode scan result
  const handleBarcodeScanned = async (barcode: string) => {
    setScannedBarcode(barcode);

    try {
      const result = await refetch();

      if (result.data) {
        addItem(result.data, 1);
        Alert.alert('Success', `Added ${result.data.name} to cart`);
        navigation.goBack();
      } else {
        Alert.alert('Not Found', 'Product not found with this barcode');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to find product');
    }
  };

  // Handle manual barcode entry
  const handleManualEntry = () => {
    if (!manualBarcode) {
      Alert.alert('Error', 'Please enter a barcode');
      return;
    }
    handleBarcodeScanned(manualBarcode);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
      {/* Header */}
      <View style={styles.header}>
        <Button variant="ghost" onPress={() => navigation.goBack()}>
          ← Back
        </Button>
      </View>

      {/* Camera View Placeholder */}
      <View style={styles.cameraContainer}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="h3" style={styles.cameraIcon}>
            📷
          </Typography>
          <Typography variant="h6" align="center" color={theme.colors.text.primary}>
            Camera Integration
          </Typography>
          <Typography variant="body" align="center" color={theme.colors.text.secondary}>
            Install expo-camera or react-native-vision-camera to enable barcode scanning
          </Typography>

          {/* Manual Barcode Entry */}
          <View style={styles.manualEntry}>
            <Typography variant="body" weight="semiBold" style={styles.manualTitle}>
              Or enter barcode manually:
            </Typography>
            <Input
              placeholder="Enter barcode"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="number-pad"
            />
            <Button
              variant="primary"
              fullWidth
              onPress={handleManualEntry}
              loading={isLoading}>
              Search Product
            </Button>
          </View>
        </Column>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  cameraContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  cameraIcon: {
    fontSize: 64,
  },
  manualEntry: {
    width: '100%',
    marginTop: 32,
    gap: 16,
  },
  manualTitle: {
    marginBottom: 8,
  },
});
