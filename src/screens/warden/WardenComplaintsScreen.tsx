import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Search,
  MapPin,
  ArrowRight,
  UserPlus,
  X,
  SlidersHorizontal,
  Check,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';

import {
  Category,
  Complaint,
  ComplaintStatus,
  Priority,
} from '../../types';

import {
  Typography,
  Spacing,
  Geometry,
} from '../../theme';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { AssignmentModal } from '../../components/AssignmentModal';

interface WardenComplaintsScreenProps {
  navigation: any;
}

export const WardenComplaintsScreen: React.FC<
  WardenComplaintsScreenProps
> = ({ navigation }) => {
  const { theme } = useAuth();

  const {
    complaints,
    staff,
    assignTechnician,
    isLoading,
    refreshComplaints,
  } = useComplaints();

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] =
    useState<Category | 'ALL'>('ALL');

  const [selectedStatus, setSelectedStatus] =
    useState<ComplaintStatus | 'ALL'>('ALL');

  const [filterVisible, setFilterVisible] =
    useState(false);

  const [assignModalVisible, setAssignModalVisible] =
    useState(false);

  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  /*
   * ----------------------------------------------------
   * FILTER OPTIONS
   * ----------------------------------------------------
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

  const statuses: (ComplaintStatus | 'ALL')[] = [
    'ALL',
    'REPORTED',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
  ];

  /*
   * ----------------------------------------------------
   * HELPERS
   * ----------------------------------------------------
   */

  const formatLabel = (value: string) => {
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatCategory = (value: string) => {
    return value.replace(/_/g, ' ');
  };

  /*
   * ----------------------------------------------------
   * REFRESH
   * ----------------------------------------------------
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
   * ----------------------------------------------------
   * FILTER COMPLAINTS
   * ----------------------------------------------------
   */

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();

        const matchTitle =
          complaint.title?.toLowerCase().includes(query);

        const matchTicket =
          complaint.ticketNumber
            ?.toLowerCase()
            .includes(query);

        const matchStudent =
          complaint.studentName
            ?.toLowerCase()
            .includes(query);

        const matchLocation =
          complaint.location
            ?.toLowerCase()
            .includes(query);

        const matchCategory =
          complaint.category
            ?.toLowerCase()
            .includes(query);

        if (
          !matchTitle &&
          !matchTicket &&
          !matchStudent &&
          !matchLocation &&
          !matchCategory
        ) {
          return false;
        }
      }

      if (
        selectedCategory !== 'ALL' &&
        complaint.category !== selectedCategory
      ) {
        return false;
      }

      if (
        selectedStatus !== 'ALL' &&
        complaint.status !== selectedStatus
      ) {
        return false;
      }

      return true;
    });
  }, [
    complaints,
    searchQuery,
    selectedCategory,
    selectedStatus,
  ]);

  /*
   * ----------------------------------------------------
   * ACTIVE FILTER
   * ----------------------------------------------------
   */

  const activeFilterCount =
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (selectedStatus !== 'ALL' ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
  };

  /*
   * ----------------------------------------------------
   * ASSIGNMENT
   * ----------------------------------------------------
   */

  const openAssignModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setAssignModalVisible(true);
  };

  const handleConfirmAssign = async (
    techId: string,
    priorityOverride: Priority
  ) => {
    if (!selectedComplaint) return;

    await assignTechnician(
      selectedComplaint.id,
      techId,
      priorityOverride
    );

    setAssignModalVisible(false);
    setSelectedComplaint(null);
  };

  /*
   * ----------------------------------------------------
   * COMPLAINT CARD
   * ----------------------------------------------------
   */

  const renderItem = ({
    item,
  }: {
    item: Complaint;
  }) => {
    return (
      <Card
        onPress={() =>
          navigation.navigate('WardenDetail', {
            complaintId: item.id,
          })
        }
        style={styles.complaintCard}
      >
        {/* Ticket Header */}

        <View style={styles.cardHeader}>
          <View style={styles.ticketInfo}>
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

            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    theme.colors.textMuted,
                },
              ]}
            />

            <Text
              style={[
                styles.category,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
              numberOfLines={1}
            >
              {formatCategory(item.category)}
            </Text>
          </View>

          <StatusBadge
            status={item.status}
            size="small"
          />
        </View>

        {/* Title */}

        <Text
          style={[
            styles.title,
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
            size={14}
            color={theme.colors.textSecondary}
            strokeWidth={1.8}
          />

          <Text
            style={[
              styles.location,
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

        {/* Student */}

        <Text
          style={[
            styles.student,
            {
              color: theme.colors.textMuted,
            },
          ]}
          numberOfLines={1}
        >
          {item.studentName}
        </Text>

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

        {/* Footer */}

        <View style={styles.cardFooter}>
          <PriorityBadge
            priority={item.priority}
            size="small"
          />

          <View style={styles.actions}>
            {item.assignedTechnicianName ? (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  openAssignModal(item)
                }
                style={[
                  styles.staffButton,
                  {
                    borderColor:
                      theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.staffText,
                    {
                      color:
                        theme.colors.textSecondary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.assignedTechnicianName}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  openAssignModal(item)
                }
                style={[
                  styles.assignButton,
                  {
                    backgroundColor:
                      theme.colors.accent,
                  },
                ]}
              >
                <UserPlus
                  size={14}
                  color="#FFFFFF"
                  strokeWidth={2}
                />

                <Text style={styles.assignText}>
                  ASSIGN
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate(
                  'WardenDetail',
                  {
                    complaintId: item.id,
                  }
                )
              }
              style={[
                styles.viewButton,
                {
                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.viewText,
                  {
                    color:
                      theme.colors.textPrimary,
                  },
                ]}
              >
                VIEW
              </Text>

              <ArrowRight
                size={14}
                color={theme.colors.textPrimary}
                strokeWidth={1.8}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  /*
   * ----------------------------------------------------
   * SCREEN
   * ----------------------------------------------------
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
    >
      {/* Header */}

      <ScreenHeader
        title="All Complaints"
        subtitle="Campus Maintenance Directory"
      />

      {/* Search */}

      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBox,
            {
              borderColor: theme.colors.border,
              backgroundColor:
                theme.colors.surfaceSubtle,
            },
          ]}
        >
          <Search
            size={19}
            color={theme.colors.textMuted}
            strokeWidth={1.8}
          />

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search ticket, resident, room..."
            placeholderTextColor={
              theme.colors.textMuted
            }
            style={[
              styles.searchInput,
              {
                color:
                  theme.colors.textPrimary,
              },
            ]}
            autoCorrect={false}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={8}
            >
              <X
                size={17}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Single Filter Control */}

      <View style={styles.filterBar}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setFilterVisible(true)}
          style={[
            styles.filterButton,
            {
              borderColor:
                activeFilterCount > 0
                  ? theme.colors.accent
                  : theme.colors.border,

              backgroundColor:
                activeFilterCount > 0
                  ? `${theme.colors.accent}18`
                  : theme.colors.surfaceSubtle,
            },
          ]}
        >
          <SlidersHorizontal
            size={16}
            color={
              activeFilterCount > 0
                ? theme.colors.accent
                : theme.colors.textSecondary
            }
            strokeWidth={1.8}
          />

          <Text
            style={[
              styles.filterButtonText,
              {
                color:
                  activeFilterCount > 0
                    ? theme.colors.accent
                    : theme.colors.textSecondary,
              },
            ]}
          >
            FILTER
          </Text>

          {activeFilterCount > 0 && (
            <View
              style={[
                styles.filterCount,
                {
                  backgroundColor:
                    theme.colors.accent,
                },
              ]}
            >
              <Text style={styles.filterCountText}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.resultCount,
            {
              color: theme.colors.textMuted,
            },
          ]}
        >
          {filteredComplaints.length}{' '}
          {filteredComplaints.length === 1
            ? 'result'
            : 'results'}
        </Text>
      </View>

      {/* Complaint List */}

      {isLoading && !refreshing ? (
        <LoadingState message="Loading maintenance records..." />
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            filteredComplaints.length === 0 &&
            styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.accent}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title={
                complaints.length === 0
                  ? 'No Complaints Yet'
                  : 'No Matching Complaints'
              }
              description={
                complaints.length === 0
                  ? 'New student maintenance requests will appear here.'
                  : 'Try changing your search or filters.'
              }
            />
          }
        />
      )}

      {/* ================================================= */}
      {/* FILTER MODAL */}
      {/* ================================================= */}

      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setFilterVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.filterModal,
              {
                backgroundColor:
                  theme.colors.cardBackground,
                borderColor:
                  theme.colors.border,
              },
            ]}
          >
            {/* Modal Header */}

            <View style={styles.modalHeader}>
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        theme.colors.textPrimary,
                    },
                  ]}
                >
                  Filter complaints
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    {
                      color:
                        theme.colors.textSecondary,
                    },
                  ]}
                >
                  Refine the maintenance list
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setFilterVisible(false)
                }
                style={[
                  styles.closeButton,
                  {
                    borderColor:
                      theme.colors.border,
                  },
                ]}
              >
                <X
                  size={18}
                  color={
                    theme.colors.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Category */}

            <Text
              style={[
                styles.modalSectionLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              CATEGORY
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.modalChipRow
              }
            >
              {categories.map((category) => {
                const selected =
                  selectedCategory === category;

                return (
                  <TouchableOpacity
                    key={category}
                    activeOpacity={0.75}
                    onPress={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    style={[
                      styles.modalChip,
                      {
                        borderColor: selected
                          ? theme.colors.accent
                          : theme.colors.border,

                        backgroundColor: selected
                          ? `${theme.colors.accent}18`
                          : 'transparent',
                      },
                    ]}
                  >
                    {selected && (
                      <Check
                        size={13}
                        color={
                          theme.colors.accent
                        }
                        strokeWidth={2.2}
                      />
                    )}

                    <Text
                      style={[
                        styles.modalChipText,
                        {
                          color: selected
                            ? theme.colors.accent
                            : theme.colors
                              .textSecondary,
                        },
                      ]}
                    >
                      {category === 'ALL'
                        ? 'All Issues'
                        : formatCategory(
                          category
                        )}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Status */}

            <Text
              style={[
                styles.modalSectionLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              STATUS
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.modalChipRow
              }
            >
              {statuses.map((status) => {
                const selected =
                  selectedStatus === status;

                return (
                  <TouchableOpacity
                    key={status}
                    activeOpacity={0.75}
                    onPress={() =>
                      setSelectedStatus(status)
                    }
                    style={[
                      styles.modalChip,
                      {
                        borderColor: selected
                          ? theme.colors.accent
                          : theme.colors.border,

                        backgroundColor: selected
                          ? `${theme.colors.accent}18`
                          : 'transparent',
                      },
                    ]}
                  >
                    {selected && (
                      <Check
                        size={13}
                        color={
                          theme.colors.accent
                        }
                        strokeWidth={2.2}
                      />
                    )}

                    <Text
                      style={[
                        styles.modalChipText,
                        {
                          color: selected
                            ? theme.colors.accent
                            : theme.colors
                              .textSecondary,
                        },
                      ]}
                    >
                      {status === 'ALL'
                        ? 'All Status'
                        : formatLabel(status)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Bottom Actions */}

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={clearFilters}
                style={[
                  styles.resetButton,
                  {
                    borderColor:
                      theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.resetText,
                    {
                      color:
                        theme.colors.textSecondary,
                    },
                  ]}
                >
                  Reset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setFilterVisible(false)
                }
                style={[
                  styles.applyButton,
                  {
                    backgroundColor:
                      theme.colors.accent,
                  },
                ]}
              >
                <Text style={styles.applyText}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================================================= */}
      {/* ASSIGNMENT MODAL */}
      {/* ================================================= */}

      <AssignmentModal
        visible={assignModalVisible}
        complaint={selectedComplaint}
        staff={staff}
        onClose={() => {
          setAssignModalVisible(false);
          setSelectedComplaint(null);
        }}
        onAssign={handleConfirmAssign}
      />
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
   * SEARCH
   */

  searchSection: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 14,
    paddingBottom: 10,
  },

  searchBox: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,

    borderWidth: 1,
  },

  searchInput: {
    flex: 1,

    marginLeft: 9,
    marginRight: 8,

    fontFamily: Typography.body,
    fontSize: 14,

    paddingVertical: 0,
  },

  /*
   * FILTER BAR
   */

  filterBar: {
    minHeight: 50,

    paddingHorizontal:
      Spacing.screenHorizontal,

    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 2,
  },

  filterButton: {
    minHeight: 38,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,

    borderWidth: 1,
    borderRadius: 19,
  },

  filterButtonText: {
    fontFamily: Typography.monoBold,
    fontSize: 11,
    letterSpacing: 0.8,

    marginLeft: 7,
  },

  filterCount: {
    width: 18,
    height: 18,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 9,

    marginLeft: 7,
  },

  filterCountText: {
    color: '#FFFFFF',

    fontFamily: Typography.monoBold,
    fontSize: 9,
  },

  resultCount: {
    fontFamily: Typography.mono,
    fontSize: 11,
  },

  /*
   * LIST
   */

  listContent: {
    paddingHorizontal:
      Spacing.screenHorizontal,

    paddingTop: 8,
    paddingBottom: 32,
  },

  emptyList: {
    flexGrow: 1,
  },

  /*
   * COMPLAINT CARD
   */

  complaintCard: {
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 8,
  },

  ticketInfo: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',

    marginRight: 8,
  },

  ticketNumber: {
    fontFamily: Typography.monoBold,
    fontSize: 13,
    letterSpacing: 0.5,
  },

  dot: {
    width: 3,
    height: 3,

    borderRadius: 2,

    marginHorizontal: 7,
  },

  category: {
    flexShrink: 1,

    fontFamily: Typography.mono,
    fontSize: 10,

    letterSpacing: 0.5,
  },

  title: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 17,
    lineHeight: 23,

    marginBottom: 10,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 5,
  },

  location: {
    flex: 1,

    marginLeft: 6,

    fontFamily: Typography.body,
    fontSize: 13,
  },

  student: {
    fontFamily: Typography.mono,
    fontSize: 10,

    letterSpacing: 0.4,

    textTransform: 'uppercase',
  },

  divider: {
    height: 1,

    marginTop: 12,
    marginBottom: 10,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },

  actions: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'flex-end',

    gap: 7,

    marginLeft: 10,
  },

  staffButton: {
    maxWidth: 125,
    minHeight: 38,

    paddingHorizontal: 9,

    justifyContent: 'center',

    borderWidth: 1,
  },

  staffText: {
    fontFamily: Typography.mono,
    fontSize: 10,
  },

  assignButton: {
    minHeight: 38,

    paddingHorizontal: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  assignText: {
    marginLeft: 5,

    color: '#FFFFFF',

    fontFamily: Typography.monoBold,
    fontSize: 10,

    letterSpacing: 0.6,
  },

  viewButton: {
    minHeight: 38,

    paddingHorizontal: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
  },

  viewText: {
    fontFamily: Typography.monoBold,
    fontSize: 10,

    letterSpacing: 0.6,

    marginRight: 4,
  },

  /*
   * FILTER MODAL
   */

  modalOverlay: {
    flex: 1,

    justifyContent: 'flex-end',

    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  filterModal: {
    borderTopWidth: 1,

    paddingHorizontal:
      Spacing.screenHorizontal,

    paddingTop: 20,
    paddingBottom: 28,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 24,
  },

  modalTitle: {
    fontFamily: Typography.bodyBold,
    fontSize: 21,
  },

  modalSubtitle: {
    fontFamily: Typography.body,
    fontSize: 12,

    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
  },

  modalSectionLabel: {
    fontFamily: Typography.monoBold,
    fontSize: 11,

    letterSpacing: 1.1,

    marginBottom: 9,
  },

  modalChipRow: {
    gap: 8,

    paddingBottom: 4,
  },

  modalChip: {
    minHeight: 36,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 12,

    borderWidth: 1,
    borderRadius: 18,
  },

  modalChipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,

    marginLeft: 4,
  },

  modalActions: {
    flexDirection: 'row',

    gap: 10,

    marginTop: 26,
  },

  resetButton: {
    flex: 1,

    minHeight: 48,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
  },

  resetText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
  },

  applyButton: {
    flex: 2,

    minHeight: 48,

    alignItems: 'center',
    justifyContent: 'center',
  },

  applyText: {
    color: '#FFFFFF',

    fontFamily: Typography.bodyBold,
    fontSize: 14,
  },
});