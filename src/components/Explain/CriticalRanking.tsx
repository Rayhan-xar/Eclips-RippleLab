import { RANKED, computeBlastRadius } from "@/utils/graphAnalysis";
import { recommendedAction } from "@/utils/explanations";
import { ScoreBar } from "@/components/shared/RippleScoreGauge";
import { TypeBadge } from "@/components/shared/Badge";
import { APPLICATIONS } from "@/data/ecosystem";

export function CriticalRanking() {
  const rows = RANKED.slice(0, 5).map((m) => ({
    m,
    apps: computeBlastRadius(m.node.id).affectedApps.length,
  }));

  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-safe">
        Critical dependencies ranking
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">#</th>
              <th className="py-2 pr-4 font-medium">Package</th>
              <th className="py-2 pr-4 font-medium">Ripple Score</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Apps affected</th>
              <th className="py-2 font-medium">Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ m, apps }, i) => (
              <tr key={m.node.id} className="border-t border-border/60">
                <td className="py-3 pr-4 font-mono text-muted-foreground">{i + 1}</td>
                <td className="py-3 pr-4 font-medium">{m.node.name}</td>
                <td className="py-3 pr-4">
                  <ScoreBar score={m.rippleScore} />
                </td>
                <td className="py-3 pr-4">
                  <TypeBadge type={m.node.type} />
                </td>
                <td className="py-3 pr-4 font-mono text-xs">
                  {apps}/{APPLICATIONS.length}
                </td>
                <td className="py-3 text-xs text-muted-foreground">
                  {recommendedAction(m.node.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
