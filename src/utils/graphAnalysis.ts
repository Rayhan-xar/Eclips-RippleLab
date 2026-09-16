import { APPLICATIONS, EDGES, NODES, NODE_BY_ID, type EcoNode } from "@/data/ecosystem";

export interface GraphIndex {
  /** dependency id -> ids of packages that directly depend on it (propagation direction) */
  dependents: Record<string, string[]>;
  /** dependent id -> ids of its direct dependencies */
  dependencies: Record<string, string[]>;
}

export function buildIndex(): GraphIndex {
  const dependents: Record<string, string[]> = {};
  const dependencies: Record<string, string[]> = {};
  for (const n of NODES) {
    dependents[n.id] = [];
    dependencies[n.id] = [];
  }
  for (const e of EDGES) {
    dependencies[e.source].push(e.target);
    dependents[e.target].push(e.source);
  }
  return { dependents, dependencies };
}

export const INDEX = buildIndex();

/** Reverse BFS: everything that transitively depends on `startId`, with depth. */
export function reverseBfs(startId: string, index: GraphIndex = INDEX): Map<string, number> {
  const depth = new Map<string, number>([[startId, 0]]);
  let frontier = [startId];
  let d = 0;
  while (frontier.length) {
    d += 1;
    const next: string[] = [];
    for (const id of frontier) {
      for (const dep of index.dependents[id] ?? []) {
        if (!depth.has(dep)) {
          depth.set(dep, d);
          next.push(dep);
        }
      }
    }
    frontier = next;
  }
  return depth;
}

export function degreeCentrality(id: string, index: GraphIndex = INDEX): number {
  const direct = (index.dependents[id]?.length ?? 0) + (index.dependencies[id]?.length ?? 0);
  return direct / (NODES.length - 1);
}

export function downstreamReach(id: string, index: GraphIndex = INDEX): number {
  const reached = reverseBfs(id, index);
  let apps = 0;
  for (const nodeId of reached.keys()) {
    if (nodeId !== id && NODE_BY_ID[nodeId]?.type === "application") apps += 1;
  }
  return apps / APPLICATIONS.length;
}

/** Brandes' algorithm on the unweighted propagation-direction digraph. */
export function betweennessAll(index: GraphIndex = INDEX): Record<string, number> {
  const ids = NODES.map((n) => n.id);
  const cb: Record<string, number> = Object.fromEntries(ids.map((i) => [i, 0]));

  for (const s of ids) {
    const stack: string[] = [];
    const preds: Record<string, string[]> = Object.fromEntries(ids.map((i) => [i, []]));
    const sigma: Record<string, number> = Object.fromEntries(ids.map((i) => [i, 0]));
    const dist: Record<string, number> = Object.fromEntries(ids.map((i) => [i, -1]));
    sigma[s] = 1;
    dist[s] = 0;
    const queue: string[] = [s];
    while (queue.length) {
      const v = queue.shift()!;
      stack.push(v);
      for (const w of index.dependents[v] ?? []) {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1;
          queue.push(w);
        }
        if (dist[w] === dist[v] + 1) {
          sigma[w] += sigma[v];
          preds[w].push(v);
        }
      }
    }
    const delta: Record<string, number> = Object.fromEntries(ids.map((i) => [i, 0]));
    while (stack.length) {
      const w = stack.pop()!;
      for (const v of preds[w]) {
        delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      }
      if (w !== s) cb[w] += delta[w];
    }
  }

  const n = ids.length;
  const norm = (n - 1) * (n - 2);
  for (const id of ids) cb[id] = norm > 0 ? cb[id] / norm : 0;
  return cb;
}

export interface PackageMetrics {
  node: EcoNode;
  degree: number;
  betweenness: number;
  reach: number;
  rippleScore: number;
  directDependents: string[];
  directDependencies: string[];
  downstreamCount: number;
}

function scaleByMax(values: Record<string, number>): Record<string, number> {
  const max = Math.max(...Object.values(values), 1e-9);
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v / max]));
}

function computeAll(): Record<string, PackageMetrics> {
  const rawDeg: Record<string, number> = {};
  const rawReach: Record<string, number> = {};
  for (const n of NODES) {
    rawDeg[n.id] = degreeCentrality(n.id);
    rawReach[n.id] = downstreamReach(n.id);
  }
  const rawBtw = betweennessAll();

  // Relative scaling keeps the composite score readable on a 0-1 band.
  const deg = scaleByMax(rawDeg);
  const btw = scaleByMax(rawBtw);

  const alpha = 0.3;
  const beta = 0.4;
  const gamma = 0.3;

  const out: Record<string, PackageMetrics> = {};
  for (const n of NODES) {
    const reached = reverseBfs(n.id);
    out[n.id] = {
      node: n,
      degree: deg[n.id],
      betweenness: btw[n.id],
      reach: rawReach[n.id],
      rippleScore: alpha * deg[n.id] + beta * btw[n.id] + gamma * rawReach[n.id],
      directDependents: INDEX.dependents[n.id],
      directDependencies: INDEX.dependencies[n.id],
      downstreamCount: reached.size - 1,
    };
  }
  return out;
}

export const METRICS: Record<string, PackageMetrics> = computeAll();

export const RANKED: PackageMetrics[] = Object.values(METRICS).sort(
  (a, b) => b.rippleScore - a.rippleScore,
);

export const CRITICAL = RANKED.filter((m) => m.rippleScore > 0.7);

export interface BlastRadius {
  compromised: string;
  affected: string[];
  depthById: Map<string, number>;
  maxDepth: number;
  affectedApps: string[];
  affectedEdges: EcoEdge[];
  exposurePct: number;
  levels: string[][];
  criticalPaths: { app: string; path: string[] }[];
}

interface EcoEdge {
  source: string;
  target: string;
}

export function computeBlastRadius(id: string, index: GraphIndex = INDEX): BlastRadius {
  const depthById = reverseBfs(id, index);
  const affected = [...depthById.keys()].filter((k) => k !== id);
  const maxDepth = Math.max(0, ...depthById.values());

  const levels: string[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const [nodeId, d] of depthById) levels[d].push(nodeId);

  const affectedSet = new Set(depthById.keys());
  const affectedEdges = EDGES.filter(
    (e) => affectedSet.has(e.source) && affectedSet.has(e.target),
  );

  const affectedApps = affected.filter((a) => NODE_BY_ID[a]?.type === "application");

  return {
    compromised: id,
    affected,
    depthById,
    maxDepth,
    affectedApps,
    affectedEdges,
    exposurePct: (affected.length / (NODES.length - 1)) * 100,
    levels,
    criticalPaths: affectedApps.map((app) => ({ app, path: shortestPath(id, app, index) })),
  };
}

/** Shortest propagation path from a compromised package to a dependent. */
export function shortestPath(from: string, to: string, index: GraphIndex = INDEX): string[] {
  const prev = new Map<string, string | null>([[from, null]]);
  const queue = [from];
  while (queue.length) {
    const v = queue.shift()!;
    if (v === to) break;
    for (const w of index.dependents[v] ?? []) {
      if (!prev.has(w)) {
        prev.set(w, v);
        queue.push(w);
      }
    }
  }
  if (!prev.has(to)) return [];
  const path: string[] = [];
  let cur: string | null = to;
  while (cur) {
    path.unshift(cur);
    cur = prev.get(cur) ?? null;
  }
  return path;
}

/** Packages that would lose all dependencies if `id` were severed from the graph. */
export function orphanedBy(id: string, index: GraphIndex = INDEX): string[] {
  return (index.dependents[id] ?? []).filter(
    (dep) => (index.dependencies[dep] ?? []).length === 1,
  );
}

export function riskBand(score: number): "critical" | "elevated" | "moderate" | "low" {
  if (score > 0.7) return "critical";
  if (score > 0.45) return "elevated";
  if (score > 0.2) return "moderate";
  return "low";
}

export const STATS = {
  totalPackages: NODES.length,
  applications: APPLICATIONS.length,
  edges: EDGES.length,
  critical: CRITICAL.length,
};

export function metricsOf(id: string): PackageMetrics {
  const m = METRICS[id];
  if (!m) throw new Error(`Unknown package: ${id}`);
  return m;
}
