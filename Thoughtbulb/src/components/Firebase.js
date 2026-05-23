import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const fire = initializeApp(firebaseConfig);

const auth = getAuth(fire);

setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Firebase auth persistence set"))
  .catch((err) => console.error("❌ Error setting auth persistence:", err));

export { fire, auth }; // 
export default fire; // add this alongside the named exports
