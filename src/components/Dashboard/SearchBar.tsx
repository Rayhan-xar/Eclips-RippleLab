import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  resultCount,
}: {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search packages — try “lodash”, “express”, “auth”…"
          className="w-full rounded-xl border border-input bg-background/60 py-2.5 pl-10 pr-9 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/60"
        />
        {value ? (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      {value ? (
        <span className="shrink-0 text-xs text-muted-foreground">
          {resultCount} match{resultCount === 1 ? "" : "es"}
        </span>
      ) : null}
    </div>
  );
}
