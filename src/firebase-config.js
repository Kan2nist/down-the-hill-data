// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSQT_EIrerpAnGrxjAOJBM0LwG-fjnNQc",
  authDomain: "down-the-hill-14a87.firebaseapp.com",
  projectId: "down-the-hill-14a87",
  storageBucket: "down-the-hill-14a87.firebasestorage.app",
  messagingSenderId: "446964021843",
  appId: "1:446964021843:web:c9667231f2f397d29224a6",
  measurementId: "G-LP87HN7CMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.log('Persistence failed: Browser not supported');
    }
  });
