/**
 * POS Customer Select Screen
 * Search and select customer for transaction
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {POSStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {usePOSStore} from '@store/slices/posSlice';
import {useSearchCustomers} from '@hooks/queries/useCustomers';
import {Customer} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

export const POSCustomerSelectScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<POSStackParamList>>();

  const [searchQuery, setSearchQuery] = useState('');
  const {selectCustomer, selectedCustomer} = usePOSStore();

  // Search customers
  const {data: customers, isLoading} = useSearchCustomers(
    searchQuery,
    searchQuery.length >= 2,
  );

  // Handle customer select
  const handleSelectCustomer = (customer: Customer) => {
    selectCustomer(customer);
    navigation.goBack();
  };

  // Handle clear customer
  const handleClearCustomer = () => {
    selectCustomer(null);
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <Row justifyContent="space-between" alignItems="center" style={{flex: 1}}>
          <Button variant="ghost" onPress={() => navigation.goBack()}>
            ← Back
          </Button>
          <Typography variant="h5" weight="semiBold" color={theme.colors.text.primary}>
            Select Customer
          </Typography>
          {selectedCustomer && (
            <Button variant="ghost" onPress={handleClearCustomer}>
              Clear
            </Button>
          )}
          {!selectedCustomer && <View style={{width: 60}} />}
        </Row>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Typography>🔍</Typography>}
        />
      </View>

      {/* Current Selection */}
      {selectedCustomer && (
        <View style={styles.currentSelection}>
          <Card variant="elevated" padding="md">
            <Row justifyContent="space-between" alignItems="center">
              <Column gap="xs">
                <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                  Current Customer:
                </Typography>
                <Typography variant="body" weight="semiBold" color={theme.colors.text.primary}>
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </Typography>
                <Typography variant="caption" color={theme.colors.text.secondary}>
                  {selectedCustomer.email}
                </Typography>
              </Column>
              <Typography variant="h4">✓</Typography>
            </Row>
          </Card>
        </View>
      )}

      {/* Customer List */}
      <FlatList
        data={customers || []}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleSelectCustomer(item)}>
            <Card
              variant="outlined"
              padding="md"
              style={[
                styles.customerCard,
                selectedCustomer?.id === item.id && {
                  borderColor: theme.colors.primary[500],
                  backgroundColor: theme.colors.primary[50],
                },
              ]}>
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="xs" style={{flex: 1}}>
                  <Typography variant="body" weight="semiBold" color={theme.colors.text.primary}>
                    {item.firstName} {item.lastName}
                  </Typography>
                  <Typography variant="caption" color={theme.colors.text.secondary}>
                    {item.email}
                  </Typography>
                  <Typography variant="caption" color={theme.colors.text.secondary}>
                    {item.phone}
                  </Typography>
                  {item.loyaltyInfo && (
                    <Typography variant="caption" color={theme.colors.primary[600]}>
                      Points: {item.loyaltyInfo.points}
                    </Typography>
                  )}
                </Column>
                {selectedCustomer?.id === item.id && (
                  <Typography color={theme.colors.primary[600]}>✓</Typography>
                )}
              </Row>
            </Card>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Column gap="md" style={styles.emptyState}>
            <Typography variant="h6" color={theme.colors.text.secondary}>
              {isLoading
                ? 'Searching...'
                : searchQuery.length < 2
                  ? 'Enter at least 2 characters to search'
                  : 'No customers found'}
            </Typography>
          </Column>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    padding: 16,
  },
  currentSelection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  list: {
    padding: 16,
  },
  customerCard: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
});
