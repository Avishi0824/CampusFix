import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  MapPin,
  ArrowRight,
  Settings,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';

import {
  Category,
  Complaint,
} from '../../types';

import {
  Typography,
  Spacing,
  Geometry,
} from '../../theme';

import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';

interface MyComplaintsScreenProps {
  navigation: any;
}

export const MyComplaintsScreen: React.FC<
  MyComplaintsScreenProps
> = ({ navigation }) => {
  const { theme } = useAuth();

  const {
    complaints,
    isLoading,
    refreshComplaints,
  } = useComplaints();

  const [selectedStatusTab, setSelectedStatusTab] =
    useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  const [selectedCategory, setSelectedCategory] =
    useState<Category | 'ALL'>('ALL');

  const [refreshing, setRefreshing] =
    useState(false);

  /*
   * =====================================================
   * CATEGORY FILTERS
   * =====================================================
   */

  const categories: (Category | 'ALL')[] = [
    'ALL',
    'PLUMBING',
    'ELECTRICAL',
    'FURNITURE',
    'INTERNET_WIFI',
    'CLEANING',
    'HVAC_AIR',
  ];

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
   * FILTER COMPLAINTS
   * =====================================================
   */

  const studentComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      // Status filter
      if (
        selectedStatusTab === 'ACTIVE' &&
        complaint.status === 'RESOLVED'
      ) {
        return false;
      }

      if (
        selectedStatusTab === 'RESOLVED' &&
        complaint.status !== 'RESOLVED'
      ) {
        return false;
      }

      // Category filter
      if (
        selectedCategory !== 'ALL' &&
        complaint.category !== selectedCategory
      ) {
        return false;
      }

      return true;
    });
  }, [
    complaints,
    selectedStatusTab,
    selectedCategory,
  ]);

  /*
   * =====================================================
   * COMPLAINT CARD
   * =====================================================
   */

  const renderComplaintItem = ({
    item,
  }: {
    item: Complaint;
  }) => {
    const formattedDate =
      new Date(item.createdAt).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
        }
      );

    return (
      <Card
        onPress={() =>
          navigation.navigate('ComplaintDetail', {
            complaintId: item.id,
          })
        }
        style={styles.complaintCard}
      >
        {/* Ticket Header */}

        <View style={styles.cardHeader}>
          <View style={styles.ticketRow}>
            <Text
              style={[
                styles.ticketNumber,
                {
                  color: theme.colors.accent,
                },
              ]}
            >
              {item.ticketNumber}
            </Text>

            <View style={styles.dotSeparator} />

            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              {item.category.replace('_', ' ')}
            </Text>
          </View>

          <Text
            style={[
              styles.dateText,
              {
                color: theme.colors.textMuted,
              },
            ]}
          >
            {formattedDate}
          </Text>
        </View>

        {/* Complaint Title */}

        <Text
          style={[
            styles.complaintTitle,
            {
              color: theme.colors.textPrimary,
            },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Location */}

        <View style={styles.locationRow}>
          <MapPin
            size={15}
            color={theme.colors.textSecondary}
            strokeWidth={1.8}
          />

          <Text
            style={[
              styles.locationText,
              {
                color:
                  theme.colors.textSecondary,
              },
            ]}
            numberOfLines={1}
          >
            {item.location}
          </Text>
        </View>

        {/* Footer */}

        <View
          style={[
            styles.cardFooter,
            {
              borderTopColor:
                theme.colors.borderLight,
            },
          ]}
        >
          <View style={styles.badgeRow}>
            <StatusBadge
              status={item.status}
              size="small"
            />

            <View style={styles.badgeGap} />

            <PriorityBadge
              priority={item.priority}
              size="small"
            />
          </View>

          <View style={styles.viewRow}>
            <Text
              style={[
                styles.viewDetailsText,
                {
                  color:
                    theme.colors.textPrimary,
                },
              ]}
            >
              DETAILS
            </Text>

            <ArrowRight
              size={14}
              color={theme.colors.textPrimary}
              style={styles.arrow}
            />
          </View>
        </View>
      </Card>
    );
  };

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
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <View
        style={[
          styles.headerContainer,
          {
            borderBottomColor:
              theme.colors.border,
          },
        ]}
      >
        {/* Title + Settings */}

        <View style={styles.headerTop}>
          <View style={styles.headerTextContainer}>
            <Text
              style={[
                styles.screenTitle,
                {
                  color:
                    theme.colors.textPrimary,
                },
              ]}
            >
              My Complaints
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
              Hostel Block B • Room 304
            </Text>
          </View>

          {/* Settings */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.settingsButton,
              {
                backgroundColor:
                  theme.colors.surfaceSubtle,
                borderColor:
                  theme.colors.border,
              },
            ]}
            accessibilityLabel="Settings"
          >
            <Settings
              size={22}
              color={theme.colors.textSecondary}
              strokeWidth={1.8}
            />
          </TouchableOpacity>
        </View>

        {/* Status Tabs */}

        <View style={styles.statusTabs}>
          {(
            [
              'ALL',
              'ACTIVE',
              'RESOLVED',
            ] as const
          ).map((tab) => {
            const isActive =
              selectedStatusTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.75}
                onPress={() =>
                  setSelectedStatusTab(tab)
                }
                style={[
                  styles.tabButton,
                  {
                    borderBottomColor: isActive
                      ? theme.colors.accent
                      : 'transparent',

                    borderBottomWidth:
                      isActive ? 2 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive
                        ? theme.colors.accent
                        : theme.colors.textSecondary,

                      fontFamily: isActive
                        ? Typography.bodyBold
                        : Typography.bodyMedium,
                    },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ================================================= */}
      {/* CATEGORY FILTER */}
      {/* ================================================= */}

      <View
        style={[
          styles.categoryScrollContainer,
          {
            borderBottomColor:
              theme.colors.borderLight,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.categoryScrollContent
          }
        >
          {categories.map((category) => {
            const isSelected =
              selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.75}
                onPress={() =>
                  setSelectedCategory(category)
                }
                style={[
                  styles.categoryChip,
                  {
                    borderColor: isSelected
                      ? theme.colors.accent
                      : theme.colors.border,

                    backgroundColor:
                      theme.colors.surface,

                    borderWidth: isSelected
                      ? 1.5
                      : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: isSelected
                        ? theme.colors.accent
                        : theme.colors.textSecondary,

                      fontFamily: isSelected
                        ? Typography.bodySemiBold
                        : Typography.bodyMedium,
                    },
                  ]}
                >
                  {category === 'ALL'
                    ? 'All'
                    : category.replace(
                      '_',
                      ' '
                    )}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ================================================= */}
      {/* COMPLAINT LIST */}
      {/* ================================================= */}

      {isLoading && !refreshing ? (
        <LoadingState
          message="Loading your complaints history..."
        />
      ) : (
        <FlatList
          data={studentComplaints}
          keyExtractor={(item) => item.id}
          renderItem={renderComplaintItem}
          contentContainerStyle={
            styles.listContent
          }
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
              title="No Complaints Found"
              description={
                selectedStatusTab === 'ACTIVE'
                  ? 'You do not have any active maintenance issues right now.'
                  : selectedStatusTab ===
                    'RESOLVED'
                    ? 'You do not have any resolved complaints yet.'
                    : 'No complaints match your selected filters.'
              }
              actionTitle="Report a New Issue"
              onAction={() =>
                navigation.navigate(
                  'ReportIssue'
                )
              }
            />
          }
        />
      )}
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

  /*
   * HEADER
   */

  headerContainer: {
    paddingHorizontal:
      Spacing.screenHorizontal,

    paddingTop: 18,

    borderBottomWidth:
      Geometry.borderWidthThin,
  },

  headerTop: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',
  },

  headerTextContainer: {
    flex: 1,

    paddingRight: 14,
  },

  screenTitle: {
    fontFamily: Typography.display,

    fontSize:
      Typography.sizes.h1,

    lineHeight:
      Typography.lineHeights.h1,

    letterSpacing: -0.4,
  },

  screenSubtitle: {
    fontFamily: Typography.body,

    fontSize:
      Typography.sizes.bodyLarge,

    lineHeight:
      Typography.lineHeights.bodyLarge,

    marginTop: 5,
  },

  /*
   * SETTINGS
   */

  settingsButton: {
    width: 46,
    height: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth:
      Geometry.borderWidthThin,

    borderRadius:
      Geometry.radiusPill,

    marginTop: 1,
  },

  /*
   * STATUS TABS
   */

  statusTabs: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 28,

    marginTop: 20,
  },

  tabButton: {
    minHeight: 42,

    paddingHorizontal: 2,

    paddingVertical: 10,

    justifyContent: 'center',
  },

  tabText: {
    fontSize:
      Typography.sizes.caption,

    letterSpacing: 0.7,
  },

  /*
   * CATEGORY FILTER
   */

  categoryScrollContainer: {
    paddingVertical: 10,

    borderBottomWidth:
      Geometry.borderWidthThin,
  },

  categoryScrollContent: {
    paddingHorizontal:
      Spacing.screenHorizontal,

    gap: 8,
  },

  categoryChip: {
    minHeight: 38,

    paddingHorizontal: 14,

    paddingVertical: 8,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius:
      Geometry.radiusSmall,
  },

  categoryChipText: {
    fontSize:
      Typography.sizes.caption,

    lineHeight: 17,
  },

  /*
   * COMPLAINT LIST
   */

  listContent: {
    paddingHorizontal:
      Spacing.screenHorizontal,

    paddingTop: 16,

    paddingBottom: 32,

    flexGrow: 1,
  },

  complaintCard: {
    marginBottom: 12,
  },

  /*
   * CARD HEADER
   */

  cardHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 8,
  },

  ticketRow: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  ticketNumber: {
    fontFamily:
      Typography.monoBold,

    fontSize:
      Typography.sizes.caption,

    letterSpacing: 0.5,
  },

  dotSeparator: {
    width: 3,
    height: 3,

    borderRadius: 1.5,

    backgroundColor:
      '#7F8998',

    marginHorizontal: 7,
  },

  categoryText: {
    fontFamily:
      Typography.mono,

    fontSize:
      Typography.sizes.micro,

    letterSpacing: 0.5,
  },

  dateText: {
    fontFamily:
      Typography.mono,

    fontSize:
      Typography.sizes.micro,

    marginLeft: 8,
  },

  /*
   * COMPLAINT TITLE
   */

  complaintTitle: {
    fontFamily:
      Typography.bodySemiBold,

    fontSize:
      Typography.sizes.bodyLarge,

    lineHeight: 22,

    marginBottom: 9,
  },

  /*
   * LOCATION
   */

  locationRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 13,
  },

  locationText: {
    flex: 1,

    fontFamily:
      Typography.body,

    fontSize:
      Typography.sizes.caption,

    lineHeight: 18,

    marginLeft: 6,
  },

  /*
   * CARD FOOTER
   */

  cardFooter: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingTop: 11,

    borderTopWidth:
      Geometry.borderWidthThin,
  },

  badgeRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  badgeGap: {
    width: 8,
  },

  viewRow: {
    flexDirection: 'row',

    alignItems: 'center',

    minHeight: 32,

    paddingHorizontal: 4,
  },

  viewDetailsText: {
    fontFamily:
      Typography.bodySemiBold,

    fontSize:
      Typography.sizes.micro,

    letterSpacing: 0.6,
  },

  arrow: {
    marginLeft: 4,
  },
});