import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

class ChatService {
  // Get or create chat room
  async getChatRoom(userId1, userId2) {
    const chatId = this.generateChatId(userId1, userId2);
    
    const chatRef = firestore().collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      // Create new chat room
      await chatRef.set({
        participants: [userId1, userId2],
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
      });
    }

    return chatId;
  }

  // Generate consistent chat ID
  generateChatId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
  }

  // Send message
  async sendMessage(chatId, senderId, receiverId, message, type = 'text', location = null) {
    try {
      const messageRef = firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc();

      const messageData = {
        id: messageRef.id,
        senderId,
        receiverId,
        message,
        type, // text, image, location
        location,
        timestamp: firestore.FieldValue.serverTimestamp(),
        status: 'sent', // sent, delivered, read
        createdAt: new Date().toISOString(),
      };

      await messageRef.set(messageData);

      // Update chat room's last message
      await firestore().collection('chats').doc(chatId).update({
        lastMessage: type === 'location' ? '📍 Location' : message,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
        [`unreadCount.${receiverId}`]: firestore.FieldValue.increment(1),
      });

      return { success: true, messageId: messageRef.id };
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update message status
  async updateMessageStatus(chatId, messageId, status) {
    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc(messageId)
        .update({ status });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Mark messages as read
  async markMessagesAsRead(chatId, userId, otherUserId) {
    try {
      const messagesRef = firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages');

      const unreadMessages = await messagesRef
        .where('receiverId', '==', userId)
        .where('status', 'in', ['sent', 'delivered'])
        .get();

      const batch = firestore().batch();
      unreadMessages.docs.forEach((doc) => {
        batch.update(doc.ref, { status: 'read' });
      });
      await batch.commit();

      // Reset unread count
      await firestore().collection('chats').doc(chatId).update({
        [`unreadCount.${userId}`]: 0,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Listen to messages
  subscribeToMessages(chatId, callback) {
    return firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(messages);
      });
  }

  // Get user chats
  subscribeToUserChats(userId, callback) {
    return firestore()
      .collection('chats')
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageTime', 'desc')
      .onSnapshot(async (snapshot) => {
        const chats = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const chatData = doc.data();
            const otherUserId = chatData.participants.find((id) => id !== userId);
            
            // Get other user's data
            const userDoc = await firestore()
              .collection('users')
              .doc(otherUserId)
              .get();

            return {
              id: doc.id,
              ...chatData,
              otherUser: { uid: otherUserId, ...userDoc.data() },
              unreadCount: chatData.unreadCount?.[userId] || 0,
            };
          })
        );
        callback(chats);
      });
  }

  // Set typing status
  async setTypingStatus(chatId, userId, isTyping) {
    const typingRef = database().ref(`typing/${chatId}/${userId}`);
    
    if (isTyping) {
      await typingRef.set(true);
      // Auto-remove after 3 seconds
      setTimeout(() => typingRef.remove(), 3000);
    } else {
      await typingRef.remove();
    }
  }

  // Listen to typing status
  subscribeToTyping(chatId, otherUserId, callback) {
    const typingRef = database().ref(`typing/${chatId}/${otherUserId}`);
    
    const listener = typingRef.on('value', (snapshot) => {
      callback(snapshot.val() === true);
    });

    return () => typingRef.off('value', listener);
  }

  // Get all users
  async getAllUsers(currentUserId) {
    try {
      const usersSnapshot = await firestore()
        .collection('users')
        .where('uid', '!=', currentUserId)
        .get();

      return usersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  }

  // Upload image
  async uploadImage(uri, path) {
    try {
      const reference = storage().ref(path);
      await reference.putFile(uri);
      const url = await reference.getDownloadURL();
      return { success: true, url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Listen to user presence
  subscribeToUserPresence(userId, callback) {
    const presenceRef = database().ref(`status/${userId}`);
    
    const listener = presenceRef.on('value', (snapshot) => {
      const presence = snapshot.val();
      callback(presence);
    });

    return () => presenceRef.off('value', listener);
  }
}

export default new ChatService();
