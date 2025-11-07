import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@navigation/types';
import {useAuthStore} from '@store/slices/authSlice';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button, Input} from '@components/ui';
import {Column, Spacer, Row} from '@components/layout';

/**
 * Login Screen
 * Email/Password authentication with biometric support
 */

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const {
    login,
    loginWithBiometric,
    isLoading,
    error,
    biometricAvailable,
    biometricEnabled,
    checkBiometricAvailability,
  } = useAuthStore();
  const {theme} = useTheme();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await login({email, password, rememberMe});
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      await loginWithBiometric();
    } catch (err: any) {
      Alert.alert('Biometric Login Failed', err.message || 'Please try again');
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

          <Row justifyContent="space-between" alignItems="center">
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
              disabled={isLoading}>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: rememberMe
                      ? theme.colors.primary[500]
                      : 'transparent',
                  },
                ]}>
                {rememberMe && (
                  <Typography variant="bodySmall" color="#fff">
                    ✓
                  </Typography>
                )}
              </View>
              <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                Remember me
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isLoading}
              onPress={() => Alert.alert('Info', 'Forgot password coming soon')}>
              <Typography variant="bodySmall" color={theme.colors.primary[500]}>
                Forgot Password?
              </Typography>
            </TouchableOpacity>
          </Row>

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

          {biometricAvailable && biometricEnabled && (
            <>
              <Spacer size="md" />
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onPress={handleBiometricLogin}
                loading={isLoading}
                disabled={isLoading}>
                Sign In with Biometric
              </Button>
            </>
          )}

          <Spacer size="md" />

          <TouchableOpacity
            style={styles.linkButton}
            disabled={isLoading}
            onPress={() => navigation.navigate('PinLogin', {})}>
            <Typography variant="bodySmall" color={theme.colors.primary[500]}>
              Use PIN Login
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButton: {
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
});
