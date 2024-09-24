// นำเข้าโมดูล Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTJC5f7RK8onkqfaiN8nHnAruDWGha9p8",
    authDomain: "lil-petals-nook.firebaseapp.com",
    projectId: "lil-petals-nook",
    storageBucket: "lil-petals-nook.appspot.com",
    messagingSenderId: "608629256813",
    appId: "1:608629256813:web:d3188f569c80aed9fb8564",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Function for Google Sign-In
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log('User logged in: ', result.user);
    })
    .catch((error) => {
      console.error('Error logging in: ', error);
    });
};
