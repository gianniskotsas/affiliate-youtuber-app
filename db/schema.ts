import { pgTable, uuid, text, timestamp, json } from "drizzle-orm/pg-core";

// Users table to store YouTuber profiles
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").unique().notNull(), // Clerk authentication ID
  email: text("email").notNull(),
  username: text("username").unique().notNull(),
  profilePicture: text("profile_picture"), // URL to profile image
  socialAccounts: json("social_accounts"), // JSON object to store social links
  createdAt: timestamp("created_at").defaultNow(),
});

// Videos table to store YouTube video details
export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  videoTitle: text("video_title").notNull(),
  videoSlug: text("video_slug").unique().notNull(), // URL-friendly slug
  videoDescription: text("video_description"),
  videoThumbnail: text("video_thumbnail"), // URL to thumbnail image
  videoShortLink: text("video_short_link").notNull(), // Dub.co shortened link
  videoQRCode: text("video_qr_code").notNull(), // QR Code Image URL
  createdAt: timestamp("created_at").defaultNow(),
});

// Products table to store affiliate products
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id").notNull().references(() => videos.id),
  productName: text("product_name").notNull(),
  productLink: text("product_link").notNull(), // Affiliate link (can be shortened with Dub.co)
  imageUrl: text("image_url"), // URL to product image
  createdAt: timestamp("created_at").defaultNow(),
});

// Click Analytics table to track user interactions
export const clickAnalytics = pgTable("click_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  clickCount: text("click_count").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types for inserting and selecting records
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type SelectVideo = typeof videos.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;
export type InsertClickAnalytics = typeof clickAnalytics.$inferInsert;
export type SelectClickAnalytics = typeof clickAnalytics.$inferSelect;
