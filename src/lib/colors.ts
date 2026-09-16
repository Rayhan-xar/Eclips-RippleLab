import type { NodeType } from "@/data/ecosystem";

export const COLORS = {
  safe: "#06b6d4",
  warning: "#f59e0b",
  critical: "#ef4444",
  mitigated: "#10b981",
  highlight: "#8b5cf6",
  muted: "#64748b",
} as const;

export const TYPE_COLOR: Record<NodeType, string> = {
  application: COLORS.highlight,
  library: COLORS.safe,
  foundational: COLORS.warning,
};
