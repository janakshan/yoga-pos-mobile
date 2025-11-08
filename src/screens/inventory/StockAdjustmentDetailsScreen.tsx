import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {InventoryStackParamList} from '@navigation/types';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui';
type RouteParams = RouteProp<InventoryStackParamList, 'StockAdjustmentDetails'>;
export const StockAdjustmentDetailsScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<RouteParams>();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background.secondary}}>
      <ScrollView style={{padding: 16}}>
        <Typography variant="body">Adjustment Details: {route.params.adjustmentId}</Typography>
      </ScrollView>
    </SafeAreaView>
  );
};
