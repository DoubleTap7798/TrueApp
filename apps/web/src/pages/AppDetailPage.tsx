import { useParams, Link } from "react-router-dom";
import { ScoreRing } from "../components/ui/ScoreRing";
import { ScoreBar } from "../components/ui/ScoreBar";
import { PricingBadge } from "../components/ui/PricingBadge";
import { TagList } from "../components/ui/TagChip";
import { AppCard } from "../components/ui/AppCard";
import { PageLoader } from "../components/ui/PageLoader";
import { PageError } from "../components/ui/PageError";
import { useSaved } from "../contexts/SavedContext";
import { scoreColor, scoreLevelLabel } from "../lib/utils";
import { useApp, useAppsByIds } from "../hooks/useApps";
import { useAllCategories } from "../hooks/useCategories";

const SCORE_BREAKDOWN = [
  { key: "privacy", label: "Privacy & Data" },
  { key: "valueForMoney", label: "Value for Money" },
  { key: "uxDesign", label: "UX & Design" },
  { key: "pricingTransparency", label: "Pricing Transparency" },
  { key: "noAds", label: "Ad-Free Experience" },
  { key: "onboarding", label: "Onboarding" },
  { key: "support", label: "Support Quality" },
] as const;

const PAYWALL_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Not aggressive", color: "#22c55e" },
  2: { label: "Slightly pushy", color: "#86efac" },
  3: { label: "Moderately aggressive", color: "#f59e0b" },
  4: { label: "Very aggressive", color: "#f97316" },
  5: { label: "Extremely aggressive", color: "#ef4444" },
};

export function AppDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isSaved, toggleSaved, isInCompare, toggleCompare } = useSaved();

  const { data: app, isLoading, isError, refetch } = useApp(slug);
  const { data: allCategories = [] } = useAllCategories();
  const { data: alternatives = [] } = useAppsByIds(app?.alternativeIds ?? []);

  if (isLoading) return <PageLoader />;

  if (isError || !app) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020817] pt-16">
        <div className="text-center">
          <div className="mb-4 text-6xl">🕵️</div>
          <h1 className="mb-2 text-2xl font-bold text-white">App not found</h1>
          <p className="mb-6 text-slate-500">
            We don't have a listing for "{slug}" yet.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/explore"
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
            >
              Browse all apps
            </Link>
            {isError && (
              <button
                onClick={() => refetch()}
                className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/5"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const category = allCategories.find((c) => c.id === app.categoryId);

  const saved = isSaved(app.id);
  const inCompare = isInCompare(app.id);
  const paywallInfo = PAYWALL_LABELS[app.pricing.paywallAggression] ??
    PAYWALL_LABELS[1];

  return (
    <div className="min-h-screen bg-[#020817] pt-16">
      {/* Hero */}
      <div
        className="relative overflow-hidden border-b border-white/[0.06] pb-12 pt-12"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(99,102,241,0.15) 0%, transparent 65%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-slate-600">
            <Link to="/explore" className="transition hover:text-white">
              Explore
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link
                  to={`/categories?cat=${category.slug}`}
                  className="transition hover:text-white"
                >
                  {category.label}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-slate-400">{app.name}</span>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {/* Left: App info */}
            <div className="flex-1">
              <div className="flex items-start gap-5">
                {/* Logo */}
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br text-4xl shadow-2xl ${app.logoGradient}`}
                >
                  {app.logoEmoji}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-black text-white">{app.name}</h1>
                    {app.isEditorsPick && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        Editor's Pick
                      </span>
                    )}
                    {app.isTrending && (
                      <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-400">
                        Trending
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-slate-400">{app.developer}</p>
                  <p className="mt-2 text-base text-slate-300">{app.tagline}</p>
                </div>
              </div>

              {/* Platform badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {app.platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {p === "all" ? "All Platforms" : p === "macos" ? "macOS" : p === "ios" ? "iOS" : p === "android" ? "Android" : p}
                  </span>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-4">
                <TagList tags={app.tags} />
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => toggleSaved(app.id)}
                  className={`flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-bold transition-all ${
                    saved
                      ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25"
                      : "border-white/[0.12] bg-white/[0.05] text-white hover:bg-white/[0.10]"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  {saved ? "Saved" : "Save app"}
                </button>

                <button
                  onClick={() => toggleCompare(app.id)}
                  className={`flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-bold transition-all ${
                    inCompare
                      ? "border-violet-500/40 bg-violet-500/15 text-violet-300 hover:bg-violet-500/25"
                      : "border-white/[0.12] bg-white/[0.05] text-white hover:bg-white/[0.10]"
                  }`}
                >
                  ⇌ {inCompare ? "In Compare" : "Add to Compare"}
                </button>

                {app.website && (
                  <a
                    href={app.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/[0.10]"
                  >
                    Visit website ↗
                  </a>
                )}
              </div>
            </div>

            {/* Right: Big TrueScore */}
            <div className="flex shrink-0 flex-col items-center">
              <ScoreRing score={app.score.overall} size="xl" />
              <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-center">
                <p
                  className="text-base font-black capitalize"
                  style={{ color: scoreColor(app.score.overall) }}
                >
                  {scoreLevelLabel(app.score.overall)}
                </p>
                <p className="text-xs text-slate-600">
                  {app.reviewSummary.count.toLocaleString()} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <p
              className="mb-1.5 text-[11px] font-bold uppercase tracking-widest"
              style={{ color: scoreColor(app.score.overall) }}
            >
              TrueApp Verdict
            </p>
            <p className="text-slate-300 leading-relaxed">{app.score.verdictText}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column: Score breakdown + Review */}
          <div className="col-span-2 space-y-6">
            {/* Score breakdown */}
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-5 text-base font-bold text-white">Score Breakdown</h2>
              <div className="space-y-3.5">
                {SCORE_BREAKDOWN.map((item) => (
                  <ScoreBar
                    key={item.key}
                    label={item.label}
                    score={app.score[item.key]}
                  />
                ))}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="glass rounded-2xl p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-xs">✓</span>
                  What works well
                </h3>
                <ul className="space-y-2.5">
                  {app.reviewSummary.pros.map((pro, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-rose-400">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/15 text-xs">✗</span>
                  What to watch out for
                </h3>
                <ul className="space-y-2.5">
                  {app.reviewSummary.cons.map((con, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Expert Verdict */}
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-3 text-base font-bold text-white">Expert Verdict</h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {app.reviewSummary.expertVerdict}
              </p>
            </div>

            {/* User quote */}
            <div
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              <div className="absolute -right-4 -top-4 text-8xl opacity-[0.08] select-none">
                "
              </div>
              <blockquote className="relative">
                <p className="mb-3 text-sm leading-relaxed text-slate-300 italic">
                  "{app.reviewSummary.featuredQuote.text}"
                </p>
                <footer className="text-xs">
                  <span className="font-semibold text-white">
                    {app.reviewSummary.featuredQuote.author}
                  </span>
                  <span className="ml-2 text-slate-500">
                    {app.reviewSummary.featuredQuote.role}
                  </span>
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Right column: Pricing */}
          <div className="space-y-6">
            {/* Pricing card */}
            <div className="glass rounded-2xl p-5">
              <h2 className="mb-4 text-base font-bold text-white">Pricing</h2>

              <div className="mb-3">
                <PricingBadge
                  model={app.pricing.model}
                  hasFree={app.pricing.hasFreeVersion}
                />
              </div>

              {/* Price breakdown */}
              <div className="space-y-2.5">
                {app.pricing.monthlyPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Monthly</span>
                    <span className="font-bold text-white">{app.pricing.monthlyPrice}/mo</span>
                  </div>
                )}
                {app.pricing.annualPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Annual</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{app.pricing.annualPrice}</span>
                      {app.pricing.annualDiscount && (
                        <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          Save {app.pricing.annualDiscount}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {app.pricing.oneTimePrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">One-time</span>
                    <span className="font-bold text-white">{app.pricing.oneTimePrice}</span>
                  </div>
                )}
                {app.pricing.trialDays && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Free trial</span>
                    <span className="font-semibold text-emerald-400">{app.pricing.trialDays} days</span>
                  </div>
                )}
                {!app.pricing.monthlyPrice && !app.pricing.oneTimePrice && (
                  <div className="text-center">
                    <span className="text-2xl font-black text-emerald-400">Free</span>
                    {!app.pricing.hasFreeVersion && (
                      <p className="mt-0.5 text-xs text-slate-600">No free version available</p>
                    )}
                  </div>
                )}
              </div>

              {/* Paywall aggression */}
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Paywall Aggression</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: paywallInfo.color }}
                  >
                    {app.pricing.paywallAggression}/5
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        background:
                          n <= app.pricing.paywallAggression
                            ? paywallInfo.color
                            : "rgba(255,255,255,0.06)",
                      }}
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600">{paywallInfo.label}</p>
              </div>

              {/* Hidden costs */}
              {app.pricing.hiddenCosts.length > 0 && (
                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <span>⚠</span> Things to know
                  </p>
                  <ul className="space-y-1.5">
                    {app.pricing.hiddenCosts.map((cost, i) => (
                      <li key={i} className="text-xs text-slate-500 leading-relaxed">
                        • {cost}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Summary */}
              <div className="mt-4 rounded-xl bg-white/[0.03] p-3">
                <p className="text-xs leading-relaxed text-slate-500">
                  {app.pricing.summary}
                </p>
              </div>
            </div>

            {/* Quick score card */}
            <div className="glass rounded-2xl p-5">
              <h2 className="mb-4 text-sm font-bold text-white">Quick Scores</h2>
              <div className="space-y-3">
                <ScoreBar label="Privacy" score={app.score.privacy} compact />
                <ScoreBar label="Value" score={app.score.valueForMoney} compact />
                <ScoreBar label="No Ads" score={app.score.noAds} compact />
                <ScoreBar label="Onboarding" score={app.score.onboarding} compact />
              </div>
            </div>

            {/* Category */}
            {category && (
              <div className="glass rounded-2xl p-5">
                <h2 className="mb-3 text-sm font-bold text-white">Category</h2>
                <Link
                  to={`/categories?cat=${category.slug}`}
                  className="flex items-center gap-3 transition hover:opacity-80"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                    style={{ background: category.gradient }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{category.label}</p>
                    <p className="text-xs text-slate-500">{category.appCount} apps</p>
                  </div>
                  <svg className="ml-auto text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-5 text-xl font-bold text-white">Alternatives to consider</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {alternatives.map((alt) => (
                <AppCard key={alt.id} app={alt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
