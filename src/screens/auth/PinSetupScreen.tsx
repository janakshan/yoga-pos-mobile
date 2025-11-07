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

/**
 * PIN Setup Screen
 * Set up a PIN for quick login
 */

type Props = NativeStackScreenProps<AuthStackParamList, 'PinSetup'>;

const PIN_LENGTH = 4;

export const PinSetupScreen: React.FC<Props> = ({navigation}) => {
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const {setPin: savePin, isLoading} = useAuthStore();
  const {theme} = useTheme();
  const pinInputRefs = useRef<Array<TextInput | null>>([]);
  const confirmPinInputRefs = useRef<Array<TextInput | null>>([]);

  const handlePinChange = (value: string, index: number) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const currentPin = step === 'enter' ? pin : confirmPin;
    const newPin = currentPin.split('');
    newPin[index] = value;
    const updatedPin = newPin.join('');

    if (step === 'enter') {
      setPin(updatedPin);
    } else {
      setConfirmPin(updatedPin);
    }

    // Auto-focus next input
    const refs = step === 'enter' ? pinInputRefs : confirmPinInputRefs;
    if (value && index < PIN_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }

    // Move to confirmation step when first PIN is complete
    if (step === 'enter' && updatedPin.length === PIN_LENGTH) {
      setTimeout(() => {
        setStep('confirm');
        setTimeout(() => {
          confirmPinInputRefs.current[0]?.focus();
        }, 100);
      }, 300);
    }

    // Auto-submit when confirmation PIN is complete
    if (step === 'confirm' && updatedPin.length === PIN_LENGTH) {
      setTimeout(() => {
        handlePinSetup(pin, updatedPin);
      }, 300);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    const refs = step === 'enter' ? pinInputRefs : confirmPinInputRefs;
    const currentPin = step === 'enter' ? pin : confirmPin;

    if (key === 'Backspace' && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePinSetup = async (enteredPin: string, confirmedPin: string) => {
    if (enteredPin.length !== PIN_LENGTH) {
      Alert.alert('Error', `Please enter a ${PIN_LENGTH}-digit PIN`);
      return;
    }

    if (enteredPin !== confirmedPin) {
      Alert.alert('Error', 'PINs do not match. Please try again.');
      setPin('');
      setConfirmPin('');
      setStep('enter');
      setTimeout(() => {
        pinInputRefs.current[0]?.focus();
      }, 100);
      return;
    }

    try {
      await savePin(enteredPin);
      Alert.alert(
        'Success',
        'PIN has been set up successfully. You can now use PIN for quick login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert('Setup Failed', err.message || 'Failed to set up PIN');
      setPin('');
      setConfirmPin('');
      setStep('enter');
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip PIN Setup',
      'You can set up PIN later from settings. Continue without PIN?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Skip',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const renderPinInputs = (
    currentPin: string,
    refs: React.MutableRefObject<Array<TextInput | null>>,
  ) => {
    return (
      <View style={styles.pinContainer}>
        {Array.from({length: PIN_LENGTH}).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => (refs.current[index] = ref)}
            style={[
              styles.pinInput,
              {
                borderColor: currentPin[index]
                  ? theme.colors.primary[500]
                  : theme.colors.border,
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
              },
            ]}
            value={currentPin[index] || ''}
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
            {step === 'enter' ? 'Set Up PIN' : 'Confirm PIN'}
          </Typography>
          <Spacer size="xs" />
          <Typography
            variant="body"
            color={theme.colors.text.secondary}
            style={styles.description}>
            {step === 'enter'
              ? 'Create a 4-digit PIN for quick access'
              : 'Re-enter your PIN to confirm'}
          </Typography>
        </Column>

        <Spacer size="3xl" />

        {step === 'enter' ? (
          <>
            <Typography
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={styles.label}>
              Enter PIN
            </Typography>
            <Spacer size="md" />
            {renderPinInputs(pin, pinInputRefs)}
          </>
        ) : (
          <>
            <Typography
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={styles.label}>
              Confirm PIN
            </Typography>
            <Spacer size="md" />
            {renderPinInputs(confirmPin, confirmPinInputRefs)}
            <Spacer size="lg" />
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                setStep('enter');
                setPin('');
                setConfirmPin('');
                setTimeout(() => {
                  pinInputRefs.current[0]?.focus();
                }, 100);
              }}
              disabled={isLoading}>
              <Typography variant="bodySmall" color={theme.colors.primary[500]}>
                Change PIN
              </Typography>
            </TouchableOpacity>
          </>
        )}

        <Spacer size="2xl" />

        <View style={styles.infoBox}>
          <Typography variant="caption" color={theme.colors.text.secondary}>
            💡 Your PIN will be used for quick and secure access to the app
          </Typography>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.linkButton}
            disabled={isLoading}
            onPress={handleSkip}>
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              Skip for Now
            </Typography>
          </TouchableOpacity>
        </View>
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
  description: {
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
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
  infoBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  linkButton: {
    alignItems: 'center',
    padding: 8,
  },
  footer: {
    marginTop: 32,
  },
});
