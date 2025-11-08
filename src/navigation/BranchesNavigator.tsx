/**
 * Branches Navigator
 * Stack navigator for branch management screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {BranchesStackParamList} from './types';

// Import Branch Screens
import {
  BranchListScreen,
  BranchDetailsScreen,
  BranchFormScreen,
  BranchDashboardScreen,
  BranchComparisonScreen,
} from '@screens/branches';

const Stack = createNativeStackNavigator<BranchesStackParamList>();

export const BranchesNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="BranchList"
        component={BranchListScreen}
        options={{
          title: 'Branches',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BranchDetails"
        component={BranchDetailsScreen}
        options={{
          title: 'Branch Details',
        }}
      />
      <Stack.Screen
        name="BranchForm"
        component={BranchFormScreen}
        options={{
          title: 'Branch',
        }}
      />
      <Stack.Screen
        name="BranchDashboard"
        component={BranchDashboardScreen}
        options={{
          title: 'Branch Dashboard',
        }}
      />
      <Stack.Screen
        name="BranchComparison"
        component={BranchComparisonScreen}
        options={{
          title: 'Compare Branches',
        }}
      />
    </Stack.Navigator>
  );
};
