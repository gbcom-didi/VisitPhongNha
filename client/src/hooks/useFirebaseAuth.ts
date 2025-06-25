import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, handleRedirect, signInWithGoogle, signOutUser } from '@/lib/firebase';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Handle redirect result on page load first
    const handleRedirectResult = async () => {
      try {
        const result = await handleRedirect();
        if (result && mounted) {
          console.log('Redirect handled successfully');
        }
      } catch (error) {
        console.error('Redirect handling error:', error);
      }
    };

    handleRedirectResult();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!mounted) return;
      
      console.log('Firebase auth state changed:', user ? `logged in as ${user.email}` : 'logged out');
      setUser(user);
      
      if (user) {
        try {
          // Get the ID token for API calls
          const token = await user.getIdToken(true); // Force refresh
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

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = () => {
    console.log('Initiating Firebase Google sign-in...');
    signInWithGoogle();
  };

  const logout = async () => {
    try {
      console.log('Signing out...');
      await signOutUser();
      setIdToken(null);
      localStorage.removeItem('firebase_token');
      setUser(null);
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