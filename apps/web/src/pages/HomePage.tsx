import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppCard } from "../components/ui/AppCard";
import { CategoryCard } from "../components/ui/CategoryCard";
import { ScoreRing } from "../components/ui/ScoreRing";
import { PageLoader } from "../components/ui/PageLoader";
import { PageError } from "../components/ui/PageError";
import { useAllApps } from "../hooks/useApps";
import { useAllCategories } from "../hooks/useCategories";

const INTENT_TAGS = [
  { label: "No Subscription", filter: "paid-once" },
  { label: "Free to Start", filter: "freemium" },
  { label: "Privacy-First", filter: "privacy" },
  { label: "Best for Teams", filter: "team-ready" },
  { label: "One-Time Purchase", filter: "paid-once" },
  { label: "No Hidden Costs", filter: "transparent" },
  { label: "Mac-Native", filter: "mac" },
  { label: "Editor's Pick", filter: "editors-pick" },
];

const SCORE_PILLARS = [
  {
    icon: "🔍",
    title: "No Dark Patterns",
    desc: "We penalize guilt-trip cancellations, confusing tiers, and artificial urgency.",
    color: "#6366f1",
  },
  {
    icon: "🔒",
    title: "Privacy Matters",
    desc: "Data collection practices, tracking, and third-party sharing all affect your score.",
    color: "#10b981",
  },
  {
    icon: "💰",
    title: "Honest Pricing",
    desc: "We surface hidden costs, paywall aggression, and whether free tiers are real.",
    color: "#f59e0b",
  },
  {
    icon: "✨",
    title: "Design & UX",
    desc: "Beautiful, fast, and intuitive apps that respect your time score higher.",
    color: "#ec4899",
  },
];

export function HomePage() {
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const { data: allApps = [], isLoading: appsLoading, isError: appsError, refetch: refetchApps } = useAllApps();
  const { data: allCategories = [], isLoading: catsLoading } = useAllCategories();

  if (appsLoading || catsLoading) return <PageLoader />;
  if (appsError) return <PageError onRetry={() => refetchApps()} />;

  const featuredApps = allApps.filter((a) => a.isFeatured).slice(0, 6);
  const trendingApps = allApps.filter((a) => a.isTrending).slice(0, 4);
  const editorsPicks = allApps.filter((a) => a.isEditorsPick).slice(0, 3);
  const noSubApps = allApps.filter(
    (a) => a.pricing.model === "paid-once" || a.pricing.model === "free"
  ).slice(0, 4);
  const topCategories = allCategories.slice(0, 12);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <div className="bg-[#020817]">
      {/* ─────────── HERO ─────────── */}
      <section className="relative overflow-hidden pt-28 pb-24">
        {/* Background mesh */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.22) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 30%, rgba(139,92,246,0.14) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 60%, rgba(16,185,129,0.10) 0%, transparent 55%)",
          }}
        />

        {/* Floating orbs */}
        <div
          className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-10 h-56 w-56 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse-slow" />
            Transparent app reviews, powered by TrueScore
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Know what you're
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #c4b5fd 0%, #818cf8 40%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              installing.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            TrueApp scores every app on privacy, pricing transparency, dark patterns, and design — so you decide with confidence, not marketing copy.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-lg items-center gap-2"
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="search"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search 500+ apps..."
                className="w-full rounded-2xl border border-white/[0.10] bg-white/[0.05] py-4 pl-12 pr-4 text-base text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition backdrop-blur-sm"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-900/50 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>

          {/* Intent pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {INTENT_TAGS.map((tag) => (
              <Link
                key={tag.label}
                to={`/explore?filter=${tag.filter}`}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-400 transition hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
              >
                {tag.label}
              </Link>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {[
              { value: "500+", label: "Apps reviewed" },
              { value: "25+", label: "Categories" },
              { value: "8 metrics", label: "Per TrueScore" },
              { value: "100%", label: "Independent" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="mt-0.5 text-xs font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW TRUESCORE WORKS ─────────── */}
      <section className="py-20 border-y border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Methodology
            </p>
            <h2 className="text-3xl font-bold text-white">What goes into a TrueScore?</h2>
            <p className="mt-3 text-slate-500">
              8 metrics. No sponsored rankings. No developer payments.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SCORE_PILLARS.map((p) => (
              <div
                key={p.title}
                className="glass rounded-2xl p-5 text-center transition hover:-translate-y-1"
              >
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}30, ${p.color}10)`,
                    border: `1px solid ${p.color}30`,
                  }}
                >
                  {p.icon}
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-white">{p.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Score scale */}
          <div className="mt-10 flex justify-center">
            <div className="glass inline-flex items-center gap-6 rounded-2xl px-6 py-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scale</span>
              {[
                { range: "9–10", label: "Exceptional", color: "#22c55e" },
                { range: "7–8", label: "Great", color: "#6366f1" },
                { range: "5–6", label: "Decent", color: "#f59e0b" },
                { range: "3–4", label: "Below Avg", color: "#f97316" },
                { range: "1–2", label: "Poor", color: "#ef4444" },
              ].map((item) => (
                <div key={item.range} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs font-semibold" style={{ color: item.color }}>
                    {item.range}
                  </span>
                  <span className="hidden text-xs text-slate-600 sm:block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── FEATURED APPS ─────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Featured
              </p>
              <h2 className="text-3xl font-bold text-white">Top-rated right now</h2>
            </div>
            <Link
              to="/explore"
              className="text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              Browse all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── TRENDING ─────────── */}
      <section className="py-16 border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-rose-400">
                Trending
              </p>
              <h2 className="text-2xl font-bold text-white">Gaining momentum</h2>
            </div>
            <Link
              to="/explore?filter=trending"
              className="text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trendingApps.map((app) => (
              <AppCard key={app.id} app={app} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── EDITOR'S PICKS WITH SCORE ─────────── */}
      <section className="py-20 border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
              Editor's Picks
            </p>
            <h2 className="text-3xl font-bold text-white">
              Apps our team stands behind
            </h2>
            <p className="mt-2 text-slate-500">
              Verified, tested, and recommended without reservation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {editorsPicks.map((app) => (
              <Link
                key={app.id}
                to={`/app/${app.slug}`}
                className="glass glass-hover group relative overflow-hidden rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="absolute right-0 top-0 h-32 w-32 opacity-10"
                  style={{
                    background: "radial-gradient(circle at top right, #8b5cf6 0%, transparent 70%)",
                  }}
                />

                <div className="mb-5 flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl ${app.logoGradient}`}
                  >
                    {app.logoEmoji}
                  </div>
                  <ScoreRing score={app.score.overall} size="sm" showLabel={false} />
                </div>

                <h3 className="text-lg font-bold text-white">{app.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400 line-clamp-2">
                  {app.score.verdictText}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-400">
                  Read full review
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── NO-SUBSCRIPTION SPOTLIGHT ─────────── */}
      <section className="py-20 border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                No Subscription
              </p>
              <h2 className="text-3xl font-bold text-white">Pay once, own forever</h2>
              <p className="mt-2 text-slate-500">
                Great apps that respect the one-time purchase model.
              </p>
            </div>
            <Link
              to="/explore?filter=paid-once"
              className="text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {noSubApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CATEGORIES ─────────── */}
      <section className="py-20 border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
                Browse
              </p>
              <h2 className="text-3xl font-bold text-white">Explore by category</h2>
            </div>
            <Link
              to="/categories"
              className="text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              All categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── BOTTOM CTA ─────────── */}
      <section className="py-24 border-t border-white/[0.05]">
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.35) 0%, transparent 70%)",
            }}
          />
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Compare smarter
          </p>
          <h2 className="text-4xl font-black text-white">
            Choosing between two apps?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-slate-400">
            Use our compare tool to see TrueScores, pricing, and feature breakdowns side by side.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/compare"
              className="rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-900/50 transition hover:bg-indigo-500"
            >
              Compare apps →
            </Link>
            <Link
              to="/explore"
              className="rounded-2xl border border-white/[0.12] bg-white/[0.04] px-8 py-4 text-base font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Browse all apps
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
