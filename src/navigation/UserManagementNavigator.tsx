/**
 * User Management Navigator
 * Stack navigator for user management screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {UserManagementStackParamList} from './types';

// Import User Management Screens
import {
  UserListScreen,
  UserDetailsScreen,
  UserFormScreen,
} from '@screens/users';

const Stack = createNativeStackNavigator<UserManagementStackParamList>();

export const UserManagementNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={{
          title: 'Users',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{
          title: 'User Details',
        }}
      />
      <Stack.Screen
        name="UserForm"
        component={UserFormScreen}
        options={{
          title: 'User',
        }}
      />
    </Stack.Navigator>
  );
};
