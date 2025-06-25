import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Firebase configuration - will be initialized by auth context
let app: any = null;
let auth: any = null;

export const initializeFirebase = async () => {
  try {
    const response = await fetch('/api/firebase-config');
    const firebaseConfig = await response.json();
    
    if (!app) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
    }
    
    return { app, auth };
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
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return auth;
};

export { app as default };