/**
 * Stock Levels Screen
 * View and search stock levels across locations
 */

import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TextInput, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {InventoryStackParamList} from '@navigation/types';
import {useTheme} from '@hooks/useTheme';
import {useStockLevels, useInventoryLocations} from '@hooks/queries/useInventory';
import {Typography, Card, Button} from '@components/ui';
import {Row, Column, Spacer} from '@components/layout';
import {StockLevel} from '@types/api.types';

type NavigationProp = NativeStackNavigationProp<InventoryStackParamList>;

export const StockLevelsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {theme} = useTheme();
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>();

  const {data: stockLevels, isLoading} = useStockLevels({
    searchTerm: search,
    locationId: selectedLocation,
  });
  const {data: locations} = useInventoryLocations();

  const renderStockItem = ({item}: {item: StockLevel}) => (
    <Card
      variant="outlined"
      padding="md"
      style={styles.stockCard}
      onPress={() => navigation.navigate('StockLevelDetails', {
        productId: item.productId,
        locationId: item.locationId,
      })}>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column style={{flex: 1}}>
          <Typography variant="body" color={theme.colors.text.primary}>
            {item.product?.name || 'Unknown Product'}
          </Typography>
          <Spacer size="xs" />
          <Typography variant="bodySmall" color={theme.colors.text.secondary}>
            {item.location?.name || 'Unknown Location'}
          </Typography>
          <Spacer size="xs" />
          <Typography variant="caption" color={theme.colors.text.tertiary}>
            SKU: {item.product?.sku}
          </Typography>
        </Column>
        <Column alignItems="flex-end">
          <Typography variant="h5" color={
            item.status === 'out_of_stock' ? theme.colors.error :
            item.status === 'low_stock' ? theme.colors.warning :
            theme.colors.success
          }>
            {item.quantity}
          </Typography>
          <Typography variant="caption" color={theme.colors.text.secondary}>
            Available: {item.availableQuantity}
          </Typography>
          <View style={[styles.statusBadge, {
            backgroundColor: item.status === 'out_of_stock' ? theme.colors.error :
                           item.status === 'low_stock' ? theme.colors.warning :
                           theme.colors.success
          }]}>
            <Typography variant="caption" color={theme.colors.white}>
              {item.status.replace('_', ' ').toUpperCase()}
            </Typography>
          </View>
        </Column>
      </Row>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, {
            backgroundColor: theme.colors.background.primary,
            borderColor: theme.colors.border.light,
            color: theme.colors.text.primary,
          }]}
          placeholder="Search products..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Location Filter */}
      {locations && locations.length > 0 && (
        <View style={styles.filterContainer}>
          <Row gap="sm" style={{paddingHorizontal: 16}}>
            <TouchableOpacity
              style={[styles.filterChip, {
                backgroundColor: !selectedLocation ? theme.colors.primary[500] : theme.colors.background.primary,
                borderColor: theme.colors.border.light,
              }]}
              onPress={() => setSelectedLocation(undefined)}>
              <Typography
                variant="caption"
                color={!selectedLocation ? theme.colors.white : theme.colors.text.primary}>
                All Locations
              </Typography>
            </TouchableOpacity>
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[styles.filterChip, {
                  backgroundColor: selectedLocation === location.id ? theme.colors.primary[500] : theme.colors.background.primary,
                  borderColor: theme.colors.border.light,
                }]}
                onPress={() => setSelectedLocation(location.id)}>
                <Typography
                  variant="caption"
                  color={selectedLocation === location.id ? theme.colors.white : theme.colors.text.primary}>
                  {location.name}
                </Typography>
              </TouchableOpacity>
            ))}
          </Row>
        </View>
      )}

      {/* Stock Levels List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={stockLevels?.data || []}
          renderItem={renderStockItem}
          keyExtractor={(item) => `${item.productId}-${item.locationId}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="body" color={theme.colors.text.secondary}>
                No stock levels found
              </Typography>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  listContent: {
    padding: 16,
  },
  stockCard: {
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
});
