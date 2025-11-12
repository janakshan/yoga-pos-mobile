import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Card, Typography} from '@components/ui';
import {Row, Spacer} from '@components/layout';
import {useTheme} from '@hooks/useTheme';
import {Branch} from '@types/api.types';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchId: string | null;
  onSelectBranch: (branchId: string | null) => void;
  showAllOption?: boolean;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  showAllOption = true,
}) => {
  const {theme} = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedBranch = branches.find(b => b.id === selectedBranchId);
  const displayName = selectedBranch
    ? selectedBranch.name
    : showAllOption
    ? 'All Branches'
    : 'Select Branch';

  const handleSelectBranch = (branchId: string | null) => {
    onSelectBranch(branchId);
    setIsModalVisible(false);
  };

  const renderBranchItem = (branch: Branch) => {
    const isSelected = branch.id === selectedBranchId;

    return (
      <TouchableOpacity
        key={branch.id}
        onPress={() => handleSelectBranch(branch.id)}
        style={styles.branchItem}>
        <Card
          variant={isSelected ? 'filled' : 'outlined'}
          padding="md"
          style={[
            styles.branchCard,
            isSelected && {
              backgroundColor: `${theme.colors.primary[500]}20`,
              borderColor: theme.colors.primary[500],
            },
          ]}>
          <Row justifyContent="space-between" alignItems="center">
            <View style={styles.branchInfo}>
              <Typography
                variant="body"
                color={
                  isSelected
                    ? theme.colors.primary[500]
                    : theme.colors.text.primary
                }
                style={isSelected && styles.selectedText}>
                {branch.name}
              </Typography>
              <Spacer size="xs" />
              <Typography variant="caption" color={theme.colors.text.secondary}>
                {branch.city}, {branch.state}
              </Typography>
              {branch.monthlyRevenue !== undefined && (
                <>
                  <Spacer size="xs" />
                  <Typography
                    variant="caption"
                    color={theme.colors.text.secondary}>
                    Revenue: ${branch.monthlyRevenue.toLocaleString()}
                  </Typography>
                </>
              )}
            </View>
            {isSelected && (
              <Typography variant="h5" color={theme.colors.primary[500]}>
                ✓
              </Typography>
            )}
          </Row>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Branch Selector Button */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={styles.selectorButton}>
        <Card
          variant="outlined"
          padding="sm"
          style={[
            styles.selectorCard,
            {borderColor: theme.colors.primary[500]},
          ]}>
          <Row justifyContent="space-between" alignItems="center">
            <View>
              <Typography variant="caption" color={theme.colors.text.secondary}>
                Branch
              </Typography>
              <Typography variant="body" color={theme.colors.text.primary}>
                {displayName}
              </Typography>
            </View>
            <Typography variant="h6" color={theme.colors.primary[500]}>
              ▼
            </Typography>
          </Row>
        </Card>
      </TouchableOpacity>

      {/* Branch Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}>
          <Pressable
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background.primary},
            ]}
            onPress={e => e.stopPropagation()}>
            <View
              style={[
                styles.modalHeader,
                {borderBottomColor: theme.colors.border.light},
              ]}>
              <Typography variant="h5" color={theme.colors.text.primary}>
                Select Branch
              </Typography>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Typography variant="h5" color={theme.colors.text.secondary}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {showAllOption && (
                <TouchableOpacity
                  onPress={() => handleSelectBranch(null)}
                  style={styles.branchItem}>
                  <Card
                    variant={
                      selectedBranchId === null ? 'filled' : 'outlined'
                    }
                    padding="md"
                    style={[
                      styles.branchCard,
                      selectedBranchId === null && {
                        backgroundColor: `${theme.colors.primary[500]}20`,
                        borderColor: theme.colors.primary[500],
                      },
                    ]}>
                    <Row justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="body"
                        color={
                          selectedBranchId === null
                            ? theme.colors.primary[500]
                            : theme.colors.text.primary
                        }
                        style={
                          selectedBranchId === null && styles.selectedText
                        }>
                        All Branches
                      </Typography>
                      {selectedBranchId === null && (
                        <Typography
                          variant="h5"
                          color={theme.colors.primary[500]}>
                          ✓
                        </Typography>
                      )}
                    </Row>
                  </Card>
                </TouchableOpacity>
              )}

              {branches.map(renderBranchItem)}

              <Spacer size="lg" />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    width: '100%',
  },
  selectorCard: {
    borderWidth: 1,
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalBody: {
    padding: 16,
  },
  branchItem: {
    marginBottom: 8,
  },
  branchCard: {
    // Additional styles if needed
  },
  branchInfo: {
    flex: 1,
  },
  selectedText: {
    fontWeight: '600',
  },
});
