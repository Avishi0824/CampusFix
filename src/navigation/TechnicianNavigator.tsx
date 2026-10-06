import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Wrench,
  User,
} from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { Typography, Geometry } from '../theme';

import { TaskQueueScreen } from '../screens/technician/TaskQueueScreen';
import { TaskDetailScreen } from '../screens/technician/TaskDetailScreen';
import { TechnicianProfileScreen } from '../screens/technician/TechnicianProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TechnicianTabs = () => {
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

        tabBarActiveTintColor:
          theme.colors.tabBarActive,

        tabBarInactiveTintColor:
          theme.colors.tabBarInactive,

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
        name="TaskQueue"
        component={TaskQueueScreen}
        options={{
          tabBarLabel: 'TASK QUEUE',
          tabBarIcon: ({ color }) => (
            <Wrench
              size={20}
              color={color}
              strokeWidth={1.8}
            />
          ),
        }}
      />

      <Tab.Screen
        name="TechnicianProfile"
        component={TechnicianProfileScreen}
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

export const TechnicianNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen
        name="TechnicianTabs"
        component={TechnicianTabs}
      />

      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
      />
    </Stack.Navigator>
  );
};