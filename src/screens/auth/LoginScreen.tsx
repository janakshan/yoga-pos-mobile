import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useAuthStore} from '@store/slices/authSlice';
import {Theme} from '@constants/theme';

/**
 * Login Screen
 * Email/Password authentication
 */

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, isLoading, error} = useAuthStore();

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Yoga POS</Text>
          <Text style={styles.subtitle}>Point of Sale System</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={Theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>v1.0.0</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing['3xl'],
  },
  title: {
    fontSize: Theme.typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: Theme.colors.primary[500],
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.text.secondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    height: Theme.input.height,
    borderWidth: Theme.input.borderWidth,
    borderColor: Theme.colors.border.light,
    borderRadius: Theme.borderRadius.base,
    paddingHorizontal: Theme.input.paddingHorizontal,
    fontSize: Theme.typography.fontSize.base,
    backgroundColor: Theme.colors.white,
  },
  button: {
    height: Theme.button.height.lg,
    backgroundColor: Theme.colors.primary[500],
    borderRadius: Theme.borderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Theme.colors.white,
    fontSize: Theme.typography.fontSize.base,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: Theme.spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: Theme.colors.primary[500],
    fontSize: Theme.typography.fontSize.sm,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: Theme.typography.fontSize.sm,
    marginTop: Theme.spacing.xs,
  },
  footer: {
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  footerText: {
    color: Theme.colors.text.tertiary,
    fontSize: Theme.typography.fontSize.xs,
  },
});
