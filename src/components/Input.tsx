import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing, Geometry } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  rightElement,
  required = false,
  style,
  multiline,
  numberOfLines,
  ...props
}) => {
  const { theme } = useAuth();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text
            style={[
              styles.label,
              {
                color: isFocused ? theme.colors.accent : theme.colors.textSecondary,
              },
            ]}
          >
            {label.toUpperCase()}
            {required && <Text style={{ color: theme.colors.accent }}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: error
              ? theme.priority.high
              : isFocused
              ? theme.colors.borderFocus
              : theme.colors.inputBorder,
            borderWidth: isFocused ? Geometry.borderWidthMedium : Geometry.borderWidthThin,
            minHeight: multiline ? 90 : Spacing.inputHeight,
            paddingVertical: multiline ? 10 : 0,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              fontFamily: Typography.body,
              fontSize: Typography.sizes.body,
            },
            style,
          ]}
          {...props}
        />
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: theme.priority.high }]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.gap,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Geometry.radiusNone, // Square Figma design
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  rightElement: {
    marginLeft: 8,
  },
  errorText: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.sizes.caption,
    marginTop: 4,
  },
  helperText: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.micro,
    marginTop: 4,
  },
});
