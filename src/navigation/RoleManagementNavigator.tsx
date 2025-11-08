/**
 * Role Management Navigator
 * Stack navigator for role management screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RoleManagementStackParamList} from './types';

// Import Role Management Screens
import {
  RoleListScreen,
  RoleDetailsScreen,
  RoleFormScreen,
  RoleTemplatesScreen,
} from '@screens/roles';

const Stack = createNativeStackNavigator<RoleManagementStackParamList>();

export const RoleManagementNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="RoleList"
        component={RoleListScreen}
        options={{
          title: 'Roles & Permissions',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RoleDetails"
        component={RoleDetailsScreen}
        options={{
          title: 'Role Details',
        }}
      />
      <Stack.Screen
        name="RoleForm"
        component={RoleFormScreen}
        options={{
          title: 'Role',
        }}
      />
      <Stack.Screen
        name="RoleTemplates"
        component={RoleTemplatesScreen}
        options={{
          title: 'Role Templates',
        }}
      />
    </Stack.Navigator>
  );
};
