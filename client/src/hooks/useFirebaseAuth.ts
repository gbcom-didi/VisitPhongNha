import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, handleRedirect, signInWithGoogle, signOutUser } from '@/lib/firebase';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result on page load
    handleRedirect().catch(console.error);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = () => {
    signInWithGoogle();
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}