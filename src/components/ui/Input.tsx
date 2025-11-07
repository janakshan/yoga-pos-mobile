import React, {useState} from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from './Typography';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled = false,
  required = false,
  containerStyle,
  style,
  secureTextEntry,
  ...props
}) => {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = !!error;
  const showPasswordToggle = secureTextEntry;

  const getBorderColor = () => {
    if (hasError) return theme.colors.error;
    if (isFocused) return theme.colors.primary[500];
    return theme.colors.border.medium;
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.background.tertiary;
    return theme.colors.background.primary;
  };

  const inputContainerStyle = StyleSheet.flatten([
    styles.inputContainer,
    {
      height: theme.input.height,
      borderWidth: theme.input.borderWidth,
      borderColor: getBorderColor(),
      borderRadius: theme.borderRadius.base,
      backgroundColor: getBackgroundColor(),
      paddingHorizontal: theme.input.paddingHorizontal,
    },
    containerStyle,
  ]);

  const inputStyle = StyleSheet.flatten([
    styles.input,
    {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: disabled ? theme.colors.text.tertiary : theme.colors.text.primary,
    },
    style,
  ]);

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Typography variant="label" color={theme.colors.text.secondary}>
            {label}
          </Typography>
          {required && (
            <Typography variant="label" color={theme.colors.error}>
              {' '}
              *
            </Typography>
          )}
        </View>
      )}

      <View style={inputContainerStyle}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={inputStyle}
          editable={!disabled}
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={handlePasswordToggle}
            style={styles.rightIcon}>
            <Typography variant="bodySmall" color={theme.colors.text.secondary}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Typography>
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {(error || helperText) && (
        <Typography
          variant="caption"
          color={error ? theme.colors.error : theme.colors.text.secondary}
          style={styles.helperText}>
          {error || helperText}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  helperText: {
    marginTop: 4,
  },
});
