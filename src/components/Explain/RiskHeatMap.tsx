import { APPLICATIONS, NODES, nodeOf } from "@/data/ecosystem";
import { computeBlastRadius } from "@/utils/graphAnalysis";

function cellFor(depth: number | null) {
  if (depth === null) return { cls: "bg-mitigated/15", label: "—" };
  if (depth <= 2) return { cls: "bg-critical/70", label: String(depth) };
  return { cls: "bg-warning/50", label: String(depth) };
}

export function RiskHeatMap() {
  const PACKAGES = NODES.filter((n) => n.type !== "application").slice(0, 40);
  const matrix = PACKAGES.map((p) => {
    const blast = computeBlastRadius(p.id);
    return {
      id: p.id,
      cells: APPLICATIONS.map((a) => blast.depthById.get(a.id) ?? null),
    };
  });

  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-safe">
        Risk heat map
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">
        Propagation depth from each package to each application. Red = direct or near-direct
        (≤2 hops), amber = indirect, green = not on the path.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 bg-surface/90 px-2 py-2 text-left font-medium text-muted-foreground">
                Package
              </th>
              {APPLICATIONS.map((a) => (
                <th
                  key={a.id}
                  className="h-28 w-10 px-1 align-bottom text-left font-medium text-muted-foreground"
                >
                  <span className="inline-block origin-bottom-left translate-x-3 -rotate-60 whitespace-nowrap">
                    {a.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.id}>
                <td className="sticky left-0 bg-surface/90 px-2 py-1 font-mono">
                  {nodeOf(row.id).name}
                </td>
                {row.cells.map((d, i) => {
                  const c = cellFor(d);
                  return (
                    <td key={i} className="px-0.5 py-0.5">
                      <div
                        className={`flex h-7 w-9 items-center justify-center rounded ${c.cls} font-mono text-[10px]`}
                        title={`${nodeOf(row.id).name} → ${APPLICATIONS[i]?.name}: ${
                          d === null ? "not on path" : `${d} hops`
                        }`}
                      >
                        {c.label}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
