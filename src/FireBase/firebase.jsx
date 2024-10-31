// นำเข้าโมดูล Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth'; // นำเข้า signOut

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
  return signInWithPopup(auth, provider); // เปลี่ยนให้ return result เพื่อให้ handle ได้ใน React
};

// เพิ่มฟังก์ชัน signOut
export const signOut = () => {
    return firebaseSignOut(auth); // เรียกใช้งานฟังก์ชัน signOut ของ Firebase
};