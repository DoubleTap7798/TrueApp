import type { ScoreLevel } from "../types";

/** Merge class strings (replaces clsx/cn for minimal deps) */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Map a 0–10 score to a semantic level */
export function scoreLevelFromValue(n: number): ScoreLevel {
  if (n >= 9) return "exceptional";
  if (n >= 7) return "great";
  if (n >= 5) return "decent";
  if (n >= 3) return "below";
  return "poor";
}

/** Hex color per score level */
export function scoreColor(n: number): string {
  if (n >= 9) return "#22c55e";
  if (n >= 7) return "#6366f1";
  if (n >= 5) return "#f59e0b";
  if (n >= 3) return "#f97316";
  return "#ef4444";
}

/** Tailwind text color class per score level */
export function scoreTextClass(n: number): string {
  if (n >= 9) return "text-emerald-400";
  if (n >= 7) return "text-indigo-400";
  if (n >= 5) return "text-amber-400";
  if (n >= 3) return "text-orange-400";
  return "text-red-400";
}

/** Friendly label per score level */
export function scoreLevelLabel(n: number): string {
  if (n >= 9) return "Exceptional";
  if (n >= 7) return "Great";
  if (n >= 5) return "Decent";
  if (n >= 3) return "Below Average";
  return "Poor";
}

/** Format pricing model for display */
export function pricingModelLabel(model: string): string {
  const map: Record<string, string> = {
    free: "Free",
    freemium: "Freemium",
    "paid-once": "One-Time Purchase",
    subscription: "Subscription",
    "pay-what-you-want": "Pay What You Want",
  };
  return map[model] ?? model;
}

/** Tailwind classes for tag variant */
export function tagVariantClasses(variant: string): string {
  const map: Record<string, string> = {
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    slate: "border-slate-500/30 bg-slate-700/30 text-slate-400",
  };
  return map[variant] ?? map.slate;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Truncate text to a max length */
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}
