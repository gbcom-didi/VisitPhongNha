import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).default("viewer"), // 'admin', 'business_owner', 'viewer'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  color: varchar("color", { length: 7 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 500 }),
  hours: text("hours"),
  imageUrl: varchar("image_url", { length: 500 }),
  gallery: text("gallery").array(),
  ownerId: varchar("owner_id").references(() => users.id), // Business owner reference
  tags: text("tags").array(),
  priceRange: varchar("price_range", { length: 100 }),
  amenities: text("amenities").array(),
  bookingType: varchar("booking_type", { length: 20 }).default("none"), // 'affiliate', 'direct', or 'none'
  affiliateLink: varchar("affiliate_link", { length: 500 }),
  directBookingContact: varchar("direct_booking_contact", { length: 255 }),
  enquiryFormEnabled: boolean("enquiry_form_enabled").default(false),
  featuredText: varchar("featured_text", { length: 255 }),
  rating: decimal("rating", { precision: 3, scale: 2 }), // e.g., 4.50
  reviewCount: integer("review_count").default(0),
  reviews: jsonb("reviews"), // Array of review objects from Google Places
  googleMapsUrl: varchar("google_maps_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false),
  isVerified: boolean("is_verified").default(false),
  isRecommended: boolean("is_recommended").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const businessCategories = pgTable("business_categories", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userLikes = pgTable("user_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const businessesRelations = relations(businesses, ({ many }) => ({
  businessCategories: many(businessCategories),
  likes: many(userLikes),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  businessCategories: many(businessCategories),
}));

export const businessCategoriesRelations = relations(businessCategories, ({ one }) => ({
  business: one(businesses, {
    fields: [businessCategories.businessId],
    references: [businesses.id],
  }),
  category: one(categories, {
    fields: [businessCategories.categoryId],
    references: [categories.id],
  }),
}));

export const userLikesRelations = relations(userLikes, ({ one }) => ({
  user: one(users, {
    fields: [userLikes.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [userLikes.businessId],
    references: [businesses.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  likes: many(userLikes),
}));

// Schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  categoryIds: z.array(z.number()).optional(),
});

export const insertBusinessCategorySchema = createInsertSchema(businessCategories).omit({
  id: true,
  createdAt: true,
});

export const insertUserLikeSchema = createInsertSchema(userLikes).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type BusinessCategory = typeof businessCategories.$inferSelect;
export type InsertBusinessCategory = z.infer<typeof insertBusinessCategorySchema>;
export type UserLike = typeof userLikes.$inferSelect;
export type InsertUserLike = z.infer<typeof insertUserLikeSchema>;

// Business with category info
export type BusinessWithCategory = Business & {
  categories?: Category[];
  category?: Category | null; // Keep for backward compatibility
  isLiked?: boolean;
};