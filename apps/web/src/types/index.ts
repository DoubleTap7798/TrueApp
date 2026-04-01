// Re-export all types from the shared package — single source of truth
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
} from "@trueapp/shared";

export { scoreLevelFromNumber } from "@trueapp/shared";
// Legacy alias kept for backward compatibility
export { scoreLevelFromNumber as scoreLevelFromValue } from "@trueapp/shared";

