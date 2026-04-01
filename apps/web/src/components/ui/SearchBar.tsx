import { useState } from "react";
import { cn } from "../../lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search apps...",
  size = "md",
  autoFocus,
  className,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "relative flex items-center transition-all duration-200",
        focused
          ? "ring-2 ring-indigo-500/60 rounded-2xl"
          : "ring-1 ring-white/10 rounded-2xl",
        className
      )}
    >
      {/* Search icon */}
      <div className="pointer-events-none absolute left-4 text-slate-500">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "w-full rounded-2xl bg-white/[0.04] pl-11 pr-4 font-medium text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.06]",
          size === "lg" ? "py-4 text-base" : "py-3 text-sm"
        )}
        spellCheck={false}
        autoComplete="off"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-slate-400 transition hover:bg-white/[0.14] hover:text-white"
          aria-label="Clear search"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
