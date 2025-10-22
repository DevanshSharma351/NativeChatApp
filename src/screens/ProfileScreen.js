import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';
import storage from '@react-native-firebase/storage';

const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [status, setStatus] = useState(user?.status || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          setPhotoURL(response.assets[0].uri);
        }
      }
    );
  };

  const uploadImage = async (uri) => {
    try {
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const reference = storage().ref(`profile_images/${filename}`);
      await reference.putFile(uri);
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    setLoading(true);

    let uploadedPhotoURL = user?.photoURL;
    
    // Upload new photo if changed
    if (photoURL && photoURL !== user?.photoURL) {
      const url = await uploadImage(photoURL);
      if (url) {
        uploadedPhotoURL = url;
      }
    }

    const updates = {
      displayName: displayName.trim(),
      status: status.trim(),
    };

    if (uploadedPhotoURL !== user?.photoURL) {
      updates.photoURL = uploadedPhotoURL;
    }

    const result = await updateProfile(updates);
    setLoading(false);

    if (result.success) {
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || '');
    setStatus(user?.status || '');
    setPhotoURL(user?.photoURL || null);
    setEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        {!editing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(true)}>
            <Icon name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={editing ? pickImage : null}
          disabled={!editing}>
          <Image
            source={
              photoURL
                ? { uri: photoURL }
                : require('../assets/default-avatar.png')
            }
            style={styles.avatar}
          />
          {editing && (
            <View style={styles.editAvatarBadge}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Icon name="person-outline" size={24} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Name</Text>
              {editing ? (
                <TextInput
                  style={styles.infoInput}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.infoValue}>{user?.displayName}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Icon name="mail-outline" size={24} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Icon name="information-circle-outline" size={24} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              {editing ? (
                <TextInput
                  style={styles.infoInput}
                  value={status}
                  onChangeText={setStatus}
                  placeholder="Enter your status"
                  placeholderTextColor="#999"
                  multiline
                />
              ) : (
                <Text style={styles.infoValue}>
                  {user?.status || 'Hey there! I am using ChatApp'}
                </Text>
              )}
            </View>
          </View>
        </View>

        {editing ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.signOutButton]}
            onPress={handleSignOut}>
            <Icon name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 20,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  infoInput: {
    fontSize: 16,
    color: '#333',
    padding: 0,
    margin: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});

export default ProfileScreen;
