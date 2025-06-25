import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '@/lib/firebase';
import { UserRole, AuthUser } from '@/types/auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // User role and permissions
  hasRole: (requiredRole: UserRole) => boolean;
  canCreateBusiness: () => boolean;
  canEditBusiness: (businessOwnerId?: string) => boolean;
  canDeleteBusiness: () => boolean;
  canAccessAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user with backend and get role information
  const syncUserWithBackend = async (user: User): Promise<AuthUser> => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/firebase/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          profileImageUrl: user.photoURL
        })
      });

      if (response.ok) {
        const userData = await response.json();
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: userData.role || UserRole.VIEWER,
          isActive: userData.isActive !== false,
          firstName: userData.firstName,
          lastName: userData.lastName
        };
      }
    } catch (error) {
      console.error('Error syncing user with backend:', error);
    }
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: UserRole.VIEWER,
      isActive: true,
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || ''
    };
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const syncedUser = await syncUserWithBackend(result.user);
      setCurrentUser(syncedUser);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const syncedUser = await syncUserWithBackend(result.user);
      setCurrentUser(syncedUser);
    } catch (error) {
      console.error('Facebook sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const syncedUser = await syncUserWithBackend(result.user);
      setCurrentUser(syncedUser);
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      if (firstName || lastName) {
        const displayName = `${firstName || ''} ${lastName || ''}`.trim();
        await updateProfile(result.user, { displayName });
      }
      
      const syncedUser = await syncUserWithBackend(result.user);
      setCurrentUser(syncedUser);
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Role-based permission checks
  const roleHierarchy = {
    [UserRole.VIEWER]: 0,
    [UserRole.BUSINESS_OWNER]: 1,
    [UserRole.ADMIN]: 2
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!currentUser?.role) return false;
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  const canCreateBusiness = (): boolean => hasRole(UserRole.BUSINESS_OWNER);
  
  const canEditBusiness = (businessOwnerId?: string): boolean => {
    if (hasRole(UserRole.ADMIN)) return true;
    if (hasRole(UserRole.BUSINESS_OWNER) && businessOwnerId === currentUser?.uid) return true;
    return false;
  };

  const canDeleteBusiness = (): boolean => hasRole(UserRole.ADMIN);
  
  const canAccessAdmin = (): boolean => hasRole(UserRole.BUSINESS_OWNER);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const syncedUser = await syncUserWithBackend(user);
        setCurrentUser(syncedUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    logout,
    resetPassword,
    hasRole,
    canCreateBusiness,
    canEditBusiness,
    canDeleteBusiness,
    canAccessAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}