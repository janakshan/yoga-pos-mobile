/**
 * Supplier Details Screen
 */

import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ProcurementStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {useSupplier} from '@hooks/queries/useProcurement';
import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

type SupplierDetailsScreenRouteProp = RouteProp<ProcurementStackParamList, 'SupplierDetails'>;

export const SupplierDetailsScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<SupplierDetailsScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ProcurementStackParamList>>();

  const {supplierId} = route.params;
  const {data: supplier, isLoading} = useSupplier(supplierId);

  if (isLoading || !supplier) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            Loading supplier details...
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
            <Typography variant="h2">{supplier.name}</Typography>
            <Typography variant="caption" color={theme.textSecondary}>
              Code: {supplier.code}
            </Typography>

            {/* Contact Info */}
            <Column spacing="sm">
              <Typography variant="h4">Contact Information</Typography>
              <Typography variant="body">Email: {supplier.email}</Typography>
              <Typography variant="body">Phone: {supplier.phone}</Typography>
              {supplier.contactPerson && (
                <Typography variant="body">Contact: {supplier.contactPerson}</Typography>
              )}
            </Column>

            {/* Payment Terms */}
            <Column spacing="sm">
              <Typography variant="h4">Payment Terms</Typography>
              <Typography variant="body">
                {supplier.paymentTerms.termType.toUpperCase()}
              </Typography>
            </Column>

            {/* Performance */}
            {supplier.performance && (
              <Column spacing="sm">
                <Typography variant="h4">Performance</Typography>
                <Typography variant="body">
                  Total Orders: {supplier.performance.totalOrders}
                </Typography>
                <Typography variant="body">
                  On-Time Delivery: {supplier.performance.onTimeDeliveryRate}%
                </Typography>
                <Typography variant="body">
                  Quality Rating: {supplier.performance.qualityRating}/5
                </Typography>
              </Column>
            )}

            <Button
              onPress={() =>
                navigation.navigate('SupplierForm', {mode: 'edit', supplierId})
              }
              variant="primary">
              Edit Supplier
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
});
