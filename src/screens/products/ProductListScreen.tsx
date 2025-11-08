/**
 * Product List Screen
 * Main product catalog management screen with search, filters, and CRUD operations
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ProductsStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {useProducts, useCategories, useDeleteProduct} from '@hooks/queries/useProducts';
import {usePermission} from '@hooks/useRBAC';
import {Permission, Product} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

type ViewMode = 'grid' | 'list';

export const ProductListScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  // Permissions
  const canView = usePermission(Permission.PRODUCT_VIEW);
  const canCreate = usePermission(Permission.PRODUCT_CREATE);
  const canUpdate = usePermission(Permission.PRODUCT_UPDATE);
  const canDelete = usePermission(Permission.PRODUCT_DELETE);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useProducts({
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    status: selectedStatus || undefined,
  });

  const {data: categories} = useCategories();
  const deleteProductMutation = useDeleteProduct();

  const products = productsData?.data || [];

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreate = () => {
    navigation.navigate('ProductCreate');
  };

  const handleViewDetails = (productId: string) => {
    navigation.navigate('ProductDetails', {productId});
  };

  const handleEdit = (productId: string) => {
    navigation.navigate('ProductEdit', {productId});
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProductMutation.mutateAsync(product.id);
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product. Please try again.');
            }
          },
        },
      ],
    );
  };

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'));
  };

  // Check permissions
  if (!canView) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="h3" color={theme.colors.text.primary}>
            Access Denied
          </Typography>
          <Typography variant="body" color={theme.colors.text.secondary}>
            You don't have permission to view products.
          </Typography>
        </Column>
      </SafeAreaView>
    );
  }

  // Render product card for grid view
  const renderGridCard = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={[
        styles.gridCard,
        {
          backgroundColor: theme.colors.white,
          borderColor: theme.colors.border.light,
        },
      ]}
      onPress={() => handleViewDetails(item.id)}>
      {item.imageUrl ? (
        <Image source={{uri: item.imageUrl}} style={styles.gridImage} />
      ) : (
        <View style={[styles.gridImagePlaceholder, {backgroundColor: theme.colors.neutral[100]}]}>
          <Typography variant="h4" color={theme.colors.neutral[400]}>
            📦
          </Typography>
        </View>
      )}
      <View style={styles.gridCardContent}>
        <Typography
          variant="body"
          weight="semiBold"
          color={theme.colors.text.primary}
          numberOfLines={2}>
          {item.name}
        </Typography>
        <Typography variant="caption" color={theme.colors.text.secondary} numberOfLines={1}>
          SKU: {item.sku}
        </Typography>
        <Typography variant="h6" weight="bold" color={theme.colors.primary[600]}>
          ${item.price.toFixed(2)}
        </Typography>
        <Row gap="xs" alignItems="center">
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.status === 'active' ? theme.colors.success : theme.colors.neutral[400],
              },
            ]}
          />
          <Typography
            variant="caption"
            color={item.stockQuantity > 0 ? theme.colors.success : theme.colors.error}>
            Stock: {item.stockQuantity}
          </Typography>
        </Row>
        {(canUpdate || canDelete) && (
          <Row gap="xs" style={styles.gridCardActions}>
            {canUpdate && (
              <Button
                variant="outline"
                size="sm"
                onPress={() => handleEdit(item.id)}
                fullWidth>
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant="danger"
                size="sm"
                onPress={() => handleDelete(item)}
                fullWidth>
                Delete
              </Button>
            )}
          </Row>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render product card for list view
  const renderListCard = ({item}: {item: Product}) => (
    <TouchableOpacity onPress={() => handleViewDetails(item.id)}>
      <Card variant="outlined" padding="md" style={styles.listCard}>
        <Row gap="md" alignItems="center">
          {item.imageUrl ? (
            <Image source={{uri: item.imageUrl}} style={styles.listImage} />
          ) : (
            <View
              style={[styles.listImagePlaceholder, {backgroundColor: theme.colors.neutral[100]}]}>
              <Typography variant="h6" color={theme.colors.neutral[400]}>
                📦
              </Typography>
            </View>
          )}
          <Column gap="xs" style={{flex: 1}}>
            <Typography variant="body" weight="semiBold" color={theme.colors.text.primary}>
              {item.name}
            </Typography>
            <Typography variant="caption" color={theme.colors.text.secondary}>
              SKU: {item.sku} | Category: {item.category}
            </Typography>
            <Row gap="md" alignItems="center">
              <Typography variant="h6" weight="bold" color={theme.colors.primary[600]}>
                ${item.price.toFixed(2)}
              </Typography>
              <Typography
                variant="caption"
                color={item.stockQuantity > 0 ? theme.colors.success : theme.colors.error}>
                Stock: {item.stockQuantity}
              </Typography>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === 'active'
                        ? theme.colors.success + '20'
                        : theme.colors.neutral[200],
                  },
                ]}>
                <Typography
                  variant="caption"
                  color={item.status === 'active' ? theme.colors.success : theme.colors.neutral[600]}>
                  {item.status}
                </Typography>
              </View>
            </Row>
          </Column>
          {(canUpdate || canDelete) && (
            <Column gap="xs">
              {canUpdate && (
                <Button variant="outline" size="sm" onPress={() => handleEdit(item.id)}>
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button variant="danger" size="sm" onPress={() => handleDelete(item)}>
                  Delete
                </Button>
              )}
            </Column>
          )}
        </Row>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h4" weight="semiBold">
          Products
        </Typography>
        <Row gap="sm">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onPress={toggleViewMode}>
            {viewMode === 'grid' ? '📱' : '📋'}
          </Button>
          {canCreate && (
            <Button variant="primary" size="sm" onPress={handleCreate}>
              Add Product
            </Button>
          )}
        </Row>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Typography>🔍</Typography>}
          style={styles.searchInput}
        />

        {/* Category Filter */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{id: '', name: 'All'}, ...(categories || [])]}
          contentContainerStyle={styles.categoryList}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === item.id
                      ? theme.colors.primary[500]
                      : theme.colors.neutral[100],
                  borderColor: theme.colors.border.light,
                },
              ]}
              onPress={() => setSelectedCategory(item.id)}>
              <Typography
                variant="caption"
                color={
                  selectedCategory === item.id ? theme.colors.white : theme.colors.text.primary
                }>
                {item.name}
              </Typography>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />

        {/* Status Filter */}
        <Row gap="sm" style={styles.statusFilters}>
          {['all', 'active', 'inactive'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusChip,
                {
                  backgroundColor:
                    selectedStatus === status
                      ? theme.colors.primary[500]
                      : theme.colors.neutral[100],
                  borderColor: theme.colors.border.light,
                },
              ]}
              onPress={() => setSelectedStatus(status)}>
              <Typography
                variant="caption"
                color={selectedStatus === status ? theme.colors.white : theme.colors.text.primary}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Typography>
            </TouchableOpacity>
          ))}
        </Row>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={viewMode === 'grid' ? renderGridCard : renderListCard}
        keyExtractor={item => item.id}
        numColumns={viewMode === 'grid' ? (isTablet ? 3 : 2) : 1}
        key={viewMode === 'grid' ? `grid-${isTablet ? 3 : 2}` : 'list'}
        contentContainerStyle={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <Column gap="md" style={styles.emptyState}>
            <Typography variant="h6" color={theme.colors.text.secondary}>
              {isLoading ? 'Loading products...' : 'No products found'}
            </Typography>
            {!isLoading && canCreate && (
              <Button variant="primary" onPress={handleCreate}>
                Create Your First Product
              </Button>
            )}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersContainer: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    marginBottom: 0,
  },
  categoryList: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusFilters: {
    paddingVertical: 4,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
  },
  gridContainer: {
    padding: 16,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  gridCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gridImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  gridImagePlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCardContent: {
    padding: 12,
    gap: 6,
  },
  gridCardActions: {
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  listCard: {
    marginBottom: 12,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  listImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
});
