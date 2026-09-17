import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2 } from "lucide-react";
import { APPLICATIONS } from "@/data/ecosystem";
import { computeBlastRadius, RANKED, STATS } from "@/utils/graphAnalysis";
import { generateAnalysis } from "@/lib/ai.functions";
import { useAppState } from "@/store/appStore";

export function AiAnalysis() {
  const { sourceLabel } = useAppState();
  const run = useServerFn(generateAnalysis);

  const mutation = useMutation({
    mutationFn: async () => {
      const top = RANKED.slice(0, 5).map((m) => {
        const blast = computeBlastRadius(m.node.id);
        return {
          name: m.node.name,
          type: m.node.type,
          version: m.node.version,
          rippleScore: Number(m.rippleScore.toFixed(3)),
          degree: Number(m.degree.toFixed(3)),
          betweenness: Number(m.betweenness.toFixed(3)),
          reach: Number(m.reach.toFixed(3)),
          directDependents: m.directDependents.slice(0, 10),
          downstreamCount: m.downstreamCount,
          affectedApps: blast.affectedApps.map((a) => a.name),
          maxDepth: blast.maxDepth,
          lastPublished: m.node.lastPublished ?? null,
        };
      });

      return run({
        data: {
          sourceLabel,
          totalPackages: STATS.totalPackages,
          applications: APPLICATIONS.map((a) => a.name),
          edges: STATS.edges,
          criticalCount: STATS.critical,
          top,
        },
      });
    },
  });

  const result = mutation.data;

  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-highlight">
          <Sparkles className="size-4" /> AI analyst
        </h2>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-highlight/15 px-4 py-2 text-sm font-semibold text-highlight ring-1 ring-highlight/30 transition-colors hover:bg-highlight/25 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Analysing graph…
            </>
          ) : (
            "Generate analysis"
          )}
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        A model reads the computed centrality, reach and blast-radius metrics for this exact
        graph and writes the assessment. Nothing is pre-written.
      </p>

      {mutation.isError ? (
        <p className="mt-4 text-sm text-critical">
          The analysis service could not be reached. Please try again.
        </p>
      ) : null}

      {result && !result.ok ? (
        <p className="mt-4 text-sm text-critical">{result.error}</p>
      ) : null}

      {result?.ok ? (
        <div className="mt-5 space-y-6">
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {result.summary}
          </p>

          {result.narratives.length > 0 ? (
            <div className="space-y-4">
              {result.narratives.map((n) => (
                <div key={n.name} className="rounded-xl border border-border bg-background/40 p-4">
                  <p className="font-mono text-sm text-warning">{n.name}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {n.text}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {result.priorities.length > 0 ? (
            <ol className="space-y-2">
              {result.priorities.map((p, i) => (
                <li key={p} className="flex gap-3 text-sm text-foreground/90">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-highlight/15 font-mono text-xs text-highlight">
                    {i + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
