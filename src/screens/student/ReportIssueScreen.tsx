import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';

import { Camera, X, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';

import { Category, Priority } from '../../types';

import {
  Typography,
  Spacing,
  Geometry,
} from '../../theme';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PriorityBadge } from '../../components/PriorityBadge';

import {
  CATEGORY_LABELS,
  getCategoryIcon,
} from '../../components/CategoryChip';

interface ReportIssueScreenProps {
  navigation: any;
}

export const ReportIssueScreen: React.FC<
  ReportIssueScreenProps
> = ({ navigation }) => {
  const { theme, user } = useAuth();

  const {
    createComplaint,
    checkDuplicateComplaint,
  } = useComplaints();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [category, setCategory] =
    useState<Category>('PLUMBING');

  const [title, setTitle] = useState('');

  const [description, setDescription] =
    useState('');

  const [hostelBlock, setHostelBlock] =
    useState(
      user?.hostelBlock || 'Block B (Kaveri)'
    );

  const [roomNumber, setRoomNumber] =
    useState(
      user?.roomNumber || '304'
    );

  const [priority, setPriority] =
    useState<Priority>('MEDIUM');

  const [images, setImages] =
    useState<string[]>([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [errors, setErrors] =
    useState<{ [key: string]: string }>({});

  // =====================================================
  // OPTIONS
  // =====================================================

  const categories: Category[] = [
    'PLUMBING',
    'ELECTRICAL',
    'FURNITURE',
    'INTERNET_WIFI',
    'CLEANING',
    'HVAC_AIR',
    'SECURITY',
    'OTHER',
  ];

  const priorities: Priority[] = [
    'LOW',
    'MEDIUM',
    'HIGH',
  ];

  // =====================================================
  // IMAGE PICKER
  // =====================================================

  const pickImage = async () => {
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
        setImages((current) => [
          ...current,
          result.assets[0].uri,
        ]);
      }
    } catch (error) {
      console.warn(
        'Image picker error:',
        error
      );
    }
  };

  const removeImage = (index: number) => {
    setImages((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    const newErrors: {
      [key: string]: string;
    } = {};

    if (!title.trim()) {
      newErrors.title =
        'Issue title is required.';
    }

    if (!description.trim()) {
      newErrors.description =
        'Please describe the problem.';
    }

    if (!roomNumber.trim()) {
      newErrors.roomNumber =
        'Room number is required.';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =====================================================
  // ACTUAL COMPLAINT SUBMISSION
  // =====================================================

  const submitComplaint = async () => {
    try {
      const created = await createComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        hostelBlock: hostelBlock.trim(),
        roomNumber: roomNumber.trim(),

        // Kept for compatibility with
        // the existing complaint model.
        isEmergency: false,

        images,
      });

      navigation.replace('SubmitSuccess', {
        complaint: created,
      });
    } catch (error) {
      Alert.alert(
        'Submission Error',
        'Failed to register complaint. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // SUBMIT + DUPLICATE CHECK
  // =====================================================

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      /*
       * Before creating a complaint, check whether
       * the same room already has a similar active
       * complaint.
       */
      const duplicateCheck =
        checkDuplicateComplaint({
          hostelBlock:
            hostelBlock.trim(),

          roomNumber:
            roomNumber.trim(),

          category,

          title:
            title.trim(),

          description:
            description.trim(),
        });

      /*
       * If a strong duplicate is found,
       * don't create another complaint immediately.
       */
      if (
        duplicateCheck.isDuplicate &&
        duplicateCheck.existingComplaint
      ) {
        const existing =
          duplicateCheck.existingComplaint;

        Alert.alert(
          'Similar Complaint Already Exists',

          `A similar complaint has already been reported for Room ${roomNumber.trim()}.\n\n` +
          `${existing.ticketNumber}\n` +
          `${existing.title}\n\n` +
          `Status: ${existing.status.replace('_', ' ')}`,

          [
            {
              text: 'View Existing',

              onPress: () => {
                setSubmitting(false);

                navigation.navigate(
                  'ComplaintDetail',
                  {
                    complaintId:
                      existing.id,
                  }
                );
              },
            },

            {
              text: 'Report Different Issue',

              onPress: async () => {
                await submitComplaint();
              },
            },

            {
              text: 'Cancel',

              style: 'cancel',

              onPress: () => {
                setSubmitting(false);
              },
            },
          ]
        );

        return;
      }

      /*
       * No duplicate found.
       * Create the complaint normally.
       */
      await submitComplaint();

    } catch (error) {
      console.error(
        'Duplicate check error:',
        error
      );

      Alert.alert(
        'Submission Error',
        'Something went wrong while checking your complaint. Please try again.'
      );

      setSubmitting(false);
    }
  };

  // =====================================================
  // SCREEN
  // =====================================================

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
        title="Report an Issue"
        subtitle="Hostel Maintenance Request"
        onBack={() =>
          navigation.goBack()
        }
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

          {/* ================================================= */}
          {/* ISSUE CATEGORY */}
          {/* ================================================= */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              ISSUE CATEGORY

              <Text
                style={{
                  color:
                    theme.colors.accent,
                }}
              >
                {' '}*
              </Text>
            </Text>

            <View
              style={styles.categoryGrid}
            >
              {categories.map((cat) => {
                const isSelected =
                  category === cat;

                return (
                  <TouchableOpacity
                    key={cat}
                    activeOpacity={0.8}
                    onPress={() =>
                      setCategory(cat)
                    }
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor:
                          theme.colors.surface,

                        borderColor:
                          isSelected
                            ? theme.colors.accent
                            : theme.colors.border,

                        borderWidth:
                          isSelected
                            ? 1.5
                            : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        {
                          backgroundColor:
                            isSelected
                              ? theme.colors.accentSubtle
                              : theme.colors.surfaceSubtle,
                        },
                      ]}
                    >
                      {getCategoryIcon(
                        cat,

                        isSelected
                          ? theme.colors.accent
                          : theme.colors.textSecondary,

                        19
                      )}
                    </View>

                    <Text
                      style={[
                        styles.categoryName,
                        {
                          color:
                            isSelected
                              ? theme.colors.accent
                              : theme.colors.textPrimary,

                          fontFamily:
                            isSelected
                              ? Typography.bodyBold
                              : Typography.bodyMedium,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {CATEGORY_LABELS[cat]}
                    </Text>

                    {isSelected && (
                      <Check
                        size={16}
                        color={
                          theme.colors.accent
                        }
                        strokeWidth={2.5}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ================================================= */}
          {/* ISSUE TITLE */}
          {/* ================================================= */}

          <View style={styles.section}>
            <Input
              label="Issue Title"
              required
              placeholder="e.g. Geyser tripping circuit breaker"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
            />
          </View>

          {/* ================================================= */}
          {/* LOCATION */}
          {/* ================================================= */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              LOCATION
            </Text>

            <View
              style={styles.locationRow}
            >
              <View
                style={styles.hostelInput}
              >
                <Input
                  label="Hostel Block"
                  required
                  placeholder="e.g. Block B (Kaveri)"
                  value={hostelBlock}
                  onChangeText={
                    setHostelBlock
                  }
                />
              </View>

              <View
                style={styles.roomInput}
              >
                <Input
                  label="Room #"
                  required
                  placeholder="304"
                  value={roomNumber}
                  onChangeText={
                    setRoomNumber
                  }
                  error={
                    errors.roomNumber
                  }
                />
              </View>
            </View>
          </View>

          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          <View style={styles.section}>
            <Input
              label="Description"
              required
              placeholder="Describe where the issue is located and what is happening..."
              value={description}
              onChangeText={
                setDescription
              }
              multiline
              numberOfLines={4}
              error={
                errors.description
              }
            />
          </View>

          {/* ================================================= */}
          {/* PRIORITY */}
          {/* ================================================= */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              PRIORITY
            </Text>

            <View
              style={styles.priorityRow}
            >
              {priorities.map((p) => {
                const isSelected =
                  priority === p;

                return (
                  <TouchableOpacity
                    key={p}
                    activeOpacity={0.8}
                    onPress={() =>
                      setPriority(p)
                    }
                    style={[
                      styles.priorityCard,
                      {
                        backgroundColor:
                          theme.colors.surface,

                        borderColor:
                          isSelected
                            ? theme.colors.accent
                            : theme.colors.border,

                        borderWidth:
                          isSelected
                            ? 1.5
                            : 1,
                      },
                    ]}
                  >
                    <View
                      style={
                        styles.priorityContent
                      }
                    >
                      <PriorityBadge
                        priority={p}
                        size="small"
                      />

                      {isSelected && (
                        <Check
                          size={16}
                          color={
                            theme.colors.accent
                          }
                          strokeWidth={2.5}
                          style={
                            styles.priorityCheck
                          }
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ================================================= */}
          {/* PHOTOS */}
          {/* ================================================= */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              PHOTOS

              <Text
                style={styles.optionalText}
              >
                {' '}OPTIONAL
              </Text>
            </Text>

            <View style={styles.photoRow}>
              {images.map(
                (uri, index) => (
                  <View
                    key={index}
                    style={
                      styles.imageThumbContainer
                    }
                  >
                    <Image
                      source={{ uri }}
                      style={
                        styles.imageThumb
                      }
                    />

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        removeImage(index)
                      }
                      style={[
                        styles.removeImageBtn,
                        {
                          backgroundColor:
                            theme.colors.accent,
                        },
                      ]}
                    >
                      <X
                        size={13}
                        color="#FFFFFF"
                        strokeWidth={2.5}
                      />
                    </TouchableOpacity>
                  </View>
                )
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={pickImage}
                style={[
                  styles.uploadBtn,
                  {
                    borderColor:
                      theme.colors.border,

                    backgroundColor:
                      theme.colors.surface,
                  },
                ]}
              >
                <Camera
                  size={21}
                  color={
                    theme.colors.accent
                  }
                  strokeWidth={1.8}
                />

                <Text
                  style={[
                    styles.uploadText,
                    {
                      color:
                        theme.colors.textSecondary,
                    },
                  ]}
                >
                  Add Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================================================= */}
          {/* SUBMIT */}
          {/* ================================================= */}

          <View
            style={styles.submitContainer}
          >
            <Button
              title="Submit Complaint"
              onPress={handleSubmit}
              variant="primary"
              loading={submitting}
              fullWidth
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// =====================================================
// STYLES
// =====================================================

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

    paddingTop: 20,

    paddingBottom: 40,
  },

  // ===================================================
  // SECTIONS
  // ===================================================

  section: {
    marginBottom: 24,
  },

  sectionLabel: {
    fontFamily:
      Typography.bodyBold,

    fontSize:
      Typography.sizes.caption,

    lineHeight: 18,

    letterSpacing: 0.8,

    marginBottom: 10,
  },

  optionalText: {
    fontFamily:
      Typography.bodyMedium,

    color: '#7F8998',

    letterSpacing: 0.4,
  },

  // ===================================================
  // CATEGORY
  // ===================================================

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  categoryCard: {
    width: '48.2%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius:
      Geometry.radiusSmall,
  },

  categoryIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:
      Geometry.radiusSmall,
    marginRight: 9,
  },

  categoryName: {
    flex: 1,
    fontSize:
      Typography.sizes.caption,
    lineHeight: 18,
  },

  // ===================================================
  // LOCATION
  // ===================================================

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  hostelInput: {
    flex: 1,
    marginRight: 10,
  },

  roomInput: {
    width: 100,
  },

  // ===================================================
  // PRIORITY
  // ===================================================

  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'stretch',
  },

  priorityCard: {
    flex: 1,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius:
      Geometry.radiusSmall,
  },

  priorityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },

  priorityCheck: {
    marginLeft: 8,
  },

  // ===================================================
  // PHOTOS
  // ===================================================

  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  uploadBtn: {
    width: 88,
    height: 88,
    borderWidth:
      Geometry.borderWidthThin,
    borderStyle: 'dashed',
    borderRadius:
      Geometry.radiusSmall,
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadText: {
    fontFamily:
      Typography.bodyMedium,
    fontSize:
      Typography.sizes.micro,
    marginTop: 6,
  },

  imageThumbContainer: {
    width: 88,
    height: 88,
    position: 'relative',
  },

  imageThumb: {
    width: 88,
    height: 88,
    borderRadius:
      Geometry.radiusSmall,
  },

  removeImageBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ===================================================
  // SUBMIT
  // ===================================================

  submitContainer: {
    marginTop: 2,
    paddingTop: 4,
    paddingBottom: 8,
  },
});