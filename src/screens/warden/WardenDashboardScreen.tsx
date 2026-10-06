import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Shield,
  AlertTriangle,
  UserX,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';

import {
  Typography,
  Spacing,
  Geometry,
} from '../../theme';

import { StatsCard } from '../../components/StatsCard';
import { LoadingState } from '../../components/LoadingState';

interface WardenDashboardScreenProps {
  navigation: any;
}

export const WardenDashboardScreen: React.FC<
  WardenDashboardScreenProps
> = () => {
  const { theme } = useAuth();

  const {
    complaints,
    analytics,
    isLoading,
    refreshComplaints,
  } = useComplaints();

  const [refreshing, setRefreshing] =
    React.useState(false);

  /*
   * =====================================================
   * DYNAMIC METRICS
   * =====================================================
   */

  const totalComplaints = complaints.length;

  const openCount = complaints.filter(
    (complaint) =>
      complaint.status !== 'RESOLVED'
  ).length;

  const unassignedCount = complaints.filter(
    (complaint) =>
      complaint.status === 'REPORTED' &&
      !complaint.assignedTechnicianId
  ).length;

  const highPriorityCount = complaints.filter(
    (complaint) =>
      complaint.priority === 'HIGH' &&
      complaint.status !== 'RESOLVED'
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status === 'RESOLVED'
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) =>
      complaint.status === 'IN_PROGRESS'
  ).length;

  const assignedCount = complaints.filter(
    (complaint) =>
      !!complaint.assignedTechnicianId
  ).length;

  const avgResolutionHours =
    analytics?.avgResolutionHours ?? 0;

  /*
   * =====================================================
   * REFRESH
   * =====================================================
   */

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await refreshComplaints();
    } finally {
      setRefreshing(false);
    }
  };

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
      >
        <LoadingState message="Loading campus overview..." />
      </SafeAreaView>
    );
  }

  /*
   * =====================================================
   * SCREEN
   * =====================================================
   */

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
          />
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View
          style={[
            styles.header,
            {
              borderBottomColor:
                theme.colors.border,
            },
          ]}
        >
          <View style={styles.headerTitleRow}>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.screenTitle,
                  {
                    color:
                      theme.colors.textPrimary,
                  },
                ]}
              >
                Warden Dashboard
              </Text>

              <Text
                style={[
                  styles.screenSubtitle,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                Hostel Facility Oversight
              </Text>
            </View>

            <View
              style={[
                styles.adminBadge,
                {
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Shield
                size={15}
                color={theme.colors.accent}
                strokeWidth={1.8}
              />

              <Text
                style={[
                  styles.adminBadgeText,
                  {
                    color:
                      theme.colors.textPrimary,
                  },
                ]}
              >
                WARDEN
              </Text>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* FACILITY OVERVIEW */}
        {/* ================================================= */}

        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionLabel,
              {
                color:
                  theme.colors.textSecondary,
              },
            ]}
          >
            FACILITY OVERVIEW
          </Text>

          <Text
            style={[
              styles.sectionDescription,
              {
                color:
                  theme.colors.textMuted,
              },
            ]}
          >
            Current maintenance activity across campus
          </Text>
        </View>

        {/* ================================================= */}
        {/* KPI ROW 1 */}
        {/* ================================================= */}

        <View style={styles.statsRow}>
          <StatsCard
            label="TOTAL TICKETS"
            value={totalComplaints}
            color={theme.colors.textPrimary}
            style={styles.statCard}
          />

          <View style={styles.statGap} />

          <StatsCard
            label="OPEN"
            value={openCount}
            color={theme.status.assigned}
            style={styles.statCard}
          />
        </View>

        {/* ================================================= */}
        {/* KPI ROW 2 */}
        {/* ================================================= */}

        <View style={styles.statsRow}>
          <StatsCard
            label="HIGH PRIORITY"
            value={highPriorityCount}
            color={theme.priority.high}
            style={styles.statCard}
          />

          <View style={styles.statGap} />

          <StatsCard
            label="UNASSIGNED"
            value={unassignedCount}
            color={theme.colors.accent}
            style={styles.statCard}
          />
        </View>

        {/* ================================================= */}
        {/* CURRENT STATUS */}
        {/* ================================================= */}

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor:
                theme.colors.cardBackground,
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <View style={styles.statusHeader}>
            <View>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color:
                      theme.colors.textPrimary,
                  },
                ]}
              >
                CURRENT STATUS
              </Text>

              <Text
                style={[
                  styles.cardSubtitle,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                Maintenance activity at a glance
              </Text>
            </View>

            <Clock
              size={21}
              color={theme.colors.accent}
              strokeWidth={1.7}
            />
          </View>

          <View style={styles.statusGrid}>
            {/* IN PROGRESS */}

            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusIcon,
                  {
                    backgroundColor:
                      `${theme.colors.accent}18`,
                  },
                ]}
              >
                <Clock
                  size={17}
                  color={theme.colors.accent}
                  strokeWidth={1.8}
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.statusValue,
                    {
                      color:
                        theme.colors.textPrimary,
                    },
                  ]}
                >
                  {inProgressCount}
                </Text>

                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color:
                        theme.colors.textSecondary,
                    },
                  ]}
                >
                  In Progress
                </Text>
              </View>
            </View>

            {/* RESOLVED */}

            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusIcon,
                  {
                    backgroundColor:
                      `${theme.status.resolved}18`,
                  },
                ]}
              >
                <CheckCircle2
                  size={17}
                  color={theme.status.resolved}
                  strokeWidth={1.8}
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.statusValue,
                    {
                      color:
                        theme.colors.textPrimary,
                    },
                  ]}
                >
                  {resolvedCount}
                </Text>

                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color:
                        theme.colors.textSecondary,
                    },
                  ]}
                >
                  Resolved
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* SERVICE PERFORMANCE */}
        {/* ================================================= */}

        <View
          style={[
            styles.slaCard,
            {
              backgroundColor:
                theme.colors.cardBackground,
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <View style={styles.slaHeader}>
            <View>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color:
                      theme.colors.textPrimary,
                  },
                ]}
              >
                SERVICE PERFORMANCE
              </Text>

              <Text
                style={[
                  styles.cardSubtitle,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                Average resolution time
              </Text>
            </View>

            <AlertTriangle
              size={21}
              color={theme.colors.accent}
              strokeWidth={1.7}
            />
          </View>

          <View style={styles.slaContent}>
            <Text
              style={[
                styles.slaValue,
                {
                  color:
                    avgResolutionHours <= 4
                      ? theme.status.resolved
                      : theme.colors.accent,
                },
              ]}
            >
              {avgResolutionHours}h
            </Text>

            <View style={styles.slaInfo}>
              <Text
                style={[
                  styles.slaLabel,
                  {
                    color:
                      theme.colors.textPrimary,
                  },
                ]}
              >
                Average Resolution
              </Text>

              <Text
                style={[
                  styles.slaTarget,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                Target: 4.0h
              </Text>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* STAFF ALLOCATION */}
        {/* ================================================= */}

        <View
          style={[
            styles.staffCard,
            {
              backgroundColor:
                theme.colors.cardBackground,
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <View style={styles.staffHeader}>
            <View>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color:
                      theme.colors.textPrimary,
                  },
                ]}
              >
                STAFF ALLOCATION
              </Text>

              <Text
                style={[
                  styles.cardSubtitle,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                Technician workload overview
              </Text>
            </View>

            <UserX
              size={21}
              color={theme.colors.accent}
              strokeWidth={1.7}
            />
          </View>

          <View style={styles.staffRow}>
            {/* UNASSIGNED */}

            <View style={styles.staffItem}>
              <Text
                style={[
                  styles.staffNumber,
                  {
                    color:
                      theme.colors.accent,
                  },
                ]}
              >
                {unassignedCount}
              </Text>

              <Text
                style={[
                  styles.staffLabel,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                Awaiting assignment
              </Text>
            </View>

            <View
              style={[
                styles.staffDivider,
                {
                  backgroundColor:
                    theme.colors.borderLight,
                },
              ]}
            />

            {/* ASSIGNED */}

            <View style={styles.staffItem}>
              <Text
                style={[
                  styles.staffNumber,
                  {
                    color:
                      theme.status.resolved,
                  },
                ]}
              >
                {assignedCount}
              </Text>

              <Text
                style={[
                  styles.staffLabel,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                Assigned requests
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/*
 * =====================================================
 * STYLES
 * =====================================================
 */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  /*
   * HEADER
   */

  header: {
    paddingHorizontal:
      Spacing.screenHorizontal,

    paddingTop: 18,
    paddingBottom: 18,

    borderBottomWidth:
      Geometry.borderWidthThin,
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },

  titleContainer: {
    flex: 1,
    marginRight: 12,
  },

  screenTitle: {
    fontFamily: Typography.display,
    fontSize: Typography.sizes.h1,
    letterSpacing: -0.3,
  },

  screenSubtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.caption,

    marginTop: 4,
  },

  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 9,
    paddingVertical: 7,

    borderWidth:
      Geometry.borderWidthThin,
  },

  adminBadgeText: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,

    marginLeft: 5,

    letterSpacing: 0.7,
  },

  /*
   * SECTION HEADER
   */

  sectionHeader: {
    paddingHorizontal:
      Spacing.screenHorizontal,

    paddingTop: 20,
    paddingBottom: 10,
  },

  sectionLabel: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,

    letterSpacing: 1,
  },

  sectionDescription: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.caption,

    marginTop: 4,
  },

  /*
   * STATS
   */

  statsRow: {
    flexDirection: 'row',

    paddingHorizontal:
      Spacing.screenHorizontal,

    marginBottom: 8,
  },

  statCard: {
    flex: 1,
  },

  statGap: {
    width: 8,
  },

  /*
   * CARDS
   */

  statusCard: {
    marginHorizontal:
      Spacing.screenHorizontal,

    marginTop: 14,

    padding: 16,

    borderWidth:
      Geometry.borderWidthThin,
  },

  slaCard: {
    marginHorizontal:
      Spacing.screenHorizontal,

    marginTop: 12,

    padding: 16,

    borderWidth:
      Geometry.borderWidthThin,
  },

  staffCard: {
    marginHorizontal:
      Spacing.screenHorizontal,

    marginTop: 12,

    padding: 16,

    borderWidth:
      Geometry.borderWidthThin,
  },

  /*
   * CARD HEADERS
   */

  statusHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    justifyContent: 'space-between',

    marginBottom: 18,
  },

  slaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    justifyContent: 'space-between',

    marginBottom: 16,
  },

  staffHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    justifyContent: 'space-between',

    marginBottom: 16,
  },

  cardTitle: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.sizes.bodyLarge,

    letterSpacing: 0.1,
  },

  cardSubtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.micro,

    marginTop: 4,
  },

  /*
   * CURRENT STATUS
   */

  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statusItem: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  statusValue: {
    fontFamily: Typography.display,

    fontSize: 25,
    lineHeight: 29,
  },

  statusLabel: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.micro,

    marginTop: 1,
  },

  /*
   * SERVICE PERFORMANCE
   */

  slaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  slaValue: {
    fontFamily: Typography.display,

    fontSize: 40,
    lineHeight: 45,

    marginRight: 16,
  },

  slaInfo: {
    flex: 1,
  },

  slaLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.sizes.caption,
  },

  slaTarget: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.micro,

    marginTop: 4,
  },

  /*
   * STAFF ALLOCATION
   */

  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  staffItem: {
    flex: 1,
  },

  staffNumber: {
    fontFamily: Typography.display,

    fontSize: 30,
    lineHeight: 34,
  },

  staffLabel: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.micro,

    marginTop: 3,

    maxWidth: 130,
  },

  staffDivider: {
    width: 1,
    height: 45,

    marginHorizontal: 22,
  },
});