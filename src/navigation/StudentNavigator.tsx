import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FileText, PlusCircle, User } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { Typography, Geometry } from '../theme';

import { MyComplaintsScreen } from '../screens/student/MyComplaintsScreen';
import { ReportIssueScreen } from '../screens/student/ReportIssueScreen';
import { ComplaintDetailScreen } from '../screens/student/ComplaintDetailScreen';
import { SubmitSuccessScreen } from '../screens/student/SubmitSuccessScreen';
import { StudentProfileScreen } from '../screens/student/StudentProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StudentTabs = () => {
  const { theme } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopColor: theme.colors.tabBarBorder,
          borderTopWidth: Geometry.borderWidthThin,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,

        tabBarLabelStyle: {
          fontFamily: Typography.monoBold,
          fontSize: Typography.sizes.micro,
          letterSpacing: 0.6,
        },

        tabBarItemStyle: {
          minHeight: 48,
        },
      }}
    >
      <Tab.Screen
        name="MyComplaints"
        component={MyComplaintsScreen}
        options={{
          tabBarLabel: 'COMPLAINTS',
          tabBarIcon: ({ color }) => (
            <FileText
              size={20}
              color={color}
              strokeWidth={1.8}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ReportIssueTab"
        component={ReportIssueScreen}
        options={{
          tabBarLabel: 'REPORT ISSUE',
          tabBarIcon: ({ color }) => (
            <PlusCircle
              size={20}
              color={color}
              strokeWidth={1.8}
            />
          ),
        }}
      />

      <Tab.Screen
        name="StudentProfile"
        component={StudentProfileScreen}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color }) => (
            <User
              size={20}
              color={color}
              strokeWidth={1.8}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const StudentNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen
        name="StudentTabs"
        component={StudentTabs}
      />

      <Stack.Screen
        name="ReportIssue"
        component={ReportIssueScreen}
      />

      <Stack.Screen
        name="ComplaintDetail"
        component={ComplaintDetailScreen}
      />

      <Stack.Screen
        name="SubmitSuccess"
        component={SubmitSuccessScreen}
      />
    </Stack.Navigator>
  );
};