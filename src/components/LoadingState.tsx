import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing } from '../theme';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading maintenance data...',
  style,
}) => {
  const { theme } = useAuth();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.textSecondary,
            fontFamily: Typography.bodyMedium,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.gapLarge,
  },
  text: {
    fontSize: Typography.sizes.body,
    marginTop: Spacing.gap,
  },
});
