import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('Firebase config:', {
  apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId ? 'Present' : 'Missing'
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// Sign in with Google redirect
export function signInWithGoogle() {
  signInWithRedirect(auth, provider);
}

// Handle redirect result after sign in
export function handleRedirect() {
  return getRedirectResult(auth)
    .then(async (result) => {
      if (result) {
        console.log('Firebase redirect result received:', result.user.uid);
        
        // Get the ID token immediately after successful redirect
        const idToken = await result.user.getIdToken();
        console.log('Got ID token from redirect, storing...');
        localStorage.setItem('firebase_token', idToken);
        
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        
        // The signed-in user info.
        const user = result.user;
        return { user, token, idToken };
      }
      return null;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Firebase auth error:', errorCode, errorMessage);
      throw error;
    });
}

// Sign out
export function signOutUser() {
  return signOut(auth);
}

// Auth state listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}