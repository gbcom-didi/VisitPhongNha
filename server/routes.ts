import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupFirebaseAuth, verifyFirebaseToken, requireFirebaseAdmin, requireFirebaseBusinessOwner, requireFirebaseViewer, auth } from "./firebaseAuth";
import { permissions } from "./rbac";
import { checkSpam, checkRateLimit, getClientIP } from "./spamProtection";
import { insertBusinessSchema, insertCategorySchema, insertUserLikeSchema, insertArticleSchema, insertGuestbookEntrySchema, insertGuestbookCommentSchema, insertGuestbookEntryLikeSchema, insertGuestbookCommentLikeSchema, businesses as businessesTable, businessCategories, categories, articles, users, guestbookEntries, guestbookComments, guestbookEntryLikes, guestbookCommentLikes } from "@shared/schema";
import * as googlePlacesImporter from "./googlePlacesImporter";
import { z } from "zod";
import { db } from "./db";
import { eq, desc, asc, sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupFirebaseAuth(app);

  // Auth routes
  // Firebase configuration endpoint for client
  app.get('/api/firebase-config', (req, res) => {
    // Use environment variables when available, fallback to correct values if not yet propagated
    res.json({
      apiKey: process.env.FIREBASE_API_KEY === "AIzaSyB50TJ2DkPa1WYsVkjK6WnIz-KtRh5NBpc" 
        ? "AIzaSyAlhyeEFRENZMDXi9KufBzCn9F05ZBRwYI" 
        : process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN === "didi-vui.firebaseapp.com" 
        ? "visit-phong-nha-29b4e.firebaseapp.com" 
        : process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID === "didi-vui" 
        ? "visit-phong-nha-29b4e" 
        : process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET === "didi-vui.appspot.com" 
        ? "visit-phong-nha-29b4e.appspot.com" 
        : process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID === "452792522384" 
        ? "78816841018" 
        : process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID === "1:452792522384:web:7d8f5c27b45ae3f19e2a15" 
        ? "1:78816841018:web:581e281407b5dc940e1403" 
        : process.env.FIREBASE_APP_ID
    });
  });

  // Firebase auth already handles user endpoints

  // Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const onlyPopulated = req.query.populated === 'true';
      
      if (onlyPopulated) {
        // Get only categories that have associated businesses
        const result = await db.execute(sql`
          SELECT DISTINCT c.id, c.name, c.slug, c.color
          FROM categories c
          INNER JOIN business_categories bc ON c.id = bc.category_id
          INNER JOIN businesses b ON bc.business_id = b.id
          WHERE b.is_active = true
          ORDER BY c.name
        `);
        
        res.json(result.rows);
      } else {
        const categories = await storage.getCategories();
        res.json(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', requireFirebaseAdmin, async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Businesses routes
  app.get('/api/businesses', async (req: Request, res: Response) => {
    try {
      // Get Firebase user if authenticated
      let userId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decodedToken = await auth.verifyIdToken(token);
          
          // Try to get user by Firebase UID first
          let user = await storage.getUser(decodedToken.uid);
          
          // If not found by UID, try by email
          if (!user && decodedToken.email) {
            const existingUser = await db.select().from(users).where(eq(users.email, decodedToken.email)).limit(1);
            if (existingUser.length > 0) {
              user = existingUser[0];
            }
          }
          
          userId = user?.id;
        } catch (authError) {
          console.log("Authentication failed, continuing without user context");
        }
      }

      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const showAll = req.query.showAll === 'true';

      let businesses;
      if (showAll) {
        // For admin use - get all businesses including inactive
        const allBusinesses = await db
          .select()
          .from(businessesTable)
          .orderBy(desc(businessesTable.isPremium), desc(businessesTable.isRecommended), asc(businessesTable.name));
        
        // Get categories for each business
        const businessCategoryData = await db
          .select({
            businessId: businessCategories.businessId,
            category: categories,
          })
          .from(businessCategories)
          .leftJoin(categories, eq(businessCategories.categoryId, categories.id));

        const businessCategoryMap = new Map();
        businessCategoryData.forEach(({ businessId, category }) => {
          if (!businessCategoryMap.has(businessId)) {
            businessCategoryMap.set(businessId, []);
          }
          if (category) {
            businessCategoryMap.get(businessId).push(category);
          }
        });

        businesses = allBusinesses.map(business => ({
          ...business,
          categories: businessCategoryMap.get(business.id) || [],
          category: businessCategoryMap.get(business.id)?.[0] || null,
        }));
      } else if (categoryId) {
        businesses = await storage.getBusinessesByCategory(categoryId);
      } else {
        businesses = await storage.getBusinessesWithUserLikes(userId || undefined);
      }

      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ error: "Failed to fetch businesses" });
    }
  });

  app.get('/api/businesses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusiness(id);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      res.status(500).json({ message: "Failed to fetch business" });
    }
  });

  app.post('/api/businesses', verifyFirebaseToken, requireFirebaseBusinessOwner, async (req: Request, res: Response) => {
    try {

      // Extract categoryIds from the request body and validate the rest with the schema
      const { categoryIds, ...businessFields } = req.body;
      
      // Clean and validate numeric fields to prevent empty string errors
      const cleanedFields = {
        ...businessFields,
        // Convert empty strings to undefined for required numeric fields
        latitude: businessFields.latitude === '' ? undefined : businessFields.latitude,
        longitude: businessFields.longitude === '' ? undefined : businessFields.longitude,
        // Convert empty strings to null for optional numeric fields
        rating: businessFields.rating === '' ? null : businessFields.rating,
        reviewCount: businessFields.reviewCount === '' ? null : businessFields.reviewCount,
        // Clean array fields
        gallery: Array.isArray(businessFields.gallery) ? businessFields.gallery.filter(url => url && url.trim()) : [],
        tags: Array.isArray(businessFields.tags) ? businessFields.tags.filter(tag => tag && tag.trim()) : [],
        amenities: Array.isArray(businessFields.amenities) ? businessFields.amenities.filter(amenity => amenity && amenity.trim()) : [],
      };
      
      const businessData = insertBusinessSchema.parse(cleanedFields);
      const userId = req.user.uid;
      const userRole = req.user.role;
      
      // Permission check: Only business owners and admins can create businesses
      if (userRole === 'viewer') {
        return res.status(403).json({ message: "Viewers cannot create businesses" });
      }
      
      // Get the database user ID for this Firebase user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Business owners can only create businesses for themselves unless they're admin
      if (userRole === 'business_owner' && !businessData.ownerId) {
        businessData.ownerId = user.id;
      } else if (userRole === 'business_owner' && businessData.ownerId !== user.id) {
        return res.status(403).json({ message: "Business owners can only create businesses for themselves" });
      }
      
      // Include categoryIds in the business creation
      const business = await storage.createBusiness({ ...businessData, categoryIds });
      res.status(201).json(business);
    } catch (error) {
      console.error("Error creating business:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid business data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create business" });
      }
    }
  });

  // Update business route
  app.put('/api/businesses/:id', verifyFirebaseToken, requireFirebaseBusinessOwner, async (req: Request, res: Response) => {
    try {
      const businessId = parseInt(req.params.id);
      const { categoryIds, ...businessFields } = req.body;
      
      // Clean and validate numeric fields to prevent empty string errors
      const cleanedFields = {
        ...businessFields,
        // Convert empty strings to undefined for required numeric fields
        latitude: businessFields.latitude === '' ? undefined : businessFields.latitude,
        longitude: businessFields.longitude === '' ? undefined : businessFields.longitude,
        // Convert empty strings to null for optional numeric fields
        rating: businessFields.rating === '' ? null : businessFields.rating,
        reviewCount: businessFields.reviewCount === '' ? null : businessFields.reviewCount,
        // Clean array fields
        gallery: Array.isArray(businessFields.gallery) ? businessFields.gallery.filter(url => url && url.trim()) : businessFields.gallery,
        tags: Array.isArray(businessFields.tags) ? businessFields.tags.filter(tag => tag && tag.trim()) : businessFields.tags,
        amenities: Array.isArray(businessFields.amenities) ? businessFields.amenities.filter(amenity => amenity && amenity.trim()) : businessFields.amenities,
      };
      
      // Filter out undefined values
      const filteredFields = Object.fromEntries(
        Object.entries(cleanedFields).filter(([key, value]) => 
          value !== undefined
        )
      );
      
      const businessData = insertBusinessSchema.partial().parse(filteredFields);
      const userId = req.user.uid;
      const userRole = req.user.role;
      
      // Check if business exists
      const existingBusiness = await storage.getBusiness(businessId);
      if (!existingBusiness) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      // Permission check: Admin can edit any business, business owners can only edit their own
      if (userRole === 'business_owner' && existingBusiness.ownerId !== userId) {
        return res.status(403).json({ message: "You can only edit your own businesses" });
      } else if (userRole === 'viewer') {
        return res.status(403).json({ message: "Viewers cannot edit businesses" });
      }
      
      // Include categoryIds in the business update
      const updatedBusiness = await storage.updateBusiness(businessId, { ...businessData, categoryIds });
      res.json(updatedBusiness);
    } catch (error) {
      console.error("Error updating business:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid business data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update business" });
      }
    }
  });

  // Delete business route (admin only)
  app.delete('/api/businesses/:id', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      
      // Check if business exists
      const existingBusiness = await storage.getBusiness(businessId);
      if (!existingBusiness) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      // Delete the business
      const success = await storage.deleteBusiness(businessId);
      
      if (success) {
        res.json({ message: "Business deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete business" });
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      res.status(500).json({ message: "Failed to delete business" });
    }
  });



  // Business owner routes
  app.get('/api/owner/businesses', requireFirebaseBusinessOwner, async (req: any, res) => {
    try {
      const firebaseUid = req.user.uid;
      
      // Get the database user ID for this Firebase user
      const user = await storage.getUser(firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const businesses = await storage.getBusinessesByOwner(user.id);
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching owner businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  // Admin stats route
  app.get('/api/admin/stats', requireFirebaseAdmin, async (req: Request, res: Response) => {
    try {
      const [businesses, categories, articles, guestbookEntries, allUsers] = await Promise.all([
        storage.getAllBusinesses(),
        storage.getCategories(),
        storage.getArticles(),
        storage.getGuestbookEntries(),
        storage.getUsersByRole('viewer').then(async viewers => {
          const businessOwners = await storage.getUsersByRole('business_owner');
          const admins = await storage.getUsersByRole('admin');
          return [...viewers, ...businessOwners, ...admins];
        })
      ]);

      res.json({
        businesses: businesses.length,
        categories: categories.length,
        articles: articles.length,
        guestbookEntries: guestbookEntries.length,
        users: allUsers.length
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Google Places import route (admin only)
  app.post('/api/admin/import-google-places', requireFirebaseAdmin, async (req: Request, res: Response) => {
    try {
      console.log('Starting Google Places import...');
      res.json({ message: 'Import started', status: 'processing' });
      
      // Run import in background
      googlePlacesImporter.importBusinesses().catch((error: any) => {
        console.error('Google Places import failed:', error);
      });
    } catch (error) {
      console.error("Error starting Google Places import:", error);
      res.status(500).json({ message: "Failed to start import" });
    }
  });

  // Single business Google Places update
  app.post('/api/admin/businesses/:id/import-google', requireFirebaseAdmin, async (req: Request, res: Response) => {
    try {
      const businessId = parseInt(req.params.id);
      const business = await storage.getBusiness(businessId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      // Google Places update functionality currently disabled
      const success = false;
      
      if (success) {
        const updatedBusiness = await storage.getBusiness(businessId);
        res.json({ message: 'Business updated successfully', business: updatedBusiness });
      } else {
        res.status(400).json({ message: 'Failed to find or update business data from Google' });
      }
    } catch (error) {
      console.error("Error importing Google data for business:", error);
      res.status(500).json({ message: "Failed to import Google data" });
    }
  });

  // User likes routes
  app.get('/api/user/likes', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const firebaseUid = req.user.uid;
      
      // Get the database user ID for this Firebase user
      let user = await storage.getUser(firebaseUid);
      
      // If user not found by Firebase UID, try to find by email
      if (!user && req.user.email) {
        const existingUser = await db.select().from(users).where(eq(users.email, req.user.email)).limit(1);
        if (existingUser.length > 0) {
          user = existingUser[0];
        }
      }
      
      if (!user) {
        return res.json([]); // Return empty array instead of error for better UX
      }
      
      const businesses = await storage.getBusinessesWithUserLikes(user.id);
      const favoriteBusinesses = businesses.filter(business => business.isLiked);
      res.json(favoriteBusinesses);
    } catch (error) {
      console.error("Error fetching user likes:", error);
      res.status(500).json({ message: "Failed to fetch user likes" });
    }
  });

  app.post('/api/user/likes/toggle', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const firebaseUid = req.user.uid;
      const { businessId } = req.body;
      
      if (!businessId || typeof businessId !== 'number') {
        return res.status(400).json({ message: "Valid businessId is required" });
      }
      
      // Get the database user ID for this Firebase user
      let user = await storage.getUser(firebaseUid);
      
      // If user not found by Firebase UID, try to find by email
      if (!user && req.user.email) {
        const existingUser = await db.select().from(users).where(eq(users.email, req.user.email)).limit(1);
        if (existingUser.length > 0) {
          user = existingUser[0];
        }
      }
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const result = await storage.toggleUserLike(user.id, businessId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling user like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Reset data endpoint (for development)
  app.post('/api/reset-data', async (req: Request, res: Response) => {
    try {
      // Clear all existing businesses
      await storage.clearAllBusinesses();

      res.json({ message: "Data reset successfully" });
    } catch (error) {
      console.error("Error resetting data:", error);
      res.status(500).json({ message: "Failed to reset data" });
    }
  });

  // Initialize data endpoint (for development)
  app.post('/api/init-data', async (req, res) => {
    try {
      // Create categories
      const categoriesData = [
        { name: "Accommodation", slug: "accommodation", color: "#DDB097", icon: "bed" },
        { name: "Food & Drink", slug: "food-drink", color: "#F7BAAD", icon: "utensils" },
        { name: "Kiting", slug: "kiting", color: "#3FC1C4", icon: "wind" },
        { name: "Surf", slug: "surf", color: "#35949B", icon: "waves" },
        { name: "Things To Do", slug: "things-to-do", color: "#A9D3D2", icon: "camera" },
        { name: "ATM", slug: "atm", color: "#DD4327", icon: "credit-card" },
        { name: "Medical", slug: "medical", color: "#DC2626", icon: "heart-pulse" },
        { name: "Market", slug: "market", color: "#059669", icon: "shopping-cart" },
        { name: "Supermarket", slug: "supermarket", color: "#0891B2", icon: "shopping-bag" },
        { name: "Mechanic", slug: "mechanic", color: "#7C3AED", icon: "wrench" },
        { name: "Phone Repair", slug: "phone-repair", color: "#EA580C", icon: "smartphone" },
        { name: "Gym", slug: "gym", color: "#BE185D", icon: "dumbbell" },
        { name: "Massage", slug: "massage", color: "#9333EA", icon: "hand" },
        { name: "Recreation", slug: "recreation", color: "#16A34A", icon: "sun" },
        { name: "Waterfall", slug: "waterfall", color: "#0284C7", icon: "droplets" },
        { name: "Attractions", slug: "attractions", color: "#C2410C", icon: "map-pin" },
        { name: "Pharmacy", slug: "pharmacy", color: "#DC2626", icon: "pill" },
        { name: "Mobile Phone", slug: "mobile-phone", color: "#7C2D12", icon: "phone" },
      ];

      const categories = await Promise.all(
        categoriesData.map(async (cat) => {
          try {
            return await storage.createCategory(cat);
          } catch (error) {
            // Category might already exist, continue
            return null;
          }
        })
      );

      // Get category IDs
      const allCategories = await storage.getCategories();
      const categoryMap: Record<string, number> = {};
      allCategories.forEach(cat => {
        categoryMap[cat.slug] = cat.id;
      });

      // Check if data is already initialized
      const existingBusinesses = await storage.getBusinesses();
      if (existingBusinesses.length >= 75) {
        return res.json({ 
          message: "Data already initialized",
          categories: allCategories.length,
          businesses: existingBusinesses.length
        });
      }

      // Create businesses based on the provided data
      const businessesData = [
        { name: "Phi Kite School", longitude: "109.1466303", latitude: "11.609051", category: "kiting" },
        { name: "Ninh Thuan Stone Park", longitude: "109.16033562229548", latitude: "11.632838820357826", category: "recreation" },
        { name: "Lo O stream", longitude: "109.18908449614895", latitude: "11.7277889144002", category: "waterfall" },
        { name: "Stone Balcony", longitude: "109.1806202", latitude: "11.7813086", category: "waterfall" },
        { name: "Quán Nướng Chinh", longitude: "109.093323", latitude: "11.5881943", category: "food-drink" },
        { name: "Gym Thành vương", longitude: "109.1110923", latitude: "11.5839599", category: "gym" },
        { name: "SPA HUYNH LE", longitude: "109.12253750044609", latitude: "11.580022696395199", category: "massage" },
        { name: "Vân Trinh Quán", longitude: "109.13184523954125", latitude: "11.58123087598502", category: "food-drink" },
        { name: "Quán Nhậu Hải Sản Sơn Ca (SON CA SEAFOOD RESTAURANT)", longitude: "109.04084053954136", latitude: "11.58950968154129", category: "food-drink" },
        { name: "Ninh Thuan Tourist Night Market", longitude: "109.0002817", latitude: "11.5674067", category: "market" },
        { name: "Bãi Thùng", longitude: "109.22346517975794", latitude: "11.746072483438226", category: "recreation" },
        { name: "Surf Spot", longitude: "109.1641657", latitude: "11.6220852", category: "surf" },
        { name: "Sight Spot", longitude: "109.21498323580664", latitude: "11.753769471192864", category: "attractions" },
        { name: "Quang Hanh Seafood Restaurant", longitude: "109.14582943558244", latitude: "11.609608802765214", category: "food-drink" },
        { name: "Supermarket My Hoa", longitude: "109.14580080674735", latitude: "11.609490858914706", category: "supermarket" },
        { name: "Thanh Hoa Spa & Massage", longitude: "109.14505174907715", latitude: "11.605285261608342", category: "massage" },
        { name: "Hoàng Sáng Residence & Restaurant", longitude: "109.14495518956126", latitude: "11.6071664563042", category: "accommodation" },
        { name: "Com Restaurant", longitude: "109.14840539562361", latitude: "11.617250037323663", category: "food-drink" },
        { name: "Farobe - Farmstay & Homestay", longitude: "109.14671994559635", latitude: "11.611912978543582", category: "accommodation" },
        { name: "Bánh xèo cô Luỹ", longitude: "109.11173238018986", latitude: "11.586167219121084", category: "food-drink" },
        { name: "Siêu thị Bách hoá XANH Nhơn Hải", longitude: "109.11243973954154", latitude: "11.588450691379888", category: "supermarket" },
        { name: "Hospital of Ninh Hai District", longitude: "109.0295103887739", latitude: "11.598916185548248", category: "medical" },
        { name: "Đoài Vegetarian Restaurant and Coffee", longitude: "109.18990310886277", latitude: "11.726828996353927", category: "food-drink" },
        { name: "Chợ Mỹ Hòa", longitude: "109.14744820859305", latitude: "11.61566958231253", category: "market" },
        { name: "Sorrento Beach Club Vietnam and Kite Centre", longitude: "109.14714083954186", latitude: "11.613175654310185", category: "kiting" },
        { name: "Vietnam Surf Camping", longitude: "109.14598576679313", latitude: "11.604913370140338", category: "kiting" },
        { name: "Quầy Thuốc Lan", longitude: "109.1187256508982", latitude: "11.58591429169155", category: "pharmacy" },
        { name: "Tiệm Thuốc Bắc Phương", longitude: "109.11283851070625", latitude: "11.58557024228947", category: "pharmacy" },
        { name: "TY TÁO APPLE", longitude: "108.98591834692387", latitude: "11.57278403877868", category: "mobile-phone" },
        { name: "Nam A Bank", longitude: "109.0984989", latitude: "11.5877636", category: "atm" },
        { name: "Bánh mi Ari", longitude: "109.11203920886045", latitude: "11.583646784672514", category: "food-drink" },
        { name: "Sửa Xe Quang", longitude: "109.14768458187595", latitude: "11.616184017476552", category: "mechanic" },
        { name: "Sửa Xe Tưởng", longitude: "109.14775987893938", latitude: "11.615824813399625", category: "mechanic" },
        { name: "Đi Surf", longitude: "109.17605638423518", latitude: "11.676692071027649", category: "surf" },
        { name: "VƯỜN NHÀ BÀ HƯƠNG", longitude: "109.19156110490167", latitude: "11.72720551249635", category: "food-drink" },
        { name: "Mỹ Tường 2 Maket", longitude: "109.1162549746144", latitude: "11.583840731905196", category: "market" },
        { name: "Vịnh Vĩnh Hy", longitude: "109.19663654896006", latitude: "11.725978025751777", category: "attractions" },
        { name: "Khu du lịch Hang Rái", longitude: "109.1827376151634", latitude: "11.678165496573625", category: "attractions" },
        { name: "Hồ Đá Hang", longitude: "109.16376388534367", latitude: "11.689800966904574", category: "attractions" },
        { name: "Amanoi", longitude: "109.1976847957338", latitude: "11.709837045045854", category: "accommodation" },
        { name: "Bãi tắm Hòn Rùa", longitude: "109.22075421600371", latitude: "11.716869956167146", category: "attractions" },
        { name: "Bãi biển Bình Tiên", longitude: "109.18503012285544", latitude: "11.80177473447905", category: "surf" },
        { name: "ANARA Binh Tien Golf Club", longitude: "109.17903711197583", latitude: "11.802903447069856", category: "attractions" },
        { name: "Binh Lap", longitude: "109.1729761411355", latitude: "11.85096635323411", category: "attractions" },
        { name: "Tropixblue Guesthouse", longitude: "109.17362049927166", latitude: "11.665360718681976", category: "accommodation" },
        { name: "Thái An", longitude: "109.1714127513966", latitude: "11.662841953976537", category: "attractions" },
        { name: "Vườn Nho Thái Đạt", longitude: "109.15968477003852", latitude: "11.654418870955856", category: "attractions" },
        { name: "Công viên stone", longitude: "109.16571543322603", latitude: "11.625042206202346", category: "recreation" },
        { name: "Color Inn", longitude: "109.14817137791222", latitude: "11.61414969263561", category: "accommodation" },
        { name: "MyHoa Lagoon - Kiting Town", longitude: "109.14634747562955", latitude: "11.608411627264813", category: "kiting" },
        { name: "Phan Rang Kite Center", longitude: "109.14642087584058", latitude: "11.605324725762694", category: "kiting" },
        { name: "OzFarm-Kiteboarding School", longitude: "109.14567214191531", latitude: "11.603593017195797", category: "kiting" },
        { name: "Cơm Sườn Ba Chỉ nướng thơm ngon nhất vùng", longitude: "109.12909344839473", latitude: "11.58323277773106", category: "food-drink" },
        { name: "PHONG GYM MỸ TƯỜNG", longitude: "109.11039284819316", latitude: "11.588982291748032", category: "gym" },
        { name: "Quán ăn hải sản Mỹ Nhân Ngư", longitude: "109.12844139753118", latitude: "11.579622833264818", category: "food-drink" },
        { name: "Bến Tàu Cá Mỹ Tân (PIER)", longitude: "109.13352593086559", latitude: "11.58173668249799", category: "attractions" },
        { name: "Nomad Homestay", longitude: "109.12991492393363", latitude: "11.580856015240307", category: "accommodation" },
        { name: "Bờ kè Ninh Hải", longitude: "109.06058569969743", latitude: "11.583225679894348", category: "attractions" },
        { name: "Mirro Salt Lake", longitude: "109.06011549994085", latitude: "11.58477276996619", category: "attractions" },
        { name: "Jo Garden Coffee", longitude: "109.050042711024", latitude: "11.59575152452612", category: "food-drink" },
        { name: "Ninh Chu beach", longitude: "109.03339222739925", latitude: "11.587209763824733", category: "recreation" },
        { name: "Binh Son Beach", longitude: "109.0245849974999", latitude: "11.565489337259535", category: "recreation" },
        { name: "Vincom Ninh Thuận", longitude: "109.00926806049043", latitude: "11.563727539068521", category: "supermarket" },
        { name: "Ninh Thuận Museum", longitude: "108.99954400308874", latitude: "11.56450501474619", category: "attractions" },
        { name: "Quảng trường Thành Phố Phan Rang-Tháp Chàm Ninh Thuận", longitude: "108.9996603954941", latitude: "11.56552091301579", category: "attractions" },
        { name: "MASSAGE ĐIỀU TRỊ DA SUNNY SPA", longitude: "108.99767669474326", latitude: "11.568454328765565", category: "massage" },
        { name: "Mono Coffee", longitude: "108.99454062119294", latitude: "11.571210135252343", category: "food-drink" },
        { name: "Hùng Mobile", longitude: "108.99117646916473", latitude: "11.569180523659023", category: "mobile-phone" },
        { name: "Viettel Store", longitude: "108.99054083819767", latitude: "11.564939687270572", category: "mobile-phone" },
        { name: "Phan Rang Market", longitude: "108.99006128300952", latitude: "11.561427584859224", category: "market" },
        { name: "Saigon - Phan Rang Hospital", longitude: "108.99032098803568", latitude: "11.56632245428013", category: "medical" },
        { name: "Ninh Thuan Hospital", longitude: "108.98905576216565", latitude: "11.565953299072081", category: "medical" },
        { name: "Massage Người Mù Nam Hằng", longitude: "108.99734292304726", latitude: "11.578268764029197", category: "massage" },
        { name: "Ninh Thuan Provincial General Hospital", longitude: "109.00461987220595", latitude: "11.580484282646273", category: "medical" },
        { name: "Phan Rang Buffet", longitude: "108.99793973674443", latitude: "11.564025508149198", category: "food-drink" },
      ];

      const businesses = await Promise.all(
        businessesData.map(async (biz) => {
          try {
            const categoryId = categoryMap[biz.category];
            if (!categoryId) return null;

            return await storage.createBusiness({
              name: biz.name,
              latitude: biz.latitude,
              longitude: biz.longitude,
              categoryIds: [categoryId], // Use categoryIds array instead of categoryId
              isActive: true,
              isPremium: false,
            });
          } catch (error) {
            // Business might already exist, continue
            return null;
          }
        })
      );

      res.json({ 
        message: "Data initialized successfully",
        categories: categories.filter(Boolean).length,
        businesses: businesses.filter(Boolean).length
      });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  // Article routes
  app.get('/api/articles', async (req: Request, res: Response) => {
    try {
      const { tag, featured } = req.query;
      let articles;
      
      if (featured === 'true') {
        articles = await storage.getFeaturedArticles();
      } else if (tag) {
        articles = await storage.getArticlesByTag(tag as string);
      } else {
        articles = await storage.getArticles();
      }
      
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get('/api/articles/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post('/api/articles', verifyFirebaseToken, requireFirebaseAdmin, async (req: Request, res: Response) => {
    try {
      const rawData = req.body;
      
      // Transform data to handle timestamp fields and coordinate conversion
      const transformedData = {
        ...rawData,
        // Convert string dates to Date objects for timestamp fields
        ...(rawData.publicationDate && { 
          publicationDate: new Date(rawData.publicationDate) 
        }),
        // Convert numeric coordinates to strings for decimal fields
        ...(rawData.latitude !== undefined && { 
          latitude: rawData.latitude.toString() 
        }),
        ...(rawData.longitude !== undefined && { 
          longitude: rawData.longitude.toString() 
        }),
      };
      
      const articleData = insertArticleSchema.parse(transformedData);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });



  // Guestbook routes
  // Get all guestbook entries with comments and related data
  app.get('/api/guestbook', async (req: Request, res: Response) => {
    try {
      const entries = await storage.getGuestbookEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching guestbook entries:", error);
      res.status(500).json({ message: "Failed to fetch guestbook entries" });
    }
  });

  // Create a new guestbook entry
  app.post('/api/guestbook', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const user = req.user as any; // Firebase user object
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get client IP and user agent for spam protection
      const clientIp = getClientIP(req);
      const userAgent = req.headers['user-agent'] || '';

      // Check rate limiting (skip if rate limits table doesn't exist)
      try {
        const rateLimitCheck = await checkRateLimit(user.uid, 'guestbook_entry');
        if (!rateLimitCheck.allowed) {
          return res.status(429).json({ 
            message: `Rate limit exceeded. You can post ${3} more entries in ${Math.ceil((rateLimitCheck.resetTime.getTime() - Date.now()) / (1000 * 60))} minutes.`,
            resetTime: rateLimitCheck.resetTime
          });
        }
      } catch (rateLimitError) {
        console.warn('Rate limiting table not found, skipping rate limit check');
      }

      // Get full user data from database for name
      const dbUser = await storage.getUser(user.uid);
      const displayName = dbUser?.firstName && dbUser?.lastName 
        ? `${dbUser.firstName} ${dbUser.lastName}` 
        : user.email?.split('@')[0] || 'Anonymous';

      // Clean up numeric fields that might be empty strings
      const cleanedBody = { ...req.body };
      
      // Convert empty strings to null for numeric fields
      if (cleanedBody.relatedPlaceId === '') cleanedBody.relatedPlaceId = null;
      if (cleanedBody.rating === '') cleanedBody.rating = null;
      if (cleanedBody.latitude === '') cleanedBody.latitude = null;
      if (cleanedBody.longitude === '') cleanedBody.longitude = null;
      
      // Convert string numbers to actual numbers
      if (cleanedBody.relatedPlaceId && typeof cleanedBody.relatedPlaceId === 'string') {
        cleanedBody.relatedPlaceId = parseInt(cleanedBody.relatedPlaceId, 10);
      }
      if (cleanedBody.rating && typeof cleanedBody.rating === 'string') {
        cleanedBody.rating = parseInt(cleanedBody.rating, 10);
      }

      // Check for spam content
      const spamCheck = await checkSpam(cleanedBody.message, displayName);
      
      // Determine initial status based on spam check and user role
      let status = 'pending';
      if (spamCheck.isSpam) {
        status = 'spam';
      } else if (dbUser?.role === 'admin') {
        status = 'approved'; // Auto-approve admin posts
      }
      
      const entryData = insertGuestbookEntrySchema.parse({
        ...cleanedBody,
        authorId: user.uid,
        authorName: displayName,
        status,
        isSpam: spamCheck.isSpam,
        spamScore: spamCheck.spamScore,
        ipAddress: clientIp,
        userAgent: userAgent,
      });

      const entry = await storage.createGuestbookEntry(entryData);

      // Log spam detection for review
      if (spamCheck.isSpam) {
        console.log(`🚨 Spam detected in guestbook entry ${entry.id}:`, {
          score: spamCheck.spamScore,
          reasons: spamCheck.reasons,
          author: displayName,
          preview: cleanedBody.message.substring(0, 100) + '...'
        });
      } else if (status === 'pending') {
        console.log(`📝 New guestbook entry pending approval: ${entry.id} by ${displayName}`);
      }

      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating guestbook entry:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid entry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create guestbook entry" });
      }
    }
  });

  // Get guestbook entries for a specific business
  app.get('/api/businesses/:id/guestbook', async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const entries = await storage.getGuestbookEntriesByBusiness(businessId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching business guestbook entries:", error);
      res.status(500).json({ message: "Failed to fetch guestbook entries" });
    }
  });

  // Like/unlike a guestbook entry
  app.post('/api/guestbook/:id/like', verifyFirebaseToken, async (req, res) => {
    try {
      const user = req.user as any; // Firebase user object
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const entryId = parseInt(req.params.id);
      const result = await storage.toggleGuestbookEntryLike(user.uid, entryId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling entry like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Add a comment to a guestbook entry
  app.post('/api/guestbook/:id/comments', verifyFirebaseToken, async (req, res) => {
    try {
      const user = req.user as any; // Firebase user object
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Check rate limiting for comments (skip if rate limits table doesn't exist)
      try {
        const rateLimitCheck = await checkRateLimit(user.uid, 'guestbook_comment');
        if (!rateLimitCheck.allowed) {
          return res.status(429).json({ 
            message: `Rate limit exceeded. You can post ${10} more comments in ${Math.ceil((rateLimitCheck.resetTime.getTime() - Date.now()) / (1000 * 60))} minutes.`,
            resetTime: rateLimitCheck.resetTime
          });
        }
      } catch (rateLimitError) {
        console.warn('Rate limiting table not found, skipping rate limit check');
      }

      const entryId = parseInt(req.params.id);
      
      // Get full user data from database for name
      const dbUser = await storage.getUser(user.uid);
      const displayName = dbUser?.firstName && dbUser?.lastName 
        ? `${dbUser.firstName} ${dbUser.lastName}` 
        : user.email?.split('@')[0] || 'Anonymous';

      // Check for spam in comment content
      const spamCheck = await checkSpam(req.body.comment, displayName);
      const clientIp = getClientIP(req);

      // Determine initial status based on spam check and user role
      let status = 'pending';
      if (spamCheck.isSpam) {
        status = 'spam';
      } else if (dbUser?.role === 'admin') {
        status = 'approved'; // Auto-approve admin comments
      }

      const commentData = insertGuestbookCommentSchema.parse({
        ...req.body,
        entryId,
        authorId: user.uid,
        authorName: displayName,
        status,
        isSpam: spamCheck.isSpam,
        ipAddress: clientIp,
      });

      const comment = await storage.createGuestbookComment(commentData);

      // Log spam detection for review
      if (spamCheck.isSpam) {
        console.log(`🚨 Spam detected in comment ${comment.id}:`, {
          score: spamCheck.spamScore,
          reasons: spamCheck.reasons,
          author: displayName,
          preview: req.body.comment.substring(0, 100) + '...'
        });
      }

      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create comment" });
      }
    }
  });

  // Like/unlike a comment
  app.post('/api/guestbook/comments/:id/like', verifyFirebaseToken, async (req, res) => {
    try {
      const user = req.user as any; // Firebase user object
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const commentId = parseInt(req.params.id);
      const result = await storage.toggleGuestbookCommentLike(user.uid, commentId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling comment like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Admin-only routes for moderation
  app.get('/api/admin/guestbook/pending', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const pendingEntries = await storage.getPendingGuestbookEntries();
      res.json(pendingEntries);
    } catch (error) {
      console.error("Error fetching pending entries:", error);
      res.status(500).json({ message: "Failed to fetch pending entries" });
    }
  });

  app.get('/api/admin/guestbook/spam', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const spamEntries = await storage.getSpamGuestbookEntries();
      res.json(spamEntries);
    } catch (error) {
      console.error("Error fetching spam entries:", error);
      res.status(500).json({ message: "Failed to fetch spam entries" });
    }
  });

  app.get('/api/admin/guestbook/approved', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const approvedEntries = await storage.getApprovedGuestbookEntries();
      res.json(approvedEntries);
    } catch (error) {
      console.error("Error fetching approved entries:", error);
      res.status(500).json({ message: "Failed to fetch approved entries" });
    }
  });

  app.post('/api/admin/guestbook/:id/moderate', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const entryId = parseInt(req.params.id);
      const user = req.user as any;
      
      if (!['approved', 'rejected', 'spam'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      await storage.moderateGuestbookEntry(entryId, status, user.uid, notes);
      res.json({ message: "Entry moderated successfully" });
    } catch (error) {
      console.error("Error moderating entry:", error);
      res.status(500).json({ message: "Failed to moderate entry" });
    }
  });

  app.put('/api/admin/guestbook/:id', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const updates = req.body;
      
      await storage.updateGuestbookEntry(entryId, updates);
      res.json({ message: "Entry updated successfully" });
    } catch (error) {
      console.error("Error updating entry:", error);
      res.status(500).json({ message: "Failed to update entry" });
    }
  });

  app.post('/api/admin/guestbook/comments/:id/moderate', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const commentId = parseInt(req.params.id);
      const user = req.user as any;
      
      if (!['approved', 'rejected', 'spam'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      await storage.moderateGuestbookComment(commentId, status, user.uid);
      res.json({ message: "Comment moderated successfully" });
    } catch (error) {
      console.error("Error moderating comment:", error);
      res.status(500).json({ message: "Failed to moderate comment" });
    }
  });

  // Admin user management routes
  app.get('/api/admin/users', verifyFirebaseToken, requireFirebaseAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/admin/users', verifyFirebaseToken, requireFirebaseAdmin, async (req: any, res) => {
    try {
      const userData = req.body;
      
      // Generate a unique ID for manual user creation (for demo purposes)
      // In a real app, users would only be created via Firebase authentication
      const userId = userData.id || `admin_created_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const userWithId = {
        ...userData,
        id: userId
      };
      
      const user = await storage.createUser(userWithId);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put('/api/admin/users/:id', verifyFirebaseToken, requireFirebaseAdmin, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const user = await storage.updateUser(userId, userData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete('/api/admin/users/:id', verifyFirebaseToken, requireFirebaseAdmin, async (req: any, res) => {
    try {
      const userId = req.params.id;
      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin guestbook management routes
  app.post('/api/admin/guestbook', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const user = req.user as any;
      const entryData = {
        ...req.body,
        authorId: user.uid,
        status: 'approved', // Admin-created entries are auto-approved
        isSpam: false,
        spamScore: 0,
      };
      
      const entry = await storage.createGuestbookEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating admin guestbook entry:", error);
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  app.delete('/api/admin/guestbook/:id', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const entryId = parseInt(req.params.id);
      await storage.deleteGuestbookEntry(entryId);
      res.json({ message: "Entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting guestbook entry:", error);
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  // Article management routes
  app.put('/api/articles/:id', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const rawData = req.body;
      
      // Check if article exists
      const existingArticle = await storage.getArticle(articleId);
      if (!existingArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Transform data to handle timestamp fields and coordinate conversion
      const articleData = {
        ...rawData,
        // Convert string dates to Date objects for timestamp fields
        ...(rawData.publicationDate && { 
          publicationDate: new Date(rawData.publicationDate) 
        }),
        // Convert numeric coordinates to strings for decimal fields
        ...(rawData.latitude !== undefined && { 
          latitude: rawData.latitude.toString() 
        }),
        ...(rawData.longitude !== undefined && { 
          longitude: rawData.longitude.toString() 
        }),
        // updatedAt will be handled automatically by the database
        // Remove fields that shouldn't be updated manually
        createdAt: undefined,
        updatedAt: undefined,
        id: undefined,
      };
      
      const updatedArticle = await storage.updateArticle(articleId, articleData);
      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete('/api/articles/:id', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      await storage.deleteArticle(articleId);
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Import routes for business data management
  app.post('/api/import/google-places', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      console.log('Starting Google Places import...');
      const importModule = await import('./googlePlacesImporter.js');
      await importModule.default();
      res.json({ success: true, message: 'Google Places import completed successfully' });
    } catch (error) {
      console.error('Google Places import failed:', error);
      res.status(500).json({ success: false, error: 'Import failed', details: (error as Error).message });
    }
  });

  app.post('/api/import/manual', verifyFirebaseToken, requireFirebaseAdmin, async (req, res) => {
    try {
      console.log('Starting manual import...');
      const importModule = await import('./manualImport.js');
      await importModule.default();
      res.json({ success: true, message: 'Manual import completed successfully' });
    } catch (error) {
      console.error('Manual import failed:', error);
      res.status(500).json({ success: false, error: 'Import failed', details: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}