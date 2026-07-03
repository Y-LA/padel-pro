/* ===========================
   Firebase Configuration & Initialization
   =========================== */

// Replace this object with your actual Firebase config from the Firebase Console!
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db      = firebase.firestore();
const auth    = firebase.auth();
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;

// Exporting to window for global access across modules
window.db      = db;
window.auth    = auth;
window.storage = storage;

// Dispatch event so mockData.js can start Firestore sync
document.dispatchEvent(new Event('firebaseReady'));
