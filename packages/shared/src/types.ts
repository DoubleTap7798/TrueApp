// Core domain types for TrueApp — shared across web, mobile, and server

export type Platform = "ios" | "android" | "macos" | "windows" | "web" | "all";
export type PricingModel = "free" | "freemium" | "paid-once" | "subscription" | "pay-what-you-want";
export type PaywallAggression = 1 | 2 | 3 | 4 | 5;
export type ScoreLevel = "exceptional" | "great" | "decent" | "below" | "poor";
export type TagVariant = "violet" | "blue" | "emerald" | "amber" | "rose" | "slate";

export interface AppTag {
  id: string;
  label: string;
  variant: TagVariant;
}

export interface TrueScore {
  overall: number;             // 0–10
  privacy: number;             // 0–10
  valueForMoney: number;       // 0–10
  uxDesign: number;            // 0–10
  pricingTransparency: number; // 0–10
  noAds: number;               // 0–10
  onboarding: number;          // 0–10
  support: number;             // 0–10
  verdict: ScoreLevel;
  verdictText: string;
}

export interface AppPricing {
  model: PricingModel;
  hasFreeVersion: boolean;
  monthlyPrice: string | null;
  annualPrice: string | null;
  oneTimePrice: string | null;
  trialDays: number | null;
  annualDiscount: string | null;
  hiddenCosts: string[];
  paywallAggression: PaywallAggression;
  summary: string;
}

export interface ReviewSummary {
  count: number;
  pros: string[];
  cons: string[];
  expertVerdict: string;
  featuredQuote: {
    text: string;
    author: string;
    role: string;
  };
}

export interface MicroCategory {
  id: string;
  label: string;
}

export interface Subcategory {
  id: string;
  label: string;
  icon: string;
  micros: MicroCategory[];
}

export interface Category {
  id: string;
  slug: string;
  label: string;
  icon: string;
  gradient: string;   // CSS gradient string
  accent: string;     // hex color for highlights
  description: string;
  appCount: number;
  subcategories: Subcategory[];
  intentTags: string[];
}

export interface AppRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoEmoji: string;
  logoGradient: string;   // e.g. "from-violet-600 to-indigo-600"
  developer: string;
  website: string;
  platforms: Platform[];
  categoryId: string;
  subcategoryId: string;
  tags: AppTag[];
  score: TrueScore;
  pricing: AppPricing;
  reviewSummary: ReviewSummary;
  alternativeIds: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isEditorsPick: boolean;
  launchYear: number;
}

// Utility helpers
export function scoreLevelFromNumber(n: number): ScoreLevel {
  if (n >= 9) return "exceptional";
  if (n >= 7) return "great";
  if (n >= 5) return "decent";
  if (n >= 3) return "below";
  return "poor";
}
