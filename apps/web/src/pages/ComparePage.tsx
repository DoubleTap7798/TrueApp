import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ScoreRing } from "../components/ui/ScoreRing";
import { ScoreBar } from "../components/ui/ScoreBar";
import { PricingBadge } from "../components/ui/PricingBadge";
import { TagList } from "../components/ui/TagChip";
import { PageLoader } from "../components/ui/PageLoader";
import { PageError } from "../components/ui/PageError";
import { useSaved } from "../contexts/SavedContext";
import { useAllApps } from "../hooks/useApps";
import type { AppRecord } from "../types";
import { scoreColor, scoreLevelLabel } from "../lib/utils";

const COMPARE_METRICS = [
  { key: "overall", label: "TrueScore Overall" },
  { key: "privacy", label: "Privacy & Data" },
  { key: "valueForMoney", label: "Value for Money" },
  { key: "uxDesign", label: "UX & Design" },
  { key: "pricingTransparency", label: "Pricing Transparency" },
  { key: "noAds", label: "Ad-Free Experience" },
  { key: "onboarding", label: "Onboarding" },
  { key: "support", label: "Support Quality" },
] as const;

function AppSelector({
  selected,
  onSelect,
  exclude,
  slot,
  allApps,
}: {
  selected: AppRecord | null;
  onSelect: (app: AppRecord) => void;
  exclude: string[];
  slot: 1 | 2;
  allApps: AppRecord[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allApps
      .filter(
        (a) =>
          !exclude.includes(a.id) &&
          (a.name.toLowerCase().includes(q) ||
            a.tagline.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [allApps, query, exclude]);

  return (
    <div className="glass relative min-h-[180px] rounded-2xl p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
        App {slot}
      </p>

      {selected ? (
        <div>
          <div className="mb-3.5 flex items-center gap-3.5">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl ${selected.logoGradient}`}
            >
              {selected.logoEmoji}
            </div>
            <div>
              <p className="text-base font-bold text-white">{selected.name}</p>
              <p className="text-xs text-slate-500">{selected.developer}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onSelect(null as unknown as AppRecord);
              setQuery("");
            }}
            className="text-xs font-semibold text-slate-500 transition hover:text-rose-400"
          >
            × Change app
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search for an app..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />

          {open && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a1628] shadow-2xl">
              {results.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onSelect(app);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/[0.05]"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg ${app.logoGradient}`}
                  >
                    {app.logoEmoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{app.name}</p>
                    <p className="truncate text-xs text-slate-500">{app.tagline}</p>
                  </div>
                  <span
                    className="ml-auto shrink-0 text-sm font-black"
                    style={{ color: scoreColor(app.score.overall) }}
                  >
                    {app.score.overall.toFixed(1)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {open && query && results.length === 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1.5 rounded-xl border border-white/[0.08] bg-[#0a1628] px-4 py-4 text-sm text-slate-500 shadow-2xl">
              No apps found for "{query}"
            </div>
          )}

          {!query && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <p className="col-span-2 mb-1 text-xs font-semibold text-slate-600">
                Suggested
              </p>
              {allApps
                .filter((a) => !exclude.includes(a.id))
                .slice(0, 4)
                .map((app) => (
                  <button
                    key={app.id}
                    onClick={() => onSelect(app)}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-left transition hover:bg-white/[0.07]"
                  >
                    <span className="text-base">{app.logoEmoji}</span>
                    <span className="truncate text-xs font-semibold text-white">{app.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WinnerBadge({ winner }: { winner: "left" | "right" | "tie" }) {
  if (winner === "tie") return null;
  return (
    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
      ▲
    </span>
  );
}

export function ComparePage() {
  const { compareIds } = useSaved();
  const { data: allApps = [], isLoading, isError, refetch } = useAllApps();

  const [appLeft, setAppLeft] = useState<AppRecord | null>(null);
  const [appRight, setAppRight] = useState<AppRecord | null>(null);

  // Once data loads, seed initial state from compareIds
  useEffect(() => {
    if (allApps.length === 0) return;
    if (!appLeft && compareIds[0]) {
      setAppLeft(allApps.find((a) => a.id === compareIds[0]) ?? null);
    }
    if (!appRight && compareIds[1]) {
      setAppRight(allApps.find((a) => a.id === compareIds[1]) ?? null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allApps]);

  if (isLoading) return <PageLoader />;
  if (isError) return <PageError onRetry={() => refetch()} />;

  const excludeLeft = appLeft ? [appLeft.id] : [];
  const excludeRight = appRight ? [appRight.id] : [];

  const winner = (left: number, right: number): "left" | "right" | "tie" => {
    if (Math.abs(left - right) < 0.05) return "tie";
    return left > right ? "left" : "right";
  };

  const ready = appLeft && appRight;

  return (
    <div className="min-h-screen bg-[#020817] pt-16">
      {/* Header */}
      <div className="border-b border-white/[0.05] px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
            Compare
          </div>
          <h1 className="text-3xl font-black text-white">Compare apps side by side</h1>
          <p className="mt-2 text-slate-500">
            Select two apps to compare TrueScores, pricing, and verdict.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Selectors */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AppSelector
            selected={appLeft}
            onSelect={setAppLeft}
            exclude={excludeRight}
            slot={1}
            allApps={allApps}
          />
          <AppSelector
            selected={appRight}
            onSelect={setAppRight}
            exclude={excludeLeft}
            slot={2}
            allApps={allApps}
          />
        </div>

        {/* Empty state */}
        {!ready && (
          <div className="glass rounded-3xl py-20 text-center">
            <div className="mb-3 text-5xl">⇌</div>
            <h3 className="mb-2 text-lg font-bold text-white">
              Select two apps to compare
            </h3>
            <p className="mb-6 text-slate-500">
              Use the search boxes above to pick any two apps from our database.
            </p>
            <Link
              to="/explore"
              className="rounded-2xl border border-white/[0.10] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Browse all apps
            </Link>
          </div>
        )}

        {/* Comparison table */}
        {ready && appLeft && appRight && (
          <div className="space-y-4">
            {/* Overall score hero */}
            <div className="glass grid grid-cols-3 rounded-2xl overflow-hidden">
              <div className="flex flex-col items-center py-8 px-4">
                <div
                  className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl ${appLeft.logoGradient}`}
                >
                  {appLeft.logoEmoji}
                </div>
                <p className="mb-3 text-base font-bold text-white">{appLeft.name}</p>
                <ScoreRing score={appLeft.score.overall} size="lg" />
                <p className="mt-2 text-xs font-semibold capitalize" style={{ color: scoreColor(appLeft.score.overall) }}>
                  {scoreLevelLabel(appLeft.score.overall)}
                </p>
              </div>

              <div className="flex items-center justify-center border-x border-white/[0.06]">
                <span className="text-3xl font-black text-slate-700">vs</span>
              </div>

              <div className="flex flex-col items-center py-8 px-4">
                <div
                  className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl ${appRight.logoGradient}`}
                >
                  {appRight.logoEmoji}
                </div>
                <p className="mb-3 text-base font-bold text-white">{appRight.name}</p>
                <ScoreRing score={appRight.score.overall} size="lg" />
                <p className="mt-2 text-xs font-semibold capitalize" style={{ color: scoreColor(appRight.score.overall) }}>
                  {scoreLevelLabel(appRight.score.overall)}
                </p>
              </div>
            </div>

            {/* Score breakdown comparison */}
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-5 text-base font-bold text-white">Score Breakdown</h2>
              <div className="space-y-5">
                {COMPARE_METRICS.map((metric) => {
                  if (metric.key === "overall") return null;
                  const lScore = appLeft.score[metric.key];
                  const rScore = appRight.score[metric.key];
                  const w = winner(lScore, rScore);
                  return (
                    <div key={metric.key}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        {/* Left bar — fill is right-aligned so it grows from center outward */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(lScore / 10) * 100}%`,
                                  background: scoreColor(lScore),
                                  marginLeft: "auto",
                                  transition: "width 0.6s ease",
                                }}
                              />
                            </div>
                          </div>
                          <span className="w-8 shrink-0 text-right text-sm font-bold tabular-nums" style={{ color: scoreColor(lScore) }}>
                            {lScore.toFixed(1)}
                          </span>
                          {w === "left" && <WinnerBadge winner="left" />}
                        </div>

                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider w-8 text-center">
                          vs
                        </span>

                        {/* Right bar — fill grows left to right */}
                        <div className="flex items-center gap-2">
                          {w === "right" && <WinnerBadge winner="right" />}
                          <span className="w-8 shrink-0 text-sm font-bold tabular-nums" style={{ color: scoreColor(rScore) }}>
                            {rScore.toFixed(1)}
                          </span>
                          <div className="flex-1">
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(rScore / 10) * 100}%`,
                                  background: scoreColor(rScore),
                                  transition: "width 0.6s ease",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing comparison */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[appLeft, appRight].map((app) => (
                <div key={app.id} className="glass rounded-2xl p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">{app.logoEmoji}</span>
                    <h3 className="text-sm font-bold text-white">{app.name} Pricing</h3>
                  </div>

                  <div className="mb-3">
                    <PricingBadge model={app.pricing.model} hasFree={app.pricing.hasFreeVersion} size="sm" />
                  </div>

                  <div className="space-y-2">
                    {app.pricing.hasFreeVersion && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Free version</span>
                        <span className="font-semibold text-emerald-400">Yes</span>
                      </div>
                    )}
                    {app.pricing.monthlyPrice && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Monthly</span>
                        <span className="font-bold text-white">{app.pricing.monthlyPrice}/mo</span>
                      </div>
                    )}
                    {app.pricing.oneTimePrice && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">One-time</span>
                        <span className="font-bold text-white">{app.pricing.oneTimePrice}</span>
                      </div>
                    )}
                    {app.pricing.trialDays && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Trial</span>
                        <span className="font-semibold text-emerald-400">{app.pricing.trialDays} days</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Paywall aggression</span>
                      <span className="font-bold text-white">{app.pricing.paywallAggression}/5</span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-white/[0.03] p-2.5">
                    <p className="text-[11px] leading-relaxed text-slate-500">{app.pricing.summary}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verdict row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[appLeft, appRight].map((app) => (
                <div key={app.id} className="glass rounded-2xl p-5">
                  <div className="mb-2.5 flex items-center gap-2">
                    <span>{app.logoEmoji}</span>
                    <h3 className="text-sm font-bold text-white">{app.name} Verdict</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">{app.score.verdictText}</p>
                </div>
              ))}
            </div>

            {/* Tags comparison */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[appLeft, appRight].map((app) => (
                <div key={app.id} className="glass rounded-2xl p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                    <span>{app.logoEmoji}</span> {app.name} Tags
                  </h3>
                  <TagList tags={app.tags} />
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[appLeft, appRight].map((app) => (
                <Link
                  key={app.id}
                  to={`/app/${app.slug}`}
                  className="glass glass-hover flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white transition"
                >
                  Full {app.name} review →
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
