import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { EcoEdge, EcoNode, NodeType } from "@/data/ecosystem";

const Input = z.object({
  packages: z.array(z.string().min(1).max(214)).min(1).max(8),
  depth: z.number().int().min(1).max(3).default(2),
});

const MAX_PACKAGES = 80;
const REGISTRY = "https://registry.npmjs.org";

interface Packument {
  name: string;
  modified?: string;
  "dist-tags"?: Record<string, string>;
  versions?: Record<
    string,
    { dependencies?: Record<string, string>; description?: string; license?: string }
  >;
  time?: Record<string, string>;
  description?: string;
  license?: string;
}

function idFor(name: string) {
  return `npm:${name}`;
}

function typeForDepth(depth: number, maxDepth: number): NodeType {
  if (depth === 0) return "application";
  if (depth >= maxDepth) return "foundational";
  return "library";
}

async function fetchPackument(name: string): Promise<Packument | null> {
  try {
    const res = await fetch(`${REGISTRY}/${encodeURIComponent(name).replace("%40", "@")}`, {
      headers: { Accept: "application/vnd.npm.install-v1+json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as Packument;
  } catch {
    return null;
  }
}

async function fetchDetails(name: string, version: string) {
  try {
    const res = await fetch(
      `${REGISTRY}/${encodeURIComponent(name).replace("%40", "@")}/${version}`,
    );
    if (!res.ok) return null;
    return (await res.json()) as { description?: string; license?: string };
  } catch {
    return null;
  }
}

/**
 * Build a real dependency graph from the public npm registry.
 * Roots become "applications", the deepest layer becomes "foundational".
 */
export const importNpmGraph = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const maxDepth = data.depth;
    const roots = [...new Set(data.packages.map((p) => p.trim().toLowerCase()))];

    const nodes = new Map<string, EcoNode>();
    const edges: EcoEdge[] = [];
    const seen = new Set<string>();
    const missing: string[] = [];

    let frontier = roots.map((name) => ({ name, depth: 0 }));

    for (let depth = 0; depth <= maxDepth && frontier.length; depth++) {
      const batch = frontier.filter((f) => !seen.has(f.name)).slice(0, MAX_PACKAGES);
      batch.forEach((f) => seen.add(f.name));
      const docs = await Promise.all(batch.map((f) => fetchPackument(f.name)));

      const next: { name: string; depth: number }[] = [];

      for (let i = 0; i < batch.length; i++) {
        const entry = batch[i]!;
        const doc = docs[i];
        if (!doc) {
          if (depth === 0) missing.push(entry.name);
          continue;
        }
        const latest = doc["dist-tags"]?.["latest"] ?? "";
        const versionDoc = latest ? doc.versions?.[latest] : undefined;

        nodes.set(entry.name, {
          id: idFor(entry.name),
          name: entry.name,
          version: latest || "unknown",
          type: typeForDepth(entry.depth, maxDepth),
          ...(doc.modified ? { lastPublished: doc.modified } : {}),
        });

        if (entry.depth < maxDepth) {
          const deps = Object.keys(versionDoc?.dependencies ?? {});
          for (const dep of deps) {
            edges.push({ source: idFor(entry.name), target: idFor(dep) });
            if (!seen.has(dep) && nodes.size + next.length < MAX_PACKAGES) {
              next.push({ name: dep, depth: entry.depth + 1 });
            }
          }
        }
      }
      frontier = next;
    }

    // enrich the roots with a human description
    await Promise.all(
      roots.map(async (name) => {
        const node = nodes.get(name);
        if (!node) return;
        const details = await fetchDetails(name, node.version);
        if (details?.description) node.description = details.description;
        if (typeof details?.license === "string") node.license = details.license;
      }),
    );

    const nodeList = [...nodes.values()];
    const known = new Set(nodeList.map((n) => n.id));
    const edgeList = edges.filter((e) => known.has(e.source) && known.has(e.target));

    if (nodeList.length === 0) {
      return { ok: false as const, error: "No packages found on the npm registry.", missing };
    }

    return {
      ok: true as const,
      nodes: nodeList,
      edges: [...new Map(edgeList.map((e) => [`${e.source}->${e.target}`, e])).values()],
      missing,
      roots,
    };
  });
