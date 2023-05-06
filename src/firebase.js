import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDK4T_mUuINi2elL-PCQ72-fZZQJKdbrOo",
  authDomain: "reactjs-aristotle.firebaseapp.com",
  projectId: "reactjs-aristotle",
  storageBucket: "reactjs-aristotle.appspot.com",
  messagingSenderId: "68760721886",
  appId: "1:68760721886:web:ad42e8728ce1fd986ba54f",
  measurementId: "G-FBW5EGMJFW"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, firestore, storage };


