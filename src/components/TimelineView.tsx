import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { CheckCircle2, Clock, Wrench, FileText } from 'lucide-react-native';
import { TimelineEvent, ComplaintStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Typography, Spacing, Geometry } from '../theme';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  currentStatus: ComplaintStatus;
  style?: ViewStyle;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  currentStatus,
  style,
}) => {
  const { theme } = useAuth();

  const getStatusIcon = (status: ComplaintStatus, isDone: boolean) => {
    const iconColor = isDone ? theme.colors.accent : theme.colors.textMuted;
    switch (status) {
      case 'REPORTED':
        return <FileText size={14} color={iconColor} />;
      case 'ASSIGNED':
        return <Clock size={14} color={iconColor} />;
      case 'IN_PROGRESS':
        return <Wrench size={14} color={iconColor} />;
      case 'RESOLVED':
        return <CheckCircle2 size={14} color={iconColor} />;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} ${d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {timeline.map((event, index) => {
        const isLast = index === timeline.length - 1;
        return (
          <View key={event.id || index} style={styles.eventRow}>
            {/* Left timeline track */}
            <View style={styles.trackColumn}>
              <View
                style={[
                  styles.node,
                  {
                    borderColor: theme.colors.accent,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                {getStatusIcon(event.status, true)}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.verticalLine,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
              )}
            </View>

            {/* Right event content */}
            <View style={styles.contentColumn}>
              <View style={styles.headerRow}>
                <Text
                  style={[
                    styles.eventTitle,
                    {
                      color: theme.colors.textPrimary,
                      fontFamily: Typography.bodySemiBold,
                    },
                  ]}
                >
                  {event.title}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    {
                      color: theme.colors.textMuted,
                      fontFamily: Typography.mono,
                    },
                  ]}
                >
                  {formatDate(event.timestamp)}
                </Text>
              </View>

              <Text
                style={[
                  styles.description,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: Typography.body,
                  },
                ]}
              >
                {event.description}
              </Text>

              <View style={styles.actorRow}>
                <Text
                  style={[
                    styles.actor,
                    {
                      color: theme.colors.textMuted,
                      fontFamily: Typography.monoMedium,
                    },
                  ]}
                >
                  BY: {event.actorName.toUpperCase()} ({event.actorRole.toUpperCase()})
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.gapSmall,
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  trackColumn: {
    width: 28,
    alignItems: 'center',
  },
  node: {
    width: 24,
    height: 24,
    borderWidth: Geometry.borderWidthThin,
    borderRadius: Geometry.radiusNone, // Square Figma aesthetic
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  verticalLine: {
    width: 1,
    flex: 1,
    marginVertical: 2,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: Typography.sizes.body,
    flex: 1,
  },
  timestamp: {
    fontSize: Typography.sizes.micro,
    marginLeft: 8,
  },
  description: {
    fontSize: Typography.sizes.caption,
    lineHeight: 18,
    marginTop: 2,
  },
  actorRow: {
    marginTop: 4,
  },
  actor: {
    fontSize: Typography.sizes.micro,
    letterSpacing: 0.5,
  },
});
