import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Explore: [
    { label: "All Apps", to: "/explore" },
    { label: "Categories", to: "/categories" },
    { label: "Compare Apps", to: "/compare" },
    { label: "Saved Apps", to: "/saved" },
  ],
  Discover: [
    { label: "Editor's Picks", to: "/explore?filter=editors-pick" },
    { label: "Free Tier Apps", to: "/explore?filter=free" },
    { label: "No Subscription", to: "/explore?filter=paid-once" },
    { label: "Trending", to: "/explore?filter=trending" },
  ],
  Company: [
    { label: "About TrueApp", to: "#" },
    { label: "How TrueScore Works", to: "#" },
    { label: "For Developers", to: "#" },
    { label: "Privacy Policy", to: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#020817] pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 pb-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 shadow-md shadow-indigo-900/50">
                <span className="text-sm font-black text-white">T</span>
              </div>
              <span className="text-lg font-bold text-white">
                True<span className="text-indigo-400">App</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Honest scores, transparent pricing analysis, and real user insights — so you know what you're installing before you do.
            </p>

            {/* Score legend */}
            <div className="mt-5 inline-flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                TrueScore Scale
              </p>
              <div className="flex items-center gap-3">
                {[
                  { label: "9–10", color: "#22c55e", name: "Exceptional" },
                  { label: "7–8", color: "#6366f1", name: "Great" },
                  { label: "5–6", color: "#f59e0b", name: "Decent" },
                  { label: "<5", color: "#ef4444", name: "Below" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="text-[10px] font-medium text-slate-500">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 text-center md:flex-row md:text-left">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} TrueApp. Built to help you spend wisely.
          </p>
          <p className="text-xs text-slate-700">
            App ratings are independent and not sponsored by any developer.
          </p>
        </div>
      </div>
    </footer>
  );
}
