# NativeChatApp - Real-Time Chat Application

**Task ID:** NativeChatApp

A feature-rich, real-time chat application built with **React Native** and **Firebase**. This app provides seamless messaging with online/offline status tracking, read receipts, live location sharing, typing indicators, and push notifications.

![App Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.74.5-61DAFB.svg)
![Firebase](https://img.shields.io/badge/Firebase-Latest-FFCA28.svg)

## Features

### Implemented Features

1. **User Authentication**
   - Sign up and login using Firebase Authentication
   - User profile management (name, photo, status)
   - Firebase token-based session handling
   - Secure password authentication

2. **Real-Time Messaging**
   - One-on-one chat conversations
   - Real-time message sending and receiving using Firebase Firestore
   - Persistent message history
   - Message timestamps with calendar formatting

3. **Online/Offline Status**
   - Display user's online/offline presence
   - Show "Last seen" timestamp for offline users
   - Real-time presence updates using Firebase Realtime Database
   - Automatic status updates on app state changes

4. **Read Receipts**
   - Three-state message status system:
     - ✓ Single tick (sent)
     - ✓✓ Double tick (delivered)
     - ✓✓ Blue double tick (read)
   - Automatic status updates when messages are viewed

5. **Live Location Sharing**
   - Share current location with chat contacts
   - Display location on interactive map
   - Distance calculation between users
   - Open location in native maps app
   - Uses React Native Maps and Geolocation

6. **Typing Indicator**
   - Show "typing..." when the other user is composing
   - Real-time updates via Firebase Realtime Database
   - Auto-hide after 2 seconds of inactivity

7. **Push Notifications**
   - Firebase Cloud Messaging integration
   - Notify users when app is backgrounded/closed
   - Display sender name and message preview
   - Notification channel setup for Android
   - iOS notification support with Notifee

8. **Additional Features**
   - Beautiful, modern UI with smooth animations
   - User search functionality
   - Unread message counter
   - Profile image upload and management
   - Custom status messages
   - Chat list with last message preview

## Screenshots

### Authentication Screens
- Login Screen - Clean and modern login interface
- Sign Up Screen - User registration with profile photo

### Main App Screens
- Home Screen - Chat list with unread counts and last messages
- Users Screen - Browse and search all users with online status
- Chat Screen - Real-time messaging with typing indicators
- Map View - Location sharing with distance calculation
- Profile Screen - Edit profile information and settings

## Tech Stack

- **Frontend:** React Native 0.74.5
- **Navigation:** React Navigation 6.x
- **Backend:** Firebase (Authentication, Firestore, Realtime Database, Storage, Cloud Messaging)
- **Maps:** React Native Maps
- **Icons:** React Native Vector Icons
- **Notifications:** Notifee
- **Date Formatting:** Moment.js

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies - macOS only)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/DevanshSharma351/NativeChatApp.git
cd NativeChatApp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install

# For iOS (macOS only)
cd ios && pod install && cd ..
```

### 3. Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Add iOS and Android apps to your Firebase project
3. Download configuration files:
   - **iOS:** `GoogleService-Info.plist` → place in `ios/NativeChatApp/`
   - **Android:** `google-services.json` → place in `android/app/`

4. Enable these Firebase services:
   - **Authentication** (Email/Password)
   - **Cloud Firestore** (for messages and user data)
   - **Realtime Database** (for presence and typing status)
   - **Cloud Storage** (for profile images)
   - **Cloud Messaging** (for push notifications)

5. Update Firebase security rules (see [Firebase documentation](https://firebase.google.com/docs/rules))

### 4. Google Maps Setup

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. **Android:** Add to `android/app/src/main/AndroidManifest.xml`
   ```xml
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
   ```
3. **iOS:** Add to `ios/NativeChatApp/AppDelegate.mm`
   ```objective-c
   [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
   ```

## Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

```bash
npm run ios
# or
yarn ios
```

## Dependencies

### Core Dependencies

```json
{
  "react": "18.2.0",
  "react-native": "0.72.6",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "@react-native-firebase/app": "^18.6.1",
  "@react-native-firebase/auth": "^18.6.1",
  "@react-native-firebase/firestore": "^18.6.1",
  "@react-native-firebase/database": "^18.6.1",
  "@react-native-firebase/storage": "^18.6.1",
  "@react-native-firebase/messaging": "^18.6.1",
  "react-native-maps": "^1.8.3",
  "@react-native-community/geolocation": "^3.1.0",
  "react-native-vector-icons": "^10.0.2",
  "react-native-image-picker": "^7.0.3",
  "@notifee/react-native": "^7.8.0",
  "moment": "^2.29.4"
}
```

## Project Structure

```
NativeChatApp/
├── src/
│   ├── assets/              # Images and static assets
│   ├── config/              # Firebase configuration
│   │   └── firebase.js
│   ├── context/             # React Context (Auth)
│   │   └── AuthContext.js
│   ├── services/            # Firebase services
│   │   ├── ChatService.js
│   │   └── NotificationService.js
│   ├── screens/             # App screens
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── HomeScreen.js
│   │   ├── UsersScreen.js
│   │   ├── ChatScreen.js
│   │   ├── MapViewScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   └── App.js              # Root component
├── android/                # Android native code
├── ios/                    # iOS native code
├── index.js                # App entry point
├── package.json            # Dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Firebase Collections Structure

### Firestore Collections

#### users
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  status: string,
  fcmToken: string,
  createdAt: timestamp
}
```

#### chats
```javascript
{
  participants: [userId1, userId2],
  lastMessage: string,
  lastMessageTime: timestamp,
  unreadCount: {
    userId1: number,
    userId2: number
  },
  createdAt: timestamp
}
```

#### chats/{chatId}/messages
```javascript
{
  id: string,
  senderId: string,
  receiverId: string,
  message: string,
  type: 'text' | 'location',
  location: { latitude: number, longitude: number },
  status: 'sent' | 'delivered' | 'read',
  timestamp: timestamp,
  createdAt: string
}
```

### Realtime Database Structure

#### /status/{userId}
```javascript
{
  state: 'online' | 'offline',
  lastSeen: timestamp
}
```

#### /typing/{chatId}/{userId}
```javascript
true | null
```

## Security Notes

1. **Never commit Firebase config with real credentials** to public repositories
2. Use environment variables for sensitive data in production
3. Implement proper Firestore security rules
4. Use Firebase App Check for additional security
5. Validate user inputs on both client and server side

## Troubleshooting

### Common Issues

1. **Metro bundler errors**
   ```bash
   npm start -- --reset-cache
   ```

2. **iOS build fails**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build fails**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

4. **Firebase not connecting**
   - Check if `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are in the correct locations
   - Verify Firebase configuration in `src/config/firebase.js`

5. **Maps not showing**
   - Verify Google Maps API key is correct
   - Ensure billing is enabled in Google Cloud Console
   - Check if Maps SDK is enabled

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Devansh Sharma**
- GitHub: [@DevanshSharma351](https://github.com/DevanshSharma351)

## Acknowledgments

- React Native team for the amazing framework
- Firebase team for the comprehensive backend services
- React Navigation for smooth navigation
- All open-source contributors

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed description

---

**Note:** This is a project submission for educational purposes. Make sure to add proper error handling, testing, and production-ready optimizations before deploying to production.

## Next Steps for Production

1. Add comprehensive error handling
2. Implement automated testing (unit, integration, E2E)
3. Add analytics (Firebase Analytics)
4. Implement proper logging
5. Add crash reporting (Firebase Crashlytics)
6. Optimize bundle size
7. Implement code splitting
8. Add offline support improvements
9. Implement message encryption
10. Add voice/video call features (optional)

---

Made with ❤️ using React Native and Firebase
