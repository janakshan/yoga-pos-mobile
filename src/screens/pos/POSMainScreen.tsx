/**
 * POS Main Screen
 * Main point of sale interface with product catalog and shopping cart
 */

import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {POSStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {usePOSStore} from '@store/slices/posSlice';
import {useProducts} from '@hooks/queries/useProducts';
import {useCategories} from '@hooks/queries/useProducts';
import {usePermission} from '@hooks/useRBAC';
import {Permission, Product} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

export const POSMainScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<POSStackParamList>>();

  // Permissions
  const canAccessPOS = usePermission(Permission.POS_ACCESS);
  const canApplyDiscount = usePermission(Permission.POS_APPLY_DISCOUNT);

  // POS Store
  const {
    cartItems,
    selectedCustomer,
    total,
    itemCount,
    subtotal,
    discountTotal,
    taxTotal,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    holdSale,
  } = usePOSStore();

  // Queries
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useProducts({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    status: 'active',
    inStock: true,
  });

  const {data: categories} = useCategories();

  const [refreshing, setRefreshing] = useState(false);

  const products = productsData?.data || [];

  // Handle Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchProducts();
    setRefreshing(false);
  };

  // Handle Product Add
  const handleAddProduct = (product: Product) => {
    addItem(product, 1);
  };

  // Handle Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before checkout');
      return;
    }
    navigation.navigate('POSCheckout');
  };

  // Handle Hold Sale
  const handleHoldSale = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Cannot hold an empty sale');
      return;
    }

    Alert.prompt(
      'Hold Sale',
      'Enter a name for this sale (optional)',
      text => {
        holdSale(text);
        Alert.alert('Success', 'Sale has been held');
      },
      'plain-text',
    );
  };

  // Handle Barcode Scan
  const handleBarcodeScan = () => {
    navigation.navigate('POSBarcodeScan', {
      onScan: (barcode: string) => {
        // This will be handled by the barcode scan screen
        console.log('Scanned:', barcode);
      },
    });
  };

  // Handle View Held Sales
  const handleViewHeldSales = () => {
    navigation.navigate('POSHeldSales');
  };

  // Handle Customer Select
  const handleSelectCustomer = () => {
    navigation.navigate('POSCustomerSelect');
  };

  if (!canAccessPOS) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="h3" color={theme.colors.text.primary}>
            Access Denied
          </Typography>
          <Typography color={theme.colors.text.secondary}>
            You don't have permission to access POS
          </Typography>
        </Column>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      <View style={styles.content}>
        {/* Left Side - Product Catalog */}
        <View style={[styles.catalogSection, isTablet && styles.catalogSectionTablet]}>
          {/* Header */}
          <View
            style={[
              styles.header,
              {backgroundColor: theme.colors.background.primary},
            ]}>
            <Typography variant="h4" weight="semiBold" color={theme.colors.text.primary}>
              Products
            </Typography>
            <Row gap="sm">
              <Button
                variant="outline"
                size="sm"
                onPress={handleBarcodeScan}
                leftIcon={<Typography>📷</Typography>}>
                Scan
              </Button>
              <Button variant="outline" size="sm" onPress={handleViewHeldSales}>
                Held Sales
              </Button>
            </Row>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Typography>🔍</Typography>}
            />
          </View>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  !selectedCategory && {
                    backgroundColor: theme.colors.primary[500],
                  },
                ]}
                onPress={() => setSelectedCategory(null)}>
                <Typography
                  variant="bodySmall"
                  weight="medium"
                  color={
                    !selectedCategory
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary
                  }>
                  All
                </Typography>
              </TouchableOpacity>

              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && {
                      backgroundColor: theme.colors.primary[500],
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.id)}>
                  <Typography
                    variant="bodySmall"
                    weight="medium"
                    color={
                      selectedCategory === category.id
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary
                    }>
                    {category.name}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Products Grid */}
          <FlatList
            data={products}
            numColumns={isTablet ? 3 : 2}
            key={isTablet ? 'tablet' : 'mobile'}
            contentContainerStyle={styles.productsGrid}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => handleAddProduct(item)}>
                <Card variant="outlined" padding="sm">
                  {item.imageUrl && (
                    <Image
                      source={{uri: item.imageUrl}}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  )}
                  <Column gap="xs" style={styles.productInfo}>
                    <Typography
                      variant="bodySmall"
                      weight="semiBold"
                      numberOfLines={2}
                      color={theme.colors.text.primary}>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      weight="bold"
                      color={theme.colors.primary[600]}>
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color={theme.colors.text.secondary}>
                      Stock: {item.stockQuantity}
                    </Typography>
                  </Column>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <Column gap="md" style={styles.emptyState}>
                <Typography variant="h5" color={theme.colors.text.secondary}>
                  {productsLoading ? 'Loading products...' : 'No products found'}
                </Typography>
              </Column>
            }
          />
        </View>

        {/* Right Side - Shopping Cart */}
        <View style={[styles.cartSection, isTablet && styles.cartSectionTablet]}>
          {/* Cart Header */}
          <View
            style={[
              styles.cartHeader,
              {backgroundColor: theme.colors.background.primary},
            ]}>
            <Column gap="xs">
              <Typography variant="h5" weight="semiBold" color={theme.colors.text.primary}>
                Cart ({itemCount} items)
              </Typography>
              {selectedCustomer && (
                <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </Typography>
              )}
            </Column>
            {cartItems.length > 0 && (
              <Button variant="ghost" size="sm" onPress={clearCart}>
                Clear
              </Button>
            )}
          </View>

          {/* Customer Selection */}
          <View style={styles.customerSection}>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onPress={handleSelectCustomer}>
              {selectedCustomer
                ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                : 'Select Customer (Optional)'}
            </Button>
          </View>

          {/* Cart Items */}
          <ScrollView style={styles.cartItems}>
            {cartItems.length === 0 ? (
              <Column gap="md" style={styles.emptyCart}>
                <Typography variant="h6" color={theme.colors.text.secondary}>
                  🛒
                </Typography>
                <Typography variant="body" color={theme.colors.text.secondary}>
                  Cart is empty
                </Typography>
              </Column>
            ) : (
              cartItems.map((item, index) => (
                <View
                  key={item.id || index}
                  style={[
                    styles.cartItem,
                    {borderBottomColor: theme.colors.border.light},
                  ]}>
                  <Column gap="xs" style={{flex: 1}}>
                    <Typography
                      variant="body"
                      weight="medium"
                      color={theme.colors.text.primary}>
                      {item.productName}
                    </Typography>
                    <Typography variant="caption" color={theme.colors.text.secondary}>
                      ${item.unitPrice.toFixed(2)} each
                    </Typography>
                  </Column>

                  <Row gap="sm" alignItems="center">
                    {/* Quantity Controls */}
                    <Row gap="xs" alignItems="center">
                      <TouchableOpacity
                        style={[
                          styles.qtyButton,
                          {backgroundColor: theme.colors.background.tertiary},
                        ]}
                        onPress={() =>
                          updateItemQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.variantId,
                          )
                        }>
                        <Typography weight="bold">-</Typography>
                      </TouchableOpacity>
                      <Typography variant="body" weight="bold" style={styles.qtyText}>
                        {item.quantity}
                      </Typography>
                      <TouchableOpacity
                        style={[
                          styles.qtyButton,
                          {backgroundColor: theme.colors.background.tertiary},
                        ]}
                        onPress={() =>
                          updateItemQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.variantId,
                          )
                        }>
                        <Typography weight="bold">+</Typography>
                      </TouchableOpacity>
                    </Row>

                    {/* Item Total */}
                    <Typography
                      variant="body"
                      weight="bold"
                      color={theme.colors.text.primary}
                      style={styles.itemTotal}>
                      ${item.total.toFixed(2)}
                    </Typography>

                    {/* Remove Button */}
                    <TouchableOpacity
                      onPress={() => removeItem(item.productId, item.variantId)}>
                      <Typography color={theme.colors.error[500]}>🗑️</Typography>
                    </TouchableOpacity>
                  </Row>
                </View>
              ))
            )}
          </ScrollView>

          {/* Cart Summary */}
          <View
            style={[
              styles.cartSummary,
              {backgroundColor: theme.colors.background.primary},
            ]}>
            <Row justifyContent="space-between">
              <Typography variant="body" color={theme.colors.text.secondary}>
                Subtotal:
              </Typography>
              <Typography variant="body" color={theme.colors.text.primary}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Row>

            {discountTotal > 0 && (
              <Row justifyContent="space-between">
                <Typography variant="body" color={theme.colors.success[600]}>
                  Discount:
                </Typography>
                <Typography variant="body" color={theme.colors.success[600]}>
                  -${discountTotal.toFixed(2)}
                </Typography>
              </Row>
            )}

            <Row justifyContent="space-between">
              <Typography variant="body" color={theme.colors.text.secondary}>
                Tax:
              </Typography>
              <Typography variant="body" color={theme.colors.text.primary}>
                ${taxTotal.toFixed(2)}
              </Typography>
            </Row>

            <View style={[styles.divider, {backgroundColor: theme.colors.border.medium}]} />

            <Row justifyContent="space-between">
              <Typography variant="h5" weight="bold" color={theme.colors.text.primary}>
                Total:
              </Typography>
              <Typography
                variant="h4"
                weight="bold"
                color={theme.colors.primary[600]}>
                ${total.toFixed(2)}
              </Typography>
            </Row>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onPress={handleHoldSale}
              disabled={cartItems.length === 0}>
              Hold Sale
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleCheckout}
              disabled={cartItems.length === 0}>
              Checkout
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: isTablet ? 'row' : 'column',
  },
  catalogSection: {
    flex: 1,
  },
  catalogSectionTablet: {
    flex: 2,
  },
  cartSection: {
    flex: 1,
    minHeight: 400,
  },
  cartSectionTablet: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    padding: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    maxHeight: 50,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  productsGrid: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    maxWidth: isTablet ? '31%' : '46%',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  customerSection: {
    padding: 16,
  },
  cartItems: {
    flex: 1,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    minWidth: 32,
    textAlign: 'center',
  },
  itemTotal: {
    minWidth: 70,
    textAlign: 'right',
  },
  cartSummary: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
});
