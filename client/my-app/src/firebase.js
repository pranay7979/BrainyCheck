// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAbXcfXOZHKvr2mlGaHnP-8LUvH895e7fQ",
  authDomain: "brain-disease-detection.firebaseapp.com",
  projectId: "brain-disease-detection",
  storageBucket: "brain-disease-detection.appspot.com",
  messagingSenderId: "784060151579",
  appId: "1:784060151579:web:7360b8cabcc40e157685be",
  measurementId: "G-LMSE2JC122"
};

const app = initializeApp(firebaseConfig);

// Conditionally enable analytics
if (typeof window !== "undefined" && location.protocol === "https:") {
  isSupported().then((yes) => {
    if (yes) getAnalytics(app);
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
