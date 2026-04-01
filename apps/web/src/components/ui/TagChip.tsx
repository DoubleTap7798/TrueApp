import { tagVariantClasses } from "../../lib/utils";
import type { AppTag } from "../../types";

interface TagChipProps {
  tag: AppTag;
  size?: "sm" | "md";
}

export function TagChip({ tag, size = "md" }: TagChipProps) {
  const base = tagVariantClasses(tag.variant);
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${padding} ${base}`}
    >
      {tag.label}
    </span>
  );
}

interface TagListProps {
  tags: AppTag[];
  max?: number;
  size?: "sm" | "md";
}

export function TagList({ tags, max = tags.length, size = "md" }: TagListProps) {
  const visible = tags.slice(0, max);
  const remaining = tags.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((t) => (
        <TagChip key={t.id} tag={t} size={size} />
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full border border-slate-700/50 bg-slate-800/30 px-2.5 py-1 text-xs font-medium text-slate-500">
          +{remaining}
        </span>
      )}
    </div>
  );
}
