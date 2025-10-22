import { firebase } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXYig2gbceEOMtBmJUvxXvcmKJ1FWM7Ts",
  authDomain: "huddle-c6f52.firebaseapp.com",
  databaseURL: "https://huddle-c6f52-default-rtdb.firebaseio.com",
  projectId: "huddle-c6f52",
  storageBucket: "huddle-c6f52.firebasestorage.app",
  messagingSenderId: "950053755019",
  appId: "1:950053755019:web:9279b91087611893ffdc8e",
  measurementId: "G-TFZX810BQP"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { auth, firestore, database, storage, messaging };
export default firebase;
