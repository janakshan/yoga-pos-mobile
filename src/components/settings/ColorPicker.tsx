/**
 * Color Picker Component
 * Setting item with color selection
 */

import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import {SettingItem} from './SettingItem';
import {Typography, Button} from '@components/ui';
import {Row, Spacer} from '@components/layout';
import {useTheme} from '@hooks/useTheme';

interface ColorPickerProps {
  label: string;
  description?: string;
  value: string;
  onValueChange: (color: string) => void;
  disabled?: boolean;
  last?: boolean;
}

// Preset colors
const PRESET_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#64748B',
  '#1E293B', '#0F172A', '#000000', '#FFFFFF', '#F1F5F9', '#E2E8F0',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
  last = false,
}) => {
  const {theme} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const [customColor, setCustomColor] = useState(value);

  const handleSave = () => {
    onValueChange(tempColor);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempColor(value);
    setCustomColor(value);
    setModalVisible(false);
  };

  const handlePresetSelect = (color: string) => {
    setTempColor(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (text: string) => {
    setCustomColor(text);
    // Validate hex color format
    if (/^#[0-9A-F]{6}$/i.test(text)) {
      setTempColor(text);
    }
  };

  return (
    <>
      <SettingItem
        label={label}
        description={description}
        onPress={() => setModalVisible(true)}
        disabled={disabled}
        last={last}
        rightComponent={
          <View style={styles.colorPreview}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: value,
                  borderColor: theme.colors.border,
                },
              ]}
            />
            <Typography
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={styles.colorValue}>
              {value.toUpperCase()}
            </Typography>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}>
        <Pressable style={styles.modalOverlay} onPress={handleCancel}>
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
                {label}
              </Typography>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Typography variant="h4" color={theme.colors.primary[500]}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Color Preview */}
              <View style={styles.previewSection}>
                <View
                  style={[
                    styles.largeColorPreview,
                    {
                      backgroundColor: tempColor,
                      borderColor: theme.colors.border,
                    },
                  ]}
                />
                <Spacer size="sm" />
                <Typography
                  variant="h5"
                  color={theme.colors.text.primary}
                  style={styles.selectedColor}>
                  {tempColor.toUpperCase()}
                </Typography>
              </View>

              <Spacer size="lg" />

              {/* Custom Color Input */}
              <View style={styles.customInputSection}>
                <Typography
                  variant="body"
                  color={theme.colors.text.secondary}
                  style={styles.sectionTitle}>
                  Custom Color (Hex)
                </Typography>
                <Spacer size="xs" />
                <TextInput
                  style={[
                    styles.customInput,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      borderColor: theme.colors.border,
                      color: theme.colors.text.primary,
                    },
                  ]}
                  value={customColor}
                  onChangeText={handleCustomColorChange}
                  placeholder="#000000"
                  placeholderTextColor={theme.colors.text.disabled}
                  autoCapitalize="characters"
                  maxLength={7}
                />
              </View>

              <Spacer size="lg" />

              {/* Preset Colors */}
              <View style={styles.presetsSection}>
                <Typography
                  variant="body"
                  color={theme.colors.text.secondary}
                  style={styles.sectionTitle}>
                  Preset Colors
                </Typography>
                <Spacer size="xs" />
                <View style={styles.presetGrid}>
                  {PRESET_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.presetColor,
                        {
                          backgroundColor: color,
                          borderColor:
                            tempColor === color
                              ? theme.colors.primary[500]
                              : theme.colors.border,
                          borderWidth: tempColor === color ? 3 : 1,
                        },
                      ]}
                      onPress={() => handlePresetSelect(color)}
                    />
                  ))}
                </View>
              </View>

              <Spacer size="lg" />

              {/* Action Buttons */}
              <Row gap="md">
                <View style={{flex: 1}}>
                  <Button
                    variant="outline"
                    onPress={handleCancel}>
                    Cancel
                  </Button>
                </View>
                <View style={{flex: 1}}>
                  <Button onPress={handleSave}>
                    Save
                  </Button>
                </View>
              </Row>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  colorValue: {
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  modalBody: {
    padding: 20,
  },
  previewSection: {
    alignItems: 'center',
  },
  largeColorPreview: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 2,
  },
  selectedColor: {
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  customInputSection: {},
  sectionTitle: {
    fontWeight: '600',
  },
  customInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'monospace',
  },
  presetsSection: {},
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetColor: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
});
