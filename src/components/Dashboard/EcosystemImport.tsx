import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PackageSearch, RotateCcw, Loader2 } from "lucide-react";
import { importNpmGraph } from "@/lib/npm.functions";
import { loadEcosystem, resetToDemo, useAppState } from "@/store/appStore";

const EXAMPLES = ["express, axios", "next", "vite, vitest"];

export function EcosystemImport() {
  const { sourceLabel } = useAppState();
  const [input, setInput] = useState("");
  const [depth, setDepth] = useState(2);
  const importFn = useServerFn(importNpmGraph);

  const mutation = useMutation({
    mutationFn: async (packages: string[]) =>
      importFn({ data: { packages, depth } }),
    onSuccess: (res) => {
      if (!res.ok) return;
      loadEcosystem(res.nodes, res.edges, {
        label: `npm · ${res.roots.join(", ")}`,
        kind: "npm",
        roots: res.roots,
      });
    },
  });

  const submit = () => {
    const packages = input
      .split(/[,\s]+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 8);
    if (packages.length) mutation.mutate(packages);
  };

  const failed = mutation.data && !mutation.data.ok ? mutation.data.error : null;
  const missing = mutation.data?.ok ? mutation.data.missing : [];

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-safe">
          <PackageSearch className="size-4" /> Analyse your own packages
        </h2>
        <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
          Current source: <span className="text-foreground">{sourceLabel}</span>
        </span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Type real npm package names. RippleLab pulls their published versions and
        dependencies straight from the npm registry and rebuilds the whole graph around them.
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="express, axios, mongoose…"
          className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/60"
        />
        <select
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          className="rounded-xl border border-input bg-background/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/60"
          aria-label="Dependency depth"
        >
          <option value={1}>1 level deep</option>
          <option value={2}>2 levels deep</option>
          <option value={3}>3 levels deep</option>
        </select>
        <button
          onClick={submit}
          disabled={mutation.isPending || !input.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-safe/15 px-4 py-2.5 text-sm font-semibold text-safe ring-1 ring-safe/30 transition-colors hover:bg-safe/25 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Fetching…
            </>
          ) : (
            "Build graph"
          )}
        </button>
        <button
          onClick={() => {
            mutation.reset();
            resetToDemo();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-4" /> Demo set
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        Try:
        {EXAMPLES.map((e) => (
          <button
            key={e}
            onClick={() => setInput(e)}
            className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono hover:text-foreground"
          >
            {e}
          </button>
        ))}
      </div>

      {failed ? <p className="mt-3 text-xs text-critical">{failed}</p> : null}
      {mutation.isError ? (
        <p className="mt-3 text-xs text-critical">
          Could not reach the npm registry. Check the package names and try again.
        </p>
      ) : null}
      {missing && missing.length > 0 ? (
        <p className="mt-3 text-xs text-warning">
          Not found on npm: {missing.join(", ")}
        </p>
      ) : null}
    </section>
  );
}
