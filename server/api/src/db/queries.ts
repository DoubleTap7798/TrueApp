import { eq, inArray, sql } from "drizzle-orm";
import { db } from "./client";
import {
  apps,
  appScores,
  appPricing,
  appReviewSummaries,
  categories,
} from "./schema";
import type { AppRecord, Category } from "@trueapp/shared";

// ─────────────────────────────────────────────
// Type helpers
// ─────────────────────────────────────────────

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

type AppWithRelations = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoEmoji: string;
  logoGradient: string;
  developer: string;
  website: string;
  platforms: string;
  categoryId: string;
  subcategoryId: string;
  tags: string;
  alternativeIds: string;
  isFeatured: boolean;
  isTrending: boolean;
  isEditorsPick: boolean;
  launchYear: number;
  score: {
    overall: number;
    privacy: number;
    valueForMoney: number;
    uxDesign: number;
    pricingTransparency: number;
    noAds: number;
    onboarding: number;
    support: number;
    verdict: string;
    verdictText: string;
  } | null;
  pricing: {
    model: string;
    hasFreeVersion: boolean;
    monthlyPrice: string | null;
    annualPrice: string | null;
    oneTimePrice: string | null;
    trialDays: number | null;
    annualDiscount: string | null;
    hiddenCosts: string;
    paywallAggression: number;
    summary: string;
  } | null;
  review: {
    count: number;
    pros: string;
    cons: string;
    expertVerdict: string;
    featuredQuoteText: string;
    featuredQuoteAuthor: string;
    featuredQuoteRole: string;
  } | null;
};

/**
 * Converts a Drizzle relational query result into a frontend-ready AppRecord.
 * Returns null if any required relation is missing (corrupt record).
 */
function toAppRecord(row: AppWithRelations): AppRecord | null {
  if (!row.score || !row.pricing || !row.review) return null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    logoEmoji: row.logoEmoji,
    logoGradient: row.logoGradient,
    developer: row.developer,
    website: row.website,
    platforms: parseJson(row.platforms, []),
    categoryId: row.categoryId,
    subcategoryId: row.subcategoryId,
    tags: parseJson(row.tags, []),
    alternativeIds: parseJson(row.alternativeIds, []),
    isFeatured: row.isFeatured,
    isTrending: row.isTrending,
    isEditorsPick: row.isEditorsPick,
    launchYear: row.launchYear,
    score: {
      overall: row.score.overall,
      privacy: row.score.privacy,
      valueForMoney: row.score.valueForMoney,
      uxDesign: row.score.uxDesign,
      pricingTransparency: row.score.pricingTransparency,
      noAds: row.score.noAds,
      onboarding: row.score.onboarding,
      support: row.score.support,
      verdict: row.score.verdict as AppRecord["score"]["verdict"],
      verdictText: row.score.verdictText,
    },
    pricing: {
      model: row.pricing.model as AppRecord["pricing"]["model"],
      hasFreeVersion: row.pricing.hasFreeVersion,
      monthlyPrice: row.pricing.monthlyPrice ?? null,
      annualPrice: row.pricing.annualPrice ?? null,
      oneTimePrice: row.pricing.oneTimePrice ?? null,
      trialDays: row.pricing.trialDays ?? null,
      annualDiscount: row.pricing.annualDiscount ?? null,
      hiddenCosts: parseJson(row.pricing.hiddenCosts, []),
      paywallAggression: row.pricing.paywallAggression as AppRecord["pricing"]["paywallAggression"],
      summary: row.pricing.summary,
    },
    reviewSummary: {
      count: row.review.count,
      pros: parseJson(row.review.pros, []),
      cons: parseJson(row.review.cons, []),
      expertVerdict: row.review.expertVerdict,
      featuredQuote: {
        text: row.review.featuredQuoteText,
        author: row.review.featuredQuoteAuthor,
        role: row.review.featuredQuoteRole,
      },
    },
  };
}

// ─────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────

export async function getAllApps(): Promise<AppRecord[]> {
  const rows = await db.query.apps.findMany({
    with: { score: true, pricing: true, review: true },
    orderBy: (a, { desc }) => [desc(a.isFeatured), desc(a.launchYear)],
  });

  return (rows as unknown as AppWithRelations[])
    .map(toAppRecord)
    .filter((a): a is AppRecord => a !== null);
}

export async function getAppBySlug(slug: string): Promise<AppRecord | null> {
  const row = await db.query.apps.findFirst({
    where: eq(apps.slug, slug),
    with: { score: true, pricing: true, review: true },
  });

  if (!row) return null;
  return toAppRecord(row as unknown as AppWithRelations);
}

export async function getAppsByIds(ids: string[]): Promise<AppRecord[]> {
  if (ids.length === 0) return [];
  const rows = await db.query.apps.findMany({
    where: inArray(apps.id, ids),
    with: { score: true, pricing: true, review: true },
  });
  return (rows as unknown as AppWithRelations[])
    .map(toAppRecord)
    .filter((a): a is AppRecord => a !== null);
}

export async function getFeaturedApps(): Promise<AppRecord[]> {
  const rows = await db.query.apps.findMany({
    where: eq(apps.isFeatured, true),
    with: { score: true, pricing: true, review: true },
  });
  return (rows as unknown as AppWithRelations[])
    .map(toAppRecord)
    .filter((a): a is AppRecord => a !== null);
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = await db.select().from(categories).orderBy(categories.label);
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    label: r.label,
    icon: r.icon,
    gradient: r.gradient,
    accent: r.accent,
    description: r.description,
    appCount: r.appCount,
    subcategories: parseJson(r.subcategories, []),
    intentTags: parseJson(r.intentTags, []),
  }));
}
