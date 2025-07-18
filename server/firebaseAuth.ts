import admin from 'firebase-admin';
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const auth = admin.auth();

// Middleware to verify Firebase ID tokens
export const verifyFirebaseToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(`Auth verification for ${req.method} ${req.path} - Header present: ${!!authHeader}`);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Bearer token found in request');
      return res.status(401).json({ message: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Fetch user data from database to get role
    // First try by Firebase UID, then by email if not found
    let dbUser = await storage.getUser(decodedToken.uid);
    if (!dbUser && decodedToken.email) {
      // Fallback: look up by email
      try {
        const userByEmail = await db.select().from(users).where(eq(users.email, decodedToken.email)).limit(1);
        if (userByEmail.length > 0) {
          dbUser = userByEmail[0];
        }
      } catch (emailLookupError) {
        console.error('Error looking up user by email:', emailLookupError);
      }
    }
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: dbUser?.role || 'viewer',
      isActive: dbUser?.isActive !== false,
      claims: decodedToken
    };

    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Setup Firebase auth routes
export async function setupFirebaseAuth(app: Express) {
  // Sync user data with database
  app.post('/api/auth/firebase/sync', verifyFirebaseToken, async (req, res) => {
    try {
      const { uid, email, firstName, lastName, profileImageUrl } = req.body;
      
      // Check if user exists by Firebase UID first
      let user = await storage.getUser(uid);
      
      if (user) {
        // User exists with Firebase UID, update and return current data
        const updatedUser = await db.update(users).set({
          firstName,
          lastName,
          profileImageUrl,
          updatedAt: new Date(),
        }).where(eq(users.id, uid)).returning();
        
        res.json(updatedUser[0]);
      } else {
        // Check if user exists by email (migrating from old auth)
        const existingUserByEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
        
        if (existingUserByEmail.length > 0) {
          // User exists with different ID, update their info and return existing user
          const migratedUser = await db.update(users).set({
            firstName,
            lastName,
            profileImageUrl,
            updatedAt: new Date(),
          }).where(eq(users.email, email)).returning();
          
          res.json(migratedUser[0]);
        } else {
          // Create new user with Firebase UID
          const newUser = await storage.upsertUser({
            id: uid,
            email,
            firstName,
            lastName,
            profileImageUrl,
            role: "viewer",
            isActive: true,
          });
          
          res.json(newUser);
        }
      }
    } catch (error) {
      console.error('Error syncing user:', error);
      res.status(500).json({ message: 'Error syncing user data' });
    }
  });

  // Get current user info
  app.get('/api/auth/user', verifyFirebaseToken, async (req, res) => {
    try {
      const user = req.user as any;
      const dbUser = await storage.getUser(user.uid);
      
      if (!dbUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImageUrl: dbUser.profileImageUrl,
        role: dbUser.role,
        isActive: dbUser.isActive,
        displayName: `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim()
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user data' });
    }
  });

  // Logout endpoint (client handles Firebase signOut)
  app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
  });
}

// Middleware for role-based access control
export function requireFirebaseRole(role: string): RequestHandler {
  return async (req, res, next) => {
    try {
      const user = req.user as any;
      
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const roleHierarchy = {
        viewer: 0,
        business_owner: 1,
        admin: 2
      };

      const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;

      if (userLevel < requiredLevel) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Error checking role:', error);
      res.status(500).json({ message: 'Error checking permissions' });
    }
  };
}

export const requireFirebaseAdmin = requireFirebaseRole('admin');
export const requireFirebaseBusinessOwner = requireFirebaseRole('business_owner');
export const requireFirebaseViewer = requireFirebaseRole('viewer');