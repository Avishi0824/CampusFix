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
  Send,
  Camera,
  Play,
  CheckCircle2,
  X,
} from 'lucide-react-native';

import * as ImagePicker from 'expo-image-picker';

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
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';

interface TaskDetailScreenProps {
  route: any;
  navigation: any;
}

export const TaskDetailScreen: React.FC<
  TaskDetailScreenProps
> = ({ route, navigation }) => {
  const { theme } = useAuth();

  const {
    getComplaintById,
    updateStatus,
    addComment,
  } = useComplaints();

  const complaintId = route?.params?.complaintId;

  const complaint = complaintId
    ? getComplaintById(complaintId)
    : undefined;

  const [resolutionNotes, setResolutionNotes] =
    useState('');

  const [resolutionImage, setResolutionImage] =
    useState<string | null>(null);

  const [updating, setUpdating] =
    useState(false);

  const [commentText, setCommentText] =
    useState('');

  /*
   * ----------------------------------------------------
   * COMPLAINT NOT FOUND
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
          title="Task Detail"
          onBack={() => navigation.goBack()}
        />

        <LoadingState message="Work order not found." />
      </SafeAreaView>
    );
  }

  /*
   * ----------------------------------------------------
   * CALL RESIDENT
   * ----------------------------------------------------
   */

  const handleCallResident = () => {
    if (!complaint.studentContact) {
      Alert.alert(
        'Contact Unavailable',
        'No phone number is available for this resident.'
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
   * START WORK
   * ASSIGNED → IN_PROGRESS
   * ----------------------------------------------------
   */

  const handleStartWork = async () => {
    if (updating) return;

    setUpdating(true);

    try {
      await updateStatus(
        complaint.id,
        'IN_PROGRESS',
        'Technician arrived on-site and commenced repair.'
      );

      Alert.alert(
        'Status Updated',
        'Ticket is now IN PROGRESS.'
      );
    } catch (error) {
      console.error(
        'Failed to start work:',
        error
      );

      Alert.alert(
        'Update Failed',
        'Unable to update the ticket status. Please try again.'
      );
    } finally {
      setUpdating(false);
    }
  };

  /*
   * ----------------------------------------------------
   * RESOLVE WORK
   * IN_PROGRESS → RESOLVED
   * ----------------------------------------------------
   */

  const handleResolveWork = async () => {
    if (updating) return;

    if (!resolutionNotes.trim()) {
      Alert.alert(
        'Resolution Notes Required',
        'Please enter a brief note explaining the fix.'
      );

      return;
    }

    setUpdating(true);

    try {
      await updateStatus(
        complaint.id,
        'RESOLVED',
        resolutionNotes.trim(),
        resolutionImage || undefined
      );

      Alert.alert(
        'Work Order Completed',
        'The complaint has been marked RESOLVED.'
      );
    } catch (error) {
      console.error(
        'Failed to resolve work:',
        error
      );

      Alert.alert(
        'Update Failed',
        'Unable to complete the work order. Please try again.'
      );
    } finally {
      setUpdating(false);
    }
  };

  /*
   * ----------------------------------------------------
   * PICK VERIFICATION IMAGE
   * ----------------------------------------------------
   */

  const pickResolutionImage = async () => {
    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.7,
        });

      if (
        !result.canceled &&
        result.assets &&
        result.assets[0]?.uri
      ) {
        setResolutionImage(
          result.assets[0].uri
        );
      }
    } catch (error) {
      console.warn(
        'Image picker error:',
        error
      );

      Alert.alert(
        'Image Error',
        'Unable to select the image.'
      );
    }
  };

  /*
   * ----------------------------------------------------
   * REMOVE VERIFICATION IMAGE
   * ----------------------------------------------------
   */

  const removeResolutionImage = () => {
    setResolutionImage(null);
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
        'Unable to post the comment. Please try again.'
      );
    }
  };

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
        )} Work Order`}
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
          {/* ----------------------------------------
              STATUS + PRIORITY
          ----------------------------------------- */}

          <View style={styles.topStatusRow}>
            <StatusBadge
              status={complaint.status}
            />

            <PriorityBadge
              priority={complaint.priority}
            />
          </View>

          {/* ----------------------------------------
              ISSUE OVERVIEW
          ----------------------------------------- */}

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
              PROBLEM DESCRIPTION
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

            {/* STUDENT ATTACHMENTS */}

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
                          theme.colors.textSecondary,
                      },
                    ]}
                  >
                    RESIDENT ATTACHMENTS
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

          {/* ----------------------------------------
              RESIDENT INFORMATION
          ----------------------------------------- */}

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
              RESIDENT STUDENT INFORMATION
            </Text>

            <View style={styles.studentRow}>
              <View
                style={styles.studentInfo}
              >
                <Text
                  style={[
                    styles.studentName,
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
                    styles.studentRoom,
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
                    styles.studentPhone,
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
                  handleCallResident
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
          </Card>

          {/* ----------------------------------------
              WORK ORDER ACTIONS
          ----------------------------------------- */}

          <Card
            style={[
              styles.sectionCard,
              {
                borderColor:
                  complaint.status ===
                    'IN_PROGRESS'
                    ? theme.status.inProgress
                    : complaint.status ===
                      'RESOLVED'
                      ? theme.status.resolved
                      : theme.colors.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.fieldLabel,
                {
                  color:
                    theme.colors.textPrimary,
                },
              ]}
            >
              WORK ORDER ACTIONS
            </Text>

            {/* ASSIGNED */}

            {complaint.status ===
              'ASSIGNED' && (
                <View
                  style={styles.actionPanel}
                >
                  <Text
                    style={[
                      styles.panelDesc,
                      {
                        color:
                          theme.colors
                            .textSecondary,
                      },
                    ]}
                  >
                    You are assigned to this
                    ticket. Tap below to notify
                    the resident and warden that
                    work has started.
                  </Text>

                  <Button
                    title="Commence On-Site Work"
                    onPress={
                      handleStartWork
                    }
                    variant="primary"
                    loading={updating}
                    fullWidth
                    icon={
                      <Play
                        size={16}
                        color="#FFFFFF"
                      />
                    }
                  />
                </View>
              )}

            {/* IN PROGRESS */}

            {complaint.status ===
              'IN_PROGRESS' && (
                <View
                  style={styles.actionPanel}
                >
                  <Text
                    style={[
                      styles.panelDesc,
                      {
                        color:
                          theme.colors
                            .textSecondary,
                      },
                    ]}
                  >
                    Work is currently in
                    progress. Enter your repair
                    summary notes to close this
                    ticket:
                  </Text>

                  <TextInput
                    placeholder="e.g. Replaced leaking valve and tested pressure seal."
                    placeholderTextColor={
                      theme.colors.textMuted
                    }
                    value={resolutionNotes}
                    onChangeText={
                      setResolutionNotes
                    }
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    style={[
                      styles.resolutionInput,
                      {
                        borderColor:
                          theme.colors.border,
                        backgroundColor:
                          theme.colors
                            .inputBackground,
                        color:
                          theme.colors
                            .textPrimary,
                      },
                    ]}
                  />

                  {/* VERIFICATION PHOTO */}

                  <View
                    style={
                      styles.resolutionPhotoRow
                    }
                  >
                    {resolutionImage ? (
                      <View
                        style={
                          styles.resolvedThumbBox
                        }
                      >
                        <Image
                          source={{
                            uri: resolutionImage,
                          }}
                          style={
                            styles.resolvedThumb
                          }
                        />

                        <TouchableOpacity
                          onPress={
                            removeResolutionImage
                          }
                          style={
                            styles.removePhotoBtn
                          }
                          activeOpacity={0.8}
                        >
                          <X
                            size={12}
                            color="#FFFFFF"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={
                          pickResolutionImage
                        }
                        style={[
                          styles.addResolutionPhotoBtn,
                          {
                            borderColor:
                              theme.colors
                                .border,
                            backgroundColor:
                              theme.colors
                                .surfaceSubtle,
                          },
                        ]}
                      >
                        <Camera
                          size={16}
                          color={
                            theme.colors.accent
                          }
                        />

                        <Text
                          style={[
                            styles.addPhotoText,
                            {
                              color:
                                theme.colors
                                  .textPrimary,
                            },
                          ]}
                        >
                          Attach Verification
                          Photo
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Button
                    title="Mark as Resolved & Complete"
                    onPress={
                      handleResolveWork
                    }
                    variant="primary"
                    loading={updating}
                    fullWidth
                    icon={
                      <CheckCircle2
                        size={16}
                        color="#FFFFFF"
                      />
                    }
                    style={{
                      backgroundColor:
                        theme.status.resolved,
                      borderColor:
                        theme.status.resolved,
                    }}
                  />
                </View>
              )}

            {/* RESOLVED */}

            {complaint.status ===
              'RESOLVED' && (
                <View
                  style={
                    styles.resolvedBanner
                  }
                >
                  <CheckCircle2
                    size={24}
                    color={
                      theme.status.resolved
                    }
                  />

                  <View
                    style={
                      styles.resolvedContent
                    }
                  >
                    <Text
                      style={[
                        styles.resolvedTitle,
                        {
                          color:
                            theme.status
                              .resolved,
                        },
                      ]}
                    >
                      WORK VERIFIED & COMPLETED
                    </Text>

                    <Text
                      style={[
                        styles.resolvedDesc,
                        {
                          color:
                            theme.colors
                              .textPrimary,
                        },
                      ]}
                    >
                      {complaint.resolutionNotes ||
                        'Repair executed successfully.'}
                    </Text>
                  </View>
                </View>
              )}
          </Card>

          {/* ----------------------------------------
              TIMELINE
          ----------------------------------------- */}

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
              LIFECYCLE AUDIT TRAIL
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

          {/* ----------------------------------------
              COMMENTS / WORK LOG
          ----------------------------------------- */}

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
              WORK LOG & COMMENTS (
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
                    styles.noComments,
                    {
                      color:
                        theme.colors
                          .textMuted,
                    },
                  ]}
                >
                  No work log entries yet.
                </Text>
              )}
            </View>

            {/* ADD COMMENT */}

            <View
              style={styles.addCommentRow}
            >
              <TextInput
                placeholder="Post an internal technician note..."
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
    </SafeAreaView>
  );
};

/*
 * ====================================================
 * STYLES
 * ====================================================
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
    marginBottom: 4,
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
    marginTop: 16,
  },

  attachedImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius:
      Geometry.radiusNone,
  },

  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  studentInfo: {
    flex: 1,
  },

  studentName: {
    fontFamily:
      Typography.bodyBold,
    fontSize:
      Typography.sizes.bodyLarge,
  },

  studentRoom: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.caption,
    marginTop: 2,
  },

  studentPhone: {
    fontFamily:
      Typography.mono,
    fontSize:
      Typography.sizes.micro,
    marginTop: 2,
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

  actionPanel: {
    marginTop: 4,
  },

  panelDesc: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.caption,
    marginBottom: 12,
    lineHeight: 18,
  },

  resolutionInput: {
    borderWidth:
      Geometry.borderWidthThin,
    borderRadius:
      Geometry.radiusNone,
    padding: 12,
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.body,
    minHeight: 88,
    textAlignVertical:
      'top',
    marginBottom: 12,
  },

  resolutionPhotoRow: {
    marginBottom: 14,
  },

  resolvedThumbBox: {
    width: 80,
    height: 80,
    position: 'relative',
  },

  resolvedThumb: {
    width: 80,
    height: 80,
    borderRadius:
      Geometry.radiusNone,
  },

  removePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor:
      'rgba(0,0,0,0.7)',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent:
      'center',
  },

  addResolutionPhotoBtn: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth:
      Geometry.borderWidthThin,
    borderStyle: 'dashed',
    borderRadius:
      Geometry.radiusNone,
  },

  addPhotoText: {
    fontFamily:
      Typography.monoMedium,
    fontSize:
      Typography.sizes.micro,
    marginLeft: 8,
  },

  resolvedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },

  resolvedContent: {
    flex: 1,
    marginLeft: 10,
  },

  resolvedTitle: {
    fontFamily:
      Typography.monoBold,
    fontSize:
      Typography.sizes.micro,
    letterSpacing: 0.8,
  },

  resolvedDesc: {
    fontFamily:
      Typography.body,
    fontSize:
      Typography.sizes.body,
    lineHeight: 20,
    marginTop: 4,
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

  noComments: {
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