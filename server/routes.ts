import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { firebaseAuthMiddleware, optionalFirebaseAuth } from "./firebaseAuth";
import { requireAdmin, requireBusinessOwner, permissions } from "./rbac";
import { insertBusinessSchema, insertCategorySchema, insertUserLikeSchema, insertArticleSchema, businesses as businessesTable, businessCategories, categories, articles } from "@shared/schema";
import { googlePlacesImporter } from "./googlePlacesImporter";
import { z } from "zod";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes - support Firebase auth
  app.get('/api/auth/user', optionalFirebaseAuth, async (req: any, res) => {
    try {
      const user = req.user;
      if (user) {
        // For Firebase users, return the Firebase user data
        res.json({
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'viewer' // Default role for Firebase users
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req, res) => {
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
  app.get('/api/businesses', async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
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
        businesses = await storage.getBusinessesWithUserLikes(userId);
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

  app.post('/api/businesses', isAuthenticated, async (req: any, res) => {
    try {
      // Extract categoryIds from the request body and validate the rest with the schema
      const { categoryIds, ...businessFields } = req.body;
      
      const businessData = insertBusinessSchema.parse(businessFields);
      const userId = req.user.claims.sub;
      const userRole = req.user.role;
      
      // Permission check: Only business owners and admins can create businesses
      if (userRole === 'viewer') {
        return res.status(403).json({ message: "Viewers cannot create businesses" });
      }
      
      // Business owners can only create businesses for themselves unless they're admin
      if (userRole === 'business_owner' && !businessData.ownerId) {
        businessData.ownerId = userId;
      } else if (userRole === 'business_owner' && businessData.ownerId !== userId) {
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
  app.put('/api/businesses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const { categoryIds, ...businessFields } = req.body;
      
      // Filter out empty strings and undefined values
      const filteredFields = Object.fromEntries(
        Object.entries(businessFields).filter(([key, value]) => 
          value !== '' && value !== undefined && value !== null
        )
      );
      
      const businessData = insertBusinessSchema.partial().parse(filteredFields);
      const userId = req.user.claims.sub;
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

  // Admin routes for user management
  app.get('/api/admin/users', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const { role } = req.query;
      let users;
      if (role) {
        users = await storage.getUsersByRole(role as string);
      } else {
        // Get all users - implement this method if needed
        users = await storage.getUsersByRole('viewer').then(async viewers => {
          const businessOwners = await storage.getUsersByRole('business_owner');
          const admins = await storage.getUsersByRole('admin');
          return [...viewers, ...businessOwners, ...admins];
        });
      }
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put('/api/admin/users/:id/role', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const { role } = req.body;
      
      if (!['admin', 'business_owner', 'viewer'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const user = await storage.updateUserRole(userId, role);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Business owner routes
  app.get('/api/owner/businesses', isAuthenticated, requireBusinessOwner, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const businesses = await storage.getBusinessesByOwner(userId);
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching owner businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  // Google Places import route (admin only)
  app.post('/api/admin/import-google-places', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      console.log('Starting Google Places import...');
      res.json({ message: 'Import started', status: 'processing' });
      
      // Run import in background
      googlePlacesImporter.importAllBusinesses().catch(error => {
        console.error('Google Places import failed:', error);
      });
    } catch (error) {
      console.error("Error starting Google Places import:", error);
      res.status(500).json({ message: "Failed to start import" });
    }
  });

  // Single business Google Places update
  app.post('/api/admin/businesses/:id/import-google', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const business = await storage.getBusiness(businessId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      const success = await googlePlacesImporter.updateBusinessWithGoogleData(businessId, business.name);
      
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
  app.get('/api/user/likes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const businesses = await storage.getBusinessesWithUserLikes(userId);
      const favoriteBusinesses = businesses.filter(business => business.isLiked);
      res.json(favoriteBusinesses);
    } catch (error) {
      console.error("Error fetching user likes:", error);
      res.status(500).json({ message: "Failed to fetch user likes" });
    }
  });

  app.post('/api/user/likes/toggle', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { businessId } = req.body;
      
      if (!businessId || typeof businessId !== 'number') {
        return res.status(400).json({ message: "Valid businessId is required" });
      }
      
      const result = await storage.toggleUserLike(userId, businessId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling user like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Reset data endpoint (for development)
  app.post('/api/reset-data', async (req, res) => {
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
  app.get('/api/articles', async (req, res) => {
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

  app.get('/api/articles/:id', async (req, res) => {
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

  app.post('/api/articles', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put('/api/articles/:id', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const articleData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, articleData);
      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}