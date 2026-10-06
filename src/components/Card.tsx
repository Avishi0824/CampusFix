import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, StyleProp } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Spacing, Geometry } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  compact?: boolean;
  highlighted?: boolean;
  highlightColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  compact = false,
  highlighted = false,
  highlightColor,
}) => {
  const { theme } = useAuth();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.cardBackground,
    borderColor: highlighted
      ? highlightColor || theme.colors.accent
      : theme.colors.border,
    borderWidth: highlighted ? Geometry.borderWidthMedium : Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone, // Strict Figma square aesthetic
    padding: compact ? Spacing.cardPaddingCompact : Spacing.cardPadding,
    borderLeftWidth: highlighted ? 3 : Geometry.borderWidthThin,
    borderLeftColor: highlighted ? highlightColor || theme.colors.accent : theme.colors.border,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[styles.base, cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.base, cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    marginVertical: 4,
  },
});
