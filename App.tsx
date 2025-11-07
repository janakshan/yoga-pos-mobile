import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootNavigator} from '@navigation/RootNavigator';
import {Theme} from '@constants/theme';

/**
 * Main App Component
 * Entry point for the Yoga POS application
 */

// Create a Query Client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
  },
});

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Theme.colors.white}
        />
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
