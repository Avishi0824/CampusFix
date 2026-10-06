import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Priority } from '../types';
import { Palette, Typography, Geometry } from '../theme';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'normal' | 'small';
  style?: ViewStyle;
}

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bgLight: string }
> = {
  HIGH: {
    label: 'HIGH',
    color: Palette.priority.high,
    bgLight: '#FDF0ED',
  },
  MEDIUM: {
    label: 'MEDIUM',
    color: Palette.priority.medium,
    bgLight: '#FBEFEA',
  },
  LOW: {
    label: 'LOW',
    color: Palette.priority.low,
    bgLight: '#EDF5EE',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'normal',
  style,
}) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          borderColor: config.color,
          backgroundColor: config.bgLight,
          paddingHorizontal: isSmall ? 6 : 8,
          paddingVertical: isSmall ? 2 : 3,
        },
        style,
      ]}
    >
      <View style={[styles.indicator, { backgroundColor: config.color }]} />
      <Text
        style={[
          styles.text,
          {
            color: config.color,
            fontSize: isSmall ? Typography.sizes.micro : Typography.sizes.tag,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusSmall,
    alignSelf: 'flex-start',
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 1,
    marginRight: 4,
  },
  text: {
    fontFamily: Typography.monoBold,
    letterSpacing: 0.8,
  },
});
