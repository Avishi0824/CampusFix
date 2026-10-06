import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Shield,
  FileText,
  BarChart3,
  Users,
} from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { Typography, Geometry } from '../theme';

import { WardenDashboardScreen } from '../screens/warden/WardenDashboardScreen';
import { WardenComplaintsScreen } from '../screens/warden/WardenComplaintsScreen';
import { WardenAnalyticsScreen } from '../screens/warden/WardenAnalyticsScreen';
import { WardenStaffScreen } from '../screens/warden/WardenStaffScreen';
import { WardenDetailScreen } from '../screens/warden/WardenDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const WardenTabs = () => {
  const { theme } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor:
            theme.colors.tabBarBackground,

          borderTopColor:
            theme.colors.tabBarBorder,

          borderTopWidth:
            Geometry.borderWidthThin,

          height: 64,

          paddingTop: 6,
          paddingBottom: 8,
        },

        tabBarActiveTintColor:
          theme.colors.tabBarActive,

        tabBarInactiveTintColor:
          theme.colors.tabBarInactive,

        tabBarLabelStyle: {
          fontFamily:
            Typography.monoBold,

          fontSize:
            Typography.sizes.micro,

          letterSpacing: 0.6,
        },

        tabBarItemStyle: {
          minHeight: 48,
        },
      }}
    >
      {/* ----------------------------------------
          DASHBOARD
      ----------------------------------------- */}

      <Tab.Screen
        name="WardenDashboard"
        component={WardenDashboardScreen}
        options={{
          tabBarLabel: 'DASHBOARD',

          tabBarIcon: ({ color }) => (
            <Shield
              size={20}
              color={color}
              strokeWidth={1.8}
            />
          ),
        }}
      />

      {/* ----------------------------------------
          ALL TICKETS
      ----------------------------------------- */}

      <Tab.Screen
        name="WardenComplaints"
        component={WardenComplaintsScreen}
        options={{
          tabBarLabel: 'ALL TICKETS',

          tabBarIcon: ({ color }) => (
            <FileText
              size={20}
              color={color}
              strokeWidth={1.8}
            />
          ),
        }}
      />

      {/* ----------------------------------------
          ANALYTICS
      ----------------------------------------- */}

      <Tab.Screen
        name="WardenAnalytics"
        component={WardenAnalyticsScreen}
        options={{
          tabBarLabel: 'ANALYTICS',

          tabBarIcon: ({ color }) => (
            <BarChart3
              size={20}
              color={color}
              strokeWidth={1.8}
            />
          ),
        }}
      />

      {/* ----------------------------------------
          STAFF
      ----------------------------------------- */}

      <Tab.Screen
        name="WardenStaff"
        component={WardenStaffScreen}
        options={{
          tabBarLabel: 'STAFF',

          tabBarIcon: ({ color }) => (
            <Users
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

export const WardenNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen
        name="WardenTabs"
        component={WardenTabs}
      />

      <Stack.Screen
        name="WardenDetail"
        component={WardenDetailScreen}
      />
    </Stack.Navigator>
  );
};