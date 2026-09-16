import { ShieldCheck, Scissors, Replace, AlertTriangle } from "lucide-react";
import type { StrategyMetrics } from "@/utils/explanations";
import { cn } from "@/lib/utils";

const ICONS = { patch: ShieldCheck, isolate: Scissors, replace: Replace } as const;

function MiniGraph({ variant }: { variant: "patch" | "isolate" | "replace" }) {
  const node = { patch: "#10b981", isolate: "#64748b", replace: "#10b981" } as const;
  const edge =
    variant === "isolate"
      ? { stroke: "#ef4444", dash: "4 3", opacity: 0.8 }
      : { stroke: "#06b6d4", dash: "0", opacity: 0.55 };

  return (
    <svg viewBox="0 0 220 96" className="h-24 w-full">
      {[30, 110, 190].map((x) => (
        <g key={x}>
          <line
            x1={110}
            y1={70}
            x2={x}
            y2={22}
            stroke={edge.stroke}
            strokeDasharray={edge.dash}
            strokeOpacity={edge.opacity}
            strokeWidth={1.6}
          />
          <rect
            x={x - 9}
            y={13}
            width={18}
            height={18}
            rx={3}
            fill={variant === "isolate" && x !== 110 ? "#f59e0b" : "#06b6d4"}
            fillOpacity={0.85}
          />
        </g>
      ))}
      {variant === "replace" ? (
        <>
          <circle cx={78} cy={72} r={7} fill="#475569" fillOpacity={0.5} />
          <circle cx={128} cy={72} r={10} fill={node[variant]} />
        </>
      ) : (
        <circle cx={110} cy={72} r={10} fill={node[variant]} />
      )}
    </svg>
  );
}

export function StrategyCard({
  variant,
  title,
  description,
  metrics,
  recommended,
}: {
  variant: "patch" | "isolate" | "replace";
  title: string;
  description: string;
  metrics: StrategyMetrics;
  recommended: boolean;
}) {
  const Icon = ICONS[variant];
  return (
    <div
      className={cn(
        "glass fade-up flex flex-col rounded-2xl p-5",
        recommended && "ring-2 ring-mitigated/50",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
          <Icon className="size-4 text-safe" /> {variant}
        </span>
        {recommended ? (
          <span className="rounded-full bg-mitigated/15 px-2.5 py-0.5 text-[11px] font-medium text-mitigated">
            Recommended
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-4 rounded-xl border border-border bg-background/40 p-2">
        <MiniGraph variant={variant} />
      </div>

      <dl className="mt-4 space-y-2 text-xs">
        {[
          ["Disruption", metrics.disruption],
          ["Blast radius after", `${metrics.blastAfter} packages`],
          ["Orphaned packages", `${metrics.orphaned}`],
          ["Effort", metrics.effort],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-mono">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 flex gap-2 rounded-xl bg-warning/10 p-3 text-xs text-warning">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        {metrics.risk}
      </p>
    </div>
  );
}
