import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyB1pIGDYK2CWRWKAG4eAJhSSi75Bu4eXbg",
  authDomain: "learning-mananagement-sy-17d27.firebaseapp.com",
  projectId: "learning-mananagement-sy-17d27",
  storageBucket: "learning-mananagement-sy-17d27.firebasestorage.app",
  messagingSenderId: "694813844924",
  appId: "1:694813844924:web:5b5ef2f782f2bf45a437b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}