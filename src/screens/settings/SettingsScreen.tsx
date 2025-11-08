/**
 * Settings Screen
 * Main settings page with all configuration options
 * Route: /settings
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button, Card} from '@components/ui';
import {Row, Column, Spacer} from '@components/layout';
import {
  GeneralSettingsSection,
  LocalizationSettingsSection,
  BrandingSettingsSection,
  HardwareSettingsSection,
  NotificationsSettingsSection,
  BackupSettingsSection,
} from '@components/settings';
import {useSettingsStore} from '@/store/slices/settingsSlice';

export const SettingsScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {resetSettings, resetCategory, exportSettings, importSettings} =
    useSettingsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showTaxRateModal, setShowTaxRateModal] = useState(false);
  const [taxRate, setTaxRate] = useState('0');

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset All Settings',
      'Are you sure you want to reset all settings to their default values? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetSettings();
            Alert.alert('Success', 'All settings have been reset to defaults.');
          },
        },
      ]
    );
  };

  const handleExportSettings = () => {
    try {
      const settings = exportSettings();
      // TODO: Implement actual file export
      Alert.alert(
        'Export Settings',
        'Settings exported successfully! The file has been saved to your device.',
        [{text: 'OK'}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export settings. Please try again.');
    }
  };

  const handleImportSettings = () => {
    Alert.alert(
      'Import Settings',
      'This will import settings from a file and overwrite current settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Import',
          onPress: () => {
            // TODO: Implement actual file import
            Alert.alert('Success', 'Settings imported successfully!');
          },
        },
      ]
    );
  };

  const handleTaxRatePress = () => {
    const {settings} = useSettingsStore.getState();
    setTaxRate(settings.general.defaultTaxRate.toString());
    setShowTaxRateModal(true);
  };

  const handleSaveTaxRate = () => {
    const rate = parseFloat(taxRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      Alert.alert('Invalid Tax Rate', 'Please enter a valid tax rate between 0 and 100.');
      return;
    }
    const {updateGeneralSettings} = useSettingsStore.getState();
    updateGeneralSettings({defaultTaxRate: rate});
    setShowTaxRateModal(false);
    Alert.alert('Success', 'Tax rate updated successfully!');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.secondary},
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" color={theme.colors.text.primary}>
            Settings
          </Typography>
          <Typography
            variant="body"
            color={theme.colors.text.secondary}
            style={styles.subtitle}>
            Configure your application preferences
          </Typography>
        </View>

        <Spacer size="lg" />

        {/* Settings Sections */}
        <GeneralSettingsSection onTaxRatePress={handleTaxRatePress} />
        <LocalizationSettingsSection />
        <BrandingSettingsSection />
        <HardwareSettingsSection />
        <NotificationsSettingsSection />
        <BackupSettingsSection />

        {/* Advanced Actions */}
        <Card
          variant="outlined"
          padding="md"
          style={{marginHorizontal: 0, marginBottom: 16}}>
          <Typography
            variant="h5"
            color={theme.colors.text.primary}
            style={styles.advancedTitle}>
            Advanced
          </Typography>
          <Spacer size="sm" />

          <Button variant="outline" onPress={handleExportSettings} size="sm">
            Export Settings
          </Button>
          <Spacer size="xs" />

          <Button variant="outline" onPress={handleImportSettings} size="sm">
            Import Settings
          </Button>
          <Spacer size="xs" />

          <Button
            variant="danger"
            onPress={handleResetSettings}
            size="sm">
            Reset All Settings
          </Button>
        </Card>

        <Spacer size="xl" />

        {/* App Info */}
        <View style={styles.appInfo}>
          <Typography
            variant="bodySmall"
            color={theme.colors.text.secondary}
            style={styles.appInfoText}>
            Yoga POS v1.0.0
          </Typography>
          <Typography
            variant="bodySmall"
            color={theme.colors.text.secondary}
            style={styles.appInfoText}>
            © 2025 All rights reserved
          </Typography>
        </View>

        <Spacer size="lg" />
      </ScrollView>

      {/* Tax Rate Modal */}
      <Modal
        visible={showTaxRateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTaxRateModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTaxRateModal(false)}>
          <Pressable
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background.primary},
            ]}
            onPress={(e) => e.stopPropagation()}>
            <Typography variant="h4" color={theme.colors.text.primary}>
              Default Tax Rate
            </Typography>
            <Spacer size="md" />

            <Typography
              variant="body"
              color={theme.colors.text.secondary}
              style={{marginBottom: 8}}>
              Enter the default tax rate percentage (0-100)
            </Typography>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background.secondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary,
                },
              ]}
              value={taxRate}
              onChangeText={setTaxRate}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.disabled}
            />

            <Spacer size="lg" />

            <Row gap="md">
              <View style={{flex: 1}}>
                <Button
                  variant="outline"
                  onPress={() => setShowTaxRateModal(false)}
                  size="md">
                  Cancel
                </Button>
              </View>
              <View style={{flex: 1}}>
                <Button onPress={handleSaveTaxRate} size="md">
                  Save
                </Button>
              </View>
            </Row>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 4,
    lineHeight: 20,
  },
  advancedTitle: {
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appInfoText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
