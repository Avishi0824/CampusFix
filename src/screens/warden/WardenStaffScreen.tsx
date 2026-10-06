import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Phone,
  LogOut,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';
import { TechnicianStaff } from '../../types';
import {
  Typography,
  Spacing,
  Geometry,
} from '../../theme';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const WardenStaffScreen: React.FC = () => {
  const { theme, logout } = useAuth();
  const { staff } = useComplaints();

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderStaffItem = ({
    item,
  }: {
    item: TechnicianStaff;
  }) => {
    return (
      <Card style={styles.staffCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.staffInfo}>
            <View style={styles.nameRow}>
              <Text
                style={[
                  styles.name,
                  {
                    color: theme.colors.textPrimary,
                  },
                ]}
              >
                {item.name}
              </Text>

              {/* Availability */}
              <View
                style={[
                  styles.statusBadge,
                  {
                    borderColor: item.isAvailable
                      ? theme.status.resolved
                      : theme.colors.textMuted,
                    backgroundColor: item.isAvailable
                      ? '#28382C'
                      : '#2F343C',
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: item.isAvailable
                        ? theme.status.resolved
                        : theme.colors.textMuted,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color: item.isAvailable
                        ? theme.status.resolved
                        : theme.colors.textMuted,
                    },
                  ]}
                >
                  {item.isAvailable
                    ? 'AVAILABLE'
                    : 'OFF DUTY'}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.spec,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              {item.specializationLabel}
            </Text>
          </View>

          {/* Call */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleCall(item.phone)}
            style={[
              styles.callBtn,
              {
                borderColor: theme.colors.border,
                backgroundColor:
                  theme.colors.surfaceSubtle,
              },
            ]}
          >
            <Phone
              size={16}
              color={theme.colors.accent}
            />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                theme.colors.borderLight,
            },
          ]}
        />

        {/* Statistics */}
        <View style={styles.statsRow}>
          {/* Active Load */}
          <View style={styles.statCol}>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              ACTIVE LOAD
            </Text>

            <Text
              style={[
                styles.statVal,
                {
                  color:
                    item.activeTasksCount > 2
                      ? theme.priority.high
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {item.activeTasksCount} Tasks
            </Text>
          </View>

          {/* Lifetime Completed */}
          <View style={styles.statCol}>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              LIFETIME COMPLETED
            </Text>

            <Text
              style={[
                styles.statVal,
                {
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              {item.completedTasksCount}
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.statCol}>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              RATING
            </Text>

            <Text
              style={[
                styles.statVal,
                {
                  color: theme.colors.accent,
                },
              ]}
            >
              ★ {item.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

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
        title="Staff Directory"
        subtitle={`Facility Maintenance Personnel (${staff.length} Technicians)`}
      />

      <FlatList
        data={staff}
        keyExtractor={(item) => item.id}
        renderItem={renderStaffItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            {/* Sign Out Only */}
            <Button
              title="Sign Out of Warden Portal"
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
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },

  staffCard: {
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  staffInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.sizes.bodyLarge,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusSmall,
    marginLeft: 8,
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },

  statusText: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.5,
  },

  spec: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.caption,
    marginTop: 2,
  },

  callBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone,
    marginLeft: 10,
  },

  divider: {
    height: 1,
    marginVertical: 10,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statCol: {
    flex: 1,
  },

  statLabel: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.6,
  },

  statVal: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.sizes.body,
    marginTop: 2,
  },

  footerContainer: {
    marginTop: 20,
  },
});