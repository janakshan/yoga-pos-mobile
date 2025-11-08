import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './types';
import {DashboardScreen} from '@screens/dashboard/DashboardScreen';
import {POSNavigator} from './POSNavigator';
import {Theme} from '@constants/theme';
import {Text} from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screens for tabs
const InventoryScreen = () => (
  <Text style={{padding: 20}}>Inventory Screen - Coming Soon</Text>
);
const ProductsScreen = () => (
  <Text style={{padding: 20}}>Products Screen - Coming Soon</Text>
);
const CustomersScreen = () => (
  <Text style={{padding: 20}}>Customers Screen - Coming Soon</Text>
);
const MoreScreen = () => (
  <Text style={{padding: 20}}>More Screen - Coming Soon</Text>
);

/**
 * Main Navigator
 * Bottom tab navigation for authenticated users
 */

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary[500],
        tabBarInactiveTintColor: Theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: Theme.colors.white,
          borderTopColor: Theme.colors.border.light,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: Theme.colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Theme.colors.border.light,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: Theme.colors.text.primary,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          headerTitle: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="POS"
        component={POSNavigator}
        options={{
          tabBarLabel: 'POS',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarLabel: 'Inventory',
          headerTitle: 'Inventory',
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Products',
          headerTitle: 'Products',
        }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomersScreen}
        options={{
          tabBarLabel: 'Customers',
          headerTitle: 'Customers',
        }}
      />
    </Tab.Navigator>
  );
};
