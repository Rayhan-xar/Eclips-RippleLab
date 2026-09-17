import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { EDGES, NODES, nodeOf } from "@/data/ecosystem";
import { metricsOf } from "@/utils/graphAnalysis";

export interface RippleGraphProps {
  colorFor: (id: string) => string;
  dimFor?: ((id: string) => boolean) | undefined;
  edgeStateFor?: ((dependencyId: string, dependentId: string) => "active" | "normal" | "dim") | undefined;
  pulseIds?: Set<string> | undefined;
  selectedId?: string | null | undefined;
  onSelect?: ((id: string | null) => void) | undefined;
  height?: number | undefined;
  className?: string | undefined;
}

interface GNode {
  id: string;
  name: string;
  type: string;
  x?: number;
  y?: number;
}

const TYPE_SHAPE: Record<string, "circle" | "square" | "triangle"> = {
  application: "circle",
  library: "square",
  foundational: "triangle",
};

export function RippleGraph({
  colorFor,
  dimFor,
  edgeStateFor,
  pulseIds,
  selectedId,
  onSelect,
  height = 560,
  className,
}: RippleGraphProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const fgRef = useRef<any>(null);
  const [FG, setFG] = useState<any>(null);
  const [size, setSize] = useState({ w: 800, h: height });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    import("react-force-graph-2d").then((mod) => {
      if (alive) setFG(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: height });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: height });
    return () => ro.disconnect();
  }, [height]);

  // spread the layout out so the ecosystem fills the canvas
  useEffect(() => {
    if (!FG) return;
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-420).distanceMax(600);
    fg.d3Force("link")?.distance(70);
    fg.d3ReheatSimulation?.();
  }, [FG]);

  // drives the pulsing halo redraw
  useEffect(() => {
    if (!pulseIds || pulseIds.size === 0) return;
    let raf = 0;
    const loop = () => {
      setTick((t) => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pulseIds]);

  const data = useMemo(
    () => ({
      nodes: NODES.map((n) => ({ id: n.id, name: n.name, type: n.type })) as GNode[],
      // arrows point from dependency -> dependent: compromise flows upstream
      links: EDGES.map((e) => ({ source: e.target, target: e.source })),
    }),
    [],
  );

  const drawNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, scale: number) => {
      const metrics = metricsOf(node.id);
      const base = 4 + metrics.rippleScore * 9;
      const dim = dimFor?.(node.id) ?? false;
      const isHover = hoverId === node.id;
      const isSelected = selectedId === node.id;
      const color = colorFor(node.id);
      const r = base * (isHover || isSelected ? 1.25 : 1);

      ctx.save();
      ctx.globalAlpha = dim ? 0.18 : 1;

      if (pulseIds?.has(node.id)) {
        const phase = (Date.now() % 1600) / 1600;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + phase * 22, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = (1 - phase) * 0.7;
        ctx.lineWidth = 2 / scale;
        ctx.stroke();
        ctx.globalAlpha = dim ? 0.18 : 1;
      }

      ctx.fillStyle = color;
      ctx.strokeStyle = isSelected ? "#ffffff" : "rgba(15,23,42,0.9)";
      ctx.lineWidth = (isSelected ? 2 : 1) / scale;

      const shape = TYPE_SHAPE[node.type];
      ctx.beginPath();
      if (shape === "circle") {
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      } else if (shape === "square") {
        ctx.rect(node.x - r * 0.9, node.y - r * 0.9, r * 1.8, r * 1.8);
      } else {
        ctx.moveTo(node.x, node.y - r * 1.1);
        ctx.lineTo(node.x + r, node.y + r * 0.8);
        ctx.lineTo(node.x - r, node.y + r * 0.8);
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();

      if (scale > 1.1 || isHover || isSelected) {
        ctx.font = `${Math.max(3, 10 / scale)}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "rgba(226,232,240,0.92)";
        ctx.fillText(node.name, node.x, node.y + r + 2);
      }
      ctx.restore();
    },
    [colorFor, dimFor, hoverId, selectedId, pulseIds, tick],
  );

  const linkColor = useCallback(
    (link: any) => {
      const s = typeof link.source === "object" ? link.source.id : link.source;
      const t = typeof link.target === "object" ? link.target.id : link.target;
      const state = edgeStateFor?.(s, t) ?? "normal";
      if (hoverId && (hoverId === s || hoverId === t)) return "rgba(139,92,246,0.9)";
      if (state === "active") return "rgba(239,68,68,0.85)";
      if (state === "dim") return "rgba(148,163,184,0.07)";
      return "rgba(148,163,184,0.2)";
    },
    [edgeStateFor, hoverId],
  );

  const resetView = () => fgRef.current?.zoomToFit(600, 60);

  return (
    <div
      ref={wrapRef}
      className={`relative min-w-0 max-w-full overflow-hidden ${className ?? ""}`}
      style={{ height }}
    >
      <button
        onClick={resetView}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
      >
        <Maximize2 className="size-3.5" /> Reset view
      </button>
      {FG ? (
        <FG
          ref={fgRef}
          graphData={data}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          nodeCanvasObject={drawNode}
          nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
            ctx.fill();
          }}
          nodeLabel={(node: any) => {
            const m = metricsOf(node.id);
            const n = nodeOf(node.id);
            return `<div style="background:#0f172a;border:1px solid rgba(255,255,255,.14);padding:8px 10px;border-radius:10px;font-family:Inter,sans-serif;color:#e2e8f0;font-size:12px">
              <strong>${n.name}</strong> <span style="color:#94a3b8">v${n.version}</span><br/>
              <span style="color:#94a3b8;text-transform:capitalize">${n.type}</span><br/>
              Ripple Score <strong style="color:#06b6d4">${(m.rippleScore * 100).toFixed(0)}</strong>
            </div>`;
          }}
          linkColor={linkColor}
          linkWidth={(link: any) => {
            const s = typeof link.source === "object" ? link.source.id : link.source;
            const t = typeof link.target === "object" ? link.target.id : link.target;
            return (edgeStateFor?.(s, t) ?? "normal") === "active" ? 2 : 1;
          }}
          linkCurvature={0.18}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkDirectionalParticles={(link: any) => {
            const s = typeof link.source === "object" ? link.source.id : link.source;
            const t = typeof link.target === "object" ? link.target.id : link.target;
            return (edgeStateFor?.(s, t) ?? "normal") === "active" ? 4 : 1;
          }}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.006}
          onNodeHover={(node: any) => setHoverId(node?.id ?? null)}
          onNodeClick={(node: any) => onSelect?.(node.id)}
          onBackgroundClick={() => onSelect?.(null)}
          cooldownTicks={200}
          d3VelocityDecay={0.28}
          d3AlphaDecay={0.018}
          onEngineStop={() => fgRef.current?.zoomToFit(500, 50)}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Rendering dependency graph…
        </div>
      )}
    </div>
  );
}

export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-highlight" /> Application (circle)
      </span>
      <span className="flex items-center gap-2">
        <span className="size-3 bg-safe" /> Library (square)
      </span>
      <span className="flex items-center gap-2">
        <span className="size-0 border-x-[7px] border-b-[12px] border-x-transparent border-b-warning" />
        Foundational (triangle)
      </span>
      <span className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-critical" /> Compromised
      </span>
      <span className="ml-auto">Node size ∝ Ripple Score</span>
    </div>
  );
}
