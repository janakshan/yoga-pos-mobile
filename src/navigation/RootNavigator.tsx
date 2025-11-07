import React, {useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '@store/slices/authSlice';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import {RootStackParamList} from './types';
import {Theme} from '@constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root Navigator
 * Handles authentication flow and main app navigation
 */

export const RootNavigator = () => {
  const {isAuthenticated, isLoading, loadUser} = useAuthStore();

  useEffect(() => {
    // Load user on app start
    loadUser();
  }, [loadUser]);

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary[500]} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
  },
});
