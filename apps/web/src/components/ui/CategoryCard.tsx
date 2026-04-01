import { Link } from "react-router-dom";
import type { Category } from "../../types";

interface CategoryCardProps {
  category: Category;
  variant?: "default" | "compact";
}

export function CategoryCard({ category, variant = "default" }: CategoryCardProps) {
  if (variant === "compact") {
    return (
      <Link
        to={`/categories?cat=${category.slug}`}
        className="group glass glass-hover flex items-center gap-3 rounded-2xl p-3 transition-all duration-200 hover:-translate-y-0.5"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ background: category.gradient }}
        >
          {category.icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{category.label}</p>
          <p className="text-xs text-slate-500">{category.appCount} apps</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/categories?cat=${category.slug}`}
      className="group glass glass-hover relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
      style={{
        boxShadow: `0 0 0 1px rgba(255,255,255,0.08)`,
      }}
    >
      {/* Subtle gradient background echo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] transition-opacity duration-200 group-hover:opacity-[0.14]"
        style={{ background: category.gradient }}
      />

      {/* Icon */}
      <div
        className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
        style={{
          background: category.gradient,
          boxShadow: `0 4px 16px ${category.accent}30`,
        }}
      >
        {category.icon}
      </div>

      {/* Title + count */}
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-white leading-tight">
          {category.label}
        </h3>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{
            background: `${category.accent}20`,
            color: category.accent,
          }}
        >
          {category.appCount}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
        {category.description}
      </p>

      {/* Subcategory pills */}
      {category.subcategories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {category.subcategories.slice(0, 3).map((sub) => (
            <span
              key={sub.id}
              className="inline-flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-500"
            >
              {sub.icon} {sub.label}
            </span>
          ))}
          {category.subcategories.length > 3 && (
            <span className="inline-flex items-center rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-600">
              +{category.subcategories.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
