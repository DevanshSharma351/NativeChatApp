import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import { useAuth } from '../context/AuthContext';
import ChatService from '../services/ChatService';

const ChatScreen = ({ route, navigation }) => {
  const { chatId, otherUser } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [presence, setPresence] = useState(null);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Subscribe to messages
    const unsubscribeMessages = ChatService.subscribeToMessages(
      chatId,
      (msgs) => {
        setMessages(msgs);
        markMessagesAsDelivered(msgs);
      }
    );

    // Subscribe to typing status
    const unsubscribeTyping = ChatService.subscribeToTyping(
      chatId,
      otherUser.uid,
      setOtherUserTyping
    );

    // Subscribe to presence
    const unsubscribePresence = ChatService.subscribeToUserPresence(
      otherUser.uid,
      setPresence
    );

    // Mark messages as read when screen is focused
    markMessagesAsRead();

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribePresence();
    };
  }, [chatId, otherUser.uid]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity
          style={styles.headerTitle}
          onPress={() =>
            navigation.navigate('UserProfile', { user: otherUser })
          }>
          <Image
            source={
              otherUser.photoURL
                ? { uri: otherUser.photoURL }
                : require('../assets/default-avatar.png')
            }
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>{otherUser.displayName}</Text>
            <Text style={styles.headerStatus}>
              {otherUserTyping
                ? 'typing...'
                : presence?.state === 'online'
                ? 'online'
                : presence?.lastSeen
                ? `Last seen ${moment(presence.lastSeen).fromNow()}`
                : 'offline'}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [otherUser, presence, otherUserTyping]);

  const markMessagesAsDelivered = async (msgs) => {
    const undeliveredMessages = msgs.filter(
      (msg) => msg.receiverId === user.uid && msg.status === 'sent'
    );

    for (const msg of undeliveredMessages) {
      await ChatService.updateMessageStatus(chatId, msg.id, 'delivered');
    }
  };

  const markMessagesAsRead = async () => {
    await ChatService.markMessagesAsRead(chatId, user.uid, otherUser.uid);
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const messageText = inputText.trim();
    setInputText('');
    setIsTyping(false);
    ChatService.setTypingStatus(chatId, user.uid, false);

    await ChatService.sendMessage(
      chatId,
      user.uid,
      otherUser.uid,
      messageText,
      'text'
    );
  };

  const handleTyping = (text) => {
    setInputText(text);

    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      ChatService.setTypingStatus(chatId, user.uid, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      ChatService.setTypingStatus(chatId, user.uid, false);
    }, 2000);
  };

  const handleLocationShare = () => {
    Alert.alert(
      'Share Location',
      'Share your current location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: async () => {
            Geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                await ChatService.sendMessage(
                  chatId,
                  user.uid,
                  otherUser.uid,
                  '📍 Location',
                  'location',
                  { latitude, longitude }
                );
              },
              (error) => {
                Alert.alert('Error', 'Failed to get location');
                console.error(error);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
          },
        },
      ]
    );
  };

  const getMessageStatus = (message) => {
    if (message.senderId !== user.uid) return null;

    switch (message.status) {
      case 'sent':
        return <Icon name="checkmark" size={16} color="#999" />;
      case 'delivered':
        return (
          <View style={styles.doubleCheck}>
            <Icon name="checkmark" size={16} color="#999" />
            <Icon name="checkmark" size={16} color="#999" style={styles.checkmarkOverlap} />
          </View>
        );
      case 'read':
        return (
          <View style={styles.doubleCheck}>
            <Icon name="checkmark" size={16} color="#007AFF" />
            <Icon name="checkmark" size={16} color="#007AFF" style={styles.checkmarkOverlap} />
          </View>
        );
      default:
        return null;
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user.uid;
    const timestamp = item.timestamp?.toDate
      ? item.timestamp.toDate()
      : new Date(item.createdAt);

    if (item.type === 'location') {
      return (
        <View
          style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessage : styles.otherMessage,
          ]}>
          <TouchableOpacity
            style={styles.locationMessage}
            onPress={() =>
              navigation.navigate('MapView', {
                location: item.location,
                userName: isMyMessage ? 'You' : otherUser.displayName,
              })
            }>
            <Icon name="location" size={40} color="#007AFF" />
            <Text style={styles.locationText}>View Location</Text>
          </TouchableOpacity>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {moment(timestamp).format('LT')}
            </Text>
            {getMessageStatus(item)}
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}>
        <Text
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText,
          ]}>
          {item.message}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTime,
              isMyMessage && styles.myMessageTime,
            ]}>
            {moment(timestamp).format('LT')}
          </Text>
          {getMessageStatus(item)}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLocationShare}>
          <Icon name="location" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={handleTyping}
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={inputText.trim() === ''}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerStatus: {
    fontSize: 12,
    color: '#666',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  myMessageTime: {
    color: '#e0e0e0',
  },
  doubleCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  checkmarkOverlap: {
    marginLeft: -10,
  },
  locationMessage: {
    alignItems: 'center',
    padding: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatScreen;
