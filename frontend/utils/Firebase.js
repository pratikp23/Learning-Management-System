import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1pIGDYK2CWRWKAG4eAJhSSi75Bu4eXbg",
  authDomain: "learning-mananagement-sy-17d27.firebaseapp.com",
  projectId: "learning-mananagement-sy-17d27",
  storageBucket: "learning-mananagement-sy-17d27.firebasestorage.app",
  messagingSenderId: "694813844924",
  appId: "1:694813844924:web:5b5ef2f782f2bf45a437b9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();