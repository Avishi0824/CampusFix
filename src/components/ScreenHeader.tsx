import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ArrowLeft, RefreshCw, UserCheck, Shield, Wrench, GraduationCap } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing, Geometry } from '../theme';
import { Role } from '../types';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showRoleBadge?: boolean;
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  showRoleBadge = false,
  style,
}) => {
  const { theme, role, switchRole } = useAuth();

  const getRoleIcon = (currentRole: Role) => {
    switch (currentRole) {
      case 'student':
        return <GraduationCap size={12} color={theme.colors.accent} />;
      case 'technician':
        return <Wrench size={12} color={theme.colors.accent} />;
      case 'warden':
        return <Shield size={12} color={theme.colors.accent} />;
    }
  };

  const cycleRole = () => {
    if (role === 'student') switchRole('technician');
    else if (role === 'technician') switchRole('warden');
    else switchRole('student');
  };

  return (
    <View style={[styles.headerContainer, { borderBottomColor: theme.colors.border }, style]}>
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onBack}
            style={[
              styles.backButton,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.isDark ? '#2B2E36' : '#FFFFFF',
              },
            ]}
          >
            <ArrowLeft size={18} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
                fontFamily: Typography.display,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: Typography.body,
                },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          {showRoleBadge && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={cycleRole}
              style={[
                styles.roleBadge,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.isDark ? '#2D3038' : '#FFFFFF',
                },
              ]}
            >
              {getRoleIcon(role)}
              <Text style={[styles.roleText, { color: theme.colors.textPrimary }]}>
                {role.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
          {rightAction}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: Geometry.borderWidthThin,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.h1,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: Typography.sizes.caption,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone,
  },
  roleText: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
});
