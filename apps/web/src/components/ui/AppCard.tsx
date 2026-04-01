import { Link } from "react-router-dom";
import type { AppRecord } from "../../types";
import { ScoreRing } from "./ScoreRing";
import { PricingBadge } from "./PricingBadge";
import { TagList } from "./TagChip";
import { useSaved } from "../../contexts/SavedContext";
import { cn, scoreColor } from "../../lib/utils";

interface AppCardProps {
  app: AppRecord;
  variant?: "default" | "compact" | "featured";
  showSaveActions?: boolean;
}

function PlatformDots({ platforms }: { platforms: AppRecord["platforms"] }) {
  const icons: Record<string, string> = {
    ios: "󰀸",
    android: "󰀼",
    macos: "",
    windows: "󰍲",
    web: "🌐",
    all: "🌐",
  };
  const labels: Record<string, string> = {
    ios: "iOS",
    android: "Android",
    macos: "macOS",
    windows: "Windows",
    web: "Web",
    all: "All Platforms",
  };
  return (
    <div className="flex items-center gap-1.5">
      {platforms.map((p) => (
        <span
          key={p}
          className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500"
          title={labels[p] ?? p}
        >
          {labels[p] ?? p}
        </span>
      ))}
    </div>
  );
}

export function AppCard({
  app,
  variant = "default",
  showSaveActions = true,
}: AppCardProps) {
  const { isSaved, toggleSaved, isInCompare, toggleCompare } = useSaved();
  const saved = isSaved(app.id);
  const inCompare = isInCompare(app.id);

  if (variant === "compact") {
    return (
      <Link
        to={`/app/${app.slug}`}
        className="glass glass-hover group flex items-center gap-3 rounded-2xl p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl",
            app.logoGradient
          )}
        >
          {app.logoEmoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-white">{app.name}</p>
            <span
              className="shrink-0 text-sm font-black tabular-nums"
              style={{ color: scoreColor(app.score.overall) }}
            >
              {app.score.overall.toFixed(1)}
            </span>
          </div>
          <p className="truncate text-xs text-slate-500">{app.tagline}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/app/${app.slug}`}
      className={cn(
        "glass glass-hover group relative flex flex-col rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/40",
        variant === "featured" ? "p-5" : "p-4"
      )}
    >
      {/* Score ring — absolutely positioned top-right, isolated from flow */}
      <div
        className={cn(
          "absolute flex shrink-0 flex-col items-end",
          variant === "featured" ? "right-5 top-5" : "right-4 top-4"
        )}
      >
        <ScoreRing score={app.score.overall} size="sm" showLabel={false} />
      </div>

      {/* Header — pr-16 keeps content clear of the score ring */}
      <div className="flex items-start gap-3.5 pr-16">
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-md",
            app.logoGradient
          )}
        >
          {app.logoEmoji}
        </div>

        <div className="min-w-0 flex-1">
          {/* Inline status badges — before the name so they don't crowd it */}
          {(app.isEditorsPick || app.isTrending) && (
            <div className="mb-1.5 flex flex-wrap items-center gap-1">
              {app.isEditorsPick && (
                <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-amber-400">
                  ✦ Pick
                </span>
              )}
              {app.isTrending && (
                <span className="inline-flex items-center gap-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-rose-400">
                  🔥 Hot
                </span>
              )}
            </div>
          )}
          <p className="text-base font-bold text-white leading-tight">{app.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{app.developer}</p>
          <div className="mt-2">
            <PlatformDots platforms={app.platforms} />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-3 text-xs leading-relaxed text-slate-400 line-clamp-2">
        {app.tagline}
      </p>

      {/* Pricing */}
      <div className="mt-3">
        <PricingBadge
          model={app.pricing.model}
          hasFree={app.pricing.hasFreeVersion}
          size="sm"
        />
      </div>

      {/* Tags */}
      <div className="mt-2.5">
        <TagList tags={app.tags} max={3} size="sm" />
      </div>

      {/* Actions */}
      {showSaveActions && (
        <div
          className="mt-3.5 flex gap-2 border-t border-white/[0.06] pt-3"
          onClick={(e) => e.preventDefault()}
        >
          <button
            onClick={() => toggleSaved(app.id)}
            className={cn(
              "flex-1 rounded-xl border py-1.5 text-xs font-semibold transition-all duration-150",
              saved
                ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"
            )}
          >
            {saved ? "✦ Saved" : "◇ Save"}
          </button>
          <button
            onClick={() => toggleCompare(app.id)}
            className={cn(
              "flex-1 rounded-xl border py-1.5 text-xs font-semibold transition-all duration-150",
              inCompare
                ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"
            )}
          >
            {inCompare ? "✦ In Compare" : "⇌ Compare"}
          </button>
        </div>
      )}
    </Link>
  );
}
