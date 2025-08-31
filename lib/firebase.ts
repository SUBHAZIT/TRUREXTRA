import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK7lBqAFzFKPCpdSUPZ7-TGQsOD167w_I",
  authDomain: "turextra-f42a5.firebaseapp.com",
  projectId: "turextra-f42a5",
  storageBucket: "turextra-f42a5.firebasestorage.app",
  messagingSenderId: "22134928942",
  appId: "1:22134928942:web:007e235edadb026bd111bf",
  measurementId: "G-WTJS983SGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
