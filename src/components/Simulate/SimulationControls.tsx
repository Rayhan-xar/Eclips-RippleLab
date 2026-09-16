import { Play, RotateCcw } from "lucide-react";
import { NODES, nodeOf } from "@/data/ecosystem";
import { metricsOf } from "@/utils/graphAnalysis";
import { TypeBadge, RiskBadge } from "@/components/shared/Badge";
import type { SimSpeed } from "@/utils/simulation";

const SPEEDS: SimSpeed[] = ["slow", "normal", "fast"];

export function SimulationControls({
  targetId,
  onTarget,
  speed,
  onSpeed,
  onRun,
  onReset,
  running,
}: {
  targetId: string;
  onTarget: (id: string) => void;
  speed: SimSpeed;
  onSpeed: (s: SimSpeed) => void;
  onRun: () => void;
  onReset: () => void;
  running: boolean;
}) {
  const node = nodeOf(targetId);
  const m = metricsOf(targetId);

  const grouped = {
    Applications: NODES.filter((n) => n.type === "application"),
    Libraries: NODES.filter((n) => n.type === "library"),
    Foundational: NODES.filter((n) => n.type === "foundational"),
  };

  return (
    <div className="glass fade-up space-y-5 rounded-2xl p-5">
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Compromised package
        </label>
        <select
          value={targetId}
          onChange={(e) => onTarget(e.target.value)}
          className="mt-2 w-full rounded-xl border border-input bg-background/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/60"
        >
          {Object.entries(grouped).map(([label, items]) => (
            <optgroup key={label} label={label}>
              {items.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} @ {n.version}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-critical/25 bg-critical/5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{node.name}</p>
            <p className="font-mono text-xs text-muted-foreground">v{node.version}</p>
          </div>
          <RiskBadge score={m.rippleScore} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <TypeBadge type={node.type} />
          <span className="font-mono text-xs text-muted-foreground">
            score {(m.rippleScore * 100).toFixed(0)} · {m.downstreamCount} downstream
          </span>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Propagation speed
        </label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => onSpeed(s)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${
                speed === s
                  ? "border-safe/40 bg-safe/15 text-safe"
                  : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRun}
          disabled={running}
          className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-critical px-4 py-3 text-sm font-semibold text-foreground transition-opacity disabled:opacity-60"
        >
          {running ? (
            <span className="ripple-ring absolute size-16 rounded-full border-2 border-foreground/50" />
          ) : null}
          <Play className="size-4" />
          {running ? "Propagating…" : "Run simulation"}
        </button>
        <button
          onClick={onReset}
          className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Reset simulation"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
    </div>
  );
}
