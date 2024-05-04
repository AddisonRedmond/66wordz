import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { env } from "~/env.mjs";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_API_KEY,
  authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_APP_ID,
  measurementId: env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const store = getFirestore(app);

export const firebaseAuth = getAuth(app);
