import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/Header";
import { ExecutiveSummary } from "@/components/Explain/ExecutiveSummary";
import { CriticalRanking } from "@/components/Explain/CriticalRanking";
import { RiskHeatMap } from "@/components/Explain/RiskHeatMap";
import { MitigationPriorities } from "@/components/Explain/MitigationPriorities";
import { RANKED } from "@/utils/graphAnalysis";
import { executiveSummary, mitigationPriorities, packageNarrative } from "@/utils/explanations";

export const Route = createFileRoute("/explain")({
  head: () => ({
    meta: [
      { title: "Analysis Report — RippleLab" },
      {
        name: "description",
        content:
          "A generated narrative of the dependency risk analysis: executive summary, critical rankings, risk heat map and mitigation priorities.",
      },
      { property: "og:title", content: "Analysis Report — RippleLab" },
      {
        property: "og:description",
        content: "Executive summary, chokepoint rankings and an exportable supply chain risk report.",
      },
    ],
  }),
  component: ExplainPage,
});

function useTimestamp() {
  const [ts, setTs] = useState("");
  useEffect(() => {
    setTs(new Date().toLocaleString());
  }, []);
  return ts;
}

function exportReport() {
  const top3 = RANKED.slice(0, 3);
  const lines = [
    "RIPPLELAB — SUPPLY CHAIN RISK REPORT",
    `Generated: ${new Date().toISOString()}`,
    "",
    "EXECUTIVE SUMMARY",
    executiveSummary(),
    "",
    "TOP CRITICAL PACKAGES",
    ...RANKED.slice(0, 5).map(
      (m, i) =>
        `${i + 1}. ${m.node.name}@${m.node.version} — Ripple Score ${m.rippleScore.toFixed(2)} (${m.node.type})`,
    ),
    "",
    "PROPAGATION ANALYSIS",
    ...top3.map((m) => `${m.node.name}\n${packageNarrative(m.node.id)}\n`),
    "MITIGATION PRIORITIES",
    ...mitigationPriorities().map((p, i) => `${i + 1}. ${p}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ripplelab-report.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function ExplainPage() {
  const ts = useTimestamp();
  const top3 = RANKED.slice(0, 3);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        eyebrow="Generated narrative"
        title="Analysis report"
        description={ts ? `Generated ${ts} · deterministic analysis, no external calls` : " "}
        actions={
          <button
            onClick={exportReport}
            className="inline-flex items-center gap-2 rounded-xl border border-safe/30 bg-safe/10 px-4 py-2.5 text-sm font-medium text-safe transition-colors hover:bg-safe/20"
          >
            <Download className="size-4" /> Export report
          </button>
        }
      />

      <ExecutiveSummary />
      <CriticalRanking />
      <RiskHeatMap />

      <section className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-safe">
          Propagation analysis
        </h2>
        <div className="mt-4 space-y-5">
          {top3.map((m) => (
            <article key={m.node.id} className="rounded-xl border border-border bg-background/40 p-4">
              <h3 className="font-semibold">
                {m.node.name} <span className="font-mono text-xs text-muted-foreground">v{m.node.version}</span>{" "}
                — Ripple Score {m.rippleScore.toFixed(2)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {packageNarrative(m.node.id)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <MitigationPriorities />
    </div>
  );
}
