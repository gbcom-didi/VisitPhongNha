import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, handleRedirect, signInWithGoogle, signOutUser } from '@/lib/firebase';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    // Handle redirect result on page load
    handleRedirect().catch(console.error);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('Firebase auth state changed:', user ? 'logged in' : 'logged out');
      setUser(user);
      
      if (user) {
        try {
          // Get the ID token for API calls
          const token = await user.getIdToken();
          console.log('Got Firebase ID token, length:', token.length);
          setIdToken(token);
          
          // Store token in localStorage for persistence across page reloads
          localStorage.setItem('firebase_token', token);
        } catch (error) {
          console.error('Error getting ID token:', error);
          setIdToken(null);
          localStorage.removeItem('firebase_token');
        }
      } else {
        setIdToken(null);
        localStorage.removeItem('firebase_token');
      }
      
      setIsLoading(false);
    });

    // Check for stored token on page load
    const storedToken = localStorage.getItem('firebase_token');
    if (storedToken && !user) {
      setIdToken(storedToken);
    }

    return () => unsubscribe();
  }, []);

  const login = () => {
    signInWithGoogle();
  };

  const logout = async () => {
    try {
      await signOutUser();
      setIdToken(null);
      localStorage.removeItem('firebase_token');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    idToken,
    login,
    logout,
  };
}