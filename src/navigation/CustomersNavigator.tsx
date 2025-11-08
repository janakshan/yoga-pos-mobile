/**
 * Customers Navigator
 * Stack navigator for customer management screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {CustomersStackParamList} from './types';

// Import Customer Screens
import {
  CustomerListScreen,
  CustomerDetailsScreen,
  CustomerFormScreen,
  CustomerQRScanScreen,
} from '@screens/customers';

const Stack = createNativeStackNavigator<CustomersStackParamList>();

export const CustomersNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{
          title: 'Customers',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CustomerDetails"
        component={CustomerDetailsScreen}
        options={{
          title: 'Customer Details',
        }}
      />
      <Stack.Screen
        name="CustomerForm"
        component={CustomerFormScreen}
        options={{
          title: 'Customer',
        }}
      />
      <Stack.Screen
        name="CustomerQRScan"
        component={CustomerQRScanScreen}
        options={{
          title: 'Scan Loyalty Card',
        }}
      />
    </Stack.Navigator>
  );
};
