import { Request, Response, NextFunction } from 'express';

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// For now, we'll do a simple token validation without Firebase Admin SDK
// This is a simplified approach - in production you'd want proper token verification
export async function verifyFirebaseToken(idToken: string): Promise<FirebaseUser | null> {
  try {
    console.log('Attempting to decode Firebase token...');
    
    // Split the JWT token into parts
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    console.log('Decoded Firebase payload:', {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      iss: payload.iss
    });
    
    // Basic validation - check if it's a Firebase token
    if (!payload.iss || !payload.iss.includes('firebase')) {
      console.error('Not a Firebase token');
      return null;
    }
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      console.error('Token expired');
      return null;
    }
    
    return {
      uid: payload.sub || payload.user_id,
      email: payload.email || null,
      displayName: payload.name || null,
      photoURL: payload.picture || null,
      emailVerified: payload.email_verified || false,
    };
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
}

export const firebaseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const user = await verifyFirebaseToken(idToken);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Firebase auth middleware error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const optionalFirebaseAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'Bearer token present' : 'No auth header');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      console.log('Verifying Firebase token...');
      const user = await verifyFirebaseToken(idToken);
      if (user) {
        console.log('Firebase user verified:', user.uid);
        (req as any).user = user;
      } else {
        console.log('Firebase token verification failed');
      }
    }
    next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    // For optional auth, we don't return an error, just continue without user
    next();
  }
};