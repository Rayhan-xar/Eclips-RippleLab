import { COLORS } from "@/lib/colors";

export function RippleScoreGauge({ score, size = 132 }: { score: number; size?: number }) {
  const pct = Math.max(0, Math.min(1, score));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color =
    pct > 0.7 ? COLORS.critical : pct > 0.45 ? COLORS.warning : COLORS.safe;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/60"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 700ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold">{(pct * 100).toFixed(0)}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Ripple
        </span>
      </div>
    </div>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, score)) * 100;
  const cls = score > 0.7 ? "bg-critical" : score > 0.45 ? "bg-warning" : "bg-safe";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-muted-foreground">{(score).toFixed(2)}</span>
    </div>
  );
}
