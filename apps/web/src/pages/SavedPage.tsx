import { Link } from "react-router-dom";
import { AppCard } from "../components/ui/AppCard";
import { useSaved } from "../contexts/SavedContext";
import { useAllApps } from "../hooks/useApps";
import { PageLoader } from "../components/ui/PageLoader";
import { PageError } from "../components/ui/PageError";

export function SavedPage() {
  const { savedIds, compareIds, toggleSaved } = useSaved();
  const { data: allApps = [], isLoading, isError, refetch } = useAllApps();

  if (isLoading) return <PageLoader />;
  if (isError) return <PageError onRetry={() => refetch()} />;

  const savedApps = allApps.filter((a) => savedIds.includes(a.id));
  const compareApps = allApps.filter((a) => compareIds.includes(a.id));

  if (savedApps.length === 0) {
    return (
      <div className="min-h-screen bg-[#020817] pt-16">
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 text-center">
          <div className="mb-5 text-6xl">🔖</div>
          <h1 className="mb-2 text-2xl font-black text-white">No saved apps yet</h1>
          <p className="mb-8 max-w-sm text-slate-500">
            Browse apps and click "Save" to build your personal shortlist. Your saves are stored locally.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/explore"
              className="rounded-2xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500"
            >
              Browse apps
            </Link>
            <Link
              to="/categories"
              className="rounded-2xl border border-white/[0.10] bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Explore categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] pt-16">
      {/* Header */}
      <div className="border-b border-white/[0.05] px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Your List
          </div>
          <h1 className="text-3xl font-black text-white">Saved Apps</h1>
          <p className="mt-1.5 text-slate-500">
            {savedApps.length} app{savedApps.length !== 1 ? "s" : ""} saved · Stored locally in your browser
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Compare CTA */}
        {compareApps.length > 0 && (
          <div
            className="mb-8 flex items-center justify-between rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.10) 100%)",
              border: "1px solid rgba(139,92,246,0.20)",
            }}
          >
            <div>
              <p className="text-sm font-bold text-white">
                {compareApps.length === 2
                  ? `Comparing ${compareApps[0].name} vs ${compareApps[1].name}`
                  : `${compareApps[0].name} added to compare`}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {compareApps.length === 1
                  ? "Add one more app to compare"
                  : "Ready to compare"}
              </p>
            </div>
            <Link
              to="/compare"
              className="rounded-xl border border-violet-500/30 bg-violet-500/15 px-4 py-2.5 text-sm font-bold text-violet-300 transition hover:bg-violet-500/25"
            >
              Open Compare →
            </Link>
          </div>
        )}

        {/* Saved apps grid */}
        <div className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your Saved Apps</h2>
            <button
              onClick={() => savedIds.forEach((id) => toggleSaved(id))}
              className="text-xs font-semibold text-slate-500 transition hover:text-rose-400"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>

        {/* Discovery suggestions */}
        <div className="border-t border-white/[0.05] pt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">You might also like</h2>
            <Link
              to="/explore"
              className="text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              Explore all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allApps.filter((a) => !savedIds.includes(a.id) && (a.isFeatured || a.isEditorsPick))
              .slice(0, 3)
              .map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
