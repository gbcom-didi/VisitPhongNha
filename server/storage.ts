import {
  users,
  businesses,
  categories,
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
import { eq, and, desc, asc } from "drizzle-orm";

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
    const result = await db
      .select({
        id: businesses.id,
        name: businesses.name,
        description: businesses.description,
        latitude: businesses.latitude,
        longitude: businesses.longitude,
        address: businesses.address,
        phone: businesses.phone,
        email: businesses.email,
        website: businesses.website,
        hours: businesses.hours,
        imageUrl: businesses.imageUrl,
        gallery: businesses.gallery,
        categoryId: businesses.categoryId,
        tags: businesses.tags,
        priceRange: businesses.priceRange,
        amenities: businesses.amenities,
        bookingType: businesses.bookingType,
        affiliateLink: businesses.affiliateLink,
        directBookingContact: businesses.directBookingContact,
        enquiryFormEnabled: businesses.enquiryFormEnabled,
        featuredText: businesses.featuredText,
        isActive: businesses.isActive,
        isPremium: businesses.isPremium,
        isVerified: businesses.isVerified,
        isRecommended: businesses.isRecommended,
        createdAt: businesses.createdAt,
        updatedAt: businesses.updatedAt,
        category: categories,
      })
      .from(businesses)
      .leftJoin(categories, eq(businesses.categoryId, categories.id))
      .where(eq(businesses.isActive, true))
      .orderBy(desc(businesses.isPremium), desc(businesses.isRecommended), asc(businesses.name));

    return result;
  }

  async getBusinessesByCategory(categoryId: number): Promise<BusinessWithCategory[]> {
    const result = await db
      .select({
        id: businesses.id,
        name: businesses.name,
        description: businesses.description,
        latitude: businesses.latitude,
        longitude: businesses.longitude,
        address: businesses.address,
        phone: businesses.phone,
        email: businesses.email,
        website: businesses.website,
        hours: businesses.hours,
        imageUrl: businesses.imageUrl,
        gallery: businesses.gallery,
        categoryId: businesses.categoryId,
        tags: businesses.tags,
        priceRange: businesses.priceRange,
        amenities: businesses.amenities,
        bookingType: businesses.bookingType,
        affiliateLink: businesses.affiliateLink,
        directBookingContact: businesses.directBookingContact,
        enquiryFormEnabled: businesses.enquiryFormEnabled,
        featuredText: businesses.featuredText,
        isActive: businesses.isActive,
        isPremium: businesses.isPremium,
        isVerified: businesses.isVerified,
        isRecommended: businesses.isRecommended,
        createdAt: businesses.createdAt,
        updatedAt: businesses.updatedAt,
        category: categories,
      })
      .from(businesses)
      .leftJoin(categories, eq(businesses.categoryId, categories.id))
      .where(and(eq(businesses.isActive, true), eq(businesses.categoryId, categoryId)))
      .orderBy(desc(businesses.isPremium), desc(businesses.isRecommended), asc(businesses.name));

    return result;
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

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const [newBusiness] = await db.insert(businesses).values(business).returning();
    return newBusiness;
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
    // Delete all businesses
    await db.delete(businesses);
  }
}

export const storage = new DatabaseStorage();
