import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { StudentNavigator } from './StudentNavigator';
import { TechnicianNavigator } from './TechnicianNavigator';
import { WardenNavigator } from './WardenNavigator';
import { LoadingState } from '../components/LoadingState';

export const RootNavigator = () => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Initializing CampusFix Portal..." />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <LoginScreen />
      ) : role === 'technician' ? (
        <TechnicianNavigator />
      ) : role === 'warden' ? (
        <WardenNavigator />
      ) : (
        <StudentNavigator />
      )}
    </NavigationContainer>
  );
};
