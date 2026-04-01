import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CategoryCard } from "../components/ui/CategoryCard";
import { AppCard } from "../components/ui/AppCard";
import { PageLoader } from "../components/ui/PageLoader";
import { PageError } from "../components/ui/PageError";
import { useAllApps } from "../hooks/useApps";
import { useAllCategories } from "../hooks/useCategories";

const INTENT_TAGS = [
  { label: "I want better focus", catId: "productivity" },
  { label: "I need to design something", catId: "design" },
  { label: "I want to learn to code", catId: "education" },
  { label: "I need a password manager", catId: "security" },
  { label: "I want to build faster", catId: "developer-tools" },
  { label: "I need to communicate better", catId: "communication" },
  { label: "I want healthier habits", catId: "health" },
  { label: "I want privacy online", catId: "security" },
  { label: "I want to manage my money", catId: "finance" },
  { label: "I need to write more", catId: "writing" },
];

export function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  const { data: allCategories = [], isLoading: catLoading, isError: catError, refetch: refetchCats } = useAllCategories();
  const { data: allApps = [], isLoading: appsLoading, isError: appsError, refetch: refetchApps } = useAllApps();

  if (catLoading || appsLoading) return <PageLoader />;
  if (catError) return <PageError onRetry={() => refetchCats()} />;
  if (appsError) return <PageError onRetry={() => refetchApps()} />;

  const CATEGORIES = allCategories;
  const APPS = allApps;

  const activeCatSlug = searchParams.get("cat") ?? null;
  const activeCategory = activeCatSlug
    ? CATEGORIES.find((c) => c.slug === activeCatSlug)
    : null;

  const filteredCategories = query
    ? CATEGORIES.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : CATEGORIES;

  const appsInCategory = activeCategory
    ? APPS.filter((a) => a.categoryId === activeCategory.id).slice(0, 6)
    : [];

  return (
    <div className="min-h-screen bg-[#020817] pt-16">
      {/* Hero */}
      <div
        className="relative overflow-hidden border-b border-white/[0.05] px-4 pb-12 pt-14 sm:px-6 lg:px-8"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            25+ Categories
          </p>
          <h1 className="text-4xl font-black text-white sm:text-5xl">
            Find apps by category
          </h1>
          <p className="mt-4 text-slate-500">
            Every major app category, scored and organized so you find the right tool fast.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter categories..."
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition"
              autoComplete="off"
            />
          </div>

          {/* Intent tags */}
          {!query && !activeCatSlug && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {INTENT_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => setSearchParams({ cat: tag.catId })}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-400 transition hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Active category detail panel */}
        {activeCategory && (
          <div className="mb-10">
            <button
              onClick={() => setSearchParams({})}
              className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              All Categories
            </button>

            <div className="glass rounded-3xl p-6 sm:p-8">
              <div className="mb-6 flex items-start gap-5">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
                  style={{
                    background: activeCategory.gradient,
                    boxShadow: `0 8px 24px ${activeCategory.accent}30`,
                  }}
                >
                  {activeCategory.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{activeCategory.label}</h2>
                  <p className="mt-1 text-slate-500">{activeCategory.description}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: activeCategory.accent }}>
                    {activeCategory.appCount} apps
                  </p>
                </div>
              </div>

              {/* Subcategories */}
              <div className="mb-6 flex flex-wrap gap-2">
                {activeCategory.subcategories.map((sub) => (
                  <div key={sub.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span>{sub.icon}</span>
                      <span className="text-sm font-semibold text-white">{sub.label}</span>
                    </div>
                    {sub.micros.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {sub.micros.map((m) => (
                          <span key={m.id} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-600">
                            {m.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Intent tags */}
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  I'm looking for...
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeCategory.intentTags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apps in category */}
              {appsInCategory.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">
                      Top apps in {activeCategory.label}
                    </p>
                    <Link
                      to={`/explore?cat=${activeCategory.id}`}
                      className="text-xs font-semibold text-indigo-400 transition hover:text-indigo-300"
                    >
                      Browse all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {appsInCategory.map((app) => (
                      <AppCard key={app.id} app={app} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {appsInCategory.length === 0 && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-8 text-center">
                  <p className="text-slate-600">More apps in this category coming soon.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Grid */}
        {!activeCatSlug && (
          <>
            {filteredCategories.length === 0 ? (
              <div className="rounded-3xl border border-white/[0.06] py-20 text-center">
                <div className="mb-3 text-4xl">🔍</div>
                <h3 className="mb-1 text-lg font-bold text-white">No categories found</h3>
                <p className="text-slate-500">Try a different search term.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {filteredCategories.length} categories
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredCategories.map((cat) => (
                    <CategoryCard key={cat.id} category={cat} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* All categories still shown below active category selection */}
        {activeCatSlug && (
          <div>
            <h2 className="mb-5 text-xl font-bold text-white">All categories</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {CATEGORIES.map((cat) => (
                <CategoryCard key={cat.id} category={cat} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
