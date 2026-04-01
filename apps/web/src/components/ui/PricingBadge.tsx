import type { PricingModel } from "../../types";
import { pricingModelLabel } from "../../lib/utils";

interface PricingBadgeProps {
  model: PricingModel;
  hasFree: boolean;
  size?: "sm" | "md";
}

const modelStyle: Record<
  PricingModel,
  { label: string; classes: string; icon: string }
> = {
  free: {
    label: "Free",
    icon: "✦",
    classes: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  freemium: {
    label: "Freemium",
    icon: "◈",
    classes: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  },
  "paid-once": {
    label: "One-Time",
    icon: "◉",
    classes: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  },
  subscription: {
    label: "Subscription",
    icon: "◌",
    classes: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  },
  "pay-what-you-want": {
    label: "Pay-What-You-Want",
    icon: "◎",
    classes: "border-teal-500/40 bg-teal-500/10 text-teal-300",
  },
};

export function PricingBadge({ model, hasFree, size = "md" }: PricingBadgeProps) {
  const style = modelStyle[model];
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${padding} ${style.classes}`}
      title={pricingModelLabel(model)}
    >
      <span>{style.icon}</span>
      {style.label}
      {model !== "free" && hasFree && (
        <span className="opacity-70"> · Free tier</span>
      )}
    </span>
  );
}
