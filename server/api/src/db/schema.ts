import {
  boolean,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { Subcategory, AppTag } from "@trueapp/shared";

// ─────────────────────────────────────────────
// categories
// ─────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: varchar("id", { length: 50 }).primaryKey(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 16 }).notNull(),
  gradient: text("gradient").notNull(),
  accent: varchar("accent", { length: 20 }).notNull(),
  description: text("description").notNull(),
  appCount: integer("app_count").notNull().default(0),
  // stored as JSON arrays / objects
  subcategories: text("subcategories").notNull().default("[]"),   // JSON stringified Subcategory[]
  intentTags: text("intent_tags").notNull().default("[]"),       // JSON stringified string[]
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  apps: many(apps),
}));

// ─────────────────────────────────────────────
// apps
// ─────────────────────────────────────────────
export const apps = pgTable("apps", {
  id: varchar("id", { length: 50 }).primaryKey(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  tagline: varchar("tagline", { length: 255 }).notNull(),
  description: text("description").notNull(),
  logoEmoji: varchar("logo_emoji", { length: 16 }).notNull(),
  logoGradient: varchar("logo_gradient", { length: 100 }).notNull(),
  developer: varchar("developer", { length: 100 }).notNull(),
  website: varchar("website", { length: 255 }).notNull(),
  platforms: text("platforms").notNull().default("[]"),          // JSON stringified Platform[]
  categoryId: varchar("category_id", { length: 50 })
    .notNull()
    .references(() => categories.id),
  subcategoryId: varchar("subcategory_id", { length: 50 }).notNull(),
  tags: text("tags").notNull().default("[]"),                    // JSON stringified AppTag[]
  alternativeIds: text("alternative_ids").notNull().default("[]"), // JSON stringified string[]
  isFeatured: boolean("is_featured").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  isEditorsPick: boolean("is_editors_pick").notNull().default(false),
  launchYear: integer("launch_year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appsRelations = relations(apps, ({ one }) => ({
  category: one(categories, {
    fields: [apps.categoryId],
    references: [categories.id],
  }),
  score: one(appScores, {
    fields: [apps.id],
    references: [appScores.appId],
  }),
  pricing: one(appPricing, {
    fields: [apps.id],
    references: [appPricing.appId],
  }),
  review: one(appReviewSummaries, {
    fields: [apps.id],
    references: [appReviewSummaries.appId],
  }),
}));

// ─────────────────────────────────────────────
// app_scores
// ─────────────────────────────────────────────
export const appScores = pgTable("app_scores", {
  appId: varchar("app_id", { length: 50 })
    .primaryKey()
    .references(() => apps.id, { onDelete: "cascade" }),
  overall: real("overall").notNull(),
  privacy: real("privacy").notNull(),
  valueForMoney: real("value_for_money").notNull(),
  uxDesign: real("ux_design").notNull(),
  pricingTransparency: real("pricing_transparency").notNull(),
  noAds: real("no_ads").notNull(),
  onboarding: real("onboarding").notNull(),
  support: real("support").notNull(),
  verdict: varchar("verdict", { length: 20 }).notNull(),
  verdictText: text("verdict_text").notNull(),
});

export const appScoresRelations = relations(appScores, ({ one }) => ({
  app: one(apps, { fields: [appScores.appId], references: [apps.id] }),
}));

// ─────────────────────────────────────────────
// app_pricing
// ─────────────────────────────────────────────
export const appPricing = pgTable("app_pricing", {
  appId: varchar("app_id", { length: 50 })
    .primaryKey()
    .references(() => apps.id, { onDelete: "cascade" }),
  model: varchar("model", { length: 30 }).notNull(),
  hasFreeVersion: boolean("has_free_version").notNull(),
  monthlyPrice: varchar("monthly_price", { length: 30 }),
  annualPrice: varchar("annual_price", { length: 50 }),
  oneTimePrice: varchar("one_time_price", { length: 30 }),
  trialDays: integer("trial_days"),
  annualDiscount: varchar("annual_discount", { length: 20 }),
  hiddenCosts: text("hidden_costs").notNull().default("[]"),     // JSON stringified string[]
  paywallAggression: integer("paywall_aggression").notNull(),
  summary: text("summary").notNull(),
});

export const appPricingRelations = relations(appPricing, ({ one }) => ({
  app: one(apps, { fields: [appPricing.appId], references: [apps.id] }),
}));

// ─────────────────────────────────────────────
// app_review_summaries
// ─────────────────────────────────────────────
export const appReviewSummaries = pgTable("app_review_summaries", {
  appId: varchar("app_id", { length: 50 })
    .primaryKey()
    .references(() => apps.id, { onDelete: "cascade" }),
  count: integer("count").notNull(),
  pros: text("pros").notNull().default("[]"),   // JSON stringified string[]
  cons: text("cons").notNull().default("[]"),   // JSON stringified string[]
  expertVerdict: text("expert_verdict").notNull(),
  featuredQuoteText: text("featured_quote_text").notNull(),
  featuredQuoteAuthor: varchar("featured_quote_author", { length: 100 }).notNull(),
  featuredQuoteRole: varchar("featured_quote_role", { length: 100 }).notNull(),
});

export const appReviewSummariesRelations = relations(appReviewSummaries, ({ one }) => ({
  app: one(apps, { fields: [appReviewSummaries.appId], references: [apps.id] }),
}));

// ─────────────────────────────────────────────
// Inferred types from schema
// ─────────────────────────────────────────────
export type CategoryRow = typeof categories.$inferSelect;
export type AppRow = typeof apps.$inferSelect;
export type AppScoreRow = typeof appScores.$inferSelect;
export type AppPricingRow = typeof appPricing.$inferSelect;
export type AppReviewRow = typeof appReviewSummaries.$inferSelect;
