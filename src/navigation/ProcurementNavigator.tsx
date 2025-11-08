/**
 * Procurement Navigator
 * Stack navigator for procurement and supplier management screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {ProcurementStackParamList} from './types';

// Import Procurement Screens
import {
  SupplierListScreen,
  SupplierDetailsScreen,
  SupplierFormScreen,
  PurchaseOrderListScreen,
  PurchaseOrderDetailsScreen,
  PurchaseOrderFormScreen,
  POApprovalScreen,
  ReceivingScreen,
} from '@screens/procurement';

const Stack = createNativeStackNavigator<ProcurementStackParamList>();

export const ProcurementNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}>
      {/* Supplier Screens */}
      <Stack.Screen
        name="SupplierList"
        component={SupplierListScreen}
        options={{
          title: 'Suppliers',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SupplierDetails"
        component={SupplierDetailsScreen}
        options={{
          title: 'Supplier Details',
        }}
      />
      <Stack.Screen
        name="SupplierForm"
        component={SupplierFormScreen}
        options={{
          title: 'Supplier',
        }}
      />

      {/* Purchase Order Screens */}
      <Stack.Screen
        name="PurchaseOrderList"
        component={PurchaseOrderListScreen}
        options={{
          title: 'Purchase Orders',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PurchaseOrderDetails"
        component={PurchaseOrderDetailsScreen}
        options={{
          title: 'PO Details',
        }}
      />
      <Stack.Screen
        name="PurchaseOrderForm"
        component={PurchaseOrderFormScreen}
        options={{
          title: 'Purchase Order',
        }}
      />

      {/* Approval Screen */}
      <Stack.Screen
        name="POApproval"
        component={POApprovalScreen}
        options={{
          title: 'Approvals',
          headerShown: false,
        }}
      />

      {/* Receiving Screen */}
      <Stack.Screen
        name="Receiving"
        component={ReceivingScreen}
        options={{
          title: 'Receiving',
        }}
      />
    </Stack.Navigator>
  );
};
