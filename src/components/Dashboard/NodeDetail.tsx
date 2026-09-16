import { Link } from "@tanstack/react-router";
import { Zap, X } from "lucide-react";
import { NODE_BY_ID } from "@/data/ecosystem";
import { METRICS } from "@/utils/graphAnalysis";
import { RippleScoreGauge } from "@/components/shared/RippleScoreGauge";
import { TypeBadge, RiskBadge } from "@/components/shared/Badge";
import { setTarget } from "@/store/appStore";

function List({ title, ids }: { title: string; ids: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title} ({ids.length})
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ids.length === 0 ? (
          <span className="text-xs text-muted-foreground">None</span>
        ) : (
          ids.map((id) => (
            <span
              key={id}
              className="rounded-md border border-border bg-background/50 px-2 py-1 font-mono text-[11px]"
            >
              {NODE_BY_ID[id].name}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export function NodeDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const node = NODE_BY_ID[id];
  const m = METRICS[id];

  return (
    <div className="glass fade-up sticky top-8 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{node.name}</h3>
          <p className="font-mono text-xs text-muted-foreground">v{node.version}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <TypeBadge type={node.type} />
        <RiskBadge score={m.rippleScore} />
      </div>

      <div className="mt-5 flex justify-center">
        <RippleScoreGauge score={m.rippleScore} />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
        {[
          ["Degree", m.degree],
          ["Betweenness", m.betweenness],
          ["Reach", m.reach],
        ].map(([label, v]) => (
          <div key={label as string} className="rounded-xl bg-background/50 p-3">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 font-mono text-sm">{(v as number).toFixed(2)}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-xs text-muted-foreground">
        Downstream reach: <span className="font-mono text-foreground">{m.downstreamCount}</span>{" "}
        packages depend on this, directly or transitively.
      </p>

      <div className="mt-5 space-y-4">
        <List title="Direct dependents" ids={m.directDependents} />
        <List title="Direct dependencies" ids={m.directDependencies} />
      </div>

      <Link
        to="/simulate"
        onClick={() => setTarget(id)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-critical/90 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-critical"
      >
        <Zap className="size-4" /> Simulate compromise
      </Link>
    </div>
  );
}
