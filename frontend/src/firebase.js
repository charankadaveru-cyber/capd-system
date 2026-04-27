import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBEckbRELjth4T8QzvOWXxvbrPkO0D9kCM",
    authDomain: "capd-kit-delivery-system.firebaseapp.com",
    projectId: "capd-kit-delivery-system",
    storageBucket: "capd-kit-delivery-system.firebasestorage.app",
    messagingSenderId: "334212641695",
    appId: "1:334212641695:web:873b4883dbe0ebc5d983aa",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);