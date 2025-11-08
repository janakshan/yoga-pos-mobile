/**
 * More Navigator
 * Stack navigator for More menu items (Settings, Profile, Help, About)
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MoreStackParamList} from './types';
import {Theme} from '@constants/theme';
import {SettingsScreen} from '@screens/settings';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Stack = createStackNavigator<MoreStackParamList>();

// Placeholder screens
const MoreMenuScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.subtitle}>Additional features and settings</Text>

      <View style={styles.menuList}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => (navigation as any).navigate('Settings')}>
          <Text style={styles.menuItemTitle}>⚙️ Settings</Text>
          <Text style={styles.menuItemDescription}>
            Configure app preferences
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.disabled]}>
          <Text style={[styles.menuItemTitle, styles.disabledText]}>
            👤 Profile
          </Text>
          <Text style={[styles.menuItemDescription, styles.disabledText]}>
            Manage your profile (Coming Soon)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.disabled]}>
          <Text style={[styles.menuItemTitle, styles.disabledText]}>
            ❓ Help
          </Text>
          <Text style={[styles.menuItemDescription, styles.disabledText]}>
            Get help and support (Coming Soon)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.disabled]}>
          <Text style={[styles.menuItemTitle, styles.disabledText]}>
            ℹ️ About
          </Text>
          <Text style={[styles.menuItemDescription, styles.disabledText]}>
            App information (Coming Soon)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.placeholderText}>Profile Screen - Coming Soon</Text>
  </View>
);

const HelpScreen = () => (
  <View style={styles.container}>
    <Text style={styles.placeholderText}>Help Screen - Coming Soon</Text>
  </View>
);

const AboutScreen = () => (
  <View style={styles.container}>
    <Text style={styles.placeholderText}>About Screen - Coming Soon</Text>
  </View>
);

export const MoreNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Theme.colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Theme.colors.border.light,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: Theme.colors.text.primary,
        },
        headerTintColor: Theme.colors.primary[500],
      }}>
      <Stack.Screen
        name="MoreMenu"
        component={MoreMenuScreen}
        options={{
          title: 'More',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{
          title: 'Help',
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.colors.background.secondary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.text.secondary,
    marginBottom: 24,
  },
  menuList: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: Theme.colors.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border.light,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Theme.colors.text.disabled,
  },
  placeholderText: {
    fontSize: 16,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
});
