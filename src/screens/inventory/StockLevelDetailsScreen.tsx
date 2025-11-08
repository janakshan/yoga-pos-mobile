import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {InventoryStackParamList} from '@navigation/types';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui';

type RouteParams = RouteProp<InventoryStackParamList, 'StockLevelDetails'>;

export const StockLevelDetailsScreen = () => {
  const {theme} = useTheme();
  const route = useRoute<RouteParams>();
  const {productId, locationId} = route.params;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      <ScrollView style={styles.content}>
        <Typography variant="body">Stock Level Details - Product: {productId}, Location: {locationId}</Typography>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {padding: 16},
});
