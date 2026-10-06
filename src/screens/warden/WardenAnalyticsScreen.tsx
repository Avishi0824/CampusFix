import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';
import {
  Typography,
  Spacing,
  Geometry,
} from '../../theme';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';

export const WardenAnalyticsScreen: React.FC = () => {
  const { theme } = useAuth();
  const { analytics, complaints } = useComplaints();

  const total = complaints.length || 1;

  const totalTickets =
    analytics?.totalComplaints || total;

  const resolvedTickets =
    analytics?.resolvedComplaints || 0;

  const avgResolution =
    analytics?.avgResolutionHours || 3.4;

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
        title="Analytics"
        subtitle="Institutional Facility Performance Reports"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================= */}
        {/* KEY METRICS */}
        {/* ============================= */}

        <Text
          style={[
            styles.sectionLabel,
            {
              color: theme.colors.textSecondary,
            },
          ]}
        >
          KEY METRICS
        </Text>

        <View style={styles.kpiRow}>
          {/* Total */}
          <View
            style={[
              styles.kpiCard,
              {
                backgroundColor:
                  theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.kpiLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              TOTAL
            </Text>

            <Text
              style={[
                styles.kpiValue,
                {
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              {totalTickets}
            </Text>

            <Text
              style={[
                styles.kpiHint,
                {
                  color: theme.colors.textMuted,
                },
              ]}
            >
              tickets
            </Text>
          </View>

          {/* Resolved */}
          <View
            style={[
              styles.kpiCard,
              {
                backgroundColor:
                  theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.kpiLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              RESOLVED
            </Text>

            <Text
              style={[
                styles.kpiValue,
                {
                  color: theme.status.resolved,
                },
              ]}
            >
              {resolvedTickets}
            </Text>

            <Text
              style={[
                styles.kpiHint,
                {
                  color: theme.colors.textMuted,
                },
              ]}
            >
              completed
            </Text>
          </View>

          {/* Average Resolution */}
          <View
            style={[
              styles.kpiCard,
              {
                backgroundColor:
                  theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.kpiLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              AVG. TIME
            </Text>

            <Text
              style={[
                styles.kpiValueSmall,
                {
                  color: theme.colors.accent,
                },
              ]}
            >
              {avgResolution}h
            </Text>

            <Text
              style={[
                styles.kpiHint,
                {
                  color: theme.colors.textMuted,
                },
              ]}
            >
              resolution
            </Text>
          </View>
        </View>

        {/* ============================= */}
        {/* CATEGORY BREAKDOWN */}
        {/* ============================= */}

        <Card style={styles.categoryCard}>
          <Text
            style={[
              styles.cardTitle,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            Category breakdown
          </Text>

          <Text
            style={[
              styles.cardSubtitle,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            Tickets by issue type
          </Text>

          <View style={styles.breakdownList}>
            {(analytics?.categoryBreakdown ?? []).map(
              (item) => {
                const barWidth = Math.max(
                  item.percentage,
                  item.count > 0 ? 7 : 0
                );

                let barColor =
                  theme.status.resolved;

                if (item.category === 'PLUMBING') {
                  barColor =
                    theme.status.assigned;
                } else if (
                  item.category === 'ELECTRICAL'
                ) {
                  barColor =
                    theme.colors.accent;
                } else if (
                  item.category === 'FURNITURE'
                ) {
                  barColor =
                    theme.priority.medium;
                }

                return (
                  <View
                    key={item.category}
                    style={styles.barRow}
                  >
                    <View style={styles.barHeader}>
                      <Text
                        style={[
                          styles.barLabel,
                          {
                            color:
                              theme.colors.textPrimary,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>

                      <Text
                        style={[
                          styles.barCount,
                          {
                            color:
                              theme.colors.textSecondary,
                          },
                        ]}
                      >
                        {item.count} · {item.percentage}%
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.progressTrack,
                        {
                          backgroundColor:
                            theme.colors.surfaceSubtle,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${barWidth}%`,
                            backgroundColor: barColor,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              }
            )}
          </View>
        </Card>

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
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
    paddingTop: 18,
    paddingBottom: 32,
  },

  /* ============================= */
  /* SECTION */
  /* ============================= */

  sectionLabel: {
    fontFamily: Typography.monoBold,
    fontSize: 12,
    letterSpacing: 1.4,
    marginBottom: 12,
  },

  /* ============================= */
  /* KPI CARDS */
  /* ============================= */

  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  kpiCard: {
    flex: 1,
    minHeight: 108,

    borderWidth: Geometry.borderWidthThin,

    paddingHorizontal: 14,
    paddingVertical: 14,

    justifyContent: 'space-between',
  },

  kpiLabel: {
    fontFamily: Typography.monoBold,
    fontSize: 10,
    letterSpacing: 1,
  },

  kpiValue: {
    fontFamily: Typography.bodyBold,
    fontSize: 32,
    lineHeight: 36,
    marginTop: 6,
  },

  kpiValueSmall: {
    fontFamily: Typography.bodyBold,
    fontSize: 27,
    lineHeight: 32,
    marginTop: 6,
  },

  kpiHint: {
    fontFamily: Typography.body,
    fontSize: 11,
    marginTop: 2,
  },

  /* ============================= */
  /* CATEGORY CARD */
  /* ============================= */

  categoryCard: {
    padding: 18,
    marginBottom: 10,
  },

  cardTitle: {
    fontFamily: Typography.bodyBold,
    fontSize: 20,
    lineHeight: 25,
  },

  cardSubtitle: {
    fontFamily: Typography.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
    marginBottom: 20,
  },

  breakdownList: {
    gap: 17,
  },

  barRow: {
    width: '100%',
  },

  barHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  barLabel: {
    flex: 1,
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
  },

  barCount: {
    fontFamily: Typography.mono,
    fontSize: 10,
    marginLeft: 12,
  },

  progressTrack: {
    height: 6,
    width: '100%',
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
  },

  bottomSpace: {
    height: 10,
  },
});