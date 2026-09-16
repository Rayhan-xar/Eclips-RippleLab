import type { NodeType } from "@/data/ecosystem";
import { cn } from "@/lib/utils";

const STYLES: Record<NodeType, string> = {
  application: "bg-highlight/15 text-highlight border-highlight/30",
  library: "bg-safe/15 text-safe border-safe/30",
  foundational: "bg-warning/15 text-warning border-warning/30",
};

const LABEL: Record<NodeType, string> = {
  application: "Application",
  library: "Library",
  foundational: "Foundational",
};

export function TypeBadge({ type, className }: { type: NodeType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        STYLES[type],
        className,
      )}
    >
      {LABEL[type]}
    </span>
  );
}

export function RiskBadge({ score }: { score: number }) {
  const band =
    score > 0.7
      ? { label: "Critical", cls: "bg-critical/15 text-critical border-critical/30" }
      : score > 0.45
        ? { label: "Elevated", cls: "bg-warning/15 text-warning border-warning/30" }
        : score > 0.2
          ? { label: "Moderate", cls: "bg-safe/15 text-safe border-safe/30" }
          : { label: "Low", cls: "bg-mitigated/15 text-mitigated border-mitigated/30" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        band.cls,
      )}
    >
      {band.label}
    </span>
  );
}
