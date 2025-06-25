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
    // For now, we'll decode the JWT payload without verification
    // This is NOT secure for production but will work for development
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    
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
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const user = await verifyFirebaseToken(idToken);
      if (user) {
        (req as any).user = user;
      }
    }
    next();
  } catch (error) {
    // For optional auth, we don't return an error, just continue without user
    next();
  }
};