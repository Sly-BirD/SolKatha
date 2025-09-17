import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

console.log('VITE_FIREBASE_CONFIG:', import.meta.env.VITE_FIREBASE_CONFIG);

let firebaseConfig;
try {
  firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
} catch (error) {
  console.error('Failed to parse VITE_FIREBASE_CONFIG:', error);
  throw new Error('Firebase configuration is invalid. Check .env file.');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInAnon = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log('Signed in anonymously with UID:', userCredential.user.uid);
    return true;
  } catch (error) {
    console.error('Anonymous auth failed:', error.message);
    return false;
  }
};

export const signInWithCredentials = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Signed in with UID:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
};

export const signUpWithCredentials = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Signed up with UID:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Registration failed:', error.message);
    throw error;
  }
};