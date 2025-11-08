/**
 * Products Navigator
 * Stack navigator for product management screens
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {ProductsStackParamList} from './types';

// Import Product Screens
import {ProductListScreen} from '@screens/products/ProductListScreen';
import {ProductDetailsScreen} from '@screens/products/ProductDetailsScreen';
import {ProductCreateScreen} from '@screens/products/ProductCreateScreen';
import {ProductEditScreen} from '@screens/products/ProductEditScreen';

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export const ProductsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Products',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          title: 'Product Details',
        }}
      />
      <Stack.Screen
        name="ProductCreate"
        component={ProductCreateScreen}
        options={{
          title: 'Create Product',
        }}
      />
      <Stack.Screen
        name="ProductEdit"
        component={ProductEditScreen}
        options={{
          title: 'Edit Product',
        }}
      />
    </Stack.Navigator>
  );
};
