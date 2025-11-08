/**
 * Branding Settings Section
 * Color customization, logo upload, and custom styling
 */

import React from 'react';
import {View, Alert, Platform} from 'react-native';
import {SettingSection} from './SettingSection';
import {SettingItem} from './SettingItem';
import {ColorPicker} from './ColorPicker';
import {Button} from '@components/ui';
import {Spacer} from '@components/layout';
import {useSettingsStore} from '@/store/slices/settingsSlice';
import * as ImagePicker from 'expo-image-picker';

export const BrandingSettingsSection: React.FC = () => {
  const {settings, updateBrandingSettings} = useSettingsStore();
  const branding = settings.branding;

  const handleLogoUpload = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required!'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateBrandingSettings({logoUri: result.assets[0].uri});
        Alert.alert('Success', 'Logo updated successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to upload logo. Please try again.');
    }
  };

  const handleCameraUpload = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera is required!'
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateBrandingSettings({logoUri: result.assets[0].uri});
        Alert.alert('Success', 'Logo updated successfully!');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const handleRemoveLogo = () => {
    Alert.alert(
      'Remove Logo',
      'Are you sure you want to remove the logo?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            updateBrandingSettings({logoUri: undefined});
          },
        },
      ]
    );
  };

  return (
    <SettingSection
      title="Branding"
      description="Customize your app's appearance and branding">
      <ColorPicker
        label="Primary Color"
        description="Main brand color used throughout the app"
        value={branding.primaryColor}
        onValueChange={(color) =>
          updateBrandingSettings({primaryColor: color})
        }
      />

      <ColorPicker
        label="Secondary Color"
        description="Supporting brand color"
        value={branding.secondaryColor}
        onValueChange={(color) =>
          updateBrandingSettings({secondaryColor: color})
        }
      />

      <ColorPicker
        label="Accent Color"
        description="Highlight color for important elements"
        value={branding.accentColor}
        onValueChange={(color) =>
          updateBrandingSettings({accentColor: color})
        }
      />

      <View style={{padding: 16}}>
        <SettingItem
          label="Logo"
          description={
            branding.logoUri
              ? 'Logo uploaded successfully'
              : 'Upload your business logo'
          }
          value={branding.logoUri ? '✓ Uploaded' : 'Not set'}
        />
        <Spacer size="sm" />
        <View style={{flexDirection: 'row', gap: 8}}>
          <View style={{flex: 1}}>
            <Button
              variant="outline"
              onPress={handleLogoUpload}
              size="sm">
              Choose from Gallery
            </Button>
          </View>
          <View style={{flex: 1}}>
            <Button
              variant="outline"
              onPress={handleCameraUpload}
              size="sm">
              Take Photo
            </Button>
          </View>
        </View>
        {branding.logoUri && (
          <>
            <Spacer size="xs" />
            <Button
              variant="outline"
              onPress={handleRemoveLogo}
              size="sm">
              Remove Logo
            </Button>
          </>
        )}
      </View>
    </SettingSection>
  );
};
