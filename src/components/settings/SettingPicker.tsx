/**
 * Setting Picker Component
 * Setting item with a modal picker
 */

import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {SettingItem} from './SettingItem';
import {Typography} from '@components/ui';
import {useTheme} from '@hooks/useTheme';

interface PickerOption<T> {
  label: string;
  value: T;
  description?: string;
}

interface SettingPickerProps<T> {
  label: string;
  description?: string;
  value: T;
  options: PickerOption<T>[];
  onValueChange: (value: T) => void;
  disabled?: boolean;
  last?: boolean;
  icon?: React.ReactNode;
  modalTitle?: string;
}

export function SettingPicker<T extends string | number>({
  label,
  description,
  value,
  options,
  onValueChange,
  disabled = false,
  last = false,
  icon,
  modalTitle,
}: SettingPickerProps<T>) {
  const {theme} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || String(value);

  const handleSelect = (newValue: T) => {
    onValueChange(newValue);
    setModalVisible(false);
  };

  return (
    <>
      <SettingItem
        label={label}
        description={description}
        value={displayValue}
        icon={icon}
        onPress={() => setModalVisible(true)}
        disabled={disabled}
        last={last}
        rightComponent={
          <Typography variant="body" color={theme.colors.text.secondary}>
            ›
          </Typography>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <Pressable
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background.primary},
            ]}
            onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalHeader,
                {borderBottomColor: theme.colors.border},
              ]}>
              <Typography variant="h4" color={theme.colors.text.primary}>
                {modalTitle || label}
              </Typography>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                <Typography variant="h4" color={theme.colors.primary[500]}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={String(option.value)}
                  style={[
                    styles.optionItem,
                    {
                      borderBottomColor: theme.colors.border,
                      borderBottomWidth:
                        index === options.length - 1 ? 0 : 1,
                      backgroundColor:
                        option.value === value
                          ? theme.colors.primary[50]
                          : 'transparent',
                    },
                  ]}
                  onPress={() => handleSelect(option.value)}>
                  <View style={styles.optionContent}>
                    <Typography
                      variant="body"
                      color={
                        option.value === value
                          ? theme.colors.primary[500]
                          : theme.colors.text.primary
                      }
                      style={styles.optionLabel}>
                      {option.label}
                    </Typography>
                    {option.description && (
                      <Typography
                        variant="bodySmall"
                        color={theme.colors.text.secondary}
                        style={styles.optionDescription}>
                        {option.description}
                      </Typography>
                    )}
                  </View>
                  {option.value === value && (
                    <Typography
                      variant="h5"
                      color={theme.colors.primary[500]}>
                      ✓
                    </Typography>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 500,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontWeight: '500',
    marginBottom: 2,
  },
  optionDescription: {
    lineHeight: 18,
  },
});
