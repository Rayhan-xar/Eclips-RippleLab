import { useMemo, useState } from "react";
import { ArrowRight, Radar } from "lucide-react";
import { nodeOf, APPLICATIONS } from "@/data/ecosystem";
import { metricsOf, type BlastRadius } from "@/utils/graphAnalysis";
import { TypeBadge } from "@/components/shared/Badge";
import { COLORS } from "@/lib/colors";

type SortKey = "name" | "type" | "depth" | "score";

function DonutBreakdown({ blast }: { blast: BlastRadius }) {
  const counts = { application: 0, library: 0, foundational: 0 } as Record<string, number>;
  for (const id of blast.affected) counts[nodeOf(id).type] += 1;
  const total = blast.affected.length || 1;

  const segments = [
    { key: "application", color: COLORS.highlight },
    { key: "library", color: COLORS.safe },
    { key: "foundational", color: COLORS.warning },
  ];

  let offset = 0;
  const r = 42;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-5">
      <svg width={110} height={110} className="-rotate-90">
        {segments.map((s) => {
          const frac = counts[s.key] / total;
          const dash = `${frac * c} ${c}`;
          const el = (
            <circle
              key={s.key}
              cx={55}
              cy={55}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={14}
              strokeDasharray={dash}
              strokeDashoffset={-offset * c}
            />
          );
          offset += frac;
          return el;
        })}
      </svg>
      <ul className="space-y-1.5 text-xs">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2 capitalize">
            <span className="size-2.5 rounded-sm" style={{ background: s.color }} />
            {s.key}s
            <span className="ml-auto font-mono text-muted-foreground">{counts[s.key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlastRadiusPanel({ blast }: { blast: BlastRadius }) {
  const [sort, setSort] = useState<SortKey>("depth");
  const compromised = nodeOf(blast.compromised);

  const rows = useMemo(() => {
    const list = blast.affected.map((id) => ({
      id,
      name: nodeOf(id).name,
      type: nodeOf(id).type,
      depth: blast.depthById.get(id) ?? 0,
      score: metricsOf(id).rippleScore,
    }));
    return list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "type") return a.type.localeCompare(b.type);
      if (sort === "score") return b.score - a.score;
      return a.depth - b.depth || a.name.localeCompare(b.name);
    });
  }, [blast, sort]);

  return (
    <div className="space-y-4">
      <div className="glass fade-up rounded-2xl p-5">
        <div className="flex items-center gap-2 text-critical">
          <Radar className="size-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Blast radius</h2>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          If <span className="font-mono text-foreground">{compromised.name}</span> is
          compromised:
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            ["Packages affected", `${blast.affected.length}`],
            ["Apps exposed", `${blast.affectedApps.length}/${APPLICATIONS.length}`],
            ["Max depth", `${blast.maxDepth} levels`],
            ["Ecosystem exposure", `${blast.exposurePct.toFixed(0)}%`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-background/50 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
              <p className="mt-1 font-mono text-xl">{v}</p>
            </div>
          ))}
        </div>
        {blast.affectedApps.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {blast.affectedApps.map((id) => (
              <span
                key={id}
                className="rounded-md border border-critical/30 bg-critical/10 px-2 py-1 font-mono text-[11px] text-critical"
              >
                {nodeOf(id).name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Critical paths
        </h3>
        <ul className="mt-3 space-y-2">
          {blast.criticalPaths.length === 0 ? (
            <li className="text-xs text-muted-foreground">
              No application is reachable from this package.
            </li>
          ) : (
            blast.criticalPaths.map(({ app, path }) => (
              <li
                key={app}
                className="flex flex-wrap items-center gap-1.5 rounded-xl bg-background/50 px-3 py-2 font-mono text-[11px]"
              >
                {path.map((id, i) => (
                  <span key={id} className="flex items-center gap-1.5">
                    {i > 0 && <ArrowRight className="size-3 text-muted-foreground" />}
                    <span className={i === 0 ? "text-critical" : "text-foreground"}>
                      {nodeOf(id).name}
                    </span>
                  </span>
                ))}
                <span className="ml-auto text-muted-foreground">depth {path.length - 1}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Severity breakdown
        </h3>
        <div className="mt-4">
          <DonutBreakdown blast={blast} />
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Affected packages
        </h3>
        <div className="mt-3 max-h-80 overflow-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-surface/95 backdrop-blur">
              <tr>
                {(
                  [
                    ["name", "Package"],
                    ["type", "Type"],
                    ["depth", "Depth"],
                    ["score", "Ripple"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th key={key} className="px-3 py-2 font-medium">
                    <button
                      onClick={() => setSort(key)}
                      className={sort === key ? "text-safe" : "text-muted-foreground"}
                    >
                      {label}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border/60">
                  <td className="px-3 py-2 font-mono">{r.name}</td>
                  <td className="px-3 py-2">
                    <TypeBadge type={r.type} />
                  </td>
                  <td className="px-3 py-2 font-mono">{r.depth}</td>
                  <td className="px-3 py-2 font-mono">{r.score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
