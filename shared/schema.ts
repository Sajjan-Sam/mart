import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in paise (₹1 = 100 paise)
  originalPrice: integer("original_price"),
  category: text("category").notNull(),
  brand: text("brand"),
  technicalSpecs: text("technical_specs"),
  condition: text("condition").notNull(), // new, like-new, good, fair, poor
  images: text("images").array().default([]),
  sellerName: text("seller_name").notNull(),
  sellerPhone: text("seller_phone").notNull(),
  priceNegotiable: boolean("price_negotiable").default(false),
  deliveryAvailable: boolean("delivery_available").default(false),
  isSold: boolean("is_sold").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  maxPrice: integer("max_price").notNull(), // Price in paise
  urgency: text("urgency").notNull(), // low, medium, high
  requesterEmail: text("requester_email").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const suggestions = pgTable("suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  category: text("category").notNull(), // new-feature, ui, security, mobile-app, search-filter, other
  priority: text("priority").notNull(), // low, medium, high
  description: text("description").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const flags = pgTable("flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  reporterName: text("reporter_name").notNull(),
  reporterEmail: text("reporter_email").notNull(),
  reason: text("reason").notNull(), // inappropriate, fake, spam, other
  description: text("description").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  isSold: true,
}).extend({
  price: z.number().min(1),
  originalPrice: z.number().optional(),
  images: z.array(z.string()).max(5).default([]),
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  createdAt: true,
  isApproved: true,
}).extend({
  maxPrice: z.number().min(1),
});

export const insertSuggestionSchema = createInsertSchema(suggestions).omit({
  id: true,
  createdAt: true,
});

export const insertFlagSchema = createInsertSchema(flags).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;

export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type Suggestion = typeof suggestions.$inferSelect;

export type InsertFlag = z.infer<typeof insertFlagSchema>;
export type Flag = typeof flags.$inferSelect;
