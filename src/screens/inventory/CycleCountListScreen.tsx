import React from 'react';
import {SafeAreaView, FlatList, ActivityIndicator, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {InventoryStackParamList} from '@navigation/types';
import {useTheme} from '@hooks/useTheme';
import {useCycleCounts} from '@hooks/queries/useInventory';
import {Typography, Card, Button} from '@components/ui';
type NavigationProp = NativeStackNavigationProp<InventoryStackParamList>;
export const CycleCountListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {theme} = useTheme();
  const {data: counts, isLoading} = useCycleCounts();
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
        data={counts?.data || []}
        renderItem={({item}) => (
          <Card variant="outlined" padding="md" style={{marginHorizontal: 16, marginBottom: 12}}
            onPress={() => navigation.navigate('CycleCountDetails', {cycleCountId: item.id})}>
            <Typography variant="body">{item.countNumber}</Typography>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{padding: 16}}
        ListEmptyComponent={<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60}}>
          <Typography variant="body" color={theme.colors.text.secondary}>No cycle counts found</Typography>
        </View>}
      />
      <View style={{padding: 16}}>
        <Button variant="primary" onPress={() => navigation.navigate('CycleCountCreate')}>
          + New Cycle Count
        </Button>
      </View>
    </SafeAreaView>
  );
};
