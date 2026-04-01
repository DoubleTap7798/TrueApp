import { scoreColor } from "../../lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
  showLabel?: boolean;
}

const CONFIG = {
  xs: { dim: 44, r: 16, sw: 3, numClass: "text-xs font-bold" },
  sm: { dim: 60, r: 22, sw: 4, numClass: "text-sm font-bold" },
  md: { dim: 84, r: 32, sw: 5, numClass: "text-lg font-black" },
  lg: { dim: 120, r: 48, sw: 7, numClass: "text-2xl font-black" },
  xl: { dim: 160, r: 66, sw: 8, numClass: "text-4xl font-black" },
} as const;

export function ScoreRing({
  score,
  size = "md",
  label = "TrueScore",
  showLabel = true,
}: ScoreRingProps) {
  const c = CONFIG[size];
  const circumference = 2 * Math.PI * c.r;
  const offset = circumference * (1 - score / 10);
  const color = scoreColor(score);
  const cx = c.dim / 2;
  const cy = c.dim / 2;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: c.dim, height: c.dim }}>
        <svg
          width={c.dim}
          height={c.dim}
          viewBox={`0 0 ${c.dim} ${c.dim}`}
          style={{ transform: "rotate(-90deg)" }}
          aria-label={`TrueScore: ${score.toFixed(1)} out of 10`}
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={c.r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={c.sw}
          />
          {/* Glow layer */}
          <circle
            cx={cx}
            cy={cy}
            r={c.r}
            fill="none"
            stroke={color}
            strokeWidth={c.sw + 6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            opacity={0.12}
            style={{ filter: "blur(3px)" }}
          />
          {/* Score arc */}
          <circle
            cx={cx}
            cy={cy}
            r={c.r}
            fill="none"
            stroke={color}
            strokeWidth={c.sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>

        {/* Center number */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${c.numClass}`}
          style={{ color }}
        >
          {score.toFixed(1)}
        </div>
      </div>

      {showLabel && label && (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </span>
      )}
    </div>
  );
}
