/**
 * Reports Navigator
 * Stack navigator for reporting and analytics screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {ReportsStackParamList} from './types';

// Import Report Screens (to be implemented)
import ReportsDashboardScreen from '@/screens/reports/ReportsDashboardScreen';
import SalesReportsScreen from '@/screens/reports/sales/SalesReportsScreen';
import CustomerReportsScreen from '@/screens/reports/customers/CustomerReportsScreen';
import ProductReportsScreen from '@/screens/reports/products/ProductReportsScreen';
import FinancialReportsScreen from '@/screens/reports/financial/FinancialReportsScreen';

const Stack = createNativeStackNavigator<ReportsStackParamList>();

export function ReportsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ReportsDashboard"
      screenOptions={{
        headerShown: false,
      }}>
      {/* Dashboard */}
      <Stack.Screen
        name="ReportsDashboard"
        component={ReportsDashboardScreen}
        options={{title: 'Reports & Analytics'}}
      />

      {/* Sales Reports */}
      <Stack.Screen
        name="SalesReports"
        component={SalesReportsScreen}
        options={{title: 'Sales Reports', headerShown: true}}
      />

      {/* Customer Reports */}
      <Stack.Screen
        name="CustomerReports"
        component={CustomerReportsScreen}
        options={{title: 'Customer Reports', headerShown: true}}
      />

      {/* Product Reports */}
      <Stack.Screen
        name="ProductReports"
        component={ProductReportsScreen}
        options={{title: 'Product Reports', headerShown: true}}
      />

      {/* Financial Reports */}
      <Stack.Screen
        name="FinancialReportsOverview"
        component={FinancialReportsScreen}
        options={{title: 'Financial Reports', headerShown: true}}
      />
    </Stack.Navigator>
  );
}
