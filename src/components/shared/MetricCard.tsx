import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "safe",
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  tone?: "safe" | "warning" | "critical" | "highlight" | "mitigated";
  delay?: number;
}) {
  const tones = {
    safe: "text-safe bg-safe/10",
    warning: "text-warning bg-warning/10",
    critical: "text-critical bg-critical/10",
    highlight: "text-highlight bg-highlight/10",
    mitigated: "text-mitigated bg-mitigated/10",
  } as const;

  return (
    <div
      className="glass fade-up rounded-2xl p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold text-foreground">{value}</p>
          {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
        </div>
        <span className={cn("rounded-xl p-2.5", tones[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
