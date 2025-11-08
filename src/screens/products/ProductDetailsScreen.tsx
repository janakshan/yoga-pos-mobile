/**
 * Product Details Screen
 * Displays comprehensive product information
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProductsStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {useProduct, useDeleteProduct} from '@hooks/queries/useProducts';
import {usePermission} from '@hooks/useRBAC';
import {Permission} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Column, Row} from '@components/layout';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<ProductsStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC<Props> = ({navigation, route}) => {
  const {theme} = useTheme();
  const {productId} = route.params;

  // Permissions
  const canUpdate = usePermission(Permission.PRODUCT_UPDATE);
  const canDelete = usePermission(Permission.PRODUCT_DELETE);

  // Queries
  const {data: product, isLoading} = useProduct(productId);
  const deleteProductMutation = useDeleteProduct();

  // Handlers
  const handleEdit = () => {
    navigation.navigate('ProductEdit', {productId});
  };

  const handleDelete = () => {
    if (!product) return;

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
              await deleteProductMutation.mutateAsync(productId);
              Alert.alert('Success', 'Product deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product. Please try again.');
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="body" color={theme.colors.text.secondary}>
            Loading product details...
          </Typography>
        </Column>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="h6" color={theme.colors.error}>
            Product not found
          </Typography>
          <Button variant="primary" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </Column>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        {product.imageUrl ? (
          <Image source={{uri: product.imageUrl}} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.imagePlaceholder, {backgroundColor: theme.colors.neutral[100]}]}>
            <Typography variant="display" color={theme.colors.neutral[400]}>
              📦
            </Typography>
          </View>
        )}

        {/* Main Details Card */}
        <View style={styles.detailsContainer}>
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              {/* Product Name and Status */}
              <Column gap="xs">
                <Row justifyContent="space-between" alignItems="flex-start">
                  <Typography
                    variant="h3"
                    weight="bold"
                    color={theme.colors.text.primary}
                    style={{flex: 1}}>
                    {product.name}
                  </Typography>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          product.status === 'active'
                            ? theme.colors.success + '20'
                            : theme.colors.neutral[200],
                      },
                    ]}>
                    <Typography
                      variant="body"
                      weight="semiBold"
                      color={
                        product.status === 'active'
                          ? theme.colors.success
                          : theme.colors.neutral[600]
                      }>
                      {product.status === 'active' ? '✓ Active' : '○ Inactive'}
                    </Typography>
                  </View>
                </Row>
                {product.description && (
                  <Typography variant="body" color={theme.colors.text.secondary}>
                    {product.description}
                  </Typography>
                )}
              </Column>

              {/* Price Information */}
              <Card variant="filled" padding="md">
                <Column gap="md">
                  <Row justifyContent="space-between">
                    <Typography color={theme.colors.text.secondary}>Sale Price:</Typography>
                    <Typography variant="h4" weight="bold" color={theme.colors.primary[600]}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Row>
                  {product.costPrice && (
                    <Row justifyContent="space-between">
                      <Typography color={theme.colors.text.secondary}>Cost Price:</Typography>
                      <Typography weight="semiBold">${product.costPrice.toFixed(2)}</Typography>
                    </Row>
                  )}
                  {product.costPrice && (
                    <Row justifyContent="space-between">
                      <Typography color={theme.colors.text.secondary}>Margin:</Typography>
                      <Typography
                        weight="semiBold"
                        color={theme.colors.success}>
                        ${(product.price - product.costPrice).toFixed(2)} (
                        {(((product.price - product.costPrice) / product.price) * 100).toFixed(1)}%)
                      </Typography>
                    </Row>
                  )}
                </Column>
              </Card>

              {/* Product Information */}
              <Column gap="md">
                <Typography variant="h6" weight="semiBold" color={theme.colors.text.primary}>
                  Product Information
                </Typography>

                <Row justifyContent="space-between">
                  <Typography color={theme.colors.text.secondary}>SKU:</Typography>
                  <Typography weight="semiBold">{product.sku}</Typography>
                </Row>

                {product.barcode && (
                  <Row justifyContent="space-between">
                    <Typography color={theme.colors.text.secondary}>Barcode:</Typography>
                    <Typography weight="semiBold">{product.barcode}</Typography>
                  </Row>
                )}

                <Row justifyContent="space-between">
                  <Typography color={theme.colors.text.secondary}>Category:</Typography>
                  <Typography weight="semiBold">{product.category}</Typography>
                </Row>

                {product.unitOfMeasure && (
                  <Row justifyContent="space-between">
                    <Typography color={theme.colors.text.secondary}>Unit of Measure:</Typography>
                    <Typography weight="semiBold">{product.unitOfMeasure}</Typography>
                  </Row>
                )}
              </Column>

              {/* Stock Information */}
              <Column gap="md">
                <Typography variant="h6" weight="semiBold" color={theme.colors.text.primary}>
                  Stock Information
                </Typography>

                <Row justifyContent="space-between">
                  <Typography color={theme.colors.text.secondary}>Current Stock:</Typography>
                  <Typography
                    weight="bold"
                    color={
                      product.stockQuantity > (product.lowStockThreshold || 10)
                        ? theme.colors.success
                        : product.stockQuantity > 0
                        ? theme.colors.warning
                        : theme.colors.error
                    }>
                    {product.stockQuantity} units
                  </Typography>
                </Row>

                {product.lowStockThreshold && (
                  <Row justifyContent="space-between">
                    <Typography color={theme.colors.text.secondary}>Low Stock Alert:</Typography>
                    <Typography weight="semiBold">{product.lowStockThreshold} units</Typography>
                  </Row>
                )}

                {product.stockQuantity <= (product.lowStockThreshold || 10) && (
                  <View
                    style={[
                      styles.alertBanner,
                      {
                        backgroundColor:
                          product.stockQuantity === 0
                            ? theme.colors.error + '20'
                            : theme.colors.warning + '20',
                      },
                    ]}>
                    <Typography
                      variant="body"
                      weight="semiBold"
                      color={product.stockQuantity === 0 ? theme.colors.error : theme.colors.warning}>
                      ⚠️ {product.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock Alert'}
                    </Typography>
                  </View>
                )}
              </Column>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <Column gap="md">
                  <Typography variant="h6" weight="semiBold" color={theme.colors.text.primary}>
                    Variants
                  </Typography>
                  {product.variants.map((variant, index) => (
                    <Card key={index} variant="outlined" padding="sm">
                      <Row justifyContent="space-between" alignItems="center">
                        <Column gap="xs">
                          <Typography weight="semiBold">{variant.name}</Typography>
                          <Typography variant="caption" color={theme.colors.text.secondary}>
                            SKU: {variant.sku}
                          </Typography>
                        </Column>
                        <Column gap="xs" alignItems="flex-end">
                          <Typography weight="semiBold" color={theme.colors.primary[600]}>
                            ${variant.price.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color={theme.colors.text.secondary}>
                            Stock: {variant.stockQuantity}
                          </Typography>
                        </Column>
                      </Row>
                    </Card>
                  ))}
                </Column>
              )}

              {/* Metadata */}
              <View style={styles.metadata}>
                <Typography variant="caption" color={theme.colors.text.tertiary}>
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" color={theme.colors.text.tertiary}>
                  Last Updated: {new Date(product.updatedAt).toLocaleDateString()}
                </Typography>
              </View>
            </Column>
          </Card>
        </View>

        {/* Action Buttons */}
        {(canUpdate || canDelete) && (
          <View style={styles.actionButtons}>
            {canUpdate && (
              <Button variant="primary" size="lg" fullWidth onPress={handleEdit}>
                Edit Product
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" size="lg" fullWidth onPress={handleDelete}>
                Delete Product
              </Button>
            )}
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  alertBanner: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  metadata: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 4,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
});
