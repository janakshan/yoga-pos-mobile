/**
 * POS Fast Checkout Screen
 * Quick checkout for common items
 */

import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {POSStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {usePOSStore} from '@store/slices/posSlice';
import {useProducts} from '@hooks/queries/useProducts';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Column} from '@components/layout';

export const POSFastCheckoutScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<POSStackParamList>>();

  const {addItem, clearCart} = usePOSStore();
  const {data: productsData} = useProducts({limit: 20, status: 'active'});

  const products = productsData?.data || [];

  const handleQuickSale = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      clearCart();
      addItem(product, 1);
      navigation.navigate('POSCheckout');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <Button variant="ghost" onPress={() => navigation.goBack()}>
          ← Back
        </Button>
        <Typography variant="h5" weight="semiBold" color={theme.colors.text.primary}>
          Fast Checkout
        </Typography>
        <View style={{width: 60}} />
      </View>

      <ScrollView style={styles.content}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="h4" align="center" color={theme.colors.text.primary}>
            🚀
          </Typography>
          <Typography variant="h6" align="center" color={theme.colors.text.primary}>
            Fast Checkout
          </Typography>
          <Typography variant="body" align="center" color={theme.colors.text.secondary}>
            Quick one-tap checkout for common products
          </Typography>
          <Typography variant="caption" align="center" color={theme.colors.text.secondary}>
            Feature coming soon
          </Typography>
        </Column>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
});
