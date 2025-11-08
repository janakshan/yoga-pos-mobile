import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootNavigator} from '@navigation/RootNavigator';
import {ThemeProvider} from '@context/ThemeContext';
import AuditService from '@services/AuditService';

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
  // Initialize Audit Service on app startup
  useEffect(() => {
    const initializeAuditService = async () => {
      try {
        await AuditService.initialize();
        console.log('[App] Audit Service initialized successfully');
      } catch (error) {
        console.error('[App] Failed to initialize Audit Service:', error);
      }
    };

    initializeAuditService();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
