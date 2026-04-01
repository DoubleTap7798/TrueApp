// Core domain types — shared across web, mobile, and server
export type {
  Platform,
  PricingModel,
  PaywallAggression,
  ScoreLevel,
  TagVariant,
  AppTag,
  TrueScore,
  AppPricing,
  ReviewSummary,
  MicroCategory,
  Subcategory,
  Category,
  AppRecord,
} from "./types";

export { scoreLevelFromNumber } from "./types";

// API response envelopes used by both api-client and server
export interface ApiListResponse<T> {
  data: T[];
  meta: { total: number };
}

export interface ApiSingleResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  code?: string;
}
