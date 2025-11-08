/**
 * POS Held Sales Screen
 * Manage and retrieve held sales
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {POSStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {usePOSStore} from '@store/slices/posSlice';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

export const POSHeldSalesScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<POSStackParamList>>();

  const {heldSales, retrieveSale, deleteHeldSale} = usePOSStore();

  // Handle retrieve sale
  const handleRetrieveSale = (saleId: string) => {
    Alert.alert(
      'Retrieve Sale',
      'Do you want to retrieve this sale?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Retrieve',
          onPress: () => {
            retrieveSale(saleId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  // Handle delete sale
  const handleDeleteSale = (saleId: string) => {
    Alert.alert(
      'Delete Held Sale',
      'Are you sure you want to delete this held sale?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteHeldSale(saleId),
        },
      ],
    );
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
        <Button variant="ghost" onPress={() => navigation.goBack()}>
          ← Back
        </Button>
        <Typography variant="h5" weight="semiBold" color={theme.colors.text.primary}>
          Held Sales
        </Typography>
        <View style={{width: 60}} />
      </View>

      {/* Held Sales List */}
      <FlatList
        data={heldSales}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <Card variant="elevated" padding="md" style={styles.saleCard}>
            <Column gap="md">
              <Row justifyContent="space-between" alignItems="flex-start">
                <Column gap="xs" style={{flex: 1}}>
                  <Typography variant="h6" weight="semiBold" color={theme.colors.text.primary}>
                    {item.name || 'Unnamed Sale'}
                  </Typography>
                  <Typography variant="caption" color={theme.colors.text.secondary}>
                    Held: {new Date(item.heldAt).toLocaleString()}
                  </Typography>
                </Column>
                <Typography variant="h6" weight="bold" color={theme.colors.primary[600]}>
                  ${item.transaction.total?.toFixed(2)}
                </Typography>
              </Row>

              <Column gap="xs">
                <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                  Items: {item.transaction.items?.length || 0}
                </Typography>
                {item.transaction.customer && (
                  <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                    Customer: {item.transaction.customer.firstName}{' '}
                    {item.transaction.customer.lastName}
                  </Typography>
                )}
              </Column>

              <Row gap="sm">
                <Button
                  variant="primary"
                  size="md"
                  style={{flex: 1}}
                  onPress={() => handleRetrieveSale(item.id)}>
                  Retrieve
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  style={{flex: 1}}
                  onPress={() => handleDeleteSale(item.id)}>
                  Delete
                </Button>
              </Row>
            </Column>
          </Card>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Column gap="md" style={styles.emptyState}>
            <Typography variant="h6" color={theme.colors.text.secondary}>
              No held sales
            </Typography>
            <Typography variant="body" align="center" color={theme.colors.text.secondary}>
              Held sales will appear here
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  list: {
    padding: 16,
  },
  saleCard: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
});
