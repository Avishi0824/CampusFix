import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import {
  Wrench,
  Zap,
  Armchair,
  Wifi,
  Sparkles,
  Wind,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react-native';
import { Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing, Geometry } from '../theme';

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  onPress?: () => void;
  labelOverride?: string;
  style?: ViewStyle;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  PLUMBING: 'Plumbing',
  ELECTRICAL: 'Electrical',
  FURNITURE: 'Furniture',
  INTERNET_WIFI: 'Wi-Fi / Network',
  CLEANING: 'Cleaning',
  HVAC_AIR: 'AC / Air',
  SECURITY: 'Locks & Security',
  OTHER: 'Other',
};

export const getCategoryIcon = (category: Category, color: string, size = 14) => {
  switch (category) {
    case 'PLUMBING':
      return <Wrench size={size} color={color} />;
    case 'ELECTRICAL':
      return <Zap size={size} color={color} />;
    case 'FURNITURE':
      return <Armchair size={size} color={color} />;
    case 'INTERNET_WIFI':
      return <Wifi size={size} color={color} />;
    case 'CLEANING':
      return <Sparkles size={size} color={color} />;
    case 'HVAC_AIR':
      return <Wind size={size} color={color} />;
    case 'SECURITY':
      return <ShieldAlert size={size} color={color} />;
    default:
      return <HelpCircle size={size} color={color} />;
  }
};

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  selected = false,
  onPress,
  labelOverride,
  style,
}) => {
  const { theme } = useAuth();
  const label = labelOverride || CATEGORY_LABELS[category];

  const activeColor = selected ? '#FFFFFF' : theme.colors.textPrimary;
  const activeBg = selected
    ? theme.colors.accent
    : theme.isDark
    ? '#2D3037'
    : '#FFFFFF';
  const activeBorder = selected
    ? theme.colors.accent
    : theme.colors.border;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.chip,
        {
          backgroundColor: activeBg,
          borderColor: activeBorder,
        },
        style,
      ]}
    >
      {getCategoryIcon(category, activeColor, 13)}
      <Text
        style={[
          styles.text,
          {
            color: activeColor,
            fontFamily: selected ? Typography.bodySemiBold : Typography.bodyMedium,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone, // Strict square Figma style
    marginRight: Spacing.gapSmall,
    marginBottom: Spacing.gapSmall,
  },
  text: {
    fontSize: Typography.sizes.caption,
    marginLeft: 6,
  },
});
