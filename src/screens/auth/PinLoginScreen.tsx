import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@navigation/types';
import {useAuthStore} from '@store/slices/authSlice';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button} from '@components/ui';
import {Column, Spacer} from '@components/layout';
import {BiometricUtility} from '@utils/biometric.utils';

/**
 * PIN Login Screen
 * Quick login with PIN code
 */

type Props = NativeStackScreenProps<AuthStackParamList, 'PinLogin'>;

const PIN_LENGTH = 4;

export const PinLoginScreen: React.FC<Props> = ({navigation, route}) => {
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState(route.params?.username || '');
  const {loginWithPin, loginWithBiometric, isLoading, biometricAvailable, biometricEnabled} =
    useAuthStore();
  const {theme} = useTheme();
  const pinInputRefs = useRef<Array<TextInput | null>>([]);

  const handlePinChange = (value: string, index: number) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newPin = pin.split('');
    newPin[index] = value;
    const updatedPin = newPin.join('');

    setPin(updatedPin);

    // Auto-focus next input
    if (value && index < PIN_LENGTH - 1) {
      pinInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when PIN is complete
    if (updatedPin.length === PIN_LENGTH) {
      handlePinLogin(updatedPin);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePinLogin = async (pinCode: string) => {
    if (!username) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    if (pinCode.length !== PIN_LENGTH) {
      Alert.alert('Error', `Please enter a ${PIN_LENGTH}-digit PIN`);
      return;
    }

    try {
      await loginWithPin({
        username,
        pin: pinCode,
        rememberMe: true,
      });
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid PIN');
      setPin('');
      pinInputRefs.current[0]?.focus();
    }
  };

  const handleBiometricLogin = async () => {
    try {
      await loginWithBiometric();
    } catch (err: any) {
      Alert.alert('Biometric Login Failed', err.message || 'Please try again');
    }
  };

  const renderPinInputs = () => {
    return (
      <View style={styles.pinContainer}>
        {Array.from({length: PIN_LENGTH}).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => (pinInputRefs.current[index] = ref)}
            style={[
              styles.pinInput,
              {
                borderColor: pin[index]
                  ? theme.colors.primary[500]
                  : theme.colors.border,
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
              },
            ]}
            value={pin[index] || ''}
            onChangeText={value => handlePinChange(value, index)}
            onKeyPress={({nativeEvent}) =>
              handleKeyPress(nativeEvent.key, index)
            }
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry
            editable={!isLoading}
            selectTextOnFocus
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.content}>
        <Column alignItems="center">
          <Typography variant="h2" color={theme.colors.primary[500]}>
            PIN Login
          </Typography>
          <Spacer size="xs" />
          <Typography variant="body" color={theme.colors.text.secondary}>
            Enter your PIN to continue
          </Typography>
        </Column>

        <Spacer size="3xl" />

        {!route.params?.username && (
          <>
            <Typography
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={styles.label}>
              Username
            </Typography>
            <Spacer size="xs" />
            <TextInput
              style={[
                styles.usernameInput,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                },
              ]}
              placeholder="Enter username"
              placeholderTextColor={theme.colors.text.tertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <Spacer size="lg" />
          </>
        )}

        <Typography
          variant="bodySmall"
          color={theme.colors.text.secondary}
          style={styles.label}>
          Enter PIN
        </Typography>
        <Spacer size="md" />

        {renderPinInputs()}

        <Spacer size="lg" />

        {biometricAvailable && biometricEnabled && (
          <>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onPress={handleBiometricLogin}
              loading={isLoading}
              disabled={isLoading}>
              Use Biometric Login
            </Button>
            <Spacer size="md" />
          </>
        )}

        <TouchableOpacity
          style={styles.linkButton}
          disabled={isLoading}
          onPress={() => navigation.navigate('Login')}>
          <Typography variant="bodySmall" color={theme.colors.primary[500]}>
            Back to Email Login
          </Typography>
        </TouchableOpacity>
      </View>
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
  label: {
    fontWeight: '600',
  },
  usernameInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
  },
});
