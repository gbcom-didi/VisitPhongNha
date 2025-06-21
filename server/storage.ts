import {
  users,
  businesses,
  categories,
  businessCategories,
  userLikes,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Business,
  type InsertBusiness,
  type BusinessWithCategory,
  type UserLike,
  type InsertUserLike,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, role: string): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Business operations
  getBusinesses(): Promise<BusinessWithCategory[]>;
  getBusinessesByCategory(categoryId: number): Promise<BusinessWithCategory[]>;
  getBusinessesWithUserLikes(userId?: string): Promise<BusinessWithCategory[]>;
  getBusinessesByOwner(ownerId: string): Promise<BusinessWithCategory[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business>;
  
  // User likes operations
  getUserLikes(userId: string): Promise<UserLike[]>;
  toggleUserLike(userId: string, businessId: number): Promise<{ liked: boolean }>;
  isBusinessLiked(userId: string, businessId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Business operations
  async getBusinesses(): Promise<BusinessWithCategory[]> {
    // First get all businesses
    const businessesData = await db
      .select()
      .from(businesses)
      .where(eq(businesses.isActive, true))
      .orderBy(desc(businesses.isPremium), desc(businesses.isRecommended), asc(businesses.name));

    // Get all business-category relationships
    const businessCategoryData = await db
      .select({
        businessId: businessCategories.businessId,
        category: categories,
      })
      .from(businessCategories)
      .leftJoin(categories, eq(businessCategories.categoryId, categories.id));

    // Group categories by business ID
    const businessCategoryMap = new Map<number, Category[]>();
    businessCategoryData.forEach(({ businessId, category }) => {
      if (!businessCategoryMap.has(businessId)) {
        businessCategoryMap.set(businessId, []);
      }
      if (category) {
        businessCategoryMap.get(businessId)!.push(category);
      }
    });

    // Combine businesses with their categories
    return businessesData.map(business => ({
      ...business,
      categories: businessCategoryMap.get(business.id) || [],
      category: businessCategoryMap.get(business.id)?.[0] || null, // For backward compatibility
    }));
  }

  async getBusinessesByCategory(categoryId: number): Promise<BusinessWithCategory[]> {
    // Get business IDs that have the specified category
    const businessIds = await db
      .select({ businessId: businessCategories.businessId })
      .from(businessCategories)
      .where(eq(businessCategories.categoryId, categoryId));

    const businessIdsList = businessIds.map(b => b.businessId);

    if (businessIdsList.length === 0) {
      return [];
    }

    // Get businesses with those IDs
    const businessesData = await db
      .select()
      .from(businesses)
      .where(and(
        eq(businesses.isActive, true),
        inArray(businesses.id, businessIdsList)
      ))
      .orderBy(desc(businesses.isPremium), desc(businesses.isRecommended), asc(businesses.name));

    // Get all business-category relationships for these businesses
    const businessCategoryData = await db
      .select({
        businessId: businessCategories.businessId,
        category: categories,
      })
      .from(businessCategories)
      .leftJoin(categories, eq(businessCategories.categoryId, categories.id))
      .where(inArray(businessCategories.businessId, businessIdsList));

    // Group categories by business ID
    const businessCategoryMap = new Map<number, Category[]>();
    businessCategoryData.forEach(({ businessId, category }) => {
      if (!businessCategoryMap.has(businessId)) {
        businessCategoryMap.set(businessId, []);
      }
      if (category) {
        businessCategoryMap.get(businessId)!.push(category);
      }
    });

    // Combine businesses with their categories
    return businessesData.map(business => ({
      ...business,
      categories: businessCategoryMap.get(business.id) || [],
      category: businessCategoryMap.get(business.id)?.[0] || null, // For backward compatibility
    }));
  }

  async getBusinessesWithUserLikes(userId?: string): Promise<BusinessWithCategory[]> {
    const businessesData = await this.getBusinesses();
    
    if (!userId) {
      return businessesData;
    }

    const userLikesData = await this.getUserLikes(userId);
    const likedBusinessIds = new Set(userLikesData.map(like => like.businessId));

    return businessesData.map(business => ({
      ...business,
      isLiked: likedBusinessIds.has(business.id),
    }));
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business;
  }

  async createBusiness(business: InsertBusiness & { categoryIds?: number[] }): Promise<Business> {
    const { categoryIds, ...businessData } = business;
    
    // Create the business
    const [newBusiness] = await db.insert(businesses).values(businessData).returning();
    
    // If categoryIds are provided, create the business-category relationships
    if (categoryIds && categoryIds.length > 0) {
      const businessCategoryData = categoryIds.map(categoryId => ({
        businessId: newBusiness.id,
        categoryId,
      }));
      
      await db.insert(businessCategories).values(businessCategoryData);
    }
    
    return newBusiness;
  }

  async getBusinessesByOwner(ownerId: string): Promise<BusinessWithCategory[]> {
    // Get businesses owned by the user
    const businessesData = await db
      .select()
      .from(businesses)
      .where(eq(businesses.ownerId, ownerId))
      .orderBy(desc(businesses.isPremium), desc(businesses.isRecommended), asc(businesses.name));

    const businessIds = businessesData.map(b => b.id);

    if (businessIds.length === 0) {
      return businessesData.map(business => ({
        ...business,
        categories: [],
        category: null,
      }));
    }

    // Get all business-category relationships for these businesses
    const businessCategoryData = await db
      .select({
        businessId: businessCategories.businessId,
        category: categories,
      })
      .from(businessCategories)
      .leftJoin(categories, eq(businessCategories.categoryId, categories.id))
      .where(inArray(businessCategories.businessId, businessIds));

    // Group categories by business ID
    const businessCategoryMap = new Map<number, Category[]>();
    businessCategoryData.forEach(({ businessId, category }) => {
      if (!businessCategoryMap.has(businessId)) {
        businessCategoryMap.set(businessId, []);
      }
      if (category) {
        businessCategoryMap.get(businessId)!.push(category);
      }
    });

    // Combine businesses with their categories
    return businessesData.map(business => ({
      ...business,
      categories: businessCategoryMap.get(business.id) || [],
      category: businessCategoryMap.get(business.id)?.[0] || null, // For backward compatibility
    }));
  }

  async updateBusiness(id: number, business: Partial<InsertBusiness> & { categoryIds?: number[] }): Promise<Business> {
    // Extract categoryIds from business data
    const { categoryIds, ...businessData } = business;
    
    // Update the business record
    const [updatedBusiness] = await db
      .update(businesses)
      .set({ ...businessData, updatedAt: new Date() })
      .where(eq(businesses.id, id))
      .returning();

    // Handle category associations if provided
    if (categoryIds !== undefined) {
      // Remove existing category associations
      await db
        .delete(businessCategories)
        .where(eq(businessCategories.businessId, id));

      // Add new category associations
      if (categoryIds.length > 0) {
        const categoryAssociations = categoryIds.map(categoryId => ({
          businessId: id,
          categoryId,
        }));
        await db.insert(businessCategories).values(categoryAssociations);
      }
    }

    return updatedBusiness;
  }

  // User likes operations
  async getUserLikes(userId: string): Promise<UserLike[]> {
    return await db.select().from(userLikes).where(eq(userLikes.userId, userId));
  }

  async toggleUserLike(userId: string, businessId: number): Promise<{ liked: boolean }> {
    const existingLike = await db
      .select()
      .from(userLikes)
      .where(and(eq(userLikes.userId, userId), eq(userLikes.businessId, businessId)))
      .limit(1);

    if (existingLike.length > 0) {
      // Remove like
      await db
        .delete(userLikes)
        .where(and(eq(userLikes.userId, userId), eq(userLikes.businessId, businessId)));
      return { liked: false };
    } else {
      // Add like
      await db.insert(userLikes).values({ userId, businessId });
      return { liked: true };
    }
  }

  async isBusinessLiked(userId: string, businessId: number): Promise<boolean> {
    const [like] = await db
      .select()
      .from(userLikes)
      .where(and(eq(userLikes.userId, userId), eq(userLikes.businessId, businessId)))
      .limit(1);
    return !!like;
  }

  async clearAllBusinesses(): Promise<void> {
    // Delete all user likes first
    await db.delete(userLikes);
    // Delete all business categories
    await db.delete(businessCategories);
    // Delete all businesses
    await db.delete(businesses);
  }
}

export const storage = new DatabaseStorage();
