import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './types';
import {DashboardScreen} from '@screens/dashboard/DashboardScreen';
import {POSNavigator} from './POSNavigator';
import {ProductsNavigator} from './ProductsNavigator';
import {InventoryNavigator} from './InventoryNavigator';
import {CustomersNavigator} from './CustomersNavigator';
import {BranchesNavigator} from './BranchesNavigator';
import {ProcurementNavigator} from './ProcurementNavigator';
import {FinancialNavigator} from './FinancialNavigator';
import {ReportsNavigator} from './ReportsNavigator';
import {Theme} from '@constants/theme';
import {Text} from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screens for tabs
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
        component={InventoryNavigator}
        options={{
          tabBarLabel: 'Inventory',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          tabBarLabel: 'Products',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomersNavigator}
        options={{
          tabBarLabel: 'Customers',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Branches"
        component={BranchesNavigator}
        options={{
          tabBarLabel: 'Branches',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Procurement"
        component={ProcurementNavigator}
        options={{
          tabBarLabel: 'Procurement',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Financial"
        component={FinancialNavigator}
        options={{
          tabBarLabel: 'Financial',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsNavigator}
        options={{
          tabBarLabel: 'Reports',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};
