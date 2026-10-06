import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  GraduationCap,
  Wrench,
  Shield,
  ChevronRight,
  Settings,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Typography } from '../../theme';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const roles: {
    role: Role;
    label: string;
    title: string;
    desc: string;
    accent: string;
    icon: React.ReactElement<{ color?: string }>;
  }[] = [
      {
        role: 'student',
        label: 'STUDENT',
        title: 'Hostel Resident',
        desc: 'Report and track maintenance issues in your hostel.',
        accent: '#6D9DC5',
        icon: <GraduationCap size={27} color="#A7B0BC" />,
      },
      {
        role: 'technician',
        label: 'TECHNICIAN',
        title: 'Maintenance Staff',
        desc: 'View assigned tasks and update work progress.',
        accent: '#5FA69A',
        icon: <Wrench size={27} color="#A7B0BC" />,
      },
      {
        role: 'warden',
        label: 'WARDEN / ADMIN',
        title: 'Campus Facility Head',
        desc: 'Oversee requests, staff and facility status.',
        accent: '#D2A85A',
        icon: <Shield size={27} color="#A7B0BC" />,
      },
    ];

  const handleContinue = async () => {
    if (!selectedRole || submitting) return;

    setSubmitting(true);

    try {
      await login(selectedRole);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRoleData = roles.find(
    (item) => item.role === selectedRole
  );

  const getContinueText = () => {
    if (!selectedRole || !selectedRoleData) {
      return 'Select a role to continue';
    }

    if (selectedRole === 'student') {
      return 'Continue as Student';
    }

    if (selectedRole === 'technician') {
      return 'Continue as Technician';
    }

    return 'Continue as Warden';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.topRow}>
              <Text style={styles.eyebrow}>
                SMART CAMPUS INFRASTRUCTURE
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.settingsButton}
              >
                <Settings
                  size={24}
                  color="#A7B0BC"
                  strokeWidth={1.8}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.logo}>
              <Text style={styles.logoCampus}>Campus</Text>
              <Text style={styles.logoFix}>Fix</Text>
            </Text>

            <Text style={styles.subtitle}>
              Institutional Maintenance & Facility Management Portal
            </Text>
          </View>

          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.sectionTitle}>
              CONTINUE AS
            </Text>

            <View style={styles.roleList}>
              {roles.map((item) => {
                const isSelected = selectedRole === item.role;

                return (
                  <TouchableOpacity
                    key={item.role}
                    activeOpacity={0.82}
                    disabled={submitting}
                    onPress={() => setSelectedRole(item.role)}
                    style={[
                      styles.roleCard,
                      isSelected && {
                        borderColor: item.accent,
                        backgroundColor: '#27313D',
                      },
                    ]}
                  >
                    {/* Icon */}
                    <View
                      style={[
                        styles.iconContainer,
                        isSelected && {
                          borderColor: item.accent,
                          backgroundColor: `${item.accent}18`,
                        },
                      ]}
                    >
                      {React.cloneElement(item.icon, {
                        color: isSelected
                          ? item.accent
                          : '#A7B0BC',
                      })}
                    </View>

                    {/* Content */}
                    <View style={styles.roleContent}>
                      <Text
                        style={[
                          styles.roleLabel,
                          isSelected && {
                            color: item.accent,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>

                      <Text style={styles.roleTitle}>
                        {item.title}
                      </Text>

                      <Text style={styles.roleDescription}>
                        {item.desc}
                      </Text>
                    </View>

                    {/* Arrow */}
                    <View style={styles.arrowContainer}>
                      <ChevronRight
                        size={25}
                        color={
                          isSelected
                            ? item.accent
                            : '#A7B0BC'
                        }
                        strokeWidth={1.8}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!selectedRole || submitting}
            onPress={handleContinue}
            style={[
              styles.continueButton,
              selectedRole && {
                backgroundColor: '#E06A47',
              },
              !selectedRole && styles.continueButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.continueText,
                selectedRole && styles.continueTextActive,
              ]}
            >
              {getContinueText()}
            </Text>

            {selectedRole && (
              <ChevronRight
                size={21}
                color="#F5F3EE"
                strokeWidth={2}
              />
            )}
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footerText}>
            CAMPUSFIX V1.0 • HOSTEL RESIDENCE PORTAL
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#151A21',
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
  },

  /* HEADER */

  header: {
    marginBottom: 58,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  eyebrow: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: '#89929E',
    letterSpacing: 2.5,
    flex: 1,
  },

  settingsButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#35404D',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },

  logo: {
    marginTop: 48,
    fontFamily: Typography.bodyBold,
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: -2,
  },

  logoCampus: {
    color: '#F5F3EE',
  },

  logoFix: {
    color: '#E06A47',
  },

  subtitle: {
    marginTop: 14,
    fontFamily: Typography.body,
    fontSize: 17,
    lineHeight: 25,
    color: '#A7B0BC',
    maxWidth: 650,
  },

  /* ROLE SECTION */

  roleSection: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: '#89929E',
    letterSpacing: 3,
    marginBottom: 28,
  },

  roleList: {
    gap: 16,
  },

  roleCard: {
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202731',
    borderWidth: 1.5,
    borderColor: '#35404D',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#35404D',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  roleContent: {
    flex: 1,
    marginLeft: 18,
    marginRight: 10,
  },

  roleLabel: {
    fontFamily: Typography.bodyBold,
    fontSize: 13,
    color: '#A7B0BC',
    letterSpacing: 2,
    marginBottom: 4,
  },

  roleTitle: {
    fontFamily: Typography.bodyBold,
    fontSize: 21,
    lineHeight: 27,
    color: '#F5F3EE',
  },

  roleDescription: {
    fontFamily: Typography.body,
    fontSize: 15,
    lineHeight: 21,
    color: '#A7B0BC',
    marginTop: 3,
  },

  arrowContainer: {
    width: 32,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  /* CONTINUE BUTTON */

  continueButton: {
    minHeight: 64,
    borderRadius: 20,
    backgroundColor: '#202731',
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  continueButtonDisabled: {
    backgroundColor: '#202731',
  },

  continueText: {
    fontFamily: Typography.bodyBold,
    fontSize: 17,
    color: '#A7B0BC',
  },

  continueTextActive: {
    color: '#F5F3EE',
  },

  /* FOOTER */

  footerText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: '#596371',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 30,
  },
});