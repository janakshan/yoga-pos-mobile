import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useAuthStore} from '@store/slices/authSlice';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button, Input} from '@components/ui';
import {Column, Spacer} from '@components/layout';

/**
 * Login Screen
 * Email/Password authentication with new design system
 */

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, isLoading, error} = useAuthStore();
  const {theme} = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await login({email, password, rememberMe: true});
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <Column alignItems="center">
          <Typography variant="h2" color={theme.colors.primary[500]}>
            Yoga POS
          </Typography>
          <Spacer size="xs" />
          <Typography variant="body" color={theme.colors.text.secondary}>
            Point of Sale System
          </Typography>
        </Column>

        <Spacer size="3xl" />

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            disabled={isLoading}
            required
          />

          <Spacer size="md" />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            disabled={isLoading}
            required
          />

          {error && (
            <>
              <Spacer size="sm" />
              <Typography variant="caption" color={theme.colors.error}>
                {error}
              </Typography>
            </>
          )}

          <Spacer size="lg" />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}>
            Sign In
          </Button>

          <Spacer size="md" />

          <TouchableOpacity
            style={styles.linkButton}
            disabled={isLoading}
            onPress={() => Alert.alert('Info', 'Forgot password coming soon')}>
            <Typography variant="bodySmall" color={theme.colors.primary[500]}>
              Forgot Password?
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Typography variant="caption" color={theme.colors.text.tertiary}>
            v1.0.0
          </Typography>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  linkButton: {
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
});
