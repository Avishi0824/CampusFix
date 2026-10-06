import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Wrench,
  CheckCircle,
  Clock,
  MapPin,
  ArrowRight,
  Play,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';
import { Complaint, ComplaintStatus } from '../../types';
import { Typography, Spacing, Geometry, DarkTheme } from '../../theme';
import { Card } from '../../components/Card';
import { StatsCard } from '../../components/StatsCard';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';

interface TaskQueueScreenProps {
  navigation: any;
}

export const TaskQueueScreen: React.FC<TaskQueueScreenProps> = ({ navigation }) => {
  const { user, theme } = useAuth();
  const { complaints, updateStatus, isLoading, refreshComplaints } = useComplaints();

  const [selectedTab, setSelectedTab] = useState<'ALL' | 'IN_PROGRESS' | 'HIGH' | 'RESOLVED'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshComplaints();
    setRefreshing(false);
  };

  // Technician tasks
  const techTasks = useMemo(() => {
    return complaints.filter((c) => {
      // Filter by tab
      if (selectedTab === 'IN_PROGRESS') return c.status === 'IN_PROGRESS';
      if (selectedTab === 'HIGH') return c.priority === 'HIGH' && c.status !== 'RESOLVED';
      if (selectedTab === 'RESOLVED') return c.status === 'RESOLVED';
      return true; // ALL
    });
  }, [complaints, selectedTab]);

  // Metrics
  const assignedCount = complaints.filter((c) => c.status === 'ASSIGNED').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  const handleStartWork = async (complaintId: string) => {
    await updateStatus(complaintId, 'IN_PROGRESS', 'Technician commenced on-site repair.');
  };

  const renderTaskCard = ({ item }: { item: Complaint }) => {
    const isHighPriority = item.priority === 'HIGH';

    return (
      <Card
        onPress={() => navigation.navigate('TaskDetail', { complaintId: item.id })}
        highlighted={isHighPriority && item.status !== 'RESOLVED'}
        highlightColor={theme.priority.high}
        style={styles.taskCard}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.ticketRow}>
            <Text style={[styles.ticketNumber, { color: theme.colors.accent }]}>
              {item.ticketNumber}
            </Text>
            <View style={styles.dotSeparator} />
            <Text style={[styles.categoryLabel, { color: theme.colors.textSecondary }]}>
              {item.category.replace('_', ' ')}
            </Text>
          </View>
          <StatusBadge status={item.status} size="small" />
        </View>

        {/* Title */}
        <Text style={[styles.taskTitle, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Location & Resident */}
        <View style={styles.metaBox}>
          <View style={styles.metaRow}>
            <MapPin size={13} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <Text style={[styles.studentText, { color: theme.colors.textMuted }]}>
            RESIDENT: {item.studentName.toUpperCase()}
          </Text>
        </View>

        {/* Bottom Actions Row */}
        <View style={[styles.cardFooter, { borderTopColor: theme.colors.borderLight }]}>
          <PriorityBadge priority={item.priority} size="small" />

          <View style={styles.actionButtonsRow}>
            {item.status === 'ASSIGNED' && (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => handleStartWork(item.id)}
                style={[
                  styles.quickActionBtn,
                  {
                    backgroundColor: theme.colors.accent,
                    borderColor: theme.colors.accent,
                  },
                ]}
              >
                <Play size={11} color="#FFFFFF" />
                <Text style={styles.quickActionText}>START WORK</Text>
              </TouchableOpacity>
            )}

            {item.status === 'IN_PROGRESS' && (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.navigate('TaskDetail', { complaintId: item.id })}
                style={[
                  styles.quickActionBtn,
                  {
                    backgroundColor: theme.status.resolved,
                    borderColor: theme.status.resolved,
                  },
                ]}
              >
                <CheckCheck size={12} color="#FFFFFF" />
                <Text style={styles.quickActionText}>RESOLVE</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => navigation.navigate('TaskDetail', { complaintId: item.id })}
              style={[
                styles.detailsLink,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surfaceSubtle,
                },
              ]}
            >
              <Text style={[styles.detailsLinkText, { color: theme.colors.textPrimary }]}>
                INSPECT
              </Text>
              <ArrowRight size={11} color={theme.colors.textPrimary} style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Editorial Header (Figma 1:809) */}
      <View style={[styles.headerContainer, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
              Task Queue
            </Text>
            <Text style={[styles.screenSubtitle, { color: theme.colors.textSecondary }]}>
              {user?.name || 'Rajesh Kumar'} • Plumbing & Facilities
            </Text>
          </View>

          <View style={[styles.statusIndicator, { borderColor: theme.colors.border }]}>
            <View style={[styles.liveDot, { backgroundColor: theme.colors.accent }]} />
            <Text style={[styles.liveText, { color: theme.colors.textPrimary }]}>
              ON DUTY
            </Text>
          </View>
        </View>

        {/* Metric Summary Cards */}
        <View style={styles.statsRow}>
          <StatsCard
            label="ASSIGNED"
            value={assignedCount}
            color={theme.status.assigned}
          />
          <View style={{ width: 8 }} />
          <StatsCard
            label="IN PROGRESS"
            value={inProgressCount}
            color={theme.status.inProgress}
          />
          <View style={{ width: 8 }} />
          <StatsCard
            label="RESOLVED"
            value={resolvedCount}
            color={theme.status.resolved}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['ALL', 'IN_PROGRESS', 'HIGH', 'RESOLVED'] as const).map((tab) => {
            const isActive = selectedTab === tab;
            const labels: Record<string, string> = {
              ALL: 'ALL TASKS',
              IN_PROGRESS: 'IN PROGRESS',
              HIGH: 'HIGH PRIORITY',
              RESOLVED: 'RESOLVED',
            };

            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.75}
                onPress={() => setSelectedTab(tab)}
                style={[
                  styles.tabButton,
                  {
                    borderBottomColor: isActive ? theme.colors.accent : 'transparent',
                    borderBottomWidth: isActive ? 2 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? theme.colors.accent : theme.colors.textSecondary,
                      fontFamily: isActive ? Typography.monoBold : Typography.mono,
                    },
                  ]}
                >
                  {labels[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Task Queue List */}
      {isLoading && !refreshing ? (
        <LoadingState message="Fetching active work orders..." />
      ) : (
        <FlatList
          data={techTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.accent}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Tasks in Queue"
              description="You have completed all pending work orders in this filter."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    borderBottomWidth: Geometry.borderWidthThin,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  screenTitle: {
    fontFamily: Typography.display,
    fontSize: Typography.sizes.h1,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.caption,
    marginTop: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  liveText: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 16,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  tabText: {
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.8,
  },
  listContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 14,
    paddingBottom: 32,
  },
  taskCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketNumber: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.caption,
    letterSpacing: 0.5,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9EA3AD',
    marginHorizontal: 6,
  },
  categoryLabel: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.5,
  },
  taskTitle: {
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.sizes.bodyLarge,
    lineHeight: 22,
    marginBottom: 8,
  },
  metaBox: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.caption,
    marginLeft: 5,
  },
  studentText: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: Geometry.borderWidthThin,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone,
  },
  quickActionText: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    color: '#FFFFFF',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone,
  },
  detailsLinkText: {
    fontFamily: Typography.monoBold,
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.5,
  },
});
