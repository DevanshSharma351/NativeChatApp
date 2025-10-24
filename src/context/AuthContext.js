import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        
        setUser({
          uid: user.uid,
          email: user.email,
          ...userDoc.data(),
        });

        // Set user online status
        setUserPresence(user.uid, true);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Set user presence in Realtime Database
  const setUserPresence = (userId, isOnline) => {
    const userStatusRef = database().ref(`/status/${userId}`);
    
    if (isOnline) {
      // Set online status
      userStatusRef.set({
        state: 'online',
        lastSeen: database.ServerValue.TIMESTAMP,
      });

      // Set offline on disconnect
      userStatusRef.onDisconnect().set({
        state: 'offline',
        lastSeen: database.ServerValue.TIMESTAMP,
      });
    } else {
      userStatusRef.set({
        state: 'offline',
        lastSeen: database.ServerValue.TIMESTAMP,
      });
    }
  };

  const signUp = async (email, password, displayName, photoURL) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = userCredential.user;

      // Create user document in Firestore
      await firestore().collection('users').doc(uid).set({
        uid,
        email,
        displayName,
        photoURL: photoURL || null,
        status: 'Hey there! I am using ChatApp',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Update profile
      await userCredential.user.updateProfile({
        displayName,
        photoURL,
      });

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error?.code || error?.message);
      return { success: false, error: error.message, code: error?.code };
    }
  };

  const signIn = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error?.code || error?.message);
      return { success: false, error: error.message, code: error?.code };
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await setUserPresence(user.uid, false);
      }
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { uid } = user;
      
      // Update Firestore
      await firestore().collection('users').doc(uid).update(updates);
      
      // Update Auth profile if displayName or photoURL changed
      if (updates.displayName || updates.photoURL) {
        await auth().currentUser.updateProfile({
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL,
        });
      }

      setUser({ ...user, ...updates });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
