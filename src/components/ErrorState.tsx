import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing, Geometry } from '../theme';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected error occurred while loading records.',
  onRetry,
  style,
}) => {
  const { theme } = useAuth();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.priority.high,
          backgroundColor: theme.colors.cardBackground,
        },
        style,
      ]}
    >
      <AlertTriangle size={32} color={theme.priority.high} />
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.textPrimary,
            fontFamily: Typography.display,
          },
        ]}
      >
        Action Failed
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: theme.colors.textSecondary,
            fontFamily: Typography.body,
          },
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Retry Operation"
          onPress={onRetry}
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
  title: {
    fontSize: Typography.sizes.h3,
    marginTop: Spacing.gapSmall,
    marginBottom: 4,
  },
  message: {
    fontSize: Typography.sizes.caption,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  button: {
    marginTop: Spacing.gap,
  },
});
