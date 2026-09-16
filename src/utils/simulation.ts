import { computeBlastRadius, type BlastRadius } from "@/utils/graphAnalysis";

export type SimSpeed = "slow" | "normal" | "fast";

export const SPEED_MS: Record<SimSpeed, number> = {
  slow: 900,
  normal: 550,
  fast: 280,
};

export interface PropagationPlan {
  blast: BlastRadius;
  levels: string[][];
  stepMs: number;
}

export function buildPropagationPlan(id: string, speed: SimSpeed): PropagationPlan {
  const blast = computeBlastRadius(id);
  return { blast, levels: blast.levels, stepMs: SPEED_MS[speed] };
}

/** Orange shade that fades with propagation distance. */
export function depthColor(depth: number, maxDepth: number): string {
  if (depth === 0) return "#ef4444";
  const t = maxDepth <= 1 ? 0 : (depth - 1) / (maxDepth - 1);
  const light = 48 + t * 22;
  return `hsl(${32 + t * 8} 95% ${light}%)`;
}
