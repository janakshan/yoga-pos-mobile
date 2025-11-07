import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList} from './types';
import {LoginScreen} from '@screens/auth/LoginScreen';
import {PinLoginScreen} from '@screens/auth/PinLoginScreen';
import {PinSetupScreen} from '@screens/auth/PinSetupScreen';
import {UnauthorizedScreen} from '@screens/auth/UnauthorizedScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Auth Navigator
 * Handles authentication-related screens
 */

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="PinLogin"
        component={PinLoginScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="PinSetup"
        component={PinSetupScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Unauthorized"
        component={UnauthorizedScreen}
        options={{
          animation: 'fade',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
