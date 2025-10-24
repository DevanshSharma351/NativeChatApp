import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';

class NotificationService {
  async initialize() {
    // Request permission
    await this.requestPermission();
    
    // Ensure FCM auto init is enabled
    try {
      await messaging().setAutoInitEnabled(true);
    } catch (e) {
      console.warn('FCM setAutoInitEnabled failed:', e?.code || e?.message || e);
    }

    // On some devices this helps register for remote messages
    try {
      await messaging().registerDeviceForRemoteMessages();
    } catch (e) {
      // No-op on Android older versions; safe to ignore
      console.warn('registerDeviceForRemoteMessages:', e?.code || e?.message || e);
    }

    // Get FCM token
    const token = await this.getFCMToken();
    
    // Create notification channel for Android
    if (Platform.OS === 'android') {
      await this.createNotificationChannel();
    }

    // Setup message handlers
    this.setupMessageHandlers();
    
    return token;
  }

  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted');
    }
  }

  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token retrieved successfully');
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error?.code || error?.message);
      // Retry by deleting token and re-fetching
      try {
        await messaging().deleteToken();
        const token = await messaging().getToken();
        console.log('FCM Token retrieved after retry');
        return token;
      } catch (retryError) {
        console.error('FCM token retry failed:', retryError?.code || retryError?.message);
      }
      return null;
    }
  }

  async saveFCMToken(userId, token) {
    try {
      await firestore().collection('users').doc(userId).update({
        fcmToken: token,
      });
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  async createNotificationChannel() {
    await notifee.createChannel({
      id: 'chat-messages',
      name: 'Chat Messages',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  setupMessageHandlers() {
    // Foreground messages
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    // Background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    // Notification opened app from quit state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      // Navigate to chat screen
    });

    // Check if app was opened by notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App opened from quit state by notification');
        }
      });
  }

  async displayNotification(remoteMessage) {
    try {
      const { notification, data } = remoteMessage;

      await notifee.displayNotification({
        title: notification?.title || 'New Message',
        body: notification?.body || 'You have a new message',
        android: {
          channelId: 'chat-messages',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          smallIcon: 'ic_launcher',
        },
        ios: {
          sound: 'default',
        },
        data,
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  async sendNotification(receiverToken, title, body, data = {}) {
    try {
      // This would typically be done from your backend
      // For demo purposes, you can use Firebase Cloud Functions
      // or a backend API to send notifications
      console.log('Send notification to:', receiverToken);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }
}

export default new NotificationService();
