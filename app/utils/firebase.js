import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDwcgdJGElyiAGBG_YFyIwiIctSzhFrVb8",
  authDomain: "tenedores-87176.firebaseapp.com",
  databaseURL: "https://tenedores-87176.firebaseio.com",
  projectId: "tenedores-87176",
  storageBucket: "tenedores-87176.appspot.com",
  messagingSenderId: "1085921762939",
  appId: "1:1085921762939:web:5c4b7caf99dcdf4bb5ccde",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
