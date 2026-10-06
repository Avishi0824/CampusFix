import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing, Geometry } from '../theme';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  style?: ViewStyle;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtitle,
  color,
  style,
}) => {
  const { theme } = useAuth();
  const accentColor = color || theme.colors.textPrimary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textSecondary,
          },
        ]}
      >
        {label.toUpperCase()}
      </Text>
      <Text
        style={[
          styles.value,
          {
            color: accentColor,
            fontFamily: Typography.display,
          },
        ]}
      >
        {value}
      </Text>
      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textMuted,
            },
          ]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.cardPadding,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone, // Strict square Figma style
    flex: 1,
    minWidth: 100,
  },
  label: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  value: {
    fontSize: Typography.sizes.hero,
    lineHeight: Typography.lineHeights.hero,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.micro,
    marginTop: 4,
  },
});
