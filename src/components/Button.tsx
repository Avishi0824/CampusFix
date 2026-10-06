import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing, Geometry } from '../theme';

export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'normal' | 'small';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'normal',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { theme } = useAuth();

  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback on web / simulators
    }
    onPress();
  };

  const isSmall = size === 'small';

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      height: isSmall ? Spacing.buttonHeightSmall : Spacing.buttonHeight,
      minHeight: isSmall ? 38 : Spacing.minTouchTarget,
      paddingHorizontal: isSmall ? 12 : 20,
      borderRadius: Geometry.radiusNone, // Strict square Figma aesthetic
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: Geometry.borderWidthThin,
      borderColor: 'transparent',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : undefined,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: theme.colors.accent,
          borderColor: theme.colors.accent,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderColor: theme.isDark ? theme.colors.border : theme.colors.border,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: theme.isDark ? '#353942' : '#E8E1D3',
          borderColor: theme.colors.border,
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: theme.priority.high,
          borderColor: theme.priority.high,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          paddingHorizontal: 8,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontFamily: Typography.bodySemiBold,
      fontSize: isSmall ? Typography.sizes.caption : Typography.sizes.body,
      letterSpacing: 0.3,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
      case 'danger':
        return {
          ...base,
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          ...base,
          color: theme.colors.textPrimary,
        };
      case 'secondary':
        return {
          ...base,
          color: theme.colors.textPrimary,
        };
      case 'ghost':
        return {
          ...base,
          color: theme.colors.accent,
        };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : theme.colors.accent}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
