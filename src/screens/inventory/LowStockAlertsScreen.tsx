import React from 'react';
import {SafeAreaView, FlatList, ActivityIndicator, View} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {useLowStockAlerts} from '@hooks/queries/useInventory';
import {Typography, Card} from '@components/ui';
import {Row, Column} from '@components/layout';
export const LowStockAlertsScreen = () => {
  const {theme} = useTheme();
  const {data: alerts, isLoading} = useLowStockAlerts();
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
        data={alerts?.data || []}
        renderItem={({item}) => (
          <Card variant="outlined" padding="md" style={{marginHorizontal: 16, marginBottom: 12}}>
            <Row justifyContent="space-between">
              <Column style={{flex: 1}}>
                <Typography variant="body">{item.product?.name}</Typography>
                <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                  Current: {item.currentQuantity} | Threshold: {item.threshold}
                </Typography>
              </Column>
              <View style={{paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: theme.colors.warning}}>
                <Typography variant="caption" color={theme.colors.white}>{item.severity.toUpperCase()}</Typography>
              </View>
            </Row>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{padding: 16}}
        ListEmptyComponent={<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60}}>
          <Typography variant="body" color={theme.colors.text.secondary}>No low stock alerts</Typography>
        </View>}
      />
    </SafeAreaView>
  );
};
