import type { StrategyMetrics } from "@/utils/explanations";

export function ComparisonTable({
  metrics,
}: {
  metrics: Record<"patch" | "isolate" | "replace", StrategyMetrics>;
}) {
  const rows: [string, (m: StrategyMetrics) => string][] = [
    ["Disruption", (m) => m.disruption],
    ["Blast radius after", (m) => `${m.blastAfter}`],
    ["Orphaned packages", (m) => `${m.orphaned}`],
    ["Implementation effort", (m) => m.effort],
    ["Reversible", (m) => (m.disruption === "High" ? "Yes, with downtime" : "Yes")],
  ];

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-3 font-medium">Metric</th>
            <th className="px-5 py-3 font-medium">Patch</th>
            <th className="px-5 py-3 font-medium">Isolate</th>
            <th className="px-5 py-3 font-medium">Replace</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, get]) => (
            <tr key={label} className="border-t border-border/60">
              <td className="px-5 py-3 text-muted-foreground">{label}</td>
              <td className="px-5 py-3 font-mono text-xs">{get(metrics.patch)}</td>
              <td className="px-5 py-3 font-mono text-xs">{get(metrics.isolate)}</td>
              <td className="px-5 py-3 font-mono text-xs">{get(metrics.replace)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
