import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
  PlayfairDisplay_900Black,
} from '@expo-google-fonts/playfair-display';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

import {
  AuthProvider,
  useAuth,
} from './src/context/AuthContext';

import {
  ComplaintsProvider,
} from './src/context/ComplaintsContext';

import {
  RootNavigator,
} from './src/navigation/RootNavigator';

const MainApp = () => {
  const { theme } = useAuth();

  return (
    <>
      <StatusBar
        style={theme.isDark ? 'light' : 'dark'}
      />

      <RootNavigator />
    </>
  );
};

const FontLoadingScreen = () => {
  const { theme } = useAuth();

  return (
    <View
      style={[
        styles.loadingContainer,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.loadingTitle,
          {
            color:
              theme.colors.textPrimary,
          },
        ]}
      >
        CAMPUSFIX
      </Text>

      <Text
        style={[
          styles.loadingText,
          {
            color:
              theme.colors.textSecondary,
          },
        ]}
      >
        Loading design assets...
      </Text>
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    PlayfairDisplay_900Black,

    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,

    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ComplaintsProvider>
          {fontsLoaded ? (
            <MainApp />
          ) : (
            <FontLoadingScreen />
          )}
        </ComplaintsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  loadingTitle: {
    fontFamily:
      'PlayfairDisplay_700Bold',
    fontSize: 32,
    letterSpacing: 1,
    marginBottom: 8,
  },

  loadingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
});