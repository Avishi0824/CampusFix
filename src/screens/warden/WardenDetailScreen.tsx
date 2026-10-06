import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Phone,
  MapPin,
  Calendar,
  Send,
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
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { TimelineView } from '../../components/TimelineView';
import { LoadingState } from '../../components/LoadingState';
import { AssignmentModal } from '../../components/AssignmentModal';

import { Priority } from '../../types';

interface WardenDetailScreenProps {
  route: any;
  navigation: any;
}

export const WardenDetailScreen: React.FC<
  WardenDetailScreenProps
> = ({ route, navigation }) => {
  const { theme } = useAuth();

  const {
    getComplaintById,
    staff,
    assignTechnician,
    addComment,
  } = useComplaints();

  const complaintId = route?.params?.complaintId;

  const complaint = complaintId
    ? getComplaintById(complaintId)
    : undefined;

  const [assignModalVisible, setAssignModalVisible] =
    useState(false);

  const [commentText, setCommentText] =
    useState('');

  /*
   * ----------------------------------------------------
   * TICKET NOT FOUND
   * ----------------------------------------------------
   */

  if (!complaint) {
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
        <ScreenHeader
          title="Complaint"
          onBack={() => navigation.goBack()}
        />

        <LoadingState message="Ticket not found." />
      </SafeAreaView>
    );
  }

  /*
   * ----------------------------------------------------
   * CALL STUDENT
   * ----------------------------------------------------
   */

  const handleCallStudent = () => {
    if (!complaint.studentContact) {
      Alert.alert(
        'Contact Unavailable',
        'No phone number is available for this student.'
      );
      return;
    }

    Linking.openURL(
      `tel:${complaint.studentContact}`
    ).catch(() => {
      Alert.alert(
        'Unable to Call',
        'The phone application could not be opened.'
      );
    });
  };

  /*
   * ----------------------------------------------------
   * CALL TECHNICIAN
   * ----------------------------------------------------
   */

  const handleCallTechnician = () => {
    if (!complaint.assignedTechnicianPhone) {
      Alert.alert(
        'Contact Unavailable',
        'No phone number is available for this technician.'
      );
      return;
    }

    Linking.openURL(
      `tel:${complaint.assignedTechnicianPhone}`
    ).catch(() => {
      Alert.alert(
        'Unable to Call',
        'The phone application could not be opened.'
      );
    });
  };

  /*
   * ----------------------------------------------------
   * ASSIGN / REASSIGN TECHNICIAN
   * ----------------------------------------------------
   */

  const handleConfirmAssign = async (
    techId: string,
    priorityOverride: Priority
  ) => {
    try {
      await assignTechnician(
        complaint.id,
        techId,
        priorityOverride
      );

      setAssignModalVisible(false);

      Alert.alert(
        'Assignment Updated',
        'The maintenance staff assignment has been updated.'
      );
    } catch (error) {
      console.error(
        'Failed to assign technician:',
        error
      );

      Alert.alert(
        'Assignment Failed',
        'Unable to update the technician assignment.'
      );
    }
  };

  /*
   * ----------------------------------------------------
   * ADD COMMENT
   * ----------------------------------------------------
   */

  const handleSendComment = async () => {
    const message = commentText.trim();

    if (!message) return;

    try {
      await addComment(
        complaint.id,
        message
      );

      setCommentText('');
    } catch (error) {
      console.error(
        'Failed to add comment:',
        error
      );

      Alert.alert(
        'Comment Failed',
        'Unable to post the note. Please try again.'
      );
    }
  };

  /*
   * ----------------------------------------------------
   * DATE FORMAT
   * ----------------------------------------------------
   */

  const formattedDate = new Date(
    complaint.createdAt
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  /*
   * ----------------------------------------------------
   * UI
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
      <ScreenHeader
        title={complaint.ticketNumber}
        subtitle={`${complaint.category.replace(
          '_',
          ' '
        )} • Warden Inspection`}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* =================================================
              STATUS + PRIORITY
          ================================================= */}

          <View style={styles.topStatusRow}>
            <StatusBadge
              status={complaint.status}
            />

            <PriorityBadge
              priority={complaint.priority}
            />
          </View>

          {/* =================================================
              ISSUE OVERVIEW
          ================================================= */}

          <Card style={styles.sectionCard}>
            <Text
              style={[
                styles.cardTitle,
                {
                  color:
                    theme.colors.textPrimary,
                },
              ]}
            >
              {complaint.title}
            </Text>

            <View style={styles.metaRow}>
              <MapPin
                size={14}
                color={
                  theme.colors.textSecondary
                }
              />

              <Text
                style={[
                  styles.metaText,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                {complaint.location}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Calendar
                size={14}
                color={
                  theme.colors.textMuted
                }
              />

              <Text
                style={[
                  styles.metaText,
                  {
                    color:
                      theme.colors.textMuted,
                  },
                ]}
              >
                Logged {formattedDate}
              </Text>
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

            <Text
              style={[
                styles.fieldLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              COMPLAINT DESCRIPTION
            </Text>

            <Text
              style={[
                styles.descriptionText,
                {
                  color:
                    theme.colors.textPrimary,
                },
              ]}
            >
              {complaint.description}
            </Text>

            {/* ATTACHMENTS */}

            {complaint.images &&
              complaint.images.length > 0 && (
                <View
                  style={
                    styles.photosSection
                  }
                >
                  <Text
                    style={[
                      styles.fieldLabel,
                      {
                        color:
                          theme.colors
                            .textSecondary,
                      },
                    ]}
                  >
                    PHOTOS ATTACHED
                  </Text>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                      false
                    }
                  >
                    {complaint.images.map(
                      (uri, index) => (
                        <Image
                          key={`${uri}-${index}`}
                          source={{ uri }}
                          style={
                            styles.attachedImage
                          }
                        />
                      )
                    )}
                  </ScrollView>
                </View>
              )}
          </Card>

          {/* =================================================
              STUDENT RESIDENT
          ================================================= */}

          <Card style={styles.sectionCard}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              STUDENT RESIDENT
            </Text>

            <View style={styles.personRow}>
              <View
                style={styles.personInfo}
              >
                <Text
                  style={[
                    styles.personName,
                    {
                      color:
                        theme.colors.textPrimary,
                    },
                  ]}
                >
                  {complaint.studentName}
                </Text>

                <Text
                  style={[
                    styles.personSub,
                    {
                      color:
                        theme.colors.textSecondary,
                    },
                  ]}
                >
                  {complaint.location}
                </Text>

                <Text
                  style={[
                    styles.personPhone,
                    {
                      color:
                        theme.colors.textMuted,
                    },
                  ]}
                >
                  {complaint.studentContact ||
                    'No contact number'}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={
                  handleCallStudent
                }
                style={[
                  styles.callButton,
                  {
                    borderColor:
                      theme.colors.border,
                    backgroundColor:
                      theme.colors
                        .surfaceSubtle,
                  },
                ]}
              >
                <Phone
                  size={16}
                  color={
                    theme.colors.textPrimary
                  }
                />

                <Text
                  style={[
                    styles.callText,
                    {
                      color:
                        theme.colors.textPrimary,
                    },
                  ]}
                >
                  CALL
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* =================================================
              ASSIGNED MAINTENANCE STAFF
          ================================================= */}

          <Card style={styles.sectionCard}>
            <View
              style={styles.sectionHeaderRow}
            >
              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color:
                      theme.colors
                        .textSecondary,
                  },
                ]}
              >
                ASSIGNED MAINTENANCE STAFF
              </Text>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  setAssignModalVisible(true)
                }
                style={[
                  styles.reassignBtn,
                  {
                    borderColor:
                      theme.colors.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.reassignBtnText,
                    {
                      color:
                        theme.colors.accent,
                    },
                  ]}
                >
                  {complaint.assignedTechnicianName
                    ? 'RE-ASSIGN'
                    : 'ASSIGN NOW'}
                </Text>
              </TouchableOpacity>
            </View>

            {complaint.assignedTechnicianName ? (
              <View
                style={styles.personRow}
              >
                <View
                  style={styles.personInfo}
                >
                  <Text
                    style={[
                      styles.personName,
                      {
                        color:
                          theme.colors
                            .textPrimary,
                      },
                    ]}
                  >
                    {
                      complaint.assignedTechnicianName
                    }
                  </Text>

                  <Text
                    style={[
                      styles.personSub,
                      {
                        color:
                          theme.colors
                            .textSecondary,
                      },
                    ]}
                  >
                    {complaint.assignedTechnicianSpecialization ||
                      'Technician'}
                  </Text>

                  <Text
                    style={[
                      styles.personPhone,
                      {
                        color:
                          theme.colors
                            .textMuted,
                      },
                    ]}
                  >
                    {complaint.assignedTechnicianPhone ||
                      'No contact number'}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={
                    handleCallTechnician
                  }
                  style={[
                    styles.callButton,
                    {
                      borderColor:
                        theme.colors.accent,
                      backgroundColor:
                        theme.colors
                          .surfaceSubtle,
                    },
                  ]}
                >
                  <Phone
                    size={16}
                    color={
                      theme.colors.accent
                    }
                  />

                  <Text
                    style={[
                      styles.callText,
                      {
                        color:
                          theme.colors.accent,
                      },
                    ]}
                  >
                    CALL
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={styles.unallocatedBox}
              >
                <Text
                  style={[
                    styles.unallocatedText,
                    {
                      color:
                        theme.colors
                          .textSecondary,
                    },
                  ]}
                >
                  No technician allocated yet.
                  Tap 'ASSIGN NOW' above.
                </Text>
              </View>
            )}
          </Card>

          {/* =================================================
              RESOLUTION SUMMARY
          ================================================= */}

          {complaint.status ===
            'RESOLVED' &&
            complaint.resolutionNotes && (
              <Card
                style={[
                  styles.sectionCard,
                  {
                    borderColor:
                      theme.status.resolved,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.fieldLabel,
                    {
                      color:
                        theme.status.resolved,
                    },
                  ]}
                >
                  RESOLUTION SUMMARY &
                  VERIFICATION
                </Text>

                <Text
                  style={[
                    styles.descriptionText,
                    {
                      color:
                        theme.colors
                          .textPrimary,
                    },
                  ]}
                >
                  {complaint.resolutionNotes}
                </Text>
              </Card>
            )}

          {/* =================================================
              AUDIT TRAIL
          ================================================= */}

          <Card style={styles.sectionCard}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              INSTITUTIONAL AUDIT TRAIL
            </Text>

            <TimelineView
              timeline={
                complaint.timeline
              }
              currentStatus={
                complaint.status
              }
            />
          </Card>

          {/* =================================================
              WARDEN & STAFF NOTES
          ================================================= */}

          <Card style={styles.sectionCard}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              WARDEN & STAFF NOTES (
              {complaint.comments.length}
              )
            </Text>

            <View
              style={styles.commentsList}
            >
              {complaint.comments.length >
                0 ? (
                complaint.comments.map(
                  (comment) => (
                    <View
                      key={comment.id}
                      style={[
                        styles.commentItem,
                        {
                          backgroundColor:
                            theme.colors
                              .surfaceSubtle,
                          borderColor:
                            theme.colors
                              .borderLight,
                        },
                      ]}
                    >
                      <View
                        style={
                          styles.commentHeader
                        }
                      >
                        <Text
                          style={[
                            styles.commentAuthor,
                            {
                              color:
                                theme.colors
                                  .textPrimary,
                            },
                          ]}
                        >
                          {comment.authorName}{' '}
                          (
                          {comment.authorRole.toUpperCase()}
                          )
                        </Text>

                        <Text
                          style={[
                            styles.commentTime,
                            {
                              color:
                                theme.colors
                                  .textMuted,
                            },
                          ]}
                        >
                          {new Date(
                            comment.timestamp
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.commentMessage,
                          {
                            color:
                              theme.colors
                                .textPrimary,
                          },
                        ]}
                      >
                        {comment.message}
                      </Text>
                    </View>
                  )
                )
              ) : (
                <Text
                  style={[
                    styles.emptyComments,
                    {
                      color:
                        theme.colors
                          .textMuted,
                    },
                  ]}
                >
                  No notes have been added yet.
                </Text>
              )}
            </View>

            {/* ADD NOTE */}

            <View
              style={styles.addCommentRow}
            >
              <TextInput
                placeholder="Post administrative note or instruction..."
                placeholderTextColor={
                  theme.colors.textMuted
                }
                value={commentText}
                onChangeText={
                  setCommentText
                }
                style={[
                  styles.commentInput,
                  {
                    color:
                      theme.colors
                        .textPrimary,
                    borderColor:
                      theme.colors.border,
                    backgroundColor:
                      theme.colors
                        .inputBackground,
                  },
                ]}
                returnKeyType="send"
                onSubmitEditing={
                  handleSendComment
                }
              />

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={
                  handleSendComment
                }
                disabled={
                  !commentText.trim()
                }
                style={[
                  styles.sendBtn,
                  {
                    backgroundColor:
                      theme.colors.accent,
                    opacity:
                      commentText.trim()
                        ? 1
                        : 0.5,
                  },
                ]}
              >
                <Send
                  size={16}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =================================================
          ASSIGNMENT MODAL
      ================================================= */}

      <AssignmentModal
        visible={assignModalVisible}
        complaint={complaint}
        staff={staff}
        onClose={() =>
          setAssignModalVisible(false)
        }
        onAssign={handleConfirmAssign}
      />
    </SafeAreaView>
  );
};

/*
 * ======================================================
 * STYLES
 * ======================================================
 */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal:
      Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },

  topStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 12,
  },

  sectionCard: {
    marginBottom: 12,
  },

  cardTitle: {
    fontFamily:
      Typography.display,
    fontSize:
      Typography.sizes.h2,
    lineHeight: 26,
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  metaText: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.caption,
    marginLeft: 6,
    flex: 1,
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  fieldLabel: {
    fontFamily:
      Typography.monoBold,
    fontSize:
      Typography.sizes.micro,
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  descriptionText: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.body,
    lineHeight: 22,
  },

  photosSection: {
    marginTop: 14,
  },

  attachedImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius:
      Geometry.radiusNone,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 8,
  },

  reassignBtn: {
    minHeight: 36,
    paddingHorizontal: 10,
    justifyContent:
      'center',
    borderWidth:
      Geometry.borderWidthThin,
    borderRadius:
      Geometry.radiusNone,
  },

  reassignBtnText: {
    fontFamily:
      Typography.monoBold,
    fontSize:
      Typography.sizes.micro,
    letterSpacing: 0.5,
  },

  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  personInfo: {
    flex: 1,
  },

  personName: {
    fontFamily:
      Typography.bodyBold,
    fontSize:
      Typography.sizes.bodyLarge,
  },

  personSub: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.caption,
    marginTop: 2,
  },

  personPhone: {
    fontFamily:
      Typography.mono,
    fontSize:
      Typography.sizes.micro,
    marginTop: 3,
  },

  callButton: {
    minWidth: 72,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
    paddingHorizontal: 12,
    borderWidth:
      Geometry.borderWidthThin,
    borderRadius:
      Geometry.radiusNone,
    marginLeft: 12,
  },

  callText: {
    fontFamily:
      Typography.monoBold,
    fontSize:
      Typography.sizes.micro,
    marginLeft: 6,
    letterSpacing: 0.5,
  },

  unallocatedBox: {
    paddingVertical: 8,
  },

  unallocatedText: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.caption,
    lineHeight: 18,
  },

  commentsList: {
    gap: 8,
    marginBottom: 12,
  },

  commentItem: {
    padding: 10,
    borderWidth:
      Geometry.borderWidthThin,
    borderRadius:
      Geometry.radiusNone,
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 4,
  },

  commentAuthor: {
    flex: 1,
    fontFamily:
      Typography.monoBold,
    fontSize:
      Typography.sizes.micro,
    letterSpacing: 0.5,
  },

  commentTime: {
    fontFamily:
      Typography.mono,
    fontSize:
      Typography.sizes.micro,
    marginLeft: 8,
  },

  commentMessage: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.body,
    lineHeight: 20,
  },

  emptyComments: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.caption,
    marginBottom: 4,
  },

  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  commentInput: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth:
      Geometry.borderWidthThin,
    borderRadius:
      Geometry.radiusNone,
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.body,
  },

  sendBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent:
      'center',
    marginLeft: 8,
    borderRadius:
      Geometry.radiusNone,
  },
});