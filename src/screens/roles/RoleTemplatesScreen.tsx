/**
 * Role Templates Screen
 * Browse and create roles from predefined templates
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
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTheme} from '@hooks/useTheme';
import {usePermission} from '@hooks/useRBAC';
import {Permission, RoleTemplate} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Spacer} from '@components/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import hooks
import {
  useRoleTemplates,
  useCreateRoleFromTemplate,
} from '@hooks/queries/useRoles';

export const RoleTemplatesScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Permissions
  const canCreate = usePermission(Permission.USER_CREATE);

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Queries
  const {data: templates = [], isLoading, refetch} = useRoleTemplates();
  const createFromTemplateMutation = useCreateRoleFromTemplate();

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUseTemplate = (template: RoleTemplate) => {
    Alert.prompt(
      'Create Role from Template',
      `Enter a name for the new role:`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Create',
          onPress: async (name) => {
            if (!name?.trim()) {
              Alert.alert('Error', 'Please enter a valid name');
              return;
            }
            try {
              const newRole = await createFromTemplateMutation.mutateAsync({
                templateId: template.id,
                data: {
                  name,
                  description: template.description,
                },
              });
              Alert.alert('Success', 'Role created successfully', [
                {
                  text: 'View',
                  onPress: () =>
                    navigation.navigate('RoleDetails', {roleId: newRole.id}),
                },
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to create role');
            }
          },
        },
      ],
      'plain-text',
      template.name,
    );
  };

  const handleViewPermissions = (template: RoleTemplate) => {
    Alert.alert(
      template.name,
      `This template includes:\n\n${template.permissions.join('\n')}\n\n${
        template.permissions.length
      } total permissions`,
      [{text: 'OK'}],
    );
  };

  // Filter templates by category
  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter(t => t.category === selectedCategory);

  // Get categories from templates
  const categories = [
    'all',
    ...new Set(templates.map(t => t.category)),
  ];

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: 'All Templates',
      sales: 'Sales',
      inventory: 'Inventory',
      management: 'Management',
      kitchen: 'Kitchen',
      custom: 'Custom',
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      sales: 'cash-register',
      inventory: 'package-variant',
      management: 'briefcase',
      kitchen: 'chef-hat',
      custom: 'account-cog',
    };
    return icons[category] || 'folder';
  };

  // Permission check
  if (!canCreate) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.errorContainer}>
          <Icon
            name="lock-outline"
            size={64}
            color={theme.colors.text.tertiary}
          />
          <Spacer size="md" />
          <Typography variant="h5" color={theme.colors.text.secondary}>
            Access Denied
          </Typography>
          <Spacer size="sm" />
          <Typography variant="body" color={theme.colors.text.tertiary}>
            You don't have permission to create roles
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Typography variant="h5" weight="bold">
        Role Templates
      </Typography>
      <Spacer size="sm" />
      <Typography variant="body" color={theme.colors.text.secondary}>
        Choose a template to quickly create a new role with predefined
        permissions
      </Typography>

      <Spacer size="lg" />

      {/* Category Filters */}
      <View style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && {
                backgroundColor: theme.colors.primary[100],
                borderColor: theme.colors.primary[500],
              },
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Typography
              variant="bodySmall"
              weight="medium"
              color={
                selectedCategory === category
                  ? theme.colors.primary[700]
                  : theme.colors.text.secondary
              }>
              {getCategoryLabel(category)}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTemplateItem = ({item}: {item: RoleTemplate}) => (
    <Card variant="elevated" padding="md">
      <View style={styles.templateHeader}>
        <View
          style={[
            styles.templateIcon,
            {backgroundColor: theme.colors.primary[100]},
          ]}>
          <Icon
            name={item.icon || getCategoryIcon(item.category)}
            size={24}
            color={theme.colors.primary[600]}
          />
        </View>

        <View style={styles.templateContent}>
          <Typography variant="h6" weight="semibold">
            {item.name}
          </Typography>
          <Spacer size="xs" />
          <Typography
            variant="bodySmall"
            color={theme.colors.text.secondary}
            numberOfLines={2}>
            {item.description}
          </Typography>

          <Spacer size="sm" />

          <View style={styles.templateMeta}>
            <View style={styles.templateMetaItem}>
              <Icon
                name="lock-check"
                size={14}
                color={theme.colors.text.secondary}
              />
              <Typography
                variant="caption"
                color={theme.colors.text.secondary}>
                {item.permissions.length} permissions
              </Typography>
            </View>

            <View style={styles.templateMetaItem}>
              <Icon
                name="signal"
                size={14}
                color={theme.colors.text.secondary}
              />
              <Typography
                variant="caption"
                color={theme.colors.text.secondary}>
                Level {item.hierarchy}
              </Typography>
            </View>

            <View
              style={[
                styles.categoryBadge,
                {backgroundColor: theme.colors.info[100]},
              ]}>
              <Typography
                variant="caption"
                weight="medium"
                color={theme.colors.info[700]}>
                {getCategoryLabel(item.category)}
              </Typography>
            </View>
          </View>

          <Spacer size="md" />

          <View style={styles.templateActions}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => handleViewPermissions(item)}
              leftIcon="eye"
              style={styles.viewButton}>
              View Permissions
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={() => handleUseTemplate(item)}
              leftIcon="plus"
              style={styles.useButton}
              loading={createFromTemplateMutation.isPending}>
              Use Template
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="folder-star-outline"
        size={80}
        color={theme.colors.text.tertiary}
      />
      <Spacer size="md" />
      <Typography variant="h5" color={theme.colors.text.secondary}>
        No Templates Found
      </Typography>
      <Spacer size="sm" />
      <Typography
        variant="body"
        color={theme.colors.text.tertiary}
        style={styles.emptyText}>
        Try selecting a different category
      </Typography>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.default},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.default},
      ]}>
      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplateItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          filteredTemplates.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }
        ItemSeparatorComponent={() => <Spacer size="md" />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  templateContent: {
    flex: 1,
  },
  templateMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  templateMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
  },
  useButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: 'center',
  },
});
