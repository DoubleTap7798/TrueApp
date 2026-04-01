import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AppCard } from "../components/ui/AppCard";
import { SearchBar } from "../components/ui/SearchBar";
import { PageLoader } from "../components/ui/PageLoader";
import { PageError } from "../components/ui/PageError";
import { useAllApps } from "../hooks/useApps";
import { useAllCategories } from "../hooks/useCategories";
import type { PricingModel } from "../types";

const SORT_OPTIONS = [
  { value: "score-desc", label: "TrueScore (High → Low)" },
  { value: "score-asc", label: "TrueScore (Low → High)" },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "newest", label: "Newest First" },
] as const;

const PRICING_FILTERS: { value: PricingModel | "all"; label: string }[] = [
  { value: "all", label: "All Models" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid-once", label: "One-Time" },
  { value: "subscription", label: "Subscription" },
];

const SPECIAL_FILTERS = [
  { value: "featured", label: "⭐ Featured" },
  { value: "trending", label: "🔥 Trending" },
  { value: "editors-pick", label: "✦ Editor's Pick" },
  { value: "privacy", label: "🔒 Privacy-First" },
  { value: "no-ads", label: "🚫 No Ads" },
];

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("cat") ?? "all"
  );
  const [selectedPricing, setSelectedPricing] = useState<string>(
    searchParams.get("pricing") ?? "all"
  );
  const [selectedFilter, setSelectedFilter] = useState(
    searchParams.get("filter") ?? ""
  );
  const [sortBy, setSortBy] = useState<string>("score-desc");

  const { data: APPS = [], isLoading: appsLoading, isError: appsError, refetch: refetchApps } = useAllApps();
  const { data: CATEGORIES = [], isLoading: catsLoading } = useAllCategories();

  // useMemo MUST stay above any early returns (React rule: hooks before conditionals)
  const filteredApps = useMemo(() => {
    let apps = [...APPS];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.developer.toLowerCase().includes(q) ||
          a.tags.some((t) => t.label.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      apps = apps.filter((a) => a.categoryId === selectedCategory);
    }

    // Pricing filter
    if (selectedPricing && selectedPricing !== "all") {
      apps = apps.filter((a) => a.pricing.model === selectedPricing);
    }

    // Special filters
    if (selectedFilter) {
      switch (selectedFilter) {
        case "featured":
          apps = apps.filter((a) => a.isFeatured);
          break;
        case "trending":
          apps = apps.filter((a) => a.isTrending);
          break;
        case "editors-pick":
          apps = apps.filter((a) => a.isEditorsPick);
          break;
        case "privacy":
          apps = apps.filter((a) => a.score.privacy >= 8);
          break;
        case "no-ads":
          apps = apps.filter((a) => a.score.noAds >= 9);
          break;
        case "paid-once":
          apps = apps.filter((a) => a.pricing.model === "paid-once");
          break;
        case "free":
        case "freemium":
          apps = apps.filter((a) => a.pricing.hasFreeVersion);
          break;
      }
    }

    // Sort
    switch (sortBy) {
      case "score-desc":
        apps.sort((a, b) => b.score.overall - a.score.overall);
        break;
      case "score-asc":
        apps.sort((a, b) => a.score.overall - b.score.overall);
        break;
      case "name-asc":
        apps.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        apps.sort((a, b) => b.launchYear - a.launchYear);
        break;
    }

    return apps;
  }, [APPS, query, selectedCategory, selectedPricing, selectedFilter, sortBy]);

  // Early returns after all hooks
  if (appsLoading || catsLoading) return <PageLoader />;
  if (appsError) return <PageError onRetry={() => refetchApps()} />;

  const handleQueryChange = (val: string) => {
    setQuery(val);
    const p = new URLSearchParams(searchParams);
    if (val) p.set("q", val);
    else p.delete("q");
    setSearchParams(p, { replace: true });
  };

  const clearAllFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedPricing("all");
    setSelectedFilter("");
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    query ||
    selectedCategory !== "all" ||
    selectedPricing !== "all" ||
    selectedFilter;

  return (
    <div className="min-h-screen bg-[#020817] pt-16">
      {/* Hero */}
      <div className="border-b border-white/[0.05] bg-[#020817] px-4 pb-6 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-1 text-3xl font-black text-white">Explore Apps</h1>
          <p className="mb-6 text-slate-500">
            {APPS.length} apps reviewed with TrueScore — filter, search, and compare.
          </p>
          <SearchBar
            value={query}
            onChange={handleQueryChange}
            placeholder="Search by name, category, feature..."
            size="lg"
            className="max-w-xl"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-60 xl:w-64">
            <div className="sticky top-20 space-y-6">
              {/* Active filter + clear */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Filters active
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-rose-400 transition hover:text-rose-300"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Category */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Category
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      selectedCategory === "all"
                        ? "bg-indigo-500/15 text-indigo-300"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.slice(0, 10).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === cat.id ? "all" : cat.id
                        )
                      }
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                        selectedCategory === cat.id
                          ? "bg-indigo-500/15 text-indigo-300"
                          : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing model */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Pricing Model
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {PRICING_FILTERS.map((pf) => (
                    <button
                      key={pf.value}
                      onClick={() => setSelectedPricing(pf.value)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        selectedPricing === pf.value
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      {pf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special filters */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Quick Filters
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {SPECIAL_FILTERS.map((sf) => (
                    <button
                      key={sf.value}
                      onClick={() =>
                        setSelectedFilter(
                          selectedFilter === sf.value ? "" : sf.value
                        )
                      }
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        selectedFilter === sf.value
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                          : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      {sf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-white">{filteredApps.length}</span>{" "}
                {filteredApps.length === 1 ? "app" : "apps"} found
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-[#0a1628] text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid */}
            {filteredApps.length === 0 ? (
              <div className="glass rounded-3xl py-20 text-center">
                <div className="mb-3 text-4xl">🔍</div>
                <h3 className="mb-2 text-lg font-bold text-white">No apps found</h3>
                <p className="text-slate-500">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
