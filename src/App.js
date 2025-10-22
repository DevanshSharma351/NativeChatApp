import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import NotificationService from './services/NotificationService';

const AppContent = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize notifications
    const initNotifications = async () => {
      const token = await NotificationService.initialize();
      if (token && user) {
        await NotificationService.saveFCMToken(user.uid, token);
      }
    };

    initNotifications();
  }, [user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
