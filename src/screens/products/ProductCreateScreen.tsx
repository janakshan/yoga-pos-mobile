/**
 * Product Create Screen
 * Form for creating new products with validation
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ProductsStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {useCreateProduct, useCategories} from '@hooks/queries/useProducts';
import {usePermission} from '@hooks/useRBAC';
import {Permission} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Column, Row} from '@components/layout';

interface FormData {
  name: string;
  sku: string;
  barcode: string;
  description: string;
  category: string;
  price: string;
  costPrice: string;
  stockQuantity: string;
  lowStockThreshold: string;
  unitOfMeasure: string;
  status: 'active' | 'inactive';
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  sku?: string;
  price?: string;
  category?: string;
  stockQuantity?: string;
}

export const ProductCreateScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();

  // Permissions
  const canCreate = usePermission(Permission.PRODUCT_CREATE);

  // Queries
  const {data: categories} = useCategories();
  const createProductMutation = useCreateProduct();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: '',
    barcode: '',
    description: '',
    category: '',
    price: '',
    costPrice: '',
    stockQuantity: '0',
    lowStockThreshold: '10',
    unitOfMeasure: 'unit',
    status: 'active',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Price validation
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    // Stock quantity validation
    const stock = parseInt(formData.stockQuantity, 10);
    if (isNaN(stock) || stock < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim() || undefined,
        description: formData.description.trim() || undefined,
        category: formData.category,
        price: parseFloat(formData.price),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity, 10),
        lowStockThreshold: formData.lowStockThreshold
          ? parseInt(formData.lowStockThreshold, 10)
          : undefined,
        unitOfMeasure: formData.unitOfMeasure || undefined,
        status: formData.status,
        imageUrl: formData.imageUrl.trim() || undefined,
        variants: [],
      };

      const newProduct = await createProductMutation.mutateAsync(productData);
      Alert.alert('Success', 'Product created successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('ProductDetails', {productId: newProduct.id});
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to create product. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Generate SKU suggestion
  const generateSKU = () => {
    const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : 'PRD';
    const timestamp = Date.now().toString().slice(-6);
    updateField('sku', `${prefix}-${timestamp}`);
  };

  if (!canCreate) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="h3" color={theme.colors.text.primary}>
            Access Denied
          </Typography>
          <Typography variant="body" color={theme.colors.text.secondary}>
            You don't have permission to create products.
          </Typography>
        </Column>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              {/* Basic Information */}
              <Column gap="md">
                <Typography variant="h6" weight="semiBold" color={theme.colors.text.primary}>
                  Basic Information
                </Typography>

                <Input
                  label="Product Name *"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChangeText={text => updateField('name', text)}
                  error={errors.name}
                />

                <Row gap="sm" alignItems="flex-end">
                  <View style={{flex: 1}}>
                    <Input
                      label="SKU *"
                      placeholder="Enter SKU"
                      value={formData.sku}
                      onChangeText={text => updateField('sku', text)}
                      error={errors.sku}
                    />
                  </View>
                  <Button variant="outline" size="md" onPress={generateSKU}>
                    Generate
                  </Button>
                </Row>

                <Input
                  label="Barcode"
                  placeholder="Enter barcode"
                  value={formData.barcode}
                  onChangeText={text => updateField('barcode', text)}
                />

                <Input
                  label="Description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChangeText={text => updateField('description', text)}
                  multiline
                  numberOfLines={3}
                />

                <View>
                  <Typography
                    variant="body"
                    weight="medium"
                    color={theme.colors.text.primary}
                    style={{marginBottom: 8}}>
                    Category *
                  </Typography>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}>
                    {categories?.map(category => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryChip,
                          {
                            backgroundColor:
                              formData.category === category.id
                                ? theme.colors.primary[500]
                                : theme.colors.neutral[100],
                            borderColor:
                              formData.category === category.id
                                ? theme.colors.primary[500]
                                : theme.colors.border.light,
                          },
                        ]}
                        onPress={() => updateField('category', category.id)}>
                        <Typography
                          variant="body"
                          color={
                            formData.category === category.id
                              ? theme.colors.white
                              : theme.colors.text.primary
                          }>
                          {category.name}
                        </Typography>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {errors.category && (
                    <Typography
                      variant="caption"
                      color={theme.colors.error}
                      style={{marginTop: 4}}>
                      {errors.category}
                    </Typography>
                  )}
                </View>
              </Column>

              {/* Pricing */}
              <Column gap="md">
                <Typography variant="h6" weight="semiBold" color={theme.colors.text.primary}>
                  Pricing
                </Typography>

                <Input
                  label="Sale Price *"
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={text => updateField('price', text)}
                  keyboardType="decimal-pad"
                  leftIcon={<Typography>$</Typography>}
                  error={errors.price}
                />

                <Input
                  label="Cost Price"
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChangeText={text => updateField('costPrice', text)}
                  keyboardType="decimal-pad"
                  leftIcon={<Typography>$</Typography>}
                />

                {formData.price && formData.costPrice && (
                  <Card variant="filled" padding="sm">
                    <Row justifyContent="space-between">
                      <Typography color={theme.colors.text.secondary}>Margin:</Typography>
                      <Typography weight="semiBold" color={theme.colors.success}>
                        $
                        {(parseFloat(formData.price) - parseFloat(formData.costPrice)).toFixed(2)} (
                        {(
                          ((parseFloat(formData.price) - parseFloat(formData.costPrice)) /
                            parseFloat(formData.price)) *
                          100
                        ).toFixed(1)}
                        %)
                      </Typography>
                    </Row>
                  </Card>
                )}
              </Column>

              {/* Inventory */}
              <Column gap="md">
                <Typography variant="h6" weight="semiBold" color={theme.colors.text.primary}>
                  Inventory
                </Typography>

                <Input
                  label="Stock Quantity *"
                  placeholder="0"
                  value={formData.stockQuantity}
                  onChangeText={text => updateField('stockQuantity', text)}
                  keyboardType="number-pad"
                  error={errors.stockQuantity}
                />

                <Input
                  label="Low Stock Threshold"
                  placeholder="10"
                  value={formData.lowStockThreshold}
                  onChangeText={text => updateField('lowStockThreshold', text)}
                  keyboardType="number-pad"
                />

                <Input
                  label="Unit of Measure"
                  placeholder="e.g., unit, kg, liter"
                  value={formData.unitOfMeasure}
                  onChangeText={text => updateField('unitOfMeasure', text)}
                />
              </Column>

              {/* Product Image */}
              <Column gap="md">
                <Typography variant="h6" weight="semiBold" color={theme.colors.text.primary}>
                  Product Image
                </Typography>

                <Input
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChangeText={text => updateField('imageUrl', text)}
                  autoCapitalize="none"
                />

                <Typography variant="caption" color={theme.colors.text.secondary}>
                  💡 Future: Upload from camera or gallery
                </Typography>
              </Column>

              {/* Status */}
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="xs">
                  <Typography variant="body" weight="semiBold" color={theme.colors.text.primary}>
                    Product Status
                  </Typography>
                  <Typography variant="caption" color={theme.colors.text.secondary}>
                    {formData.status === 'active'
                      ? 'Product is visible and available for sale'
                      : 'Product is hidden from catalog'}
                  </Typography>
                </Column>
                <Switch
                  value={formData.status === 'active'}
                  onValueChange={value => updateField('status', value ? 'active' : 'inactive')}
                  trackColor={{
                    false: theme.colors.neutral[300],
                    true: theme.colors.primary[500],
                  }}
                />
              </Row>
            </Column>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </Button>
          <Button variant="outline" size="lg" fullWidth onPress={handleCancel}>
            Cancel
          </Button>
        </View>
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
  formContainer: {
    padding: 16,
  },
  categoryList: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
});
