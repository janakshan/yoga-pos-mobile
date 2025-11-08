/**
 * POS Navigator
 * Stack navigator for POS screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {POSStackParamList} from './types';

// Import POS Screens
import {POSMainScreen} from '@screens/pos/POSMainScreen';
import {POSCheckoutScreen} from '@screens/pos/POSCheckoutScreen';
import {POSReceiptScreen} from '@screens/pos/POSReceiptScreen';
import {POSFastCheckoutScreen} from '@screens/pos/POSFastCheckoutScreen';
import {POSHeldSalesScreen} from '@screens/pos/POSHeldSalesScreen';
import {POSBarcodeScanScreen} from '@screens/pos/POSBarcodeScanScreen';
import {POSCustomerSelectScreen} from '@screens/pos/POSCustomerSelectScreen';

const Stack = createNativeStackNavigator<POSStackParamList>();

export const POSNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="POSMain" component={POSMainScreen} />
      <Stack.Screen name="POSFastCheckout" component={POSFastCheckoutScreen} />
      <Stack.Screen name="POSCheckout" component={POSCheckoutScreen} />
      <Stack.Screen name="POSReceipt" component={POSReceiptScreen} />
      <Stack.Screen name="POSHeldSales" component={POSHeldSalesScreen} />
      <Stack.Screen
        name="POSBarcodeScan"
        component={POSBarcodeScanScreen}
        options={{
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="POSCustomerSelect"
        component={POSCustomerSelectScreen}
        options={{
          presentation: 'modal',
        }}
      />
      {/* TODO: Add these screens later */}
      {/* <Stack.Screen name="POSReturns" component={POSReturnsScreen} /> */}
      {/* <Stack.Screen name="POSReturnDetails" component={POSReturnDetailsScreen} /> */}
    </Stack.Navigator>
  );
};
