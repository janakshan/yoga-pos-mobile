/**
 * Inventory Navigator
 * Stack navigator for inventory management screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {InventoryStackParamList} from './types';

// Import Inventory Screens (we'll create these)
import {InventoryDashboardScreen} from '@screens/inventory/InventoryDashboardScreen';
import {StockLevelsScreen} from '@screens/inventory/StockLevelsScreen';
import {StockLevelDetailsScreen} from '@screens/inventory/StockLevelDetailsScreen';
import {StockTransferListScreen} from '@screens/inventory/StockTransferListScreen';
import {StockTransferDetailsScreen} from '@screens/inventory/StockTransferDetailsScreen';
import {StockTransferCreateScreen} from '@screens/inventory/StockTransferCreateScreen';
import {StockTransferReceiveScreen} from '@screens/inventory/StockTransferReceiveScreen';
import {StockAdjustmentListScreen} from '@screens/inventory/StockAdjustmentListScreen';
import {StockAdjustmentDetailsScreen} from '@screens/inventory/StockAdjustmentDetailsScreen';
import {StockAdjustmentCreateScreen} from '@screens/inventory/StockAdjustmentCreateScreen';
import {CycleCountListScreen} from '@screens/inventory/CycleCountListScreen';
import {CycleCountDetailsScreen} from '@screens/inventory/CycleCountDetailsScreen';
import {CycleCountCreateScreen} from '@screens/inventory/CycleCountCreateScreen';
import {CycleCountPerformScreen} from '@screens/inventory/CycleCountPerformScreen';
import {PhysicalInventoryListScreen} from '@screens/inventory/PhysicalInventoryListScreen';
import {PhysicalInventoryDetailsScreen} from '@screens/inventory/PhysicalInventoryDetailsScreen';
import {PhysicalInventoryCreateScreen} from '@screens/inventory/PhysicalInventoryCreateScreen';
import {PhysicalInventoryPerformScreen} from '@screens/inventory/PhysicalInventoryPerformScreen';
import {WasteLossListScreen} from '@screens/inventory/WasteLossListScreen';
import {WasteLossDetailsScreen} from '@screens/inventory/WasteLossDetailsScreen';
import {WasteLossCreateScreen} from '@screens/inventory/WasteLossCreateScreen';
import {LowStockAlertsScreen} from '@screens/inventory/LowStockAlertsScreen';
import {InventoryTransactionsScreen} from '@screens/inventory/InventoryTransactionsScreen';
import {BarcodeScanScreen} from '@screens/inventory/BarcodeScanScreen';
import {SerialNumberScanScreen} from '@screens/inventory/SerialNumberScanScreen';

const Stack = createNativeStackNavigator<InventoryStackParamList>();

export const InventoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}>
      {/* Dashboard */}
      <Stack.Screen
        name="InventoryDashboard"
        component={InventoryDashboardScreen}
        options={{
          title: 'Inventory',
          headerShown: false,
        }}
      />

      {/* Stock Levels */}
      <Stack.Screen
        name="StockLevels"
        component={StockLevelsScreen}
        options={{
          title: 'Stock Levels',
        }}
      />
      <Stack.Screen
        name="StockLevelDetails"
        component={StockLevelDetailsScreen}
        options={{
          title: 'Stock Details',
        }}
      />

      {/* Stock Transfers */}
      <Stack.Screen
        name="StockTransferList"
        component={StockTransferListScreen}
        options={{
          title: 'Stock Transfers',
        }}
      />
      <Stack.Screen
        name="StockTransferDetails"
        component={StockTransferDetailsScreen}
        options={{
          title: 'Transfer Details',
        }}
      />
      <Stack.Screen
        name="StockTransferCreate"
        component={StockTransferCreateScreen}
        options={{
          title: 'Create Transfer',
        }}
      />
      <Stack.Screen
        name="StockTransferReceive"
        component={StockTransferReceiveScreen}
        options={{
          title: 'Receive Transfer',
        }}
      />

      {/* Stock Adjustments */}
      <Stack.Screen
        name="StockAdjustmentList"
        component={StockAdjustmentListScreen}
        options={{
          title: 'Stock Adjustments',
        }}
      />
      <Stack.Screen
        name="StockAdjustmentDetails"
        component={StockAdjustmentDetailsScreen}
        options={{
          title: 'Adjustment Details',
        }}
      />
      <Stack.Screen
        name="StockAdjustmentCreate"
        component={StockAdjustmentCreateScreen}
        options={{
          title: 'Create Adjustment',
        }}
      />

      {/* Cycle Counts */}
      <Stack.Screen
        name="CycleCountList"
        component={CycleCountListScreen}
        options={{
          title: 'Cycle Counts',
        }}
      />
      <Stack.Screen
        name="CycleCountDetails"
        component={CycleCountDetailsScreen}
        options={{
          title: 'Cycle Count Details',
        }}
      />
      <Stack.Screen
        name="CycleCountCreate"
        component={CycleCountCreateScreen}
        options={{
          title: 'Create Cycle Count',
        }}
      />
      <Stack.Screen
        name="CycleCountPerform"
        component={CycleCountPerformScreen}
        options={{
          title: 'Perform Count',
        }}
      />

      {/* Physical Inventories */}
      <Stack.Screen
        name="PhysicalInventoryList"
        component={PhysicalInventoryListScreen}
        options={{
          title: 'Physical Inventories',
        }}
      />
      <Stack.Screen
        name="PhysicalInventoryDetails"
        component={PhysicalInventoryDetailsScreen}
        options={{
          title: 'Inventory Details',
        }}
      />
      <Stack.Screen
        name="PhysicalInventoryCreate"
        component={PhysicalInventoryCreateScreen}
        options={{
          title: 'Create Physical Inventory',
        }}
      />
      <Stack.Screen
        name="PhysicalInventoryPerform"
        component={PhysicalInventoryPerformScreen}
        options={{
          title: 'Perform Count',
        }}
      />

      {/* Waste/Loss */}
      <Stack.Screen
        name="WasteLossList"
        component={WasteLossListScreen}
        options={{
          title: 'Waste & Loss',
        }}
      />
      <Stack.Screen
        name="WasteLossDetails"
        component={WasteLossDetailsScreen}
        options={{
          title: 'Record Details',
        }}
      />
      <Stack.Screen
        name="WasteLossCreate"
        component={WasteLossCreateScreen}
        options={{
          title: 'Report Waste/Loss',
        }}
      />

      {/* Alerts & Transactions */}
      <Stack.Screen
        name="LowStockAlerts"
        component={LowStockAlertsScreen}
        options={{
          title: 'Low Stock Alerts',
        }}
      />
      <Stack.Screen
        name="InventoryTransactions"
        component={InventoryTransactionsScreen}
        options={{
          title: 'Transactions History',
        }}
      />

      {/* Scanning Screens */}
      <Stack.Screen
        name="BarcodeScan"
        component={BarcodeScanScreen}
        options={{
          title: 'Scan Barcode',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="SerialNumberScan"
        component={SerialNumberScanScreen}
        options={{
          title: 'Scan Serial Number',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
