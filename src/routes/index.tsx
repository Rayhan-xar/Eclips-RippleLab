import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NODES, NODE_BY_ID } from "@/data/ecosystem";
import { METRICS, RANKED } from "@/utils/graphAnalysis";
import { TYPE_COLOR, COLORS } from "@/lib/colors";
import { PageHeader } from "@/components/layout/Header";
import { StatsBar } from "@/components/Dashboard/StatsBar";
import { SearchBar } from "@/components/Dashboard/SearchBar";
import { NodeDetail } from "@/components/Dashboard/NodeDetail";
import { RippleGraph, GraphLegend } from "@/components/graph/RippleGraph";
import { ScoreBar } from "@/components/shared/RippleScoreGauge";
import { TypeBadge } from "@/components/shared/Badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RippleLab — Supply Chain Risk Dashboard" },
      {
        name: "description",
        content:
          "Interactive dependency graph, Ripple Scores and chokepoint analysis for a 30-package open-source ecosystem.",
      },
      { property: "og:title", content: "RippleLab — Supply Chain Risk Dashboard" },
      {
        property: "og:description",
        content:
          "Map critical packages, centrality metrics and blast radius across your dependency graph.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return new Set(NODES.filter((n) => n.name.toLowerCase().includes(q)).map((n) => n.id));
  }, [query]);

  const colorFor = (id: string) => {
    if (selected === id) return COLORS.highlight;
    return TYPE_COLOR[nodeOf(id).type];
  };

  const dimFor = (id: string) => (matches ? !matches.has(id) : false);

  const top5 = RANKED.slice(0, 5);

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <PageHeader
        eyebrow="Ecosystem overview"
        title="Dependency risk dashboard"
        description="A live map of 30 packages across application, library and foundational tiers. Node size scales with Ripple Score — the bigger the node, the wider the damage if it falls."
      />

      <StatsBar />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="glass rounded-2xl p-5">
            <SearchBar
              value={query}
              onChange={setQuery}
              resultCount={matches ? matches.size : 0}
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background/40">
              <RippleGraph
                colorFor={colorFor}
                dimFor={dimFor}
                selectedId={selected}
                onSelect={setSelected}
                height={600}
              />
            </div>
            <div className="mt-4">
              <GraphLegend />
            </div>
          </section>

          <section className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Top 5 critical packages
            </h2>
            <div className="mt-4 space-y-2">
              {top5.map((m, i) => (
                <button
                  key={m.node.id}
                  onClick={() => setSelected(m.node.id)}
                  className="flex w-full items-center gap-4 rounded-xl border border-border bg-background/40 px-4 py-3 text-left transition-colors hover:border-safe/40 hover:bg-secondary/40"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-36 font-medium">{m.node.name}</span>
                  <TypeBadge type={m.node.type} />
                  <span className="ml-auto flex items-center gap-4">
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {m.downstreamCount} downstream
                    </span>
                    <ScoreBar score={m.rippleScore} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div>
          {selected ? (
            <NodeDetail id={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">No package selected</p>
              <p className="mt-2">
                Click any node in the graph — or a row in the critical list — to inspect its
                centrality metrics, dependents and Ripple Score.
              </p>
              <p className="mt-4">
                Arrows point in the direction a compromise travels: from a dependency up to
                everything that relies on it.
              </p>
              <div className="mt-5 space-y-2">
                {["found-lodash", "found-debug", "lib-express"].map((id) => (
                  <button
                    key={id}
                    onClick={() => setSelected(id)}
                    className="w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-left text-xs transition-colors hover:border-safe/40"
                  >
                    Inspect{" "}
                    <span className="font-mono text-foreground">{nodeOf(id).name}</span> —
                    score {(metricsOf(id).rippleScore * 100).toFixed(0)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
