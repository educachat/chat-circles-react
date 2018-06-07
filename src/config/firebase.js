import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAJZko-yv1sPE2mHDkNwDqK9N4BFmr1Zwk",
  authDomain: "chat-circles.firebaseapp.com",
  databaseURL: "https://chat-circles.firebaseio.com",
  projectId: "chat-circles",
  storageBucket: "chat-circles.appspot.com",
  messagingSenderId: "934013236137"
};

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();