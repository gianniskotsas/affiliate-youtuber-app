import { pgTable, uuid, text, timestamp, json, boolean } from "drizzle-orm/pg-core";

// Define a TypeScript type for social accounts
export type SocialAccount = {
  name: string;
  url: string;
};

// Users table to store YouTuber profiles
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username").unique().notNull(),
  bio: text("bio"),
  profilePicture: text("profile_picture"), // URL to profile image
  socialAccounts: json("social_accounts")
    .$type<SocialAccount[]>() 
    .default([
      { name: "X", url: "" },
      { name: "YouTube", url: "" },
      { name: "Instagram", url: "" },
      { name: "TikTok", url: "" },
    ]),
  createdAt: timestamp("created_at").defaultNow(),
  domain: text("domain").default(""),
  stripeCustomerId: text("stripe_customer_id").default(""), // Stripe customer ID
  stripeSubscriptionId: text("stripe_subscription_id").default(""), // Stripe subscription ID
});

// Videos table to store YouTube video details
export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  videoTitle: text("video_title").notNull(),
  videoSlug: text("video_slug").unique().notNull(), // URL-friendly slug
  videoThumbnail: text("video_thumbnail").notNull(), // URL to thumbnail image
  videoShortLink: text("video_short_link").notNull(), // Dub.co shortened link
  videoQrCodeUrl: text("video_qr_code_url"), // URL to QR code image
  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").default(false)
});

// Products table to store affiliate products
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id),
  productName: text("product_name").notNull(),
  shortLink: text("short_link").notNull(), // Affiliate link (can be shortened with Dub.co)
  originalLink: text("original_link").notNull(), // Original affiliate link
  imageUrl: text("image_url").default(""), // URL to product image
  productDescription: text("product_description"), // Description of the product
  createdAt: timestamp("created_at").defaultNow(),
});



// Types for inserting and selecting records
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type SelectVideo = typeof videos.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;