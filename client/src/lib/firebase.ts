import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, type Auth } from 'firebase/auth';

// Firebase configuration - will be initialized by auth context
let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

export const initializeFirebase = async () => {
  try {
    const response = await fetch('/api/firebase-config');
    const firebaseConfig = await response.json();
    
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig);
      firebaseAuth = getAuth(firebaseApp);
    }
    
    return { app: firebaseApp, auth: firebaseAuth };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Facebook provider
facebookProvider.setCustomParameters({
  display: 'popup'
});

// Get auth instance (must be called after initialization)
export const getAuthInstance = () => {
  if (!firebaseAuth) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return firebaseAuth;
};

export { firebaseApp as default };