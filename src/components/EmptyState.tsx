import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing, Geometry } from '../theme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionTitle,
  onAction,
  icon,
  style,
}) => {
  const { theme } = useAuth();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.cardBackground,
        },
        style,
      ]}
    >
      <View style={styles.iconWrapper}>
        {icon || <Inbox size={36} color={theme.colors.textMuted} />}
      </View>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.textPrimary,
            fontFamily: Typography.display,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.description,
          {
            color: theme.colors.textSecondary,
            fontFamily: Typography.body,
          },
        ]}
      >
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="outline"
          size="small"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.gapLarge,
    borderWidth: Geometry.borderWidthThin,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.gap,
    borderRadius: Geometry.radiusNone,
  },
  iconWrapper: {
    marginBottom: Spacing.gap,
  },
  title: {
    fontSize: Typography.sizes.h3,
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  button: {
    marginTop: Spacing.gap,
  },
});
