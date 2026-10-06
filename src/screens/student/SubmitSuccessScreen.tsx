import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  Home,
  Clock,
  FileText,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { Complaint } from '../../types';
import {
  Typography,
  Spacing,
  Geometry,
} from '../../theme';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';

interface SubmitSuccessScreenProps {
  route: {
    params: {
      complaint: Complaint;
    };
  };
  navigation: any;
}

export const SubmitSuccessScreen: React.FC<
  SubmitSuccessScreenProps
> = ({ route, navigation }) => {
  const { theme } = useAuth();

  const { complaint } = route.params;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* SUCCESS HEADER */}
        <View style={styles.headerBlock}>
          <View
            style={[
              styles.iconWrapper,
              {
                borderColor: theme.colors.accent,
              },
            ]}
          >
            <CheckCircle2
              size={44}
              color={theme.colors.accent}
              strokeWidth={1.8}
            />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            Complaint Registered
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            Your maintenance request has been submitted
            to the facility management department.
          </Text>
        </View>

        {/* TICKET SUMMARY */}
        <Card style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.ticketLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              REFERENCE TICKET NUMBER
            </Text>

            <Text
              style={[
                styles.ticketNumber,
                {
                  color: theme.colors.accent,
                },
              ]}
            >
              {complaint.ticketNumber}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: theme.colors.borderLight,
              },
            ]}
          />

          {/* ISSUE TITLE */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              ISSUE TITLE
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              {complaint.title}
            </Text>
          </View>

          {/* LOCATION */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              LOCATION
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              {complaint.location}
            </Text>
          </View>

          {/* STATUS + PRIORITY */}
          <View style={styles.badgeRow}>
            <StatusBadge
              status={complaint.status}
              size="small"
            />

            <View style={styles.badgeGap} />

            <PriorityBadge
              priority={complaint.priority}
              size="small"
            />
          </View>

          {/* SLA NOTICE */}
          <View
            style={[
              styles.slaNotice,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Clock
              size={16}
              color={theme.colors.accent}
              strokeWidth={1.8}
            />

            <Text
              style={[
                styles.slaText,
                {
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              ESTIMATED WARDEN TRIAGE: WITHIN 2 HOURS
            </Text>
          </View>
        </Card>

        {/* ACTIONS */}
        <View style={styles.actionContainer}>
          <Button
            title="View Ticket Details & Timeline"
            onPress={() =>
              navigation.replace('ComplaintDetail', {
                complaintId: complaint.id,
              })
            }
            variant="primary"
            fullWidth
            icon={
              <FileText
                size={16}
                color="#FFFFFF"
                strokeWidth={1.8}
              />
            }
            style={styles.primaryBtn}
          />

          <Button
            title="Return to My Complaints"
            onPress={() =>
              navigation.navigate('StudentTabs', {
                screen: 'MyComplaints',
              })
            }
            variant="outline"
            fullWidth
            icon={
              <Home
                size={16}
                color={theme.colors.textPrimary}
                strokeWidth={1.8}
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

  container: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },

  headerBlock: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
  },

  iconWrapper: {
    width: 72,
    height: 72,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  title: {
    fontFamily: Typography.display,
    fontSize: Typography.sizes.h1,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.body,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },

  summaryCard: {
    width: '100%',
    marginBottom: 24,
  },

  cardHeader: {
    marginBottom: 12,
  },

  ticketLabel: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.8,
  },

  ticketNumber: {
    fontFamily: Typography.display,
    fontSize: Typography.sizes.h1,
    marginTop: 2,
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  detailRow: {
    marginBottom: 10,
  },

  detailLabel: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.8,
  },

  detailValue: {
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.sizes.body,
    marginTop: 2,
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },

  badgeGap: {
    width: 8,
  },

  slaNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone,
  },

  slaText: {
    flex: 1,
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.5,
    marginLeft: 8,
  },

  actionContainer: {
    width: '100%',
    gap: 12,
  },

  primaryBtn: {
    marginBottom: 4,
  },
});