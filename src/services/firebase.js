import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadString, getDownloadURL, listAll } from 'firebase/storage';

console.log('VITE_FIREBASE_CONFIG:', import.meta.env.VITE_FIREBASE_CONFIG);

let firebaseConfig = null;
try {
  if (import.meta.env.VITE_FIREBASE_CONFIG) {
    firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
  }
} catch (error) {
  console.warn('Failed to parse VITE_FIREBASE_CONFIG - running without Firebase:', error);
  firebaseConfig = null;
}

let app = null;
let auth = null;
let db = null;
let storage = null;
if (firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn('Firebase failed to initialize - continuing without Firebase:', err);
    app = null; auth = null; db = null; storage = null;
  }
} else {
  console.log('No Firebase configuration found. App will run without backend features.');
}

// Provide a minimal auth stub so components that call auth.onAuthStateChanged
// or read auth.currentUser don't crash when Firebase isn't configured.
if (!auth) {
  auth = {
    currentUser: null,
    onAuthStateChanged: (cb) => {
      // immediately call with null user and return an unsubscribe stub
      try { cb(null); } catch (e) { console.warn(e); }
      return () => {};
    },
  };
}

export { auth, db, storage };

export const signInAnon = async () => {
  if (!auth) {
    console.warn('signInAnon called but Firebase auth is not configured.');
    return false;
  }
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
  if (!auth) throw new Error('Firebase auth not configured');
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
  if (!auth) throw new Error('Firebase auth not configured');
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Signed up with UID:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Registration failed:', error.message);
    throw error;
  }
};

// Upload a canvas dataURL for a user and return the public URL
export const uploadCanvasImage = async (userId, fileName, dataUrl) => {
  if (!storage) {
    console.warn('uploadCanvasImage called but Firebase Storage not configured.');
    return null;
  }
  try {
    const path = `sketches/${userId}/${fileName}`;
    const ref = storageRef(storage, path);
    // dataUrl is expected to be a data:image/png;base64,... string
    await uploadString(ref, dataUrl, 'data_url');
    const url = await getDownloadURL(ref);
    return url;
  } catch (err) {
    console.error('uploadCanvasImage error', err);
    throw err;
  }
};

// List sketches for a user
export const listUserSketches = async (userId) => {
  if (!storage) {
    return [];
  }
  try {
    const folder = storageRef(storage, `sketches/${userId}`);
    const res = await listAll(folder);
    const urls = await Promise.all(res.items.map((it) => getDownloadURL(it)));
    return urls;
  } catch (err) {
    // If folder doesn't exist, return empty
    if (err.code && err.code === 'storage/object-not-found') return [];
    console.error('listUserSketches error', err);
    return [];
  }
};