import React from 'react';
import {View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {InventoryStackParamList} from '@navigation/types';
import {useTheme} from '@hooks/useTheme';
import {useStockTransfers} from '@hooks/queries/useInventory';
import {Typography, Card, Button} from '@components/ui';
import {Row, Column, Spacer} from '@components/layout';
import {StockTransfer} from '@types/api.types';

type NavigationProp = NativeStackNavigationProp<InventoryStackParamList>;

export const StockTransferListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {theme} = useTheme();
  const {data: transfers, isLoading} = useStockTransfers();

  const renderTransferItem = ({item}: {item: StockTransfer}) => (
    <Card variant="outlined" padding="md" style={styles.card}
      onPress={() => navigation.navigate('StockTransferDetails', {transferId: item.id})}>
      <Row justifyContent="space-between">
        <Column style={{flex: 1}}>
          <Typography variant="body" color={theme.colors.text.primary}>
            {item.transferNumber}
          </Typography>
          <Spacer size="xs" />
          <Typography variant="bodySmall" color={theme.colors.text.secondary}>
            {item.fromLocation?.name} → {item.toLocation?.name}
          </Typography>
        </Column>
        <View style={[styles.statusBadge, {backgroundColor: theme.colors.primary[500]}]}>
          <Typography variant="caption" color={theme.colors.white}>
            {item.status.toUpperCase()}
          </Typography>
        </View>
      </Row>
    </Card>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      <FlatList
        data={transfers?.data || []}
        renderItem={renderTransferItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body" color={theme.colors.text.secondary}>
              No transfers found
            </Typography>
            <Spacer size="md" />
            <Button variant="primary" onPress={() => navigation.navigate('StockTransferCreate')}>
              Create Transfer
            </Button>
          </View>
        }
      />
      <View style={styles.fabContainer}>
        <Button variant="primary" onPress={() => navigation.navigate('StockTransferCreate')}>
          + New Transfer
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  listContent: {padding: 16},
  card: {marginBottom: 12},
  statusBadge: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60},
  fabContainer: {position: 'absolute', bottom: 16, right: 16, left: 16},
});
