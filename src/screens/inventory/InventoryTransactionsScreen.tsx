import React from 'react';
import {SafeAreaView, FlatList, ActivityIndicator, View} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {useInventoryTransactions} from '@hooks/queries/useInventory';
import {Typography, Card} from '@components/ui';
export const InventoryTransactionsScreen = () => {
  const {theme} = useTheme();
  const {data: transactions, isLoading} = useInventoryTransactions();
  if (isLoading) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background.secondary}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background.secondary}}>
      <FlatList
        data={transactions?.data || []}
        renderItem={({item}) => (
          <Card variant="outlined" padding="md" style={{marginHorizontal: 16, marginBottom: 12}}>
            <Typography variant="body">{item.transactionNumber} - {item.type}</Typography>
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Qty: {item.quantity} | {item.product?.name}
            </Typography>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{padding: 16}}
        ListEmptyComponent={<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60}}>
          <Typography variant="body" color={theme.colors.text.secondary}>No transactions found</Typography>
        </View>}
      />
    </SafeAreaView>
  );
};
