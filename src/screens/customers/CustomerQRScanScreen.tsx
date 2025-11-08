/**
 * Customer QR Scan Screen
 * QR code scanner for loyalty card lookup
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {CustomersStackParamList} from '@navigation/types';
import {CameraView, Camera} from 'expo-camera';

import {useTheme} from '@hooks/useTheme';
import {useCustomerByLoyaltyCard} from '@hooks/queries/useCustomers';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Column} from '@components/layout';

export const CustomerQRScanScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<CustomersStackParamList>>();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  // Query for customer lookup
  const {
    data: customer,
    isLoading,
    error,
  } = useCustomerByLoyaltyCard(scannedCode, scanned && !!scannedCode);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (customer && scanned) {
      Alert.alert(
        'Customer Found',
        `${customer.firstName} ${customer.lastName}\n${customer.email}\nLoyalty Points: ${customer.loyaltyInfo?.points || 0}`,
        [
          {
            text: 'View Details',
            onPress: () => {
              navigation.replace('CustomerDetails', {customerId: customer.id});
            },
          },
          {
            text: 'Scan Again',
            onPress: () => {
              setScanned(false);
              setScannedCode('');
            },
          },
        ],
      );
    } else if (error && scanned) {
      Alert.alert(
        'Customer Not Found',
        'No customer found with this loyalty card number',
        [
          {
            text: 'Scan Again',
            onPress: () => {
              setScanned(false);
              setScannedCode('');
            },
          },
          {text: 'Cancel', onPress: () => navigation.goBack()},
        ],
      );
    }
  }, [customer, error, scanned, navigation]);

  const handleBarCodeScanned = ({type, data}: {type: string; data: string}) => {
    setScanned(true);
    setScannedCode(data);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Typography variant="body" style={styles.message}>
            Requesting camera permission...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.centerContainer}>
          <Card style={styles.messageCard}>
            <Column spacing="md">
              <Typography variant="h3" style={styles.centerText}>
                Camera Permission Required
              </Typography>
              <Typography
                variant="body"
                color={theme.textSecondary}
                style={styles.centerText}>
                Please grant camera permission to scan QR codes
              </Typography>
              <Button
                title="Go Back"
                onPress={() => navigation.goBack()}
                variant="outline"
              />
            </Column>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <Typography variant="h2">Scan Loyalty Card</Typography>
        <Typography variant="body" color={theme.textSecondary}>
          Position the QR code within the frame
        </Typography>
      </View>

      <View style={styles.cameraContainer}>
        {!scanned ? (
          <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}>
            <View style={styles.overlay}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
          </CameraView>
        ) : (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Typography variant="body" style={styles.message}>
              {isLoading ? 'Looking up customer...' : 'Processing...'}
            </Typography>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
        {scanned && (
          <Button
            title="Scan Again"
            onPress={() => {
              setScanned(false);
              setScannedCode('');
            }}
          />
        )}
      </View>

      <Card style={styles.infoCard}>
        <Column spacing="sm">
          <Typography variant="h4">How to scan:</Typography>
          <Typography variant="caption" color={theme.textSecondary}>
            1. Hold the device steady
          </Typography>
          <Typography variant="caption" color={theme.textSecondary}>
            2. Position the QR code within the frame
          </Typography>
          <Typography variant="caption" color={theme.textSecondary}>
            3. Wait for automatic detection
          </Typography>
        </Column>
      </Card>
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
  cameraContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  footer: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  messageCard: {
    width: '100%',
  },
  centerText: {
    textAlign: 'center',
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});
