import { NODES } from "@/data/ecosystem";
import { metricsOf } from "@/utils/graphAnalysis";
import { CalendarClock } from "lucide-react";

function ageInDays(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000));
}

/** Last-update recency crossed with Ripple Score: stale chokepoints rank highest. */
export function ThreatTimeline() {
  const rows = NODES.filter((n) => n.lastPublished)
    .map((n) => {
      const days = ageInDays(n.lastPublished!);
      const staleness = Math.min(1, days / (365 * 4));
      const score = metricsOf(n.id)?.rippleScore ?? 0;
      return { node: n, days, staleness, risk: 0.5 * staleness + 0.5 * score };
    })
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 12);

  if (rows.length === 0) return null;

  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-warning">
        <CalendarClock className="size-4" /> Threat timeline — maintenance risk over time
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">
        How long each package has gone without a release, weighted by how much of the
        ecosystem depends on it. Old code at a chokepoint is where the next incident starts.
      </p>

      <ul className="mt-5 space-y-3">
        {rows.map(({ node, days, risk }) => (
          <li key={node.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate font-mono text-sm">{node.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  last release {new Date(node.lastPublished!).toLocaleDateString()} ·{" "}
                  {Math.floor(days / 30)} months ago
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-background/60">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round(risk * 100)}%`,
                    background:
                      risk > 0.66
                        ? "var(--critical)"
                        : risk > 0.4
                          ? "var(--warning)"
                          : "var(--safe)",
                  }}
                />
              </div>
            </div>
            <span className="w-12 text-right font-mono text-xs text-muted-foreground">
              {(risk * 100).toFixed(0)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
