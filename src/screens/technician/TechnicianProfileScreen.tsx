import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Wrench,
  LogOut,
  Phone,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';
import {
  Typography,
  Spacing,
  Geometry,
} from '../../theme';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { StatsCard } from '../../components/StatsCard';
import { Button } from '../../components/Button';

interface TechnicianProfileScreenProps {
  navigation: any;
}

export const TechnicianProfileScreen: React.FC<
  TechnicianProfileScreenProps
> = () => {
  const { user, theme, logout } = useAuth();
  const { complaints } = useComplaints();

  /* ---------------- WORK METRICS ---------------- */

  const assignedCount = complaints.filter(
    (c) => c.status === 'ASSIGNED'
  ).length;

  const inProgressCount = complaints.filter(
    (c) => c.status === 'IN_PROGRESS'
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === 'RESOLVED'
  ).length;

  const queueCount = assignedCount + inProgressCount;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <ScreenHeader
        title="Staff Profile"
        subtitle="Technician Maintenance Portal"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- PROFILE CARD ---------------- */}

        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatarWrapper,
                {
                  borderColor: theme.colors.accent,
                  backgroundColor:
                    theme.colors.surfaceSubtle,
                },
              ]}
            >
              <Wrench
                size={26}
                color={theme.colors.accent}
              />
            </View>

            <View style={styles.profileDetails}>
              <Text
                style={[
                  styles.userName,
                  {
                    color: theme.colors.textPrimary,
                  },
                ]}
              >
                {user?.name || 'Rajesh Kumar'}
              </Text>

              <Text
                style={[
                  styles.userRoleTag,
                  {
                    color: theme.colors.accent,
                  },
                ]}
              >
                PLUMBING & SANITATION SPECIALIST
              </Text>

              <Text
                style={[
                  styles.userEmail,
                  {
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                {user?.email ||
                  'rajesh.kumar@facility.campus.edu'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  theme.colors.borderLight,
              },
            ]}
          />

          {/* Direct Line */}
          <View style={styles.metaRow}>
            <Phone
              size={14}
              color={theme.colors.textSecondary}
            />

            <Text
              style={[
                styles.metaLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              Direct Line:
            </Text>

            <Text
              style={[
                styles.metaValue,
                {
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              {user?.phone || '+91 98111 22334'}
            </Text>
          </View>
        </Card>

        {/* ---------------- WORK METRICS ---------------- */}

        <Text
          style={[
            styles.sectionLabel,
            {
              color: theme.colors.textSecondary,
            },
          ]}
        >
          WORKLOAD & REPAIR METRICS
        </Text>

        <View style={styles.statsRow}>
          <StatsCard
            label="IN QUEUE"
            value={queueCount}
            color={theme.status.inProgress}
          />

          <View style={styles.statsGap} />

          <StatsCard
            label="COMPLETED"
            value={resolvedCount}
            color={theme.status.resolved}
          />

          <View style={styles.statsGap} />

          <StatsCard
            label="RATING"
            value="4.8 ★"
            color={theme.colors.accent}
          />
        </View>

        {/* ---------------- SIGN OUT ---------------- */}

        <View style={styles.signOutSection}>
          <Button
            title="Sign Out"
            onPress={logout}
            variant="danger"
            fullWidth
            icon={
              <LogOut
                size={15}
                color="#FFFFFF"
              />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },

  /* ---------------- PROFILE ---------------- */

  profileCard: {
    marginBottom: 28,
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarWrapper: {
    width: 72,
    height: 72,

    borderWidth: Geometry.borderWidthThin,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: Geometry.radiusNone,

    marginRight: 18,
  },

  profileDetails: {
    flex: 1,
  },

  userName: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.sizes.h2,
  },

  userRoleTag: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.6,
    marginTop: 3,
  },

  userEmail: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.caption,
    marginTop: 3,
  },

  divider: {
    height: 1,
    marginVertical: 14,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaLabel: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.micro,
    marginLeft: 6,
    marginRight: 7,
  },

  metaValue: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.sizes.caption,
  },

  /* ---------------- METRICS ---------------- */

  sectionLabel: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  statsRow: {
    flexDirection: 'row',
  },

  statsGap: {
    width: 8,
  },

  /* ---------------- SIGN OUT ---------------- */

  signOutSection: {
    marginTop: 32,
  },
});