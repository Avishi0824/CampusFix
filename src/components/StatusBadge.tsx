import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ComplaintStatus } from '../types';
import { Palette, Typography, Geometry } from '../theme';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'normal' | 'small';
  style?: ViewStyle;
}

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; color: string; bgLight: string; bgDark: string }
> = {
  REPORTED: {
    label: 'REPORTED',
    color: Palette.status.reported,
    bgLight: '#ECEEF1',
    bgDark: '#2F343C',
  },
  ASSIGNED: {
    label: 'ASSIGNED',
    color: Palette.status.assigned, // Visually blue
    bgLight: '#EBF1F7',
    bgDark: '#283442',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    color: Palette.status.inProgress,
    bgLight: '#FBEFEA',
    bgDark: '#3A2E2A',
  },
  RESOLVED: {
    label: 'RESOLVED',
    color: Palette.status.resolved,
    bgLight: '#EDF5EE',
    bgDark: '#28382C',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'normal',
  style,
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.REPORTED;
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
      <View style={[styles.dot, { backgroundColor: config.color }]} />
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontFamily: Typography.monoBold,
    letterSpacing: 0.8,
  },
});
