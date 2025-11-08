import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {InventoryStackParamList} from '@navigation/types';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui';
type RouteParams = RouteProp<InventoryStackParamList, 'CycleCountPerform'>;
export const CycleCountPerformScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<RouteParams>();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background.secondary}}>
      <ScrollView style={{padding: 16}}>
        <Typography variant="body">Perform Count: {route.params.cycleCountId}</Typography>
      </ScrollView>
    </SafeAreaView>
  );
};
