import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { nodeOf } from "@/data/ecosystem";
import { TYPE_COLOR, COLORS } from "@/lib/colors";
import { PageHeader } from "@/components/layout/Header";
import { RippleGraph, GraphLegend } from "@/components/graph/RippleGraph";
import { SimulationControls } from "@/components/Simulate/SimulationControls";
import { BlastRadiusPanel } from "@/components/Simulate/BlastRadiusPanel";
import { useSimulation } from "@/hooks/useSimulation";
import { depthColor, type SimSpeed } from "@/utils/simulation";
import { markSimulated, setTarget, useAppState } from "@/store/appStore";

export const Route = createFileRoute("/simulate")({
  head: () => ({
    meta: [
      { title: "Simulate a Compromise — RippleLab" },
      {
        name: "description",
        content:
          "Watch a supply chain compromise ripple level-by-level through the dependency graph and read the resulting blast radius.",
      },
      { property: "og:title", content: "Simulate a Compromise — RippleLab" },
      {
        property: "og:description",
        content:
          "Animated propagation, affected path traces and blast radius metrics for any package.",
      },
    ],
  }),
  component: SimulatePage,
});

function SimulatePage() {
  const { targetId } = useAppState();
  const [speed, setSpeed] = useState<SimSpeed>("normal");
  const { state, run, reset } = useSimulation();

  const active = state.blast !== null;

  const revealed = useMemo(() => {
    if (!state.blast) return new Map<string, number>();
    const m = new Map<string, number>();
    for (const [id, d] of state.depthById) {
      if (d <= state.revealedDepth) m.set(id, d);
    }
    return m;
  }, [state]);

  const colorFor = (id: string) => {
    if (!active) return TYPE_COLOR[nodeOf(id).type];
    if (id === state.blast!.compromised) return COLORS.critical;
    const d = revealed.get(id);
    if (d === undefined) return COLORS.muted;
    return depthColor(d, state.blast!.maxDepth);
  };

  const dimFor = (id: string) => active && !revealed.has(id);

  const edgeStateFor = (dependencyId: string, dependentId: string) => {
    if (!active) return "normal" as const;
    return revealed.has(dependencyId) && revealed.has(dependentId)
      ? ("active" as const)
      : ("dim" as const);
  };

  const pulseIds = useMemo(() => {
    if (!active) return undefined;
    const s = new Set<string>([state.blast!.compromised]);
    if (state.running) {
      for (const [id, d] of revealed) if (d === state.revealedDepth) s.add(id);
    }
    return s;
  }, [active, revealed, state]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <PageHeader
        eyebrow="Propagation simulation"
        title="Compromise the graph, watch it ripple"
        description="Pick a package, detonate it, and follow the shockwave upstream through every package that transitively depends on it."
      />

      <div className="grid min-w-0 gap-10 2xl:grid-cols-[320px_minmax(0,1fr)] 2xl:items-start">
        <div className="min-w-0">
          <SimulationControls
            targetId={targetId}
            onTarget={(id) => {
              reset();
              setTarget(id);
            }}
            speed={speed}
            onSpeed={setSpeed}
            running={state.running}
            onRun={() => run(targetId, speed, () => markSimulated(targetId))}
            onReset={reset}
          />
        </div>

        <section className="glass min-w-0 rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {active ? "Simulation mode" : "Standby"}
            </h2>
            {active ? (
              <span className="font-mono text-xs text-critical">
                wave {Math.max(0, state.revealedDepth)} / {state.blast!.maxDepth}
              </span>
            ) : null}
          </div>
          <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-border bg-background/40">
            <RippleGraph
              colorFor={colorFor}
              dimFor={dimFor}
              edgeStateFor={edgeStateFor}
              pulseIds={pulseIds}
              selectedId={active ? state.blast!.compromised : null}
              height={520}
              className="sm:min-h-[560px] 2xl:min-h-[620px]"
            />
          </div>
          <div className="mt-4">
            <GraphLegend />
          </div>
        </section>

        <div className="min-w-0 2xl:col-span-2">
          {state.blast && state.done ? (
            <BlastRadiusPanel blast={state.blast} />
          ) : (
            <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Blast radius pending</p>
              <p className="mt-2">
                {state.running
                  ? "Propagating the compromise wave by wave…"
                  : "Run the simulation to compute affected packages, exposed applications, propagation depth and critical paths."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
