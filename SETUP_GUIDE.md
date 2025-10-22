# Quick Setup Guide for NativeChatApp

This guide will help you get the app running quickly for your project submission.

## Step 1: Install Dependencies (5 minutes)

```bash
# Install Node modules
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..
```

## Step 2: Firebase Setup (10 minutes)

### Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "NativeChatApp" (or your preferred name)
4. Disable Google Analytics (optional for testing)
5. Click "Create project"

### Add Apps to Firebase

#### For Android:
1. Click Android icon
2. Android package name: `com.nativechatapp`
3. Download `google-services.json`
4. Place it in `android/app/google-services.json`

#### For iOS (if testing on iOS):
1. Click iOS icon
2. iOS bundle ID: `org.reactjs.native.example.NativeChatApp`
3. Download `GoogleService-Info.plist`
4. Place it in `ios/NativeChatApp/GoogleService-Info.plist`

### Enable Firebase Services

1. **Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"

2. **Firestore Database**
   - Go to Firestore Database → Create database
   - Start in **test mode** (for quick setup)
   - Choose your location

3. **Realtime Database**
   - Go to Realtime Database → Create database
   - Start in **test mode**
   - Choose your location

4. **Storage**
   - Go to Storage → Get started
   - Start in **test mode**

5. **Cloud Messaging**
   - Already enabled by default
   - No action needed

### Update Firebase Config

1. Open `src/config/firebase.js`
2. Go to Firebase Console → Project Settings (gear icon)
3. Scroll to "Your apps" section
4. Copy your web app config
5. Replace the placeholder values in `firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "AIza...", // Copy from Firebase Console
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

## Step 3: Google Maps Setup (5 minutes)

### Get API Key

1. Go to https://console.cloud.google.com/
2. Select your Firebase project (or create new one)
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "API Key"
5. Copy the API key

### Enable Required APIs

1. Go to "APIs & Services" → "Library"
2. Search and enable:
   - Maps SDK for Android
   - Maps SDK for iOS (if using iOS)

### Add API Key to Project

**Android:**
Open `android/app/src/main/AndroidManifest.xml` and replace:
```xml
android:value="YOUR_GOOGLE_MAPS_API_KEY"
```
with your actual key.

**iOS (if using):**
Open `ios/NativeChatApp/AppDelegate.mm` and add your key.

## Step 4: Add Default Avatar (2 minutes)

1. Download any default avatar image (200x200 PNG)
2. Rename it to `default-avatar.png`
3. Place it in `src/assets/default-avatar.png`

Or use this online avatar generator:
- Visit: https://ui-avatars.com/api/?name=User&size=200&background=random
- Save the image as `default-avatar.png` in `src/assets/`

## Step 5: Run the App (2 minutes)

### Android

```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

### iOS (macOS only)

```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

## Step 6: Test the App (5 minutes)

1. **Create Account:**
   - Click "Sign Up"
   - Enter name, email, password
   - Optionally add profile photo
   - Click "Sign Up"

2. **Create Second Account (use another device/emulator):**
   - Repeat step 1 with different credentials
   - Or use web browser Firebase Console to add user manually

3. **Test Features:**
   - Search for users
   - Send messages
   - Share location
   - Test typing indicator
   - Check read receipts
   - View online/offline status

## Common Issues & Solutions

### Issue: "Unable to resolve module"
**Solution:**
```bash
npm start -- --reset-cache
```

### Issue: Metro bundler not connecting
**Solution:**
```bash
# Kill existing processes
npx react-native start --reset-cache
```

### Issue: Android build fails
**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Issue: iOS build fails
**Solution:**
```bash
cd ios
pod install
cd ..
npm run ios
```

### Issue: Firebase not connecting
**Solution:**
- Verify `google-services.json` is in `android/app/`
- Verify `GoogleService-Info.plist` is in `ios/NativeChatApp/`
- Check Firebase config in `src/config/firebase.js`
- Ensure Firebase services are enabled in console

### Issue: Maps not showing
**Solution:**
- Verify API key is correct
- Enable billing in Google Cloud Console (required for Maps)
- Check if Maps SDK is enabled for your platform

### Issue: Location permission denied
**Solution:**
- For Android: Go to Settings → Apps → ChatApp → Permissions → Enable Location
- For iOS: When prompted, tap "Allow While Using App"

## Production Checklist

Before submitting your project:

- All Firebase services enabled
- Firebase security rules configured
- Google Maps API key added
- Default avatar image added
- README.md updated with your info
- .gitignore properly configured
- Tested on both Android and iOS (if possible)
- Screenshots taken for documentation
- Code committed to GitHub
- Repository is public (or accessible by instructor)

## Git Commands for Submission

```bash
# Check status
git status

# Add all files
git add .

# Commit with message
git commit -m "Initial commit: Complete chat app with all features"

# Push to GitHub
git push origin main
```

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the main README.md
3. Check Firebase Console for any errors
4. Verify all configuration files are properly set up

---
