import { createFileRoute } from "@tanstack/react-router";
import { NODES, nodeOf, alternativeFor } from "@/data/ecosystem";
import { PageHeader } from "@/components/layout/Header";
import { StrategyCard } from "@/components/Compare/StrategyCard";
import { ComparisonTable } from "@/components/Compare/ComparisonTable";
import { Recommendation } from "@/components/Compare/Recommendation";
import { recommendation, strategyMetrics } from "@/utils/explanations";
import { setTarget, useAppState } from "@/store/appStore";
import { computeBlastRadius } from "@/utils/graphAnalysis";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Mitigation Strategies — RippleLab" },
      {
        name: "description",
        content:
          "Compare patching, isolating and replacing a compromised dependency side by side, with disruption, orphaning and effort deltas.",
      },
      { property: "og:title", content: "Mitigation Strategies — RippleLab" },
      {
        property: "og:description",
        content: "Patch vs Isolate vs Replace, scored on disruption, orphaned packages and effort.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { targetId, lastSimulatedId } = useAppState();
  const id = lastSimulatedId ?? targetId;
  const node = nodeOf(id);
  const metrics = strategyMetrics(id);
  const rec = recommendation(id);
  const blast = computeBlastRadius(id);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <PageHeader
        eyebrow="Mitigation scenarios"
        title="Patch, isolate or replace?"
        description={`Three responses to a compromise of ${node.name}, scored on disruption, orphaning and effort. Baseline blast radius today: ${blast.affected.length} packages, ${blast.affectedApps.length} applications.`}
        actions={
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Compromised package
            </label>
            <select
              value={id}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-2 block rounded-xl border border-input bg-background/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/60"
            >
              {NODES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} @ {n.version}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <StrategyCard
          variant="patch"
          title="Patch the vulnerability"
          description="Apply a security fix to the compromised package. It stays in the graph but its vulnerability is neutralized."
          metrics={metrics.patch}
          recommended={rec.strategy === "PATCH"}
        />
        <StrategyCard
          variant="isolate"
          title="Isolate the package"
          description="Sever every connection to the compromised package. Dependents must find alternatives or lose functionality."
          metrics={metrics.isolate}
          recommended={rec.strategy === "ISOLATE"}
        />
        <StrategyCard
          variant="replace"
          title={`Replace with ${alternativeFor(id)}`}
          description="Swap the compromised package for a safe alternative and redirect every dependency edge to it."
          metrics={metrics.replace}
          recommended={rec.strategy === "REPLACE"}
        />
      </div>

      <Recommendation text={rec.text} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Side-by-side metrics
        </h2>
        <ComparisonTable metrics={metrics} />
      </section>
    </div>
  );
}
