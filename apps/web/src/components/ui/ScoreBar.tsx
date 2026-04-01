import { scoreColor } from "../../lib/utils";

interface ScoreBarProps {
  label: string;
  score: number;
  showValue?: boolean;
  compact?: boolean;
}

export function ScoreBar({ label, score, showValue = true, compact = false }: ScoreBarProps) {
  const color = scoreColor(score);
  const pct = (score / 10) * 100;

  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      <div className="flex items-center justify-between">
        <span
          className={`font-medium text-slate-300 ${compact ? "text-[11px]" : "text-xs"}`}
        >
          {label}
        </span>
        {showValue && (
          <span
            className={`font-bold tabular-nums ${compact ? "text-[11px]" : "text-xs"}`}
            style={{ color }}
          >
            {score.toFixed(1)}
          </span>
        )}
      </div>

      {/* Track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        {/* Fill */}
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 6px ${color}60`,
            transition: "width 0.6s ease-out",
          }}
        />
      </div>
    </div>
  );
}
