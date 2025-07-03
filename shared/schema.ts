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
  imageUrl: varchar("image_url", { length: 1000 }),
  gallery: text("gallery").array(),
  ownerId: varchar("owner_id").references(() => users.id), // Business owner reference
  tags: text("tags").array(),
  priceRange: varchar("price_range", { length: 100 }),
  amenities: text("amenities").array(),
  bookingType: varchar("booking_type", { length: 20 }).default("none"), // 'affiliate', 'direct', or 'none'
  affiliateLink: varchar("affiliate_link", { length: 500 }),
  bookingComUrl: varchar("booking_com_url", { length: 500 }),
  agodaUrl: varchar("agoda_url", { length: 500 }),
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

// Guestbook tables
export const guestbookEntries = pgTable("guestbook_entries", {
  id: serial("id").primaryKey(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  message: text("message").notNull(),
  nationality: varchar("nationality", { length: 100 }),
  location: text("location"), // Google Maps URL or description
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  relatedPlaceId: integer("related_place_id").references(() => businesses.id),
  rating: integer("rating"), // 1-5 star rating
  likes: integer("likes").default(0),
  // Moderation and spam protection fields
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected, spam
  isSpam: boolean("is_spam").default(false),
  spamScore: decimal("spam_score", { precision: 5, scale: 2 }), // 0-100 spam probability
  moderatedBy: varchar("moderated_by").references(() => users.id),
  moderatedAt: timestamp("moderated_at"),
  moderationNotes: text("moderation_notes"),
  ipAddress: varchar("ip_address", { length: 45 }), // For rate limiting
  userAgent: text("user_agent"), // For spam detection
  createdAt: timestamp("created_at").defaultNow(),
});

export const guestbookComments = pgTable("guestbook_comments", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id").references(() => guestbookEntries.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  comment: text("comment").notNull(),
  parentCommentId: integer("parent_comment_id").references(() => guestbookComments.id),
  likes: integer("likes").default(0),
  // Moderation fields
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected, spam
  isSpam: boolean("is_spam").default(false),
  moderatedBy: varchar("moderated_by").references(() => users.id),
  moderatedAt: timestamp("moderated_at"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guestbookEntryLikes = pgTable("guestbook_entry_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  entryId: integer("entry_id").references(() => guestbookEntries.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guestbookCommentLikes = pgTable("guestbook_comment_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  commentId: integer("comment_id").references(() => guestbookComments.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rate limiting table for spam protection
export const rateLimits = pgTable("rate_limits", {
  id: serial("id").primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(), // IP address or user ID
  action: varchar("action", { length: 50 }).notNull(), // 'guestbook_entry', 'guestbook_comment'
  count: integer("count").default(1),
  windowStart: timestamp("window_start").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const businessesRelations = relations(businesses, ({ many }) => ({
  businessCategories: many(businessCategories),
  likes: many(userLikes),
  guestbookEntries: many(guestbookEntries),
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
  guestbookEntries: many(guestbookEntries),
  guestbookComments: many(guestbookComments),
  guestbookEntryLikes: many(guestbookEntryLikes),
  guestbookCommentLikes: many(guestbookCommentLikes),
}));

// Guestbook relations
export const guestbookEntriesRelations = relations(guestbookEntries, ({ one, many }) => ({
  author: one(users, {
    fields: [guestbookEntries.authorId],
    references: [users.id],
  }),
  relatedPlace: one(businesses, {
    fields: [guestbookEntries.relatedPlaceId],
    references: [businesses.id],
  }),
  comments: many(guestbookComments),
  likes: many(guestbookEntryLikes),
}));

export const guestbookCommentsRelations = relations(guestbookComments, ({ one, many }) => ({
  entry: one(guestbookEntries, {
    fields: [guestbookComments.entryId],
    references: [guestbookEntries.id],
  }),
  author: one(users, {
    fields: [guestbookComments.authorId],
    references: [users.id],
  }),
  parentComment: one(guestbookComments, {
    fields: [guestbookComments.parentCommentId],
    references: [guestbookComments.id],
    relationName: "CommentReplies",
  }),
  replies: many(guestbookComments, {
    relationName: "CommentReplies",
  }),
  likes: many(guestbookCommentLikes),
}));

export const guestbookEntryLikesRelations = relations(guestbookEntryLikes, ({ one }) => ({
  user: one(users, {
    fields: [guestbookEntryLikes.userId],
    references: [users.id],
  }),
  entry: one(guestbookEntries, {
    fields: [guestbookEntryLikes.entryId],
    references: [guestbookEntries.id],
  }),
}));

export const guestbookCommentLikesRelations = relations(guestbookCommentLikes, ({ one }) => ({
  user: one(users, {
    fields: [guestbookCommentLikes.userId],
    references: [users.id],
  }),
  comment: one(guestbookComments, {
    fields: [guestbookCommentLikes.commentId],
    references: [guestbookComments.id],
  }),
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

// Guestbook schemas
export const insertGuestbookEntrySchema = createInsertSchema(guestbookEntries).omit({
  id: true,
  likes: true,
  moderatedBy: true,
  moderatedAt: true,
  moderationNotes: true,
  createdAt: true,
});

export const insertGuestbookCommentSchema = createInsertSchema(guestbookComments).omit({
  id: true,
  likes: true,
  moderatedBy: true,
  moderatedAt: true,
  createdAt: true,
});

export const insertGuestbookEntryLikeSchema = createInsertSchema(guestbookEntryLikes).omit({
  id: true,
  createdAt: true,
});

export const insertGuestbookCommentLikeSchema = createInsertSchema(guestbookCommentLikes).omit({
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

// Guestbook types
export type GuestbookEntry = typeof guestbookEntries.$inferSelect;
export type InsertGuestbookEntry = z.infer<typeof insertGuestbookEntrySchema>;
export type GuestbookComment = typeof guestbookComments.$inferSelect;
export type InsertGuestbookComment = z.infer<typeof insertGuestbookCommentSchema>;
export type GuestbookEntryLike = typeof guestbookEntryLikes.$inferSelect;
export type InsertGuestbookEntryLike = z.infer<typeof insertGuestbookEntryLikeSchema>;
export type GuestbookCommentLike = typeof guestbookCommentLikes.$inferSelect;
export type InsertGuestbookCommentLike = z.infer<typeof insertGuestbookCommentLikeSchema>;

// Extended types with relations
export type GuestbookEntryWithRelations = GuestbookEntry & {
  author: User;
  relatedPlace?: Business;
  comments: (GuestbookComment & { author: User })[];
  isLiked?: boolean;
  commentCount?: number;
};

// Articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  mainImageUrl: varchar("main_image_url", { length: 500 }),
  publicationDate: timestamp("publication_date").notNull(),
  locationIds: text("location_ids"), // Comma-separated list of location IDs
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  tags: text("tags").array(), // Array of tags
  contentHtml: text("content_html").notNull(),
  mapOverlay: text("map_overlay"),
  externalUrl: varchar("external_url", { length: 500 }),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Business with category info
export type BusinessWithCategory = Business & {
  categories?: Category[];
  category?: Category | null; // Keep for backward compatibility
  isLiked?: boolean;
};

// Article types
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;