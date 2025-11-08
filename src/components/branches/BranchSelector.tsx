import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui/Typography';
import {useBranchContext} from '@context/BranchContext';
import {useActiveBranches} from '@hooks/queries/useBranches';
import {Branch} from '@types/api.types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BranchSelectorProps {
  onBranchChange?: (branch: Branch | null) => void;
  placeholder?: string;
  disabled?: boolean;
  showAllOption?: boolean;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  onBranchChange,
  placeholder = 'Select Branch',
  disabled = false,
  showAllOption = true,
}) => {
  const {theme} = useTheme();
  const {selectedBranch, setSelectedBranch} = useBranchContext();
  const {data: branches, isLoading} = useActiveBranches();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = React.useMemo(() => {
    if (!branches) return [];
    if (!searchQuery) return branches;

    const query = searchQuery.toLowerCase();
    return branches.filter(
      branch =>
        branch.name.toLowerCase().includes(query) ||
        branch.code.toLowerCase().includes(query) ||
        branch.city.toLowerCase().includes(query),
    );
  }, [branches, searchQuery]);

  const handleSelectBranch = (branch: Branch | null) => {
    setSelectedBranch(branch);
    onBranchChange?.(branch);
    setModalVisible(false);
    setSearchQuery('');
  };

  const displayText = selectedBranch
    ? `${selectedBranch.name} (${selectedBranch.code})`
    : placeholder;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: theme.colors.background.card,
            borderColor: theme.colors.border.medium,
          },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}>
        <View style={styles.selectorContent}>
          <Icon
            name="office-building-marker"
            size={20}
            color={theme.colors.primary[500]}
            style={styles.icon}
          />
          <Typography
            variant="body"
            style={[
              styles.selectorText,
              !selectedBranch && {color: theme.colors.text.tertiary},
            ]}>
            {displayText}
          </Typography>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary[500]} />
          ) : (
            <Icon
              name="chevron-down"
              size={20}
              color={theme.colors.text.secondary}
            />
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background.primary},
            ]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Typography variant="h3">Select Branch</Typography>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: theme.colors.background.secondary,
                  borderColor: theme.colors.border.light,
                },
              ]}>
              <Icon
                name="magnify"
                size={20}
                color={theme.colors.text.tertiary}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  {color: theme.colors.text.primary},
                ]}
                placeholder="Search branches..."
                placeholderTextColor={theme.colors.text.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon
                    name="close-circle"
                    size={20}
                    color={theme.colors.text.tertiary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Branch List */}
            <FlatList
              data={filteredBranches}
              keyExtractor={item => item.id}
              ListHeaderComponent={
                showAllOption ? (
                  <TouchableOpacity
                    style={[
                      styles.branchItem,
                      {borderBottomColor: theme.colors.border.light},
                      !selectedBranch && {
                        backgroundColor: theme.colors.primary[50],
                      },
                    ]}
                    onPress={() => handleSelectBranch(null)}>
                    <Icon
                      name="office-building"
                      size={24}
                      color={theme.colors.text.secondary}
                    />
                    <View style={styles.branchInfo}>
                      <Typography variant="bodyBold">All Branches</Typography>
                      <Typography variant="caption" color="secondary">
                        View all locations
                      </Typography>
                    </View>
                    {!selectedBranch && (
                      <Icon
                        name="check-circle"
                        size={24}
                        color={theme.colors.success}
                      />
                    )}
                  </TouchableOpacity>
                ) : null
              }
              renderItem={({item}) => {
                const isSelected = selectedBranch?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.branchItem,
                      {borderBottomColor: theme.colors.border.light},
                      isSelected && {
                        backgroundColor: theme.colors.primary[50],
                      },
                    ]}
                    onPress={() => handleSelectBranch(item)}>
                    <Icon
                      name="office-building-marker"
                      size={24}
                      color={
                        isSelected
                          ? theme.colors.primary[500]
                          : theme.colors.text.secondary
                      }
                    />
                    <View style={styles.branchInfo}>
                      <Typography variant="bodyBold">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="secondary">
                        {item.code} • {item.city}, {item.state}
                      </Typography>
                    </View>
                    {isSelected && (
                      <Icon
                        name="check-circle"
                        size={24}
                        color={theme.colors.success}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon
                    name="office-building-off"
                    size={48}
                    color={theme.colors.text.tertiary}
                  />
                  <Typography variant="body" color="secondary">
                    {searchQuery
                      ? 'No branches found'
                      : 'No active branches available'}
                  </Typography>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selector: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  selectorText: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  branchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  branchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});
