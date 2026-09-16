import { APPLICATIONS, EDGES, NODES, NODE_BY_ID, alternativeFor } from "@/data/ecosystem";
import {
  CRITICAL,
  METRICS,
  RANKED,
  computeBlastRadius,
  orphanedBy,
} from "@/utils/graphAnalysis";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function nameOf(id: string) {
  return NODE_BY_ID[id].name;
}

export function executiveSummary(): string {
  const top = RANKED[0];
  const blast = computeBlastRadius(top.node.id);
  return `This dependency ecosystem contains ${NODES.length} packages serving ${APPLICATIONS.length} applications through ${EDGES.length} dependency relationships. Analysis identified ${CRITICAL.length} critical chokepoint${CRITICAL.length === 1 ? "" : "s"} with Ripple Scores above 0.70. The most critical package is ${top.node.name} (Ripple Score: ${top.rippleScore.toFixed(2)}), which sits on the dependency path of ${blast.affectedApps.length} of ${APPLICATIONS.length} applications. A single compromise of ${top.node.name} would expose ${blast.exposurePct.toFixed(0)}% of the ecosystem across ${blast.maxDepth} propagation levels.`;
}

export function recommendedAction(id: string): string {
  const score = METRICS[id].rippleScore;
  if (score > 0.7) return "Replace or vendor-pin immediately";
  if (score > 0.45) return "Pin version + monitor advisories";
  if (score > 0.2) return "Monitor advisories";
  return "Routine review";
}

export function packageNarrative(id: string): string {
  const m = METRICS[id];
  const n = m.node;
  const blast = computeBlastRadius(id);
  const dependents = m.directDependents.map(nameOf);
  const dependentList =
    dependents.length > 0 ? dependents.join(", ") : "no direct dependents";

  return `${n.name} (v${n.version}) is a ${n.type} package with a Ripple Score of ${m.rippleScore.toFixed(2)}. It is a direct dependency of ${m.directDependents.length} package${m.directDependents.length === 1 ? "" : "s"} (${dependentList}), giving it a relative degree centrality of ${m.degree.toFixed(2)}. Through those intermediaries it reaches ${blast.affectedApps.length} of ${APPLICATIONS.length} end-user applications (${pct(m.reach)} downstream reach). Its relative betweenness centrality of ${m.betweenness.toFixed(2)} means it sits on a large share of the shortest propagation paths between the foundational and application layers. A compromise here would contaminate ${blast.affected.length} packages within ${blast.maxDepth} hop${blast.maxDepth === 1 ? "" : "s"}.`;
}

export function mitigationPriorities(): string[] {
  const top3 = RANKED.slice(0, 3).map((m) => m.node.name);
  return [
    `Establish vendor and advisory monitoring for ${top3.join(", ")} — these carry the highest Ripple Scores in the graph.`,
    `Evaluate audited alternatives for every package scoring above 0.70 (${CRITICAL.length} today), starting with ${RANKED[0].node.name} → ${alternativeFor(RANKED[0].node.id)}.`,
    "Implement strict dependency pinning and lockfile integrity checks for all foundational packages.",
    "Add runtime integrity verification (Sigstore / provenance attestation) for packages on the critical propagation paths.",
    "Rehearse the isolation playbook quarterly so containment does not orphan production services unexpectedly.",
  ];
}

export interface StrategyMetrics {
  disruption: "Low" | "Medium" | "High";
  blastAfter: number;
  orphaned: number;
  effort: "Low" | "Medium" | "High";
  risk: string;
}

export function strategyMetrics(id: string): Record<"patch" | "isolate" | "replace", StrategyMetrics> {
  const orphans = orphanedBy(id);
  const dependents = METRICS[id].directDependents.length;
  return {
    patch: {
      disruption: "Low",
      blastAfter: 0,
      orphaned: 0,
      effort: "Low",
      risk: "Assumes a patch is available upstream and fully effective against the disclosed vector.",
    },
    isolate: {
      disruption: "High",
      blastAfter: 0,
      orphaned: orphans.length,
      effort: "High",
      risk: `Severs ${dependents} dependency edge${dependents === 1 ? "" : "s"}; ${orphans.length} package${orphans.length === 1 ? "" : "s"} would be left with no remaining dependency and may lose functionality.`,
    },
    replace: {
      disruption: "Medium",
      blastAfter: 0,
      orphaned: 0,
      effort: "Medium",
      risk: "Requires an API-compatible alternative and regression testing across every dependent.",
    },
  };
}

export function recommendation(id: string): { strategy: string; text: string } {
  const n = NODE_BY_ID[id];
  const m = METRICS[id];
  const orphans = orphanedBy(id);
  const alt = alternativeFor(id);

  if (m.rippleScore > 0.7) {
    return {
      strategy: "REPLACE",
      text: `Recommended: REPLACE. For ${n.name} (Ripple Score ${m.rippleScore.toFixed(2)}), swapping to ${alt} achieves full risk elimination with moderate effort and keeps all ${m.directDependents.length} dependents wired into the graph. Patching is viable only if the maintainer releases a verified fix inside your risk window — at this centrality, waiting is itself a risk. Isolation would orphan ${orphans.length} package${orphans.length === 1 ? "" : "s"} and is not recommended unless containment is urgent.`,
    };
  }
  if (orphans.length === 0 && m.directDependents.length <= 2) {
    return {
      strategy: "ISOLATE",
      text: `Recommended: ISOLATE. ${n.name} has only ${m.directDependents.length} direct dependent${m.directDependents.length === 1 ? "" : "s"} and no package would be orphaned by severing it, so containment is cheap and instant. Patch afterwards at your own pace, or migrate to ${alt} during the next maintenance window.`,
    };
  }
  return {
    strategy: "PATCH",
    text: `Recommended: PATCH. ${n.name} scores ${m.rippleScore.toFixed(2)} — meaningful but not a top chokepoint. Applying the upstream fix neutralises the vulnerability with zero structural disruption to its ${m.directDependents.length} dependent${m.directDependents.length === 1 ? "" : "s"}. If no patch lands within your risk window, escalate to REPLACE with ${alt}; isolation would orphan ${orphans.length} package${orphans.length === 1 ? "" : "s"}.`,
  };
}

export function heatMapDepth(packageId: string, appId: string): number | null {
  const blast = computeBlastRadius(packageId);
  const d = blast.depthById.get(appId);
  return d === undefined ? null : d;
}
